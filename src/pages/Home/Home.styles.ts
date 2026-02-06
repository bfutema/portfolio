import styled from 'styled-components';

export const PageWrapper = styled.main`
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;
