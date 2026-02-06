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

  const isHoras = location.pathname.endsWith('/horas') || location.pathname.endsWith('/app1');
  const isClientes = location.pathname.endsWith('/clientes');

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
          <S.SidebarTitle>Controle de Horas</S.SidebarTitle>
        </S.SidebarHeader>

        <S.NavList>
          <S.NavItem as={Link} to="/app1/horas" $active={isHoras} onClick={handleNavClick}>
            <S.NavIcon>⏱</S.NavIcon>
            Horas
          </S.NavItem>
          <S.NavItem as={Link} to="/app1/clientes" $active={isClientes} onClick={handleNavClick}>
            <S.NavIcon>👥</S.NavIcon>
            Clientes
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

        <S.SidebarFooter>
          <S.BackLink as={Link} to="/" onClick={handleNavClick}>
            <S.NavIcon>←</S.NavIcon>
            Voltar ao portfólio
          </S.BackLink>
        </S.SidebarFooter>
      </S.SidebarWrapper>
    </>
  );
}
