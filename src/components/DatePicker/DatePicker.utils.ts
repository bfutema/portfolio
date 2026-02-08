/**
 * Utilitários para o DatePicker.
 * Mantidos isolados para facilitar testes e reuso.
 */

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

/** Converte YYYY-MM-DD para objeto Date */
export function parseIsoDate(iso: string): Date | null {
  if (!iso || iso.length < 10) return null;
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (isNaN(date.getTime())) return null;
  return date;
}

/** Converte Date para YYYY-MM-DD */
export function toIsoString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Formato DD/MM/YYYY para exibição */
export function toDisplayFormat(iso: string): string {
  if (!iso || iso.length < 10) return '';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d ?? ''}/${m ?? ''}/${y ?? ''}`;
}

export function getMonthName(month: number): string {
  return MONTH_NAMES[month] ?? '';
}

/** Retorna primeiro dia do mês e quantos dias em branco antes (0 = domingo) */
export function getMonthGrid(year: number, month: number): {
  firstDay: number;
  daysInMonth: number;
  prevMonthDays: number;
} {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const firstDay = first.getDay();
  const daysInMonth = last.getDate();
  const prevMonthLast = new Date(year, month, 0);
  const prevMonthDays = prevMonthLast.getDate();
  return { firstDay, daysInMonth, prevMonthDays };
}

/** Gera array de células para o grid do calendário (6 semanas) */
export interface CalendarCell {
  date: Date;
  iso: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export function buildCalendarCells(
  year: number,
  month: number,
  selectedIso: string | null
): CalendarCell[] {
  const today = new Date();
  const todayIso = toIsoString(today);
  const { firstDay, daysInMonth, prevMonthDays } = getMonthGrid(year, month);

  const cells: CalendarCell[] = [];
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;

  // Dias do mês anterior
  for (let i = 0; i < firstDay; i++) {
    const d = prevMonthDays - firstDay + i + 1;
    const date = new Date(prevYear, prevMonth, d);
    cells.push({
      date,
      iso: toIsoString(date),
      isCurrentMonth: false,
      isToday: toIsoString(date) === todayIso,
      isSelected: toIsoString(date) === selectedIso,
    });
  }

  // Dias do mês atual
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const iso = toIsoString(date);
    cells.push({
      date,
      iso,
      isCurrentMonth: true,
      isToday: iso === todayIso,
      isSelected: iso === selectedIso,
    });
  }

  // Dias do próximo mês para completar 6 semanas (42 células)
  const totalSoFar = cells.length;
  const remaining = 42 - totalSoFar;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;

  for (let d = 1; d <= remaining; d++) {
    const date = new Date(nextYear, nextMonth, d);
    cells.push({
      date,
      iso: toIsoString(date),
      isCurrentMonth: false,
      isToday: toIsoString(date) === todayIso,
      isSelected: toIsoString(date) === selectedIso,
    });
  }

  return cells;
}
