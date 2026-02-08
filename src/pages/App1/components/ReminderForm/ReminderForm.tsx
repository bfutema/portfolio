import { useState, useEffect } from 'react';
import * as S from './ReminderForm.styles';
import { DatePicker } from '../../../../components/DatePicker';
import type { TaxReminder, RecurringReminder, TaxReminderSource } from '../../../../types/hoursApp';

const SOURCES: { value: TaxReminderSource; label: string }[] = [
  { value: 'PGFN', label: 'PGFN' },
  { value: 'Prefeitura', label: 'Prefeitura' },
  { value: 'Receita Federal', label: 'Receita Federal' },
  { value: 'Cartão de crédito', label: 'Cartão de crédito' },
];

interface ReminderFormProps {
  defaultDate?: string;
  reminder?: TaxReminder | RecurringReminder | null;
  mode?: 'parcel' | 'recurring' | 'both';
  onSaveParcel: (reminder: Omit<TaxReminder, 'id'>) => void;
  onSaveRecurring: (reminder: Omit<RecurringReminder, 'id'>) => void;
  onUpdateParcel?: (id: string, updates: Partial<TaxReminder>) => void;
  onUpdateRecurring?: (id: string, updates: Partial<RecurringReminder>) => void;
  onCancel?: () => void;
}

export function ReminderForm({
  defaultDate,
  reminder,
  mode = 'both',
  onSaveParcel,
  onSaveRecurring,
  onUpdateParcel,
  onUpdateRecurring,
  onCancel,
}: ReminderFormProps) {
  const isEdit = Boolean(reminder);
  const isParcel = reminder?.type === 'parcel';
  const isRecurring = reminder?.type === 'recurring';

  const effectiveType = mode === 'parcel' ? 'parcel' : mode === 'recurring' ? 'recurring' : null;
  const [type, setType] = useState<'parcel' | 'recurring'>(
    effectiveType ?? (isParcel ? 'parcel' : isRecurring ? 'recurring' : 'parcel')
  );
  const [source, setSource] = useState<TaxReminderSource | 'other'>(() => {
    if (reminder?.type === 'parcel' || reminder?.type === 'recurring') {
      const src = reminder.source;
      return SOURCES.some((s) => s.value === src) ? (src as TaxReminderSource) : 'other';
    }
    return 'PGFN';
  });
  const [customSource, setCustomSource] = useState(() => {
    if (reminder && !SOURCES.some((s) => s.value === reminder.source)) {
      return String(reminder.source);
    }
    return '';
  });
  const [dueDate, setDueDate] = useState(
    reminder?.type === 'parcel' ? reminder.dueDate : defaultDate ?? ''
  );
  const [dayOfMonth, setDayOfMonth] = useState(
    reminder?.type === 'recurring' ? reminder.dayOfMonth : 10
  );
  const [amount, setAmount] = useState(
    reminder?.type === 'parcel' ? reminder.amount : reminder?.type === 'recurring' && reminder.amount ? reminder.amount : 0
  );
  const [description, setDescription] = useState(reminder?.description ?? '');

  useEffect(() => {
    if (!reminder) {
      if (!defaultDate) {
        setDueDate(new Date().toISOString().slice(0, 10));
      } else {
        setDueDate(defaultDate);
      }
    }
  }, [defaultDate, reminder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const src = source === 'other' ? (customSource.trim() || 'Outro') : source;

    if (type === 'parcel') {
      if (!dueDate) return;
      if (isEdit && reminder?.type === 'parcel' && onUpdateParcel) {
        onUpdateParcel(reminder.id, { source: src, dueDate, amount, description: description.trim() });
        onCancel?.();
      } else {
        onSaveParcel({
          type: 'parcel',
          source: src,
          dueDate,
          amount,
          description: description.trim(),
        });
        if (!isEdit) {
          setDescription('');
          setAmount(0);
          setDayOfMonth(10);
        }
      }
    } else {
      if (isEdit && reminder?.type === 'recurring' && onUpdateRecurring) {
        onUpdateRecurring(reminder.id, {
          source: src,
          dayOfMonth: Math.max(1, Math.min(31, dayOfMonth)),
          description: description.trim(),
          amount: amount > 0 ? amount : undefined,
        });
        onCancel?.();
      } else {
        onSaveRecurring({
          type: 'recurring',
          source: src,
          dayOfMonth: Math.max(1, Math.min(31, dayOfMonth)),
          description: description.trim(),
          amount: amount > 0 ? amount : undefined,
        });
        if (!isEdit) {
          setDescription('');
          setAmount(0);
          setDayOfMonth(10);
        }
      }
    }
  };

  return (
    <S.Form onSubmit={handleSubmit}>
      {mode === 'both' && (
        <S.Field>
          <S.Label>Tipo</S.Label>
          <S.Select
            value={type}
            onChange={(e) => setType(e.target.value as 'parcel' | 'recurring')}
            disabled={isEdit}
          >
            <option value="parcel">Data fixa (conta, fatura, parcela)</option>
            <option value="recurring">Recorrente (todo mês)</option>
          </S.Select>
        </S.Field>
      )}

      <S.Field>
        <S.Label>Origem</S.Label>
        <S.Select
          value={source}
          onChange={(e) => setSource(e.target.value as TaxReminderSource | 'other')}
        >
          {SOURCES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
          <option value="other">Outro</option>
        </S.Select>
      </S.Field>

      {source === 'other' && (
        <S.Field>
          <S.Label>Nome da origem</S.Label>
          <S.Input
            type="text"
            value={customSource}
            onChange={(e) => setCustomSource(e.target.value)}
            placeholder="Ex: Procon, SPC"
          />
        </S.Field>
      )}

      {type === 'parcel' ? (
        <S.Field>
          <S.Label>Data de vencimento</S.Label>
          <DatePicker value={dueDate} onChange={setDueDate} placeholder="dd/mm/aaaa" required />
        </S.Field>
      ) : (
        <S.Field>
          <S.Label>Dia do mês (1–31)</S.Label>
          <S.Input
            type="number"
            min={1}
            max={31}
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(Number(e.target.value) || 1)}
            required
          />
        </S.Field>
      )}

      <S.Field>
        <S.Label>Valor (R$)</S.Label>
        <S.Input
          type="number"
          min="0"
          step="0.01"
          value={amount || ''}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          placeholder="0,00"
        />
      </S.Field>

      <S.Field>
        <S.Label>Descrição</S.Label>
        <S.Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Parcela 3/12, Fatura Nubank, Declarar IR"
          required
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
