import { useRef, useEffect } from 'react';
import * as S from './DatePicker.styles';
import { getMonthName, buildCalendarCells } from './DatePicker.utils';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface CalendarPopoverProps {
  anchorRect: DOMRect;
  year: number;
  month: number;
  selectedIso: string | null;
  onSelect: (iso: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onClose: () => void;
}

export function CalendarPopover({
  anchorRect,
  year,
  month,
  selectedIso,
  onSelect,
  onPrevMonth,
  onNextMonth,
  onClose,
}: CalendarPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const cells = buildCalendarCells(year, month, selectedIso);

  const popoverStyle: React.CSSProperties = {
    top: anchorRect.bottom + 4,
    left: anchorRect.left,
  };

  const content = (
    <S.Popover ref={popoverRef} style={popoverStyle} role="dialog" aria-label="Selecione uma data">
      <S.PopoverHeader>
        <S.NavButton type="button" onClick={onPrevMonth} aria-label="Mês anterior">
          ‹
        </S.NavButton>
        <S.MonthLabel>
          {getMonthName(month)} {year}
        </S.MonthLabel>
        <S.NavButton type="button" onClick={onNextMonth} aria-label="Próximo mês">
          ›
        </S.NavButton>
      </S.PopoverHeader>
      <S.WeekdayRow>
        {WEEKDAYS.map((wd) => (
          <S.WeekdayCell key={wd}>{wd}</S.WeekdayCell>
        ))}
      </S.WeekdayRow>
      <S.DayGrid>
        {cells.map((cell) => (
          <S.DayCell
            key={cell.iso}
            type="button"
            $isCurrentMonth={cell.isCurrentMonth}
            $isToday={cell.isToday && !cell.isSelected}
            $isSelected={cell.isSelected}
            onClick={() => onSelect(cell.iso)}
          >
            {cell.date.getDate()}
          </S.DayCell>
        ))}
      </S.DayGrid>
    </S.Popover>
  );

  return content;
}
