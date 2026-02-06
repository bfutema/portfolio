import { useState, useEffect } from 'react';
import * as S from './DateInput.styles';
import { toDisplayFormat, toIsoFormat, formatDateInput } from '../../utils/dateFormat';

interface DateInputProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

export function DateInput({
  value,
  onChange,
  placeholder = 'dd/mm/aaaa',
  required,
  id,
}: DateInputProps) {
  const [displayValue, setDisplayValue] = useState(() => toDisplayFormat(value));

  useEffect(() => {
    setDisplayValue(toDisplayFormat(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatDateInput(raw);
    setDisplayValue(formatted);

    if (formatted === '') {
      onChange('');
    } else {
      const iso = toIsoFormat(formatted);
      if (iso) onChange(iso);
    }
  };

  const handleBlur = () => {
    if (value) {
      setDisplayValue(toDisplayFormat(value));
    } else {
      setDisplayValue('');
    }
  };

  return (
    <S.Input
      id={id}
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      required={required}
      maxLength={10}
      autoComplete="off"
    />
  );
}
