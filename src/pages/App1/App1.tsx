import { Outlet } from 'react-router-dom';
import { HoursAppProvider } from '../../providers/HoursAppProvider';
import { App1Header } from './components/App1Header';
import { Sidebar } from './components/Sidebar';
import * as S from './App1.styles';

function App1Layout() {
  return (
    <S.PageWrapper>
      <App1Header />
      <S.Body>
        <Sidebar />
        <S.Content>
          <S.ContentInner>
            <Outlet />
          </S.ContentInner>
        </S.Content>
      </S.Body>
    </S.PageWrapper>
  );
}

export function App1() {
  return (
    <HoursAppProvider>
      <App1Layout />
    </HoursAppProvider>
  );
}
