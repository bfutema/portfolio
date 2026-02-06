import { Link } from 'react-router-dom';
import * as S from './Apps.styles';

export function Apps() {
  return (
    <S.Wrapper>
      <S.Content>
        <S.Title>Apps</S.Title>
        <S.AppList>
          <S.AppItem>
            <S.AppLink as={Link} to="/app1">
              Controle de Horas
            </S.AppLink>
          </S.AppItem>
          <S.AppItem>
            <S.AppItemDisabled>App 2 — Em breve</S.AppItemDisabled>
          </S.AppItem>
          <S.AppItem>
            <S.AppItemDisabled>App 3 — Em breve</S.AppItemDisabled>
          </S.AppItem>
        </S.AppList>
        <S.BackLink as={Link} to="/">
          ← Voltar ao portfólio
        </S.BackLink>
      </S.Content>
    </S.Wrapper>
  );
}
