import { useState, useEffect } from 'react';
import * as S from './ExpenseForm.styles';
import { DatePicker } from '../../../../components/DatePicker';
import type { OneOffExpense } from '../../../../types/hoursApp';

interface ExpenseFormProps {
  defaultDate?: string;
  expense?: OneOffExpense | null;
  onSave: (expense: Omit<OneOffExpense, 'id'>) => void;
  onUpdate?: (id: string, updates: Partial<OneOffExpense>) => void;
  onCancel?: () => void;
}

export function ExpenseForm({
  defaultDate,
  expense,
  onSave,
  onUpdate,
  onCancel,
}: ExpenseFormProps) {
  const isEdit = Boolean(expense);
  const [date, setDate] = useState(expense?.date ?? defaultDate ?? '');
  const [amount, setAmount] = useState(expense?.amount ?? 0);
  const [description, setDescription] = useState(expense?.description ?? '');

  useEffect(() => {
    if (!defaultDate && !expense) {
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [defaultDate, expense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    if (amount <= 0) return;

    if (isEdit && expense) {
      onUpdate?.(expense.id, { date, amount, description: description.trim() });
      onCancel?.();
    } else {
      onSave({ date, amount, description: description.trim() });
      setDate(new Date().toISOString().slice(0, 10));
      setAmount(0);
      setDescription('');
    }
  };

  return (
    <S.Form onSubmit={handleSubmit}>
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
          placeholder="Ex: Manutenção carro"
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
