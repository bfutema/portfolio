import { useState, useEffect } from 'react';
import * as S from './TaskForm.styles';
import { DatePicker } from '../../../../components/DatePicker';
import { TimeInput } from '../../../../components/TimeInput';
import { useHoursApp } from '../../../../providers/HoursAppProvider';
import { formatCurrency, MASKED_CURRENCY } from '../../../../utils/hoursStorage';
import type { Task } from '../../../../types/hoursApp';
import type { Client } from '../../../../types/hoursApp';

interface TaskFormProps {
  task?: Task | null;
  clients: Client[];
  defaultDate?: string;
  onSave: (task: Omit<Task, 'id'>) => void;
  onUpdate?: (id: string, updates: Partial<Task>) => void;
  onCancel?: () => void;
}

export function TaskForm({
  task,
  clients,
  defaultDate,
  onSave,
  onUpdate,
  onCancel,
}: TaskFormProps) {
  const { valuesHidden } = useHoursApp();
  const isEdit = Boolean(task);
  const [date, setDate] = useState(task?.date ?? defaultDate ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [startTime, setStartTime] = useState(task?.startTime ?? '09:00');
  const [endTime, setEndTime] = useState(task?.endTime ?? '18:00');
  const hasTaskWithDuration = task && task.startTime === '00:00' && task.endTime;
  const [useDuration, setUseDuration] = useState(Boolean(hasTaskWithDuration));
  const [duration, setDuration] = useState(
    hasTaskWithDuration ? task!.endTime : ''
  );
  const [isIsolated, setIsIsolated] = useState(task?.isIsolated ?? false);
  const hourlyClients = clients.filter((c) => c.type === 'hourly');
  const [clientId, setClientId] = useState(task?.clientId ?? hourlyClients[0]?.id ?? '');

  useEffect(() => {
    if (!defaultDate && !task) {
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [defaultDate, task]);

  useEffect(() => {
    if (!clientId && hourlyClients[0]) {
      setClientId(hourlyClients[0].id);
    }
  }, [hourlyClients, clientId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    let finalStart = startTime;
    let finalEnd = endTime;

    if (useDuration && duration) {
      const parts = duration.split(':').map(Number);
      const h = parts[0] ?? 0;
      const m = parts[1] ?? 0;
      if (h > 0 || m > 0) {
        finalStart = '00:00';
        finalEnd = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      } else {
        return;
      }
    } else {
      const start = startTime.split(':').map(Number);
      const end = endTime.split(':').map(Number);
      if (start[0] * 60 + start[1] >= end[0] * 60 + end[1]) return;
    }

    if (isEdit && task) {
      onUpdate?.(task.id, {
        date,
        description: description.trim(),
        startTime: finalStart,
        endTime: finalEnd,
        isIsolated,
        clientId,
      });
      onCancel?.();
    } else {
      onSave({
        date,
        description: description.trim(),
        startTime: finalStart,
        endTime: finalEnd,
        isIsolated,
        clientId,
      });
      setDescription('');
      setStartTime('09:00');
      setEndTime('18:00');
      setDuration('');
      setIsIsolated(false);
      setClientId(hourlyClients[0]?.id ?? '');
    }
  };

  return (
    <S.Form onSubmit={handleSubmit}>
      {hourlyClients.length > 0 && (
        <S.Field>
          <S.Label>Cliente</S.Label>
          <S.Select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            {hourlyClients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.hourlyRate > 0 ? (valuesHidden ? `${MASKED_CURRENCY}/h` : `${formatCurrency(c.hourlyRate)}/h`) : '—'})
              </option>
            ))}
          </S.Select>
        </S.Field>
      )}
      <S.Field>
        <S.Label>Data</S.Label>
        <DatePicker
          value={date}
          onChange={setDate}
          placeholder="dd/mm/aaaa"
          required
        />
      </S.Field>
      <S.Field>
        <S.Label>Descrição</S.Label>
        <S.Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="O que foi feito?"
          required
        />
      </S.Field>
      <S.CheckboxLabel>
        <S.Checkbox
          type="checkbox"
          checked={useDuration}
          onChange={(e) => {
            setUseDuration(e.target.checked);
            if (!e.target.checked) setDuration('');
          }}
        />
        Inserir só a duração (ex: 08:27 para 8h27)
      </S.CheckboxLabel>
      {useDuration ? (
        <S.Field>
          <S.Label>Duração (HH:MM)</S.Label>
          <TimeInput
            value={duration}
            onChange={setDuration}
            placeholder="08:27"
            required={useDuration}
          />
        </S.Field>
      ) : (
        <S.Row>
          <S.Field>
            <S.Label>Hora início</S.Label>
            <TimeInput
              value={startTime}
              onChange={setStartTime}
              placeholder="09:00"
              required
            />
          </S.Field>
          <S.Field>
            <S.Label>Hora fim</S.Label>
            <TimeInput
              value={endTime}
              onChange={setEndTime}
              placeholder="18:00"
              required
            />
          </S.Field>
        </S.Row>
      )}
      <S.CheckboxLabel>
        <S.Checkbox
          type="checkbox"
          checked={isIsolated}
          onChange={(e) => setIsIsolated(e.target.checked)}
        />
        Tempo isolado (ex: reunião após expediente)
      </S.CheckboxLabel>
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
