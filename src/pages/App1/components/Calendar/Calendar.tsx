import { useState, useCallback } from 'react';
import * as S from './Calendar.styles';
import { TaskForm } from '../TaskForm';
import { RevenueEntryForm } from '../RevenueEntryForm';
import { ReminderForm } from '../ReminderForm';
import { ExpenseForm } from '../ExpenseForm';
import { PaymentForm } from '../PaymentForm';
import { useHoursApp } from '../../../../providers/HoursAppProvider';
import { formatCurrency, MASKED_CURRENCY } from '../../../../utils/hoursStorage';
import type {
  Task,
  Client,
  RevenueEntry,
  TaxReminder,
  RecurringReminder,
  RecurringPayment,
  OneOffExpense,
} from '../../../../types/hoursApp';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function formatDateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

interface CalendarDayItem {
  id: string;
  label: string;
  isPaid: boolean;
  amount?: number;
  type: 'parcel' | 'recurring';
  monthKey?: string;
}

interface CalendarProps {
  tasks: Task[];
  clients: Client[];
  revenueEntries: RevenueEntry[];
  taxReminders?: TaxReminder[];
  recurringReminders?: RecurringReminder[];
  recurringPayments?: RecurringPayment[];
  oneOffExpenses?: OneOffExpense[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onAddRevenue: (entry: Omit<RevenueEntry, 'id'>) => void;
  onUpdateRevenue: (id: string, updates: Partial<RevenueEntry>) => void;
  onAddTaxReminder?: (reminder: Omit<TaxReminder, 'id'>) => void;
  onUpdateTaxReminder?: (id: string, updates: Partial<TaxReminder>) => void;
  onAddRecurringReminder?: (reminder: Omit<RecurringReminder, 'id'>) => void;
  onAddRecurringPayment?: (payment: Omit<RecurringPayment, 'id'>) => void;
  onAddOneOffExpense?: (expense: Omit<OneOffExpense, 'id'>) => void;
  onUpdateOneOffExpense?: (id: string, updates: Partial<OneOffExpense>) => void;
  onDeleteTaxReminder?: (id: string) => void;
  onDeleteRecurringReminder?: (id: string) => void;
  onDeleteOneOffExpense?: (id: string) => void;
  showImpostosActions?: boolean;
}

export function Calendar({
  tasks,
  clients,
  revenueEntries,
  taxReminders = [],
  recurringReminders = [],
  recurringPayments = [],
  oneOffExpenses = [],
  onAddTask,
  onUpdateTask,
  onAddRevenue,
  onUpdateRevenue,
  onAddTaxReminder,
  onUpdateTaxReminder,
  onAddRecurringReminder,
  onAddRecurringPayment,
  onAddOneOffExpense,
  onUpdateOneOffExpense,
  showImpostosActions = false,
}: CalendarProps) {
  const { valuesHidden } = useHoursApp();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'task' | 'revenue' | 'reminder' | 'expense'>('task');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingRevenueId, setEditingRevenueId] = useState<string | null>(null);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [paymentReminder, setPaymentReminder] = useState<{
    reminder: TaxReminder | (RecurringReminder & { monthKey: string });
    type: 'parcel' | 'recurring';
  } | null>(null);

