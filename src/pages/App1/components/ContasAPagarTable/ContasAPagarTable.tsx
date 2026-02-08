import { useState } from 'react';
import { formatCurrency, MASKED_CURRENCY } from '../../../../utils/hoursStorage';
import { PaymentForm } from '../PaymentForm';
import { ReminderForm } from '../ReminderForm';
import type { TaxReminder } from '../../../../types/hoursApp';
import * as S from '../ImpostosTable/ImpostosTable.styles';

function formatDateDisplay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

interface ContasAPagarTableProps {
  taxReminders: TaxReminder[];
  valuesHidden: boolean;
  onUpdateTaxReminder: (id: string, updates: Partial<TaxReminder>) => void;
  onDeleteTaxReminder: (id: string) => void;
}

export function ContasAPagarTable({
  taxReminders,
  valuesHidden,
  onUpdateTaxReminder,
  onDeleteTaxReminder,
}: ContasAPagarTableProps) {
  const [paymentReminder, setPaymentReminder] = useState<TaxReminder | null>(null);
  const [editingReminder, setEditingReminder] = useState<TaxReminder | null>(null);

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
    onUpdateTaxReminder(paymentReminder.id, { paidAt, paidAmount });
    setPaymentReminder(null);
  };

  return (
    <S.Wrapper>
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
                          <S.ActionButton type="button" onClick={() => setPaymentReminder(r)}>
                            Pagar
                          </S.ActionButton>
                        )}
                        <S.ActionButton type="button" onClick={() => setEditingReminder(r)}>
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
              reminder={paymentReminder}
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
            <h3 style={{ margin: '0 0 16px' }}>Editar conta</h3>
            <ReminderForm
              reminder={editingReminder}
              defaultDate={editingReminder.dueDate}
              onSaveParcel={() => {}}
              onSaveRecurring={() => {}}
              onUpdateParcel={(id, updates) => {
                onUpdateTaxReminder(id, updates);
                setEditingReminder(null);
              }}
              onUpdateRecurring={() => {}}
              onCancel={() => setEditingReminder(null)}
            />
          </div>
        </div>
      )}
    </S.Wrapper>
  );
}
