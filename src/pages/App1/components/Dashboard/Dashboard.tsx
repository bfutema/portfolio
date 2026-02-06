import * as S from './Dashboard.styles';
import { useHoursApp } from '../../../../providers/HoursAppProvider';
import {
  calculateHours,
  calculateTotalHours,
  formatCurrency,
  formatHoursDisplay,
  MASKED_CURRENCY,
  MASKED_HOURS,
} from '../../../../utils/hoursStorage';
import type { Task, Client, RevenueEntry } from '../../../../types/hoursApp';

interface DashboardProps {
  tasks: Task[];
  clients: Client[];
  revenueEntries: RevenueEntry[];
  year: number;
  month: number;
}

function getPrevMonthPrefix(year: number, month: number): string {
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonthStr = String(prevMonth + 1).padStart(2, '0');
  return `${prevYear}-${prevMonthStr}`;
}

export function Dashboard({ tasks, clients, revenueEntries, year, month }: DashboardProps) {
  const { valuesHidden } = useHoursApp();
  const monthStr = String(month + 1).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;
  const prevPrefix = getPrevMonthPrefix(year, month);

  const monthTasks = tasks.filter((t) => t.date.startsWith(prefix));
  const prevMonthTasks = tasks.filter((t) => t.date.startsWith(prevPrefix));
  const monthRevenue = revenueEntries.filter((e) => e.date.startsWith(prefix));

  const totalHours = calculateTotalHours(monthTasks);

  const totalFromHours = prevMonthTasks.reduce((acc, t) => {
    const hours = calculateHours(t.startTime, t.endTime);
    const client = clients.find((c) => c.id === t.clientId);
    const rate = client?.hourlyRate ?? 0;
    return acc + hours * rate;
  }, 0);

  const totalFromFixed = monthRevenue.reduce((acc, e) => acc + e.value, 0);
  const totalToReceive = totalFromHours + totalFromFixed;

  const fmtCurr = (v: number) => (valuesHidden ? MASKED_CURRENCY : formatCurrency(v));
  const fmtHours = (v: number) => (valuesHidden ? MASKED_HOURS : formatHoursDisplay(v));

  return (
    <S.Wrapper>
      <S.Card>
        <S.CardLabel>Horas no mês</S.CardLabel>
        <S.CardValue>{fmtHours(totalHours)}h</S.CardValue>
      </S.Card>
      <S.Card>
        <S.CardLabel>Total a receber</S.CardLabel>
        <S.CardValue>{fmtCurr(totalToReceive)}</S.CardValue>
        <S.CardHint>
          {totalFromHours > 0 && <span>Por horas (mês anterior): {fmtCurr(totalFromHours)}</span>}
          {totalFromHours > 0 && totalFromFixed > 0 && ' • '}
          {totalFromFixed > 0 && <span>Receita fixa: {fmtCurr(totalFromFixed)}</span>}
        </S.CardHint>
      </S.Card>
    </S.Wrapper>
  );
}
