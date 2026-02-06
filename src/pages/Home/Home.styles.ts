import styled from 'styled-components';

export const PageWrapper = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;
