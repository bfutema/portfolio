import styled from 'styled-components';

export const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing['2xl']};
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.lg};
  }
`;

export const HeroContent = styled.div`
  max-width: 800px;
  text-align: center;
`;

export const Greeting = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const Name = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  letter-spacing: -0.03em;
  line-height: 1.1;
  display: inline-block;
`;

export const Cursor = styled.span`
  display: inline-block;
  width: 0.08em;
  height: 0.9em;
  background: ${({ theme }) => theme.colors.primary};
  margin-left: 2px;
  vertical-align: -0.05em;
  animation: blink 1s step-end infinite;

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }
`;

export const Tagline = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.6;
  margin: 0 0 ${({ theme }) => theme.spacing['2xl']};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

export const CTAWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

export const CTAButton = styled.a<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.md};
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;

  ${({ $variant = 'primary', theme }) =>
    $variant === 'primary'
      ? `
    background: ${theme.colors.primary};
    color: white;
    border: 2px solid ${theme.colors.primary};

    &:hover {
      background: ${theme.colors.primaryHover};
      border-color: ${theme.colors.primaryHover};
      transform: translateY(-2px);
    }
  `
      : `
    background: transparent;
    color: ${theme.colors.text};
    border: 2px solid ${theme.colors.border};

    &:hover {
      border-color: ${theme.colors.primary};
      color: ${theme.colors.primary};
      transform: translateY(-2px);
    }
  `}
`;

export const GridBackground = styled.div`
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      ${({ theme }) => theme.colors.border}15 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.border}15 1px,
      transparent 1px
    );
  background-size: 60px 60px;
  pointer-events: none;
  opacity: 0.5;
`;
