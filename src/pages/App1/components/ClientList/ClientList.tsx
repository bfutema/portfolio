import { useState } from 'react';
import * as S from './ClientList.styles';
import { ClientForm } from '../ClientForm';
import { RevenueEntryForm } from '../RevenueEntryForm';
import { useHoursApp } from '../../../../providers/HoursAppProvider';
import { formatCurrency, MASKED_CURRENCY } from '../../../../utils/hoursStorage';
import type { Client, RevenueEntry } from '../../../../types/hoursApp';

interface ClientListProps {
  clients: Client[];
  revenueEntries: RevenueEntry[];
  onAdd: (client: Omit<Client, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Client>) => void;
  onDelete: (id: string) => void;
  onAddRevenue: (entry: Omit<RevenueEntry, 'id'>) => void;
  onUpdateRevenue: (id: string, updates: Partial<RevenueEntry>) => void;
  onDeleteRevenue: (id: string) => void;
}

export function ClientList({
  clients,
  revenueEntries,
  onAdd,
  onUpdate,
  onDelete,
  onAddRevenue,
  onUpdateRevenue,
  onDeleteRevenue,
}: ClientListProps) {
  const { valuesHidden } = useHoursApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingRevenueFor, setAddingRevenueFor] = useState<string | null>(null);
  const [editingRevenueId, setEditingRevenueId] = useState<string | null>(null);

  const fmtCurr = (v: number) => (valuesHidden ? MASKED_CURRENCY : formatCurrency(v));

  const editingClient = editingId ? clients.find((c) => c.id === editingId) : null;
  const editingRevenue = editingRevenueId ? revenueEntries.find((e) => e.id === editingRevenueId) : null;

  return (
    <S.Wrapper>
      <S.SectionTitle>Clientes</S.SectionTitle>
      <S.EmptyMessage>
        Cadastre clientes por hora ou com valor fixo mensal. Para clientes fixos, adicione os lançamentos de receita manualmente (incluindo dissídios).
      </S.EmptyMessage>

      {showForm && !editingId && (
        <ClientForm
          onSave={(client) => {
            onAdd(client);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingClient && (
        <ClientForm
          client={editingClient}
          onSave={() => {}}
          onUpdate={(id, updates) => {
            onUpdate(id, updates);
            setEditingId(null);
          }}
          onCancel={() => setEditingId(null)}
        />
      )}

      {addingRevenueFor && (
        <S.RevenueFormCard>
          <S.RevenueFormTitle>Novo lançamento de receita</S.RevenueFormTitle>
          <RevenueEntryForm
            clientId={addingRevenueFor}
            onSave={(entry) => {
              onAddRevenue(entry);
              setAddingRevenueFor(null);
            }}
            onCancel={() => setAddingRevenueFor(null)}
          />
        </S.RevenueFormCard>
      )}

      {editingRevenue && (
        <S.RevenueFormCard>
          <S.RevenueFormTitle>Editar lançamento</S.RevenueFormTitle>
          <RevenueEntryForm
            clientId={editingRevenue.clientId}
            entry={editingRevenue}
            onSave={() => {}}
            onUpdate={(id, updates) => {
              onUpdateRevenue(id, updates);
              setEditingRevenueId(null);
            }}
            onCancel={() => setEditingRevenueId(null)}
          />
        </S.RevenueFormCard>
      )}

      <S.ClientItems>
        {clients.map((client) => {
          const clientRevenue = revenueEntries.filter((e) => e.clientId === client.id);
          return (
            <S.ClientItem key={client.id}>
              <S.ClientTopRow>
                <S.ClientInfo>
                  <S.ClientName>{client.name}</S.ClientName>
                  <S.ClientMeta>
                    {client.type === 'hourly' ? (
                      <>{fmtCurr(client.hourlyRate)}/h</>
                    ) : (
                      <S.ClientTypeBadge>Fixo mensal</S.ClientTypeBadge>
                    )}
                  </S.ClientMeta>
                  {client.type === 'fixed_monthly' && clientRevenue.length > 0 && (
                    <S.RevenuePreview>
                      {clientRevenue.length} lançamento(s) • {fmtCurr(clientRevenue.reduce((s, e) => s + e.value, 0))}
                    </S.RevenuePreview>
                  )}
                </S.ClientInfo>
                <S.ClientActions>
                {client.type === 'fixed_monthly' && (
                  <S.ClientButton onClick={() => setAddingRevenueFor(client.id)}>
                    + Receita
                  </S.ClientButton>
                )}
                <S.ClientButton onClick={() => setEditingId(client.id)}>
                  Editar
                </S.ClientButton>
                <S.ClientButton onClick={() => onDelete(client.id)}>
                  Excluir
                </S.ClientButton>
                </S.ClientActions>
              </S.ClientTopRow>
              {client.type === 'fixed_monthly' && clientRevenue.length > 0 && (
                <S.RevenueList>
                  {clientRevenue
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((entry) => (
                      <S.RevenueItem key={entry.id}>
                        <S.RevenueItemInfo>
                          <span>{entry.date.split('-').reverse().join('/')}</span>
                          <span>{fmtCurr(entry.value)}</span>
                          {entry.description && <S.RevenueDesc>{entry.description}</S.RevenueDesc>}
                        </S.RevenueItemInfo>
                        <S.RevenueItemActions>
                          <S.ClientButton onClick={() => setEditingRevenueId(entry.id)}>
                            Editar
                          </S.ClientButton>
                          <S.ClientButton onClick={() => onDeleteRevenue(entry.id)}>
                            Excluir
                          </S.ClientButton>
                        </S.RevenueItemActions>
                      </S.RevenueItem>
                    ))}
                </S.RevenueList>
              )}
            </S.ClientItem>
          );
        })}
      </S.ClientItems>

      <S.AddButton onClick={() => setShowForm(true)} type="button">
        + Novo cliente
      </S.AddButton>
    </S.Wrapper>
  );
}
