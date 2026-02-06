import { useState, useCallback } from 'react';
import * as S from './Calendar.styles';
import { TaskForm } from '../TaskForm';
import { RevenueEntryForm } from '../RevenueEntryForm';
import { useHoursApp } from '../../../../providers/HoursAppProvider';
import { formatCurrency, MASKED_CURRENCY } from '../../../../utils/hoursStorage';
import type { Task, Client, RevenueEntry } from '../../../../types/hoursApp';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatDateKey(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

interface CalendarProps {
  tasks: Task[];
  clients: Client[];
  revenueEntries: RevenueEntry[];
  year: number;
  month: number;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onAddRevenue: (entry: Omit<RevenueEntry, 'id'>) => void;
  onUpdateRevenue: (id: string, updates: Partial<RevenueEntry>) => void;
}

export function Calendar({
  tasks,
  clients,
  revenueEntries,
  year,
  month,
  onAddTask,
  onUpdateTask,
  onAddRevenue,
  onUpdateRevenue,
}: CalendarProps) {
  const { valuesHidden } = useHoursApp();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'task' | 'revenue'>('task');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingRevenueId, setEditingRevenueId] = useState<string | null>(null);

  const fmtCurr = (v: number) => (valuesHidden ? MASKED_CURRENCY : formatCurrency(v));

  const hourlyClients = clients.filter((c) => c.type === 'hourly');
  const fixedClients = clients.filter((c) => c.type === 'fixed_monthly');

  const today = new Date();
  const todayKey = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const monthStr = String(month + 1).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;
  const monthTasks = tasks.filter((t) => t.date.startsWith(prefix));
  const monthRevenue = revenueEntries.filter((e) => e.date.startsWith(prefix));
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

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  const leadingEmpty = startWeekday;
  const totalCells = Math.ceil((leadingEmpty + daysInMonth) / 7) * 7;
  const trailingEmpty = totalCells - leadingEmpty - daysInMonth;

  const handleDayClick = useCallback(
    (dateKey: string) => {
      if (clients.length === 0) return;
      setSelectedDate(dateKey);
      setModalMode(hourlyClients.length > 0 ? 'task' : 'revenue');
      setEditingTaskId(null);
      setEditingRevenueId(null);
    },
    [clients.length, hourlyClients.length]
  );

  const handleTaskChipClick = useCallback((e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setEditingTaskId(taskId);
    setEditingRevenueId(null);
    setSelectedDate(null);
  }, []);

  const handleRevenueChipClick = useCallback((e: React.MouseEvent, entryId: string) => {
    e.stopPropagation();
    setEditingRevenueId(entryId);
    setEditingTaskId(null);
    setSelectedDate(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDate(null);
    setEditingTaskId(null);
    setEditingRevenueId(null);
  }, []);

  const editingTask = editingTaskId ? tasks.find((t) => t.id === editingTaskId) : null;
  const editingRevenue = editingRevenueId ? revenueEntries.find((e) => e.id === editingRevenueId) : null;

  const cells: { dateKey: string; day: number; isCurrentMonth: boolean }[] = [];

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

  return (
    <>
      <S.Wrapper>
        <S.WeekdayRow>
          {WEEKDAYS.map((wd) => (
            <S.WeekdayCell key={wd}>{wd}</S.WeekdayCell>
          ))}
        </S.WeekdayRow>
        <S.Grid>
          {cells.map(({ dateKey, day, isCurrentMonth }) => {
            const dayTasks = tasksByDate[dateKey] ?? [];
            const dayRevenue = revenueByDate[dateKey] ?? [];
            const isToday = dateKey === todayKey;
            const hasContent = dayTasks.length > 0 || dayRevenue.length > 0;
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
                  {(dayTasks.length > 2 || dayRevenue.length > 2) && (
                    <S.MoreChip as="span">
                      +{dayTasks.length + dayRevenue.length - 2} mais
                    </S.MoreChip>
                  )}
                </S.DayTasks>
                {!hasContent && <S.AddHint>+ Adicionar</S.AddHint>}
              </S.DayCell>
            );
          })}
        </S.Grid>
      </S.Wrapper>

      {selectedDate && clients.length > 0 && (
        <S.ModalOverlay onClick={handleCloseModal}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle>
                {hourlyClients.length > 0 && fixedClients.length > 0 ? (
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
    </>
  );
}
