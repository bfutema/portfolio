import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as S from './DatePicker.styles';
import { CalendarPopover } from './CalendarPopover';
import { parseIsoDate, toDisplayFormat } from './DatePicker.utils';

export interface DatePickerProps {
  /** Valor no formato YYYY-MM-DD */
  value: string;
  /** Callback com valor YYYY-MM-DD */
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'dd/mm/aaaa',
  required,
  id,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const parsed = parseIsoDate(value);
    return parsed ?? new Date();
  });
  const inputRef = useRef<HTMLDivElement>(null);

  const displayValue = value ? toDisplayFormat(value) : '';

  const openCalendar = useCallback(() => {
    const parsed = parseIsoDate(value);
    setViewDate(parsed ?? new Date());
    setIsOpen(true);
  }, [value]);

  const closeCalendar = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSelect = useCallback(
    (iso: string) => {
      onChange(iso);
      closeCalendar();
    },
    [onChange, closeCalendar]
  );

  const handleInputClick = useCallback(() => {
    openCalendar();
  }, [openCalendar]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCalendar();
      }
    },
    [openCalendar]
  );

  const handlePrevMonth = useCallback(() => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  }, []);

  const anchorRect = inputRef.current?.getBoundingClientRect() ?? new DOMRect(0, 0, 0, 0);

  return (
    <S.Wrapper>
      <S.InputWrapper ref={inputRef}>
        <S.Input
          id={id}
          type="text"
          placeholder={placeholder}
          value={displayValue}
          readOnly
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
          required={required}
          autoComplete="off"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
        />
        <S.TriggerButton
          type="button"
          onClick={handleInputClick}
          aria-label="Abrir calendário"
        >
          <CalendarIcon />
        </S.TriggerButton>
      </S.InputWrapper>
      {isOpen &&
        createPortal(
          <CalendarPopover
            anchorRect={anchorRect}
            year={viewDate.getFullYear()}
            month={viewDate.getMonth()}
            selectedIso={value || null}
            onSelect={handleSelect}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onClose={closeCalendar}
          />,
          document.body
        )}
    </S.Wrapper>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
