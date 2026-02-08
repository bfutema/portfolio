import { useState } from 'react';
import { formatCurrency, MASKED_CURRENCY } from '../../../../utils/hoursStorage';
import { PaymentForm } from '../PaymentForm';
import { ExpenseForm } from '../ExpenseForm';
import { OneOffRevenueForm } from '../OneOffRevenueForm';
import { ReminderForm } from '../ReminderForm';
import type {
  TaxReminder,
  RecurringReminder,
  RecurringPayment,
  OneOffExpense,
  OneOffRevenue,
} from '../../../../types/hoursApp';
import * as S from './ImpostosTable.styles';

function formatDateDisplay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

function formatMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

interface ImpostosTableProps {
  taxReminders: TaxReminder[];
  recurringReminders: RecurringReminder[];
  recurringPayments: RecurringPayment[];
  oneOffExpenses: OneOffExpense[];
  oneOffRevenues: OneOffRevenue[];
  valuesHidden: boolean;
  onUpdateTaxReminder: (id: string, updates: Partial<TaxReminder>) => void;
  onUpdateRecurringReminder: (id: string, updates: Partial<RecurringReminder>) => void;
  onAddRecurringPayment: (payment: Omit<RecurringPayment, 'id'>) => void;
  onDeleteTaxReminder: (id: string) => void;
  onDeleteRecurringReminder: (id: string) => void;
  onUpdateOneOffExpense: (id: string, updates: Partial<OneOffExpense>) => void;
  onDeleteOneOffExpense: (id: string) => void;
  onUpdateOneOffRevenue: (id: string, updates: Partial<OneOffRevenue>) => void;
  onDeleteOneOffRevenue: (id: string) => void;
}

