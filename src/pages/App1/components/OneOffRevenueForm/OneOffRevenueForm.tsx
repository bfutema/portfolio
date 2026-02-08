import { useState, useEffect } from 'react';
import * as S from './OneOffRevenueForm.styles';
import { DatePicker } from '../../../../components/DatePicker';
import type { OneOffRevenue, OneOffRevenueType } from '../../../../types/hoursApp';

interface OneOffRevenueFormProps {
  defaultDate?: string;
  revenue?: OneOffRevenue | null;
  onSave: (revenue: Omit<OneOffRevenue, 'id'>) => void;
  onUpdate?: (id: string, updates: Partial<OneOffRevenue>) => void;
  onCancel?: () => void;
}

export function OneOffRevenueForm({
  defaultDate,
  revenue,
  onSave,
  onUpdate,
  onCancel,
}: OneOffRevenueFormProps) {
  const isEdit = Boolean(revenue);
  const [date, setDate] = useState(revenue?.date ?? defaultDate ?? '');
  const [amount, setAmount] = useState(revenue?.amount ?? 0);
  const [description, setDescription] = useState(revenue?.description ?? '');
  const [transferType, setTransferType] = useState<OneOffRevenueType>(
    revenue?.transferType ?? 'PIX'
  );

  useEffect(() => {
    if (!defaultDate && !revenue) {
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [defaultDate, revenue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    if (amount <= 0) return;

    if (isEdit && revenue) {
      onUpdate?.(revenue.id, {
        date,
        amount,
        description: description.trim(),
        transferType,
      });
      onCancel?.();
    } else {
      onSave({ date, amount, description: description.trim(), transferType });
      setDate(new Date().toISOString().slice(0, 10));
      setAmount(0);
      setDescription('');
    }
  };

  return (
    <S.Form onSubmit={handleSubmit}>
      <S.Field>
        <S.Label>Tipo</S.Label>
        <S.Select
          value={transferType}
          onChange={(e) => setTransferType(e.target.value as OneOffRevenueType)}
        >
          <option value="PIX">PIX</option>
          <option value="TED">TED</option>
        </S.Select>
      </S.Field>
      <S.Field>
        <S.Label>Data</S.Label>
        <DatePicker value={date} onChange={setDate} placeholder="dd/mm/aaaa" required />
      </S.Field>
      <S.Field>
        <S.Label>Valor (R$)</S.Label>
        <S.Input
          type="number"
          min="0.01"
          step="0.01"
          value={amount || ''}
          onChange={(e) => setAmount(Number(e.target.value) || 0)}
          placeholder="0,00"
          required
        />
      </S.Field>
      <S.Field>
        <S.Label>Descrição</S.Label>
        <S.Input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Pagamento cliente X"
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
