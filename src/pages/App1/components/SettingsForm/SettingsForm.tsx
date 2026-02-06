import * as S from './SettingsForm.styles';

interface SettingsFormProps {
  hourlyRate: number;
  onChange: (rate: number) => void;
}

export function SettingsForm({ hourlyRate, onChange }: SettingsFormProps) {
  return (
    <S.Wrapper>
      <S.Label htmlFor="hourly-rate">Valor por hora (R$)</S.Label>
      <S.Input
        id="hourly-rate"
        type="number"
        min="0"
        step="0.01"
        value={hourlyRate || ''}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        placeholder="0,00"
      />
    </S.Wrapper>
  );
}