  const fmtCurr = (v: number) => (valuesHidden ? MASKED_CURRENCY : formatCurrency(v));

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  };

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const hourlyClients = clients.filter((c) => c.type === 'hourly');
  const fixedClients = clients.filter((c) => c.type === 'fixed_monthly');

  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const monthStr = String(month + 1).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;
  const monthTasks = tasks.filter((t) => t.date.startsWith(prefix));
  const monthRevenue = revenueEntries.filter((e) => e.date.startsWith(prefix));
  const monthTaxReminders = taxReminders.filter((t) => t.dueDate.startsWith(prefix));
  const monthExpenses = oneOffExpenses.filter((e) => e.date.startsWith(prefix));

  const tasksByDate = monthTasks.reduce<Record<string, Task[]>>((acc, t) => {
    if (!acc[t.date]) acc[t.date] = [];
    acc[t.date].push(t);
    return acc;
  }, {});
  const revenueByDate = monthRevenue.reduce<Record<string, RevenueEntry[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});

  const remindersByDate = monthTaxReminders.reduce<Record<string, CalendarDayItem[]>>((acc, r) => {
    if (!acc[r.dueDate]) acc[r.dueDate] = [];
    acc[r.dueDate].push({
      id: r.id,
      label: `${r.source}: ${r.description}`,
      isPaid: Boolean(r.paidAt),
      amount: r.amount,
      type: 'parcel',
    });
    return acc;
  }, {});

  recurringReminders.forEach((r) => {
    const day = String(r.dayOfMonth).padStart(2, '0');
    const dateKey = `${year}-${monthStr}-${day}`;
    const paidForMonth = recurringPayments.some(
      (p) => p.reminderId === r.id && p.month === prefix
    );
    if (!remindersByDate[dateKey]) remindersByDate[dateKey] = [];
    remindersByDate[dateKey].push({
      id: r.id,
      label: `${r.source}: ${r.description}`,
      isPaid: paidForMonth,
      amount: r.amount,
      type: 'recurring',
      monthKey: prefix,
    });
  });

  const expensesByDate = monthExpenses.reduce<Record<string, OneOffExpense[]>>((acc, e) => {
    if (!acc[e.date]) acc[e.date] = [];
    acc[e.date].push(e);
    return acc;
  }, {});

  const hasClientsOrImpostos = clients.length > 0 || showImpostosActions;

  const handleDayClick = useCallback(
    (dateKey: string) => {
      if (!hasClientsOrImpostos) return;
      setSelectedDate(dateKey);
      if (showImpostosActions) {
        setModalMode('reminder');
      } else {
        setModalMode(hourlyClients.length > 0 ? 'task' : 'revenue');
      }
      setEditingTaskId(null);
      setEditingRevenueId(null);
      setEditingExpenseId(null);
    },
    [hasClientsOrImpostos, showImpostosActions, hourlyClients.length]
  );

  const handleTaskChipClick = useCallback((e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setEditingTaskId(taskId);
    setEditingRevenueId(null);
    setEditingExpenseId(null);
    setSelectedDate(null);
    setPaymentReminder(null);
  }, []);

  const handleRevenueChipClick = useCallback((e: React.MouseEvent, entryId: string) => {
    e.stopPropagation();
    setEditingRevenueId(entryId);
    setEditingTaskId(null);
    setEditingExpenseId(null);
    setSelectedDate(null);
    setPaymentReminder(null);
  }, []);

  const handleReminderChipClick = useCallback(
    (e: React.MouseEvent, item: CalendarDayItem) => {
      e.stopPropagation();
      if (item.isPaid) return;
      if (item.type === 'parcel') {
        const r = taxReminders.find((t) => t.id === item.id);
        if (r) setPaymentReminder({ reminder: r, type: 'parcel' });
      } else {
        const r = recurringReminders.find((t) => t.id === item.id);
        if (r && item.monthKey)
          setPaymentReminder({
            reminder: { ...r, monthKey: item.monthKey },
            type: 'recurring',
          });
      }
      setSelectedDate(null);
    },
    [taxReminders, recurringReminders]
  );

  const handleExpenseChipClick = useCallback((e: React.MouseEvent, expenseId: string) => {
    e.stopPropagation();
    setEditingExpenseId(expenseId);
    setEditingTaskId(null);
    setEditingRevenueId(null);
    setSelectedDate(null);
    setPaymentReminder(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDate(null);
    setEditingTaskId(null);
    setEditingRevenueId(null);
    setEditingExpenseId(null);
    setPaymentReminder(null);
  }, []);

  const handlePaymentConfirm = useCallback(
    (paidAt: string, paidAmount: number) => {
      if (!paymentReminder) return;
      if (paymentReminder.type === 'parcel') {
        onUpdateTaxReminder?.(paymentReminder.reminder.id, {
          paidAt,
          paidAmount,
        });
      } else {
        onAddRecurringPayment?.({
          reminderId: paymentReminder.reminder.id,
          month: (paymentReminder.reminder as RecurringReminder & { monthKey: string }).monthKey,
          paidAt,
          paidAmount,
        });
      }
      setPaymentReminder(null);
    },
    [paymentReminder, onUpdateTaxReminder, onAddRecurringPayment]
  );

  const editingTask = editingTaskId ? tasks.find((t) => t.id === editingTaskId) : null;
  const editingRevenue = editingRevenueId ? revenueEntries.find((e) => e.id === editingRevenueId) : null;
  const editingExpense = editingExpenseId ? oneOffExpenses.find((e) => e.id === editingExpenseId) : null;

  const cells: { dateKey: string; day: number; isCurrentMonth: boolean }[] = [];

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const leadingEmpty = startWeekday;
  const totalCells = Math.ceil((leadingEmpty + daysInMonth) / 7) * 7;
  const trailingEmpty = totalCells - leadingEmpty - daysInMonth;

  for (let i = 0; i < leadingEmpty; i++) {
    const prevMonthDay = prevMonthLastDay - leadingEmpty + i + 1;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    cells.push({
      dateKey: formatDateKey(prevYear, prevMonth, prevMonthDay),
      day: prevMonthDay,
      isCurrentMonth: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      dateKey: formatDateKey(year, month, d),
      day: d,
      isCurrentMonth: true,
    });
  }

  for (let i = 0; i < trailingEmpty; i++) {
    const nextMonthDay = i + 1;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    cells.push({
      dateKey: formatDateKey(nextYear, nextMonth, nextMonthDay),
      day: nextMonthDay,
      isCurrentMonth: false,
    });
  }

  const allChipsForDay = (dateKey: string) => {
    const tasks = tasksByDate[dateKey]?.length ?? 0;
    const revenue = revenueByDate[dateKey]?.length ?? 0;
    const reminders = remindersByDate[dateKey]?.length ?? 0;
    const expenses = expensesByDate[dateKey]?.length ?? 0;
    return tasks + revenue + reminders + expenses;
  };

  const visibleChipsCount = 2;
  const extraCount = (dateKey: string) =>
    Math.max(0, allChipsForDay(dateKey) - visibleChipsCount);

  return (
    <>
      <S.Wrapper>
        <S.CalendarHeader>
          <S.TodayButton
            type="button"
            $active={isCurrentMonth}
            onClick={handleToday}
            aria-label="Ir para hoje"
          >
            Hoje
          </S.TodayButton>
          <S.MonthNav>
            <S.MonthNavButton type="button" onClick={handlePrevMonth} aria-label="Mês anterior">
              ‹
            </S.MonthNavButton>
            <S.MonthLabel>
              {MONTH_NAMES[month]} {year}
            </S.MonthLabel>
            <S.MonthNavButton type="button" onClick={handleNextMonth} aria-label="Próximo mês">
              ›
            </S.MonthNavButton>
          </S.MonthNav>
        </S.CalendarHeader>
        <S.WeekdayRow>
          {WEEKDAYS.map((wd) => (
            <S.WeekdayCell key={wd}>{wd}</S.WeekdayCell>
          ))}
        </S.WeekdayRow>
        <S.Grid>
          {cells.map(({ dateKey, day, isCurrentMonth }) => {
            const dayTasks = tasksByDate[dateKey] ?? [];
            const dayRevenue = revenueByDate[dateKey] ?? [];
            const dayReminders = remindersByDate[dateKey] ?? [];
            const dayExpenses = expensesByDate[dateKey] ?? [];
            const isToday = dateKey === todayKey;
            const hasContent =
              dayTasks.length > 0 ||
              dayRevenue.length > 0 ||
              dayReminders.length > 0 ||
              dayExpenses.length > 0;
            const extra = extraCount(dateKey);

            return (
              <S.DayCell
                key={dateKey}
                type="button"
                $isCurrentMonth={isCurrentMonth}
                $isToday={isToday}
                onClick={() => handleDayClick(dateKey)}
              >
                <S.DayNumber $isToday={isToday}>{day}</S.DayNumber>
                <S.DayTasks>
                  {dayTasks.slice(0, 2).map((task) => (
                    <S.TaskChip
                      key={task.id}
                      onClick={(e) => handleTaskChipClick(e, task.id)}
                      title={`${task.description} (${task.startTime}–${task.endTime})`}
                    >
                      {task.description}
                    </S.TaskChip>
                  ))}
                  {dayRevenue.slice(0, 2).map((entry) => {
                    const client = clients.find((c) => c.id === entry.clientId);
                    return (
                      <S.RevenueChip
                        key={entry.id}
                        onClick={(e) => handleRevenueChipClick(e, entry.id)}
                        title={`${client?.name ?? 'Cliente'}: ${fmtCurr(entry.value)}${entry.description ? ` - ${entry.description}` : ''}`}
                      >
                        {fmtCurr(entry.value)}
                      </S.RevenueChip>
                    );
                  })}
                  {dayReminders.slice(0, 2).map((item) => (
                    <S.ReminderChip
                      key={`${item.id}-${item.monthKey ?? ''}`}
                      $paid={item.isPaid}
                      onClick={(e) => handleReminderChipClick(e, item)}
                      title={`${item.label}${item.amount ? ` - ${fmtCurr(item.amount)}` : ''}${item.isPaid ? ' (pago)' : ''}`}
                    >
                      {item.isPaid && '✓ '}
                      {item.label}
                    </S.ReminderChip>
                  ))}
                  {dayExpenses.slice(0, 2).map((exp) => (
                    <S.ExpenseChip
                      key={exp.id}
                      onClick={(e) => handleExpenseChipClick(e, exp.id)}
                      title={`${exp.description} - ${fmtCurr(exp.amount)}`}
                    >
                      {fmtCurr(exp.amount)}
                    </S.ExpenseChip>
                  ))}
                  {extra > 0 && (
                    <S.MoreChip as="span">+{extra} mais</S.MoreChip>
                  )}
                </S.DayTasks>
                {!hasContent && <S.AddHint>+ Adicionar</S.AddHint>}
              </S.DayCell>
            );
          })}
        </S.Grid>
      </S.Wrapper>

      {selectedDate && hasClientsOrImpostos && (
        <S.ModalOverlay onClick={handleCloseModal}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle>
                {showImpostosActions ? (
                  <S.ModalTabs>
                    <S.ModalTab
                      $active={modalMode === 'reminder'}
                      onClick={() => setModalMode('reminder')}
                      type="button"
                    >
                      Novo lembrete
                    </S.ModalTab>
                    <S.ModalTab
                      $active={modalMode === 'expense'}
                      onClick={() => setModalMode('expense')}
                      type="button"
                    >
                      Nova despesa
                    </S.ModalTab>
                    {hourlyClients.length > 0 && (
                      <S.ModalTab
                        $active={modalMode === 'task'}
                        onClick={() => setModalMode('task')}
                        type="button"
                      >
                        Nova tarefa
                      </S.ModalTab>
                    )}
                    {fixedClients.length > 0 && (
                      <S.ModalTab
                        $active={modalMode === 'revenue'}
                        onClick={() => setModalMode('revenue')}
                        type="button"
                      >
                        Nova receita
                      </S.ModalTab>
                    )}
                  </S.ModalTabs>
                ) : hourlyClients.length > 0 && fixedClients.length > 0 ? (
                  <S.ModalTabs>
                    <S.ModalTab
                      $active={modalMode === 'task'}
                      onClick={() => setModalMode('task')}
                      type="button"
                    >
                      Nova tarefa
                    </S.ModalTab>
                    <S.ModalTab
                      $active={modalMode === 'revenue'}
                      onClick={() => setModalMode('revenue')}
                      type="button"
                    >
                      Nova receita
                    </S.ModalTab>
                  </S.ModalTabs>
                ) : hourlyClients.length > 0 ? (
                  'Nova tarefa'
                ) : (
                  'Novo lançamento de receita'
                )}
              </S.ModalTitle>
              <S.ModalClose type="button" onClick={handleCloseModal} aria-label="Fechar">
                ✕
              </S.ModalClose>
            </S.ModalHeader>
            {modalMode === 'task' && hourlyClients.length > 0 && (
              <TaskForm
                clients={clients}
                defaultDate={selectedDate}
                onSave={(task) => {
                  onAddTask(task);
                  handleCloseModal();
                }}
                onCancel={handleCloseModal}
              />
            )}
            {modalMode === 'revenue' && fixedClients.length > 0 && (
              <RevenueEntryForm
                clientId={fixedClients[0]?.id ?? ''}
                clients={fixedClients.map((c) => ({ id: c.id, name: c.name }))}
                defaultDate={selectedDate}
                onSave={(entry) => {
                  onAddRevenue(entry);
                  handleCloseModal();
                }}
                onCancel={handleCloseModal}
              />
            )}
            {modalMode === 'reminder' && onAddTaxReminder && onAddRecurringReminder && (
              <ReminderForm
                defaultDate={selectedDate}
                onSaveParcel={onAddTaxReminder}
                onSaveRecurring={onAddRecurringReminder}
                onCancel={handleCloseModal}
              />
            )}
            {modalMode === 'expense' && onAddOneOffExpense && (
              <ExpenseForm
                defaultDate={selectedDate}
                onSave={(exp) => {
                  onAddOneOffExpense(exp);
                  handleCloseModal();
                }}
                onCancel={handleCloseModal}
              />
            )}
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {editingTask && (
        <S.ModalOverlay onClick={handleCloseModal}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle>Editar tarefa</S.ModalTitle>
              <S.ModalClose type="button" onClick={handleCloseModal} aria-label="Fechar">
                ✕
              </S.ModalClose>
            </S.ModalHeader>
            <TaskForm
              task={editingTask}
              clients={clients}
              onSave={() => {}}
              onUpdate={(id, updates) => {
                onUpdateTask(id, updates);
                handleCloseModal();
              }}
              onCancel={handleCloseModal}
            />
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {editingRevenue && (
        <S.ModalOverlay onClick={handleCloseModal}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle>Editar lançamento</S.ModalTitle>
              <S.ModalClose type="button" onClick={handleCloseModal} aria-label="Fechar">
                ✕
              </S.ModalClose>
            </S.ModalHeader>
            <RevenueEntryForm
              clientId={editingRevenue.clientId}
              entry={editingRevenue}
              onSave={() => {}}
              onUpdate={(id, updates) => {
                onUpdateRevenue(id, updates);
                handleCloseModal();
              }}
              onCancel={handleCloseModal}
            />
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {editingExpense && onUpdateOneOffExpense && (
        <S.ModalOverlay onClick={handleCloseModal}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle>Editar despesa</S.ModalTitle>
              <S.ModalClose type="button" onClick={handleCloseModal} aria-label="Fechar">
                ✕
              </S.ModalClose>
            </S.ModalHeader>
            <ExpenseForm
              expense={editingExpense}
              onSave={() => {}}
              onUpdate={(id, updates) => {
                onUpdateOneOffExpense(id, updates);
                handleCloseModal();
              }}
              onCancel={handleCloseModal}
            />
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {paymentReminder && (
        <S.ModalOverlay onClick={handleCloseModal}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle>Registrar pagamento</S.ModalTitle>
              <S.ModalClose type="button" onClick={handleCloseModal} aria-label="Fechar">
                ✕
              </S.ModalClose>
            </S.ModalHeader>
            <PaymentForm
              reminder={paymentReminder.reminder as TaxReminder | (RecurringReminder & { monthKey: string })}
              onConfirm={handlePaymentConfirm}
              onCancel={handleCloseModal}
            />
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </>
  );
}
