import { useState } from 'react';
import { formatCurrency, MASKED_CURRENCY } from '../../../../utils/hoursStorage';
import { PaymentForm } from '../PaymentForm';
import { ReminderForm } from '../ReminderForm';
import type { RecurringReminder, RecurringPayment } from '../../../../types/hoursApp';
import * as S from '../ImpostosTable/ImpostosTable.styles';

function formatMonthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

interface LembretesRecorrentesTableProps {
  recurringReminders: RecurringReminder[];
  recurringPayments: RecurringPayment[];
  valuesHidden: boolean;
  onUpdateRecurringReminder: (id: string, updates: Partial<RecurringReminder>) => void;
  onAddRecurringPayment: (payment: Omit<RecurringPayment, 'id'>) => void;
  onDeleteRecurringReminder: (id: string) => void;
}

export function LembretesRecorrentesTable({
  recurringReminders,
  recurringPayments,
  valuesHidden,
  onUpdateRecurringReminder,
  onAddRecurringPayment,
  onDeleteRecurringReminder,
}: LembretesRecorrentesTableProps) {
  const [paymentReminder, setPaymentReminder] = useState<{
    reminder: RecurringReminder;
    monthKey: string;
  } | null>(null);
  const [editingReminder, setEditingReminder] = useState<RecurringReminder | null>(null);

  const now = new Date();
  const fmtCurr = (v: number) => (valuesHidden ? MASKED_CURRENCY : formatCurrency(v));

  const handlePaymentConfirm = (paidAt: string, paidAmount: number) => {
    if (!paymentReminder) return;
    onAddRecurringPayment({
      reminderId: paymentReminder.reminder.id,
      month: paymentReminder.monthKey,
      paidAt,
      paidAmount,
    });
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
                                !paid && setPaymentReminder({ reminder: r, monthKey: key })
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
              reminder={{ ...paymentReminder.reminder, monthKey: paymentReminder.monthKey }}
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
            <h3 style={{ margin: '0 0 16px' }}>Editar lembrete recorrente</h3>
            <ReminderForm
              reminder={editingReminder}
              defaultDate={`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`}
              onSaveParcel={() => {}}
              onSaveRecurring={() => {}}
              onUpdateParcel={() => {}}
              onUpdateRecurring={(id, updates) => {
                onUpdateRecurringReminder(id, updates);
                setEditingReminder(null);
              }}
              onCancel={() => setEditingReminder(null)}
            />
          </div>
        </div>
      )}
    </S.Wrapper>
  );
}
