import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as S from './Header.styles';
import { useTheme } from '../../providers';

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const sections = [
  { id: 'hero', label: 'Início', icon: '🏠' },
  { id: 'about', label: 'Sobre', icon: '👤' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'projects', label: 'Projetos', icon: '📁' },
  { id: 'contact', label: 'Contato', icon: '✉️' },
];

export function Header() {
  const { mode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <S.HeaderWrapper>
        <S.Nav>
          <S.Logo href="#" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
            BF
          </S.Logo>

          <S.DesktopNav>
            <S.NavLinks>
              {sections.map(({ id, label }) => (
                <li key={id}>
                  <S.NavLink
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(id);
                    }}
                  >
                    {label}
                  </S.NavLink>
                </li>
              ))}
            </S.NavLinks>
            <S.ThemeToggle
              onClick={toggleTheme}
              type="button"
              $isDark={mode === 'dark'}
              aria-label={mode === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
            >
              <S.ThemeToggleTrack>
                <S.ThemeToggleThumb $isDark={mode === 'dark'} />
                <S.ThemeToggleIcons>
                  <S.ThemeToggleIcon $active={mode === 'light'} aria-hidden>
                    <SunIcon />
                  </S.ThemeToggleIcon>
                  <S.ThemeToggleIcon $active={mode === 'dark'} aria-hidden>
                    <MoonIcon />
                  </S.ThemeToggleIcon>
                </S.ThemeToggleIcons>
              </S.ThemeToggleTrack>
            </S.ThemeToggle>
          </S.DesktopNav>

          <S.HamburgerButton
            onClick={() => setMenuOpen(true)}
            type="button"
            aria-label="Abrir menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </S.HamburgerButton>
        </S.Nav>
      </S.HeaderWrapper>

      <S.MobileMenuOverlay
        $open={menuOpen}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
      <S.MobileMenu $open={menuOpen} aria-hidden={!menuOpen}>
        <S.MobileMenuHeader>
          <S.MobileMenuTitle>Menu</S.MobileMenuTitle>
          <S.MobileMenuClose
            onClick={() => setMenuOpen(false)}
            type="button"
            aria-label="Fechar menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </S.MobileMenuClose>
        </S.MobileMenuHeader>
        <S.MobileNavLinks>
          {sections.map(({ id, label, icon }, index) => (
            <motion.li
              key={id}
              initial={{ opacity: 0, x: 20 }}
              animate={
                menuOpen
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: 20 }
              }
              transition={{
                duration: 0.3,
                delay: menuOpen ? index * 0.05 : 0,
              }}
            >
              <S.MobileNavLink
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(id);
                }}
              >
                <S.MobileNavLinkIcon>{icon}</S.MobileNavLinkIcon>
                {label}
              </S.MobileNavLink>
            </motion.li>
          ))}
        </S.MobileNavLinks>
        <S.MobileMenuFooter>
          <S.MobileMenuFooterLabel>Aparência</S.MobileMenuFooterLabel>
          <S.ThemeToggleMobile
            onClick={toggleTheme}
            type="button"
            $isDark={mode === 'dark'}
            $fullWidth
            aria-label={mode === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
          >
            <S.ThemeToggleTrack>
              <S.ThemeToggleThumb $isDark={mode === 'dark'} />
              <S.ThemeToggleIcons>
                <S.ThemeToggleIcon $active={mode === 'light'} aria-hidden>
                  <SunIcon />
                </S.ThemeToggleIcon>
                <S.ThemeToggleIcon $active={mode === 'dark'} aria-hidden>
                  <MoonIcon />
                </S.ThemeToggleIcon>
              </S.ThemeToggleIcons>
            </S.ThemeToggleTrack>
            <S.ThemeToggleLabel>
              {mode === 'dark' ? 'Modo claro' : 'Modo escuro'}
            </S.ThemeToggleLabel>
          </S.ThemeToggleMobile>
        </S.MobileMenuFooter>
      </S.MobileMenu>
    </>
  );
}
