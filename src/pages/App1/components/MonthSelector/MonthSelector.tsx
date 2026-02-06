import * as S from './MonthSelector.styles';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

interface MonthSelectorProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  onToday?: () => void;
}

export function MonthSelector({ year, month, onPrev, onNext, onToday }: MonthSelectorProps) {
  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  return (
    <S.Wrapper>
      <S.Button onClick={onPrev} type="button" aria-label="Mês anterior">
        ‹
      </S.Button>
      <S.Label>
        {MONTH_NAMES[month]} {year}
      </S.Label>
      <S.Button onClick={onNext} type="button" aria-label="Próximo mês">
        ›
      </S.Button>
      {onToday && (
        <S.TodayButton
          onClick={onToday}
          type="button"
          $active={isCurrentMonth}
          aria-label="Ir para hoje"
        >
          Hoje
        </S.TodayButton>
      )}
    </S.Wrapper>
  );
}
