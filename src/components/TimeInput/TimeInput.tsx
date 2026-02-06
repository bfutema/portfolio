import { useState, useEffect } from 'react';
import * as S from './TimeInput.styles';
import { formatTimeInput, parseTimeInput } from '../../utils/timeFormat';

interface TimeInputProps {
  value: string; // HH:MM
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

export function TimeInput({
  value,
  onChange,
  placeholder = '00:00',
  required,
  id,
}: TimeInputProps) {
  const [displayValue, setDisplayValue] = useState(value || '');

  useEffect(() => {
    setDisplayValue(value || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatTimeInput(raw);
    setDisplayValue(formatted);

    const parsed = parseTimeInput(formatted);
    if (parsed) onChange(parsed);
    else if (formatted === '') onChange('');
  };

  const handleBlur = () => {
    if (value) {
      setDisplayValue(value);
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
      maxLength={5}
      autoComplete="off"
    />
  );
}
