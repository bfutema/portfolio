import styled from 'styled-components';

const MOBILE_BREAKPOINT = '768px';

const HEADER_HEIGHT = '56px';

export const PageWrapper = styled.main`
  --app-header-height: ${HEADER_HEIGHT};
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
`;

const SIDEBAR_WIDTH = '200px';

export const Body = styled.div`
  flex: 1;
  display: flex;
  min-height: 0;
  padding-left: ${SIDEBAR_WIDTH};

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding-left: 0;
  }
`;

export const Content = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: ${({ theme }) => theme.spacing.xl};
    padding-top: 60px;
  }
`;

export const ContentInner = styled.div`
  width: 100%;
`;
