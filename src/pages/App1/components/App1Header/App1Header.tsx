import { Link } from 'react-router-dom';
import { useHoursApp } from '../../../../providers/HoursAppProvider';
import * as S from './App1Header.styles';

export function App1Header() {
  const { valuesHidden, toggleValuesVisibility } = useHoursApp();

  return (
    <S.Header>
      <S.BackLink as={Link} to="/">
        ← Voltar ao portfólio
      </S.BackLink>
      <S.Title>Controle de Horas</S.Title>
      <S.EyeButton
        type="button"
        onClick={toggleValuesVisibility}
        title={valuesHidden ? 'Mostrar valores' : 'Ocultar valores'}
        aria-label={valuesHidden ? 'Mostrar valores' : 'Ocultar valores'}
      >
        {valuesHidden ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </S.EyeButton>
    </S.Header>
  );
}
