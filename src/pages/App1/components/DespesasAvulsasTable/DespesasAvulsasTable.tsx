import { useState } from 'react';
import { formatCurrency, MASKED_CURRENCY } from '../../../../utils/hoursStorage';
import { ExpenseForm } from '../ExpenseForm';
import type { OneOffExpense } from '../../../../types/hoursApp';
import * as S from '../ImpostosTable/ImpostosTable.styles';

function formatDateDisplay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

interface DespesasAvulsasTableProps {
  oneOffExpenses: OneOffExpense[];
  valuesHidden: boolean;
  onUpdateOneOffExpense: (id: string, updates: Partial<OneOffExpense>) => void;
  onDeleteOneOffExpense: (id: string) => void;
}

export function DespesasAvulsasTable({
  oneOffExpenses,
  valuesHidden,
  onUpdateOneOffExpense,
  onDeleteOneOffExpense,
}: DespesasAvulsasTableProps) {
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  const fmtCurr = (v: number) => (valuesHidden ? MASKED_CURRENCY : formatCurrency(v));

  return (
    <S.Wrapper>
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
    </S.Wrapper>
  );
}
