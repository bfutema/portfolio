import { useState } from 'react';
import * as S from './PaymentForm.styles';
import { DatePicker } from '../../../../components/DatePicker';
import { formatCurrency } from '../../../../utils/hoursStorage';
import type { TaxReminder, RecurringReminder } from '../../../../types/hoursApp';

type ReminderForPayment = (TaxReminder | RecurringReminder) & { monthKey?: string };

interface PaymentFormProps {
  reminder: ReminderForPayment;
  onConfirm: (paidAt: string, paidAmount: number) => void;
  onCancel?: () => void;
}

export function PaymentForm({ reminder, onConfirm, onCancel }: PaymentFormProps) {
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 10));
  const [paidAmount, setPaidAmount] = useState(
    reminder.amount && reminder.amount > 0 ? reminder.amount : 0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paidAmount <= 0) return;
    onConfirm(paidAt, paidAmount);
  };

  const label =
    reminder.type === 'parcel'
      ? `${reminder.source} - ${reminder.description} (venc. ${reminder.dueDate})`
      : `${reminder.source} - ${reminder.description} (dia ${reminder.dayOfMonth})`;

  return (
    <S.Form onSubmit={handleSubmit}>
      <S.ReminderInfo>{label}</S.ReminderInfo>
      {reminder.amount != null && reminder.amount > 0 && (
        <S.ReminderInfo>Valor previsto: {formatCurrency(reminder.amount)}</S.ReminderInfo>
      )}
      <S.Field>
        <S.Label>Data do pagamento</S.Label>
        <DatePicker value={paidAt} onChange={setPaidAt} placeholder="dd/mm/aaaa" required />
      </S.Field>
      <S.Field>
        <S.Label>Valor pago (R$)</S.Label>
        <S.Input
          type="number"
          min="0.01"
          step="0.01"
          value={paidAmount || ''}
          onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
          placeholder="0,00"
          required
        />
      </S.Field>
      <S.Buttons>
        <S.Button type="submit">Confirmar pagamento</S.Button>
        {onCancel && (
          <S.Button type="button" $variant="secondary" onClick={onCancel}>
            Cancelar
          </S.Button>
        )}
      </S.Buttons>
    </S.Form>
  );
}
