import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-right: 40px;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const TriggerButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing.xs};
  top: 50%;
  transform: translateY(-50%);
  padding: ${({ theme }) => theme.spacing.xs};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Popover = styled.div`
  position: fixed;
  z-index: 1000;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 4px 20px ${({ theme }) => theme.colors.text}20;
  padding: ${({ theme }) => theme.spacing.md};
  min-width: 280px;
`;

export const PopoverHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const MonthLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

export const NavButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 18px;
  line-height: 1;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const WeekdayCell = styled.span`
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

export const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

export const DayCell = styled.button<{
  $isCurrentMonth?: boolean;
  $isToday?: boolean;
  $isSelected?: boolean;
}>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  background: transparent;
  color: ${({ theme, $isCurrentMonth }) =>
    $isCurrentMonth ? theme.colors.text : theme.colors.textMuted};

  ${({ theme, $isToday }) =>
    $isToday &&
    `
    font-weight: ${theme.fontWeight.semibold};
    color: ${theme.colors.primary};
  `}

  ${({ theme, $isSelected }) =>
    $isSelected &&
    `
    background: ${theme.colors.primary};
    color: white;
    font-weight: ${theme.fontWeight.semibold};
  `}

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary}20;
  }

  &:disabled {
    cursor: default;
  }
`;
