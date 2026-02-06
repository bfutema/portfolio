import { useState } from 'react';
import * as S from './TaskList.styles';
import { TaskForm } from '../TaskForm';
import { useHoursApp } from '../../../../providers/HoursAppProvider';
import { calculateHours, formatHoursDisplay, MASKED_HOURS } from '../../../../utils/hoursStorage';
import type { Task, Client } from '../../../../types/hoursApp';

const DATE_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  const formatted = DATE_FORMAT.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

interface TaskListProps {
  tasks: Task[];
  clients: Client[];
  year: number;
  month: number;
  onAdd: (task: Omit<Task, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export function TaskList({
  tasks,
  clients,
  year,
  month,
  onAdd,
  onUpdate,
  onDelete,
}: TaskListProps) {
  const { valuesHidden } = useHoursApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fmtHours = (v: number) => (valuesHidden ? MASKED_HOURS : formatHoursDisplay(v));

  const monthStr = String(month + 1).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;

  const monthTasks = tasks.filter((t) => t.date.startsWith(prefix));
  const byDate = monthTasks.reduce<Record<string, Task[]>>((acc, t) => {
    if (!acc[t.date]) acc[t.date] = [];
    acc[t.date].push(t);
    return acc;
  }, {});

  const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));
  const hourlyClients = clients.filter((c) => c.type === 'hourly');
  const editingTask = editingId ? tasks.find((t) => t.id === editingId) : null;

  return (
    <S.Wrapper>
      {showForm && !editingId && (
        <TaskForm
          clients={clients}
          defaultDate={sortedDates[0] ?? `${year}-${monthStr}-01`}
          onSave={(task) => {
            onAdd(task);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          clients={clients}
          onSave={() => {}}
          onUpdate={(id, updates) => {
            onUpdate(id, updates);
            setEditingId(null);
          }}
          onCancel={() => setEditingId(null)}
        />
      )}

      {sortedDates.map((date) => (
        <S.DayGroup key={date}>
          <S.DayHeader>{formatDate(date)}</S.DayHeader>
          <S.TaskItems>
            {byDate[date].map((task) => (
              <S.TaskItem key={task.id}>
                <S.TaskContent>
                  <S.TaskDescription>
                    {task.description}
                    {task.isIsolated && <S.IsolatedBadge>Isolado</S.IsolatedBadge>}
                  </S.TaskDescription>
                  <S.TaskMeta>
                    {task.startTime} – {task.endTime} (
                    {fmtHours(calculateHours(task.startTime, task.endTime))}h)
                    {task.clientId && (
                      <> • {clients.find((c) => c.id === task.clientId)?.name ?? 'Cliente'}</>
                    )}
                  </S.TaskMeta>
                </S.TaskContent>
                <S.TaskActions>
                  <S.TaskButton onClick={() => setEditingId(task.id)}>
                    Editar
                  </S.TaskButton>
                  <S.TaskButton onClick={() => onDelete(task.id)}>
                    Excluir
                  </S.TaskButton>
                </S.TaskActions>
              </S.TaskItem>
            ))}
          </S.TaskItems>
        </S.DayGroup>
      ))}

      <S.AddButton
        onClick={() => setShowForm(true)}
        type="button"
        disabled={hourlyClients.length === 0}
      >
        + Nova tarefa {hourlyClients.length === 0 && '(cadastre um cliente por hora primeiro)'}
      </S.AddButton>
    </S.Wrapper>
  );
}
