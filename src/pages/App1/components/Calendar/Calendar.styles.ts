import styled from 'styled-components';

const MOBILE_BREAKPOINT = '768px';

export const Wrapper = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  box-shadow: 0 1px 3px ${({ theme }) => theme.colors.text}08;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(64px, 64px);
  min-height: 420px;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    grid-auto-rows: minmax(52px, 52px);
    min-height: 320px;
  }
`;

export const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const WeekdayCell = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  letter-spacing: 0.02em;
`;

export const AddHint = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing.xs};
  opacity: 0;
  transition: opacity 0.2s ease;

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    display: none;
  }
`;

export const DayCell = styled.button<{ $isCurrentMonth?: boolean; $isToday?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 0;
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: left;
  overflow: hidden;
  background: ${({ theme, $isCurrentMonth, $isToday }) =>
    $isToday
      ? theme.colors.primary + '12'
      : $isCurrentMonth
        ? theme.colors.surface
        : theme.colors.surfaceElevated};
  color: ${({ theme, $isCurrentMonth }) =>
    $isCurrentMonth ? theme.colors.text : theme.colors.textMuted};
  border: none;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;

  &:nth-child(7n) {
    border-right: none;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary}0a;
  }

  &:hover:not(:disabled) ${AddHint} {
    opacity: 1;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    padding: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSize.xs};
  }
`;

export const DayNumber = styled.span<{ $isToday?: boolean }>`
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: 0.8rem;
  transition: all 0.2s ease;
  ${({ theme, $isToday }) =>
    $isToday
      ? `
    background: ${theme.colors.primary};
    color: white;
    box-shadow: 0 2px 6px ${theme.colors.primary}40;
  `
      : `
    color: inherit;
  `}

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    width: 22px;
    height: 22px;
    font-size: 0.75rem;
  }
`;

export const DayTasks = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: ${({ theme }) => theme.spacing.sm};
  overflow: hidden;
`;

export const TaskChip = styled.span`
  flex-shrink: 1;
  display: block;
  padding: 3px 8px;
  font-size: 10px;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primary}12;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 0 ${({ theme }) => theme.borderRadius.sm} ${({ theme }) => theme.borderRadius.sm} 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}20;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 9px;
    padding: 2px 6px;
    border-left-width: 2px;
  }
`;

export const RevenueChip = styled.span`
  flex-shrink: 1;
  display: block;
  padding: 3px 8px;
  font-size: 10px;
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.success};
  background: ${({ theme }) => theme.colors.success}20;
  border-left: 3px solid ${({ theme }) => theme.colors.success};
  border-radius: 0 ${({ theme }) => theme.borderRadius.sm} ${({ theme }) => theme.borderRadius.sm} 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.success}35;
  }

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    font-size: 9px;
    padding: 2px 6px;
    border-left-width: 2px;
  }
`;

export const MoreChip = styled.span`
  flex-shrink: 1;
  display: block;
  padding: 2px 6px;
  font-size: 9px;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 100%;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.text}60;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
`;

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 24px 48px ${({ theme }) => theme.colors.text}30;
  width: 100%;
  max-width: 420px;
  max-height: 90dvh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ModalTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

export const ModalTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ModalTab = styled.button<{ $active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  background: transparent;
  border: none;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textMuted)};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ModalClose = styled.button`
  padding: ${({ theme }) => theme.spacing.sm};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceElevated};
    color: ${({ theme }) => theme.colors.text};
  }
`;
