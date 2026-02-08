import styled from 'styled-components';

const SIDEBAR_WIDTH = '200px';
const MOBILE_BREAKPOINT = '768px';

export const SidebarWrapper = styled.aside<{ $open?: boolean }>`
  width: ${SIDEBAR_WIDTH};
  min-width: ${SIDEBAR_WIDTH};
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.xl};
  position: fixed;
  top: var(--app-header-height, 56px);
  left: 0;
  bottom: 0;
  height: calc(100dvh - var(--app-header-height, 56px));
  overflow-y: auto;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    height: auto;
    overflow-y: auto;
    z-index: 100;
    transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
    transition: transform 0.25s ease;
    box-shadow: 4px 0 24px ${({ theme }) => theme.colors.text}20;
  }
`;

export const SidebarHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const SidebarTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

export const NavItem = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textMuted)};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceElevated};
    color: ${({ theme }) => theme.colors.primary};
  }

  ${({ theme, $active }) =>
    $active &&
    `
    background: ${theme.colors.primary}15;
    color: ${theme.colors.primary};
  `}
`;

export const NavIcon = styled.span`
  font-size: 1rem;
  width: 20px;
  text-align: center;
`;

export const DataActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const DataButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ImportError = styled.p`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.error};
  margin: 0;
`;

export const MenuButton = styled.button`
  display: none;
  position: fixed;
  top: ${({ theme }) => theme.spacing.md};
  left: ${({ theme }) => theme.spacing.md};
  z-index: 101;
  width: 44px;
  height: 44px;
  padding: 0;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Overlay = styled.div<{ $open?: boolean }>`
  display: none;
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.text}40;
  z-index: 99;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity 0.2s ease, visibility 0.2s ease;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: block;
  }
`;
