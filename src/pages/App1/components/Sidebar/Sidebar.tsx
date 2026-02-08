import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useHoursApp } from '../../../../providers/HoursAppProvider';
import { importFromRaw, isEncryptedExport } from '../../../../utils/hoursStorage';
import * as S from './Sidebar.styles';

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { exportData, applyImport } = useHoursApp();

  const isHome = location.pathname.endsWith('/home') || location.pathname.endsWith('/backoffice');
  const isHoras = location.pathname.endsWith('/horas');
  const isClientes = location.pathname.endsWith('/clientes');
  const isContasAPagar = location.pathname.endsWith('/contas-a-pagar');
  const isLembretesRecorrentes = location.pathname.endsWith('/lembretes-recorrentes');
  const isReceitasAvulsas = location.pathname.endsWith('/receitas-avulsas');
  const isDespesasAvulsas = location.pathname.endsWith('/despesas-avulsas');

  const handleNavClick = () => {
    setOpen(false);
    onNavigate?.();
  };

  const handleExport = async () => {
    const password = window.prompt('Defina uma senha para o backup (obrigatória):');
    if (password === null) return;
    if (!password.trim()) {
      alert('A senha não pode estar vazia.');
      return;
    }
    try {
      await exportData(password);
      setOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao exportar');
    }
  };

  const handleImportClick = () => {
    setImportError(null);
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const raw = await file.text();
      const needsPassword = isEncryptedExport(raw);
      let password: string | undefined;
      if (needsPassword) {
        const p = window.prompt('Digite a senha do backup:');
        if (p === null) return;
        password = p;
      }
      const result = await importFromRaw(raw, password);
      applyImport(result);
      setOpen(false);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Erro ao importar');
    }
    e.target.value = '';
  };

  return (
    <>
      <S.MenuButton
        onClick={() => setOpen(true)}
        type="button"
        aria-label="Abrir menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </S.MenuButton>

      <S.Overlay $open={open} onClick={() => setOpen(false)} aria-hidden={!open} />

      <S.SidebarWrapper $open={open}>
        <S.SidebarHeader>
          <S.SidebarTitle>Backoffice</S.SidebarTitle>
        </S.SidebarHeader>

        <S.NavList>
          <S.NavItem as={Link} to="/backoffice/home" $active={isHome} onClick={handleNavClick}>
            <S.NavIcon>🏠</S.NavIcon>
            Home
          </S.NavItem>
          <S.NavItem as={Link} to="/backoffice/horas" $active={isHoras} onClick={handleNavClick}>
            <S.NavIcon>⏱</S.NavIcon>
            Horas
          </S.NavItem>
          <S.NavItem as={Link} to="/backoffice/clientes" $active={isClientes} onClick={handleNavClick}>
            <S.NavIcon>👥</S.NavIcon>
            Clientes
          </S.NavItem>
          <S.NavItem as={Link} to="/backoffice/contas-a-pagar" $active={isContasAPagar} onClick={handleNavClick}>
            <S.NavIcon>📋</S.NavIcon>
            Contas a pagar
          </S.NavItem>
          <S.NavItem as={Link} to="/backoffice/lembretes-recorrentes" $active={isLembretesRecorrentes} onClick={handleNavClick}>
            <S.NavIcon>🔄</S.NavIcon>
            Lembretes
          </S.NavItem>
          <S.NavItem as={Link} to="/backoffice/receitas-avulsas" $active={isReceitasAvulsas} onClick={handleNavClick}>
            <S.NavIcon>💰</S.NavIcon>
            Receitas
          </S.NavItem>
          <S.NavItem as={Link} to="/backoffice/despesas-avulsas" $active={isDespesasAvulsas} onClick={handleNavClick}>
            <S.NavIcon>💳</S.NavIcon>
            Despesas
          </S.NavItem>
        </S.NavList>

        <S.DataActions>
          <S.DataButton type="button" onClick={handleExport}>
            <S.NavIcon>📤</S.NavIcon>
            Exportar backup
          </S.DataButton>
          <S.DataButton type="button" onClick={handleImportClick}>
            <S.NavIcon>📥</S.NavIcon>
            Importar backup
          </S.DataButton>
          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {importError && <S.ImportError>{importError}</S.ImportError>}
        </S.DataActions>
      </S.SidebarWrapper>
    </>
  );
}