export function ImpostosTable({
  taxReminders,
  recurringReminders,
  recurringPayments,
  oneOffExpenses,
  oneOffRevenues,
  valuesHidden,
  onUpdateTaxReminder,
  onUpdateRecurringReminder,
  onAddRecurringPayment,
  onDeleteTaxReminder,
  onDeleteRecurringReminder,
  onUpdateOneOffExpense,
  onDeleteOneOffExpense,
  onUpdateOneOffRevenue,
  onDeleteOneOffRevenue,
}: ImpostosTableProps) {
  const [paymentReminder, setPaymentReminder] = useState<
    | { type: 'parcel'; reminder: TaxReminder }
    | { type: 'recurring'; reminder: RecurringReminder; monthKey: string }
    | null
  >(null);
  const [editingReminder, setEditingReminder] = useState<
    TaxReminder | RecurringReminder | null
  >(null);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingRevenueId, setEditingRevenueId] = useState<string | null>(null);

  const now = new Date();
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const [filterMonth, setFilterMonth] = useState(now.getMonth());

  const handlePrevFilterMonth = () => {
    if (filterMonth === 0) {
      setFilterMonth(11);
      setFilterYear((y) => y - 1);
    } else {
      setFilterMonth((m) => m - 1);
    }
  };

  const handleNextFilterMonth = () => {
    if (filterMonth === 11) {
      setFilterMonth(0);
      setFilterYear((y) => y + 1);
    } else {
      setFilterMonth((m) => m + 1);
    }
  };

  const monthPrefix = `${filterYear}-${String(filterMonth + 1).padStart(2, '0')}`;
  const filteredTaxReminders = taxReminders.filter((r) => r.dueDate.startsWith(monthPrefix));

  const fmtCurr = (v: number) => (valuesHidden ? MASKED_CURRENCY : formatCurrency(v));

  const handlePaymentConfirm = (paidAt: string, paidAmount: number) => {
    if (!paymentReminder) return;
    if (paymentReminder.type === 'parcel') {
      onUpdateTaxReminder(paymentReminder.reminder.id, { paidAt, paidAmount });
    } else {
      onAddRecurringPayment({
        reminderId: paymentReminder.reminder.id,
        month: paymentReminder.monthKey,
        paidAt,
        paidAmount,
      });
    }
    setPaymentReminder(null);
  };

  const isRecurringPaidForMonth = (reminderId: string, monthKey: string) =>
    recurringPayments.some((p) => p.reminderId === reminderId && p.month === monthKey);

  const recentMonths: { key: string; label: string }[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    recentMonths.push({
      key: formatMonthKey(d.getFullYear(), d.getMonth()),
      label: d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
    });
  }

  return (
    <S.Wrapper>
      {/* Contas a pagar */}
      <S.Section>
        <S.SectionHeader>
          <S.SectionTitle>Contas a pagar</S.SectionTitle>
          <S.MonthFilterNav>
            <S.MonthFilterBtn type="button" onClick={handlePrevFilterMonth} aria-label="Mês anterior">
              ‹
            </S.MonthFilterBtn>
            <S.MonthFilterLabel>
              {new Date(filterYear, filterMonth).toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric',
              })}
            </S.MonthFilterLabel>
            <S.MonthFilterBtn type="button" onClick={handleNextFilterMonth} aria-label="Próximo mês">
              ›
            </S.MonthFilterBtn>
          </S.MonthFilterNav>
        </S.SectionHeader>
        <S.TableWrapper>
          <S.Table>
            <thead>
              <tr>
                <S.Th>Origem</S.Th>
                <S.Th>Vencimento</S.Th>
                <S.Th>Valor</S.Th>
                <S.Th>Descrição</S.Th>
                <S.Th>Status</S.Th>
                <S.Th>Pago em</S.Th>
                <S.Th>Ações</S.Th>
              </tr>
            </thead>
            <tbody>
              {filteredTaxReminders.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <S.EmptyMessage>
                      {taxReminders.length === 0
                        ? 'Nenhuma conta cadastrada.'
                        : `Nenhuma conta para ${new Date(filterYear, filterMonth).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}.`}
                    </S.EmptyMessage>
                  </td>
                </tr>
              ) : (
                filteredTaxReminders.map((r) => (
                  <S.Tr key={r.id}>
                    <S.Td>{r.source}</S.Td>
                    <S.Td>{formatDateDisplay(r.dueDate)}</S.Td>
                    <S.Td>{fmtCurr(r.amount)}</S.Td>
                    <S.Td>{r.description}</S.Td>
                    <S.Td>
                      <S.StatusBadge $paid={Boolean(r.paidAt)}>
                        {r.paidAt ? 'Pago' : 'Pendente'}
                      </S.StatusBadge>
                    </S.Td>
                    <S.Td>{r.paidAt ? formatDateDisplay(r.paidAt) : '—'}</S.Td>
                    <S.ActionsCell>
                      <S.ActionButtons>
                        {!r.paidAt && (
                          <S.ActionButton
                            type="button"
                            onClick={() => setPaymentReminder({ type: 'parcel', reminder: r })}
                          >
                            Pagar
                          </S.ActionButton>
                        )}
                        <S.ActionButton
                          type="button"
                          onClick={() => setEditingReminder(r)}
                        >
                          Editar
                        </S.ActionButton>
                        <S.ActionButton
                          type="button"
                          onClick={() => {
                            if (window.confirm('Excluir esta conta?')) onDeleteTaxReminder(r.id);
                          }}
                        >
                          Excluir
                        </S.ActionButton>
                      </S.ActionButtons>
                    </S.ActionsCell>
                  </S.Tr>
                ))
              )}
            </tbody>
          </S.Table>
        </S.TableWrapper>
      </S.Section>

      {/* Lembretes recorrentes */}
      <S.Section>
        <S.SectionTitle>Lembretes recorrentes</S.SectionTitle>
        <S.TableWrapper>
          <S.Table>
            <thead>
              <tr>
                <S.Th>Origem</S.Th>
                <S.Th>Dia do mês</S.Th>
                <S.Th>Valor</S.Th>
                <S.Th>Descrição</S.Th>
                <S.Th>Meses recentes</S.Th>
                <S.Th>Ações</S.Th>
              </tr>
            </thead>
            <tbody>
              {recurringReminders.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <S.EmptyMessage>Nenhum lembrete recorrente cadastrado.</S.EmptyMessage>
                  </td>
                </tr>
              ) : (
                recurringReminders.map((r) => (
                  <S.Tr key={r.id}>
                    <S.Td>{r.source}</S.Td>
                    <S.Td>Dia {r.dayOfMonth}</S.Td>
                    <S.Td>{r.amount != null && r.amount > 0 ? fmtCurr(r.amount) : '—'}</S.Td>
                    <S.Td>{r.description}</S.Td>
                    <S.Td>
                      <S.ActionButtons>
                        {recentMonths.map(({ key, label }) => {
                          const paid = isRecurringPaidForMonth(r.id, key);
                          return (
                            <S.ActionButton
                              key={key}
                              type="button"
                              disabled={paid}
                              onClick={() =>
                                !paid &&
                                setPaymentReminder({
                                  type: 'recurring',
                                  reminder: r,
                                  monthKey: key,
                                })
                              }
                            >
                              {label}: {paid ? '✓' : 'Pagar'}
                            </S.ActionButton>
                          );
                        })}
                      </S.ActionButtons>
                    </S.Td>
                    <S.ActionsCell>
                      <S.ActionButton
                        type="button"
                        onClick={() => setEditingReminder(r)}
                      >
                        Editar
                      </S.ActionButton>
                      <S.ActionButton
                        type="button"
                        onClick={() => {
                          if (window.confirm('Excluir este lembrete recorrente?'))
                            onDeleteRecurringReminder(r.id);
                        }}
                      >
                        Excluir
                      </S.ActionButton>
                    </S.ActionsCell>
                  </S.Tr>
                ))
              )}
            </tbody>
          </S.Table>
        </S.TableWrapper>
      </S.Section>

      {/* Receitas avulsas */}
      <S.Section>
        <S.SectionTitle>Receitas avulsas</S.SectionTitle>
        <S.TableWrapper>
          <S.Table>
            <thead>
              <tr>
                <S.Th>Tipo</S.Th>
                <S.Th>Data</S.Th>
                <S.Th>Valor</S.Th>
                <S.Th>Descrição</S.Th>
                <S.Th>Ações</S.Th>
              </tr>
            </thead>
            <tbody>
              {oneOffRevenues.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <S.EmptyMessage>Nenhuma receita avulsa cadastrada.</S.EmptyMessage>
                  </td>
                </tr>
              ) : (
                [...oneOffRevenues]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((r) => (
                    <S.Tr key={r.id}>
                      <S.Td>{r.transferType}</S.Td>
                      <S.Td>{formatDateDisplay(r.date)}</S.Td>
                      <S.Td>{fmtCurr(r.amount)}</S.Td>
                      <S.Td>{r.description}</S.Td>
                      <S.ActionsCell>
                        <S.ActionButtons>
                          <S.ActionButton
                            type="button"
                            onClick={() => setEditingRevenueId(r.id)}
                          >
                            Editar
                          </S.ActionButton>
                          <S.ActionButton
                            type="button"
                            onClick={() => {
                              if (window.confirm('Excluir esta receita?'))
                                onDeleteOneOffRevenue(r.id);
                            }}
                          >
                            Excluir
                          </S.ActionButton>
                        </S.ActionButtons>
                      </S.ActionsCell>
                    </S.Tr>
                  ))
              )}
            </tbody>
          </S.Table>
        </S.TableWrapper>
      </S.Section>

      {/* Despesas avulsas */}
      <S.Section>
        <S.SectionTitle>Despesas avulsas</S.SectionTitle>
        <S.TableWrapper>
          <S.Table>
            <thead>
              <tr>
                <S.Th>Data</S.Th>
                <S.Th>Valor</S.Th>
                <S.Th>Descrição</S.Th>
                <S.Th>Ações</S.Th>
              </tr>
            </thead>
            <tbody>
              {oneOffExpenses.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <S.EmptyMessage>Nenhuma despesa avulsa cadastrada.</S.EmptyMessage>
                  </td>
                </tr>
              ) : (
                [...oneOffExpenses]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((e) => (
                    <S.Tr key={e.id}>
                      <S.Td>{formatDateDisplay(e.date)}</S.Td>
                      <S.Td>{fmtCurr(e.amount)}</S.Td>
                      <S.Td>{e.description}</S.Td>
                      <S.ActionsCell>
                        <S.ActionButtons>
                          <S.ActionButton
                            type="button"
                            onClick={() => setEditingExpenseId(e.id)}
                          >
                            Editar
                          </S.ActionButton>
                          <S.ActionButton
                            type="button"
                            onClick={() => {
                              if (window.confirm('Excluir esta despesa?'))
                                onDeleteOneOffExpense(e.id);
                            }}
                          >
                            Excluir
                          </S.ActionButton>
                        </S.ActionButtons>
                      </S.ActionsCell>
                    </S.Tr>
                  ))
              )}
            </tbody>
          </S.Table>
        </S.TableWrapper>
      </S.Section>

      {/* Modals */}
      {paymentReminder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
          onClick={() => setPaymentReminder(null)}
          role="presentation"
        >
          <div
            onClick={(ev) => ev.stopPropagation()}
            style={{
              background: 'var(--color-surface, #fff)',
              borderRadius: 8,
              padding: 24,
              maxWidth: 400,
              width: '100%',
            }}
          >
            <PaymentForm
              reminder={
                paymentReminder.type === 'parcel'
                  ? paymentReminder.reminder
                  : { ...paymentReminder.reminder, monthKey: paymentReminder.monthKey }
              }
              onConfirm={handlePaymentConfirm}
              onCancel={() => setPaymentReminder(null)}
            />
          </div>
        </div>
      )}

      {editingReminder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
          onClick={() => setEditingReminder(null)}
          role="presentation"
        >
          <div
            onClick={(ev) => ev.stopPropagation()}
            style={{
              background: 'var(--color-surface, #fff)',
              borderRadius: 8,
              padding: 24,
              maxWidth: 400,
              width: '100%',
            }}
          >
            <h3 style={{ margin: '0 0 16px' }}>
              Editar {editingReminder.type === 'parcel' ? 'conta' : 'lembrete recorrente'}
            </h3>
            <ReminderForm
              reminder={editingReminder}
              defaultDate={
                editingReminder.type === 'parcel'
                  ? editingReminder.dueDate
                  : `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`
              }
              onSaveParcel={() => {}}
              onSaveRecurring={() => {}}
              onUpdateParcel={(id, updates) => {
                onUpdateTaxReminder(id, updates);
                setEditingReminder(null);
              }}
              onUpdateRecurring={(id, updates) => {
                onUpdateRecurringReminder(id, updates);
                setEditingReminder(null);
              }}
              onCancel={() => setEditingReminder(null)}
            />
          </div>
        </div>
      )}

      {editingExpenseId && (() => {
        const expense = oneOffExpenses.find((e) => e.id === editingExpenseId);
        if (!expense) return null;
        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 16,
            }}
            onClick={() => setEditingExpenseId(null)}
            role="presentation"
          >
            <div
              onClick={(ev) => ev.stopPropagation()}
              style={{
                background: 'var(--color-surface, #fff)',
                borderRadius: 8,
                padding: 24,
                maxWidth: 400,
                width: '100%',
              }}
            >
              <h3 style={{ margin: '0 0 16px' }}>Editar despesa</h3>
              <ExpenseForm
                expense={expense}
                onSave={() => {}}
                onUpdate={(id, updates) => {
                  onUpdateOneOffExpense(id, updates);
                  setEditingExpenseId(null);
                }}
                onCancel={() => setEditingExpenseId(null)}
              />
            </div>
          </div>
        );
      })()}

      {editingRevenueId && (() => {
        const revenue = oneOffRevenues.find((r) => r.id === editingRevenueId);
        if (!revenue) return null;
        return (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 16,
            }}
            onClick={() => setEditingRevenueId(null)}
            role="presentation"
          >
            <div
              onClick={(ev) => ev.stopPropagation()}
              style={{
                background: 'var(--color-surface, #fff)',
                borderRadius: 8,
                padding: 24,
                maxWidth: 400,
                width: '100%',
              }}
            >
              <h3 style={{ margin: '0 0 16px' }}>Editar receita</h3>
              <OneOffRevenueForm
                revenue={revenue}
                onSave={() => {}}
                onUpdate={(id, updates) => {
                  onUpdateOneOffRevenue(id, updates);
                  setEditingRevenueId(null);
                }}
                onCancel={() => setEditingRevenueId(null)}
              />
            </div>
          </div>
        );
      })()}
    </S.Wrapper>
  );
}
