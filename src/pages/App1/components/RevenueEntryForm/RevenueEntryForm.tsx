import { useState, useEffect } from 'react';
import * as S from './RevenueEntryForm.styles';
import { DateInput } from '../../../../components/DateInput';
import type { RevenueEntry } from '../../../../types/hoursApp';

interface RevenueEntryFormProps {
  clientId: string;
  clients?: { id: string; name: string }[];
  entry?: RevenueEntry | null;
  defaultDate?: string;
  onSave: (entry: Omit<RevenueEntry, 'id'>) => void;
  onUpdate?: (id: string, updates: Partial<RevenueEntry>) => void;
  onCancel?: () => void;
}

export function RevenueEntryForm({
  clientId: initialClientId,
  clients: fixedClients,
  entry,
  defaultDate,
  onSave,
  onUpdate,
  onCancel,
}: RevenueEntryFormProps) {
  const isEdit = Boolean(entry);
  const [clientId, setClientId] = useState(initialClientId ?? fixedClients?.[0]?.id ?? '');
  const [date, setDate] = useState(entry?.date ?? defaultDate ?? '');
  const [value, setValue] = useState(entry?.value ?? 0);
  const [description, setDescription] = useState(entry?.description ?? '');

  useEffect(() => {
    if (entry) {
      setClientId(entry.clientId);
    } else if (initialClientId) {
      setClientId(initialClientId);
    } else if (fixedClients?.[0]) {
      setClientId(fixedClients[0].id);
    }
  }, [entry, initialClientId, fixedClients]);

  useEffect(() => {
    if (!defaultDate && !entry) {
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [defaultDate, entry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value <= 0) return;

    if (isEdit && entry) {
      onUpdate?.(entry.id, { date, value, description: description.trim() || undefined });
      onCancel?.();
    } else {
      onSave({ clientId, date, value, description: description.trim() || undefined });
      setValue(0);
      setDescription('');
      setDate(new Date().toISOString().slice(0, 10));
    }
  };

  return (
    <S.Form onSubmit={handleSubmit}>
      {fixedClients && fixedClients.length > 1 && !entry && (
        <S.Field>
          <S.Label>Cliente</S.Label>
          <S.Select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            {fixedClients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </S.Select>
        </S.Field>
      )}
      <S.Field>
        <S.Label>Data da receita</S.Label>
        <DateInput value={date} onChange={setDate} placeholder="dd/mm/aaaa" required />
      </S.Field>
      <S.Field>
        <S.Label htmlFor="revenue-value">Valor (R$)</S.Label>
        <S.Input
          id="revenue-value"
          type="number"
          min="0.01"
          step="0.01"
          value={value || ''}
          onChange={(e) => setValue(Number(e.target.value) || 0)}
          placeholder="0,00"
          required
        />
      </S.Field>
      <S.Field>
        <S.Label htmlFor="revenue-desc">Descrição (opcional)</S.Label>
        <S.Input
          id="revenue-desc"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Dissídio 2025"
        />
      </S.Field>
      <S.Buttons>
        <S.Button type="submit">{isEdit ? 'Salvar' : 'Adicionar'}</S.Button>
        {onCancel && (
          <S.Button type="button" $variant="secondary" onClick={onCancel}>
            Cancelar
          </S.Button>
        )}
      </S.Buttons>
    </S.Form>
  );
}
