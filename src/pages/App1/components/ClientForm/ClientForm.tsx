import { useState, useEffect } from 'react';
import * as S from './ClientForm.styles';
import type { Client, ClientType } from '../../../../types/hoursApp';

interface ClientFormProps {
  client?: Client | null;
  onSave: (client: Omit<Client, 'id'>) => void;
  onUpdate?: (id: string, updates: Partial<Client>) => void;
  onCancel?: () => void;
}

export function ClientForm({
  client,
  onSave,
  onUpdate,
  onCancel,
}: ClientFormProps) {
  const isEdit = Boolean(client);
  const [name, setName] = useState(client?.name ?? '');
  const [type, setType] = useState<ClientType>(client?.type ?? 'hourly');
  const [hourlyRate, setHourlyRate] = useState(client?.hourlyRate ?? 0);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setType(client.type);
      setHourlyRate(client.hourlyRate);
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEdit && client) {
      onUpdate?.(client.id, {
        name: name.trim(),
        type,
        hourlyRate: type === 'hourly' ? Math.max(0, hourlyRate) : 0,
      });
      onCancel?.();
    } else {
      onSave({
        name: name.trim(),
        type,
        hourlyRate: type === 'hourly' ? Math.max(0, hourlyRate) : 0,
      });
      setName('');
      setType('hourly');
      setHourlyRate(0);
    }
  };

  return (
    <S.Form onSubmit={handleSubmit}>
      <S.Field>
        <S.Label htmlFor="client-name">Nome do cliente</S.Label>
        <S.Input
          id="client-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Empresa XYZ"
          required
        />
      </S.Field>
      <S.Field>
        <S.Label>Tipo de cobrança</S.Label>
        <S.RadioGroup>
          <S.RadioLabel>
            <S.Radio
              type="radio"
              name="client-type"
              value="hourly"
              checked={type === 'hourly'}
              onChange={(e) => setType(e.target.value as ClientType)}
            />
            Por hora
          </S.RadioLabel>
          <S.RadioLabel>
            <S.Radio
              type="radio"
              name="client-type"
              value="fixed_monthly"
              checked={type === 'fixed_monthly'}
              onChange={(e) => setType(e.target.value as ClientType)}
            />
            Valor fixo mensal
          </S.RadioLabel>
        </S.RadioGroup>
      </S.Field>
      {type === 'hourly' && (
        <S.Field>
          <S.Label htmlFor="client-rate">Valor/hora (R$)</S.Label>
          <S.Input
            id="client-rate"
            type="number"
            min="0"
            step="0.01"
            value={hourlyRate || ''}
            onChange={(e) => setHourlyRate(Number(e.target.value) || 0)}
            placeholder="0,00"
            required
          />
        </S.Field>
      )}
      <S.Buttons>
        <S.Button type="submit">
          {isEdit ? 'Salvar' : 'Adicionar'}
        </S.Button>
        {onCancel && (
          <S.Button type="button" $variant="secondary" onClick={onCancel}>
            Cancelar
          </S.Button>
        )}
      </S.Buttons>
    </S.Form>
  );
}
