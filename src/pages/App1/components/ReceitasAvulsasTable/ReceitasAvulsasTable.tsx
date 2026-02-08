import { useState } from 'react';
import { formatCurrency, MASKED_CURRENCY } from '../../../../utils/hoursStorage';
import { OneOffRevenueForm } from '../OneOffRevenueForm';
import type { OneOffRevenue } from '../../../../types/hoursApp';
import * as S from '../ImpostosTable/ImpostosTable.styles';

function formatDateDisplay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

interface ReceitasAvulsasTableProps {
  oneOffRevenues: OneOffRevenue[];
  valuesHidden: boolean;
  onUpdateOneOffRevenue: (id: string, updates: Partial<OneOffRevenue>) => void;
  onDeleteOneOffRevenue: (id: string) => void;
}

export function ReceitasAvulsasTable({
  oneOffRevenues,
  valuesHidden,
  onUpdateOneOffRevenue,
  onDeleteOneOffRevenue,
}: ReceitasAvulsasTableProps) {
  const [editingRevenueId, setEditingRevenueId] = useState<string | null>(null);

  const fmtCurr = (v: number) => (valuesHidden ? MASKED_CURRENCY : formatCurrency(v));

  return (
    <S.Wrapper>
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
