import * as S from './Footer.styles';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <S.FooterWrapper>
      <S.Copyright>© {year} Bruno Futema. Desenvolvido com dedicação.</S.Copyright>
    </S.FooterWrapper>
  );
}
