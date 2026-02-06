import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as S from './Hero.styles';

const NAME = 'Bruno Futema';
const LETTER_DELAY_MS = 80;
const INITIAL_DELAY_MS = 400;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

const letterVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

export function Hero() {
  const [cursorPosition, setCursorPosition] = useState(-1);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < NAME.length; i++) {
      timers.push(
        setTimeout(() => setCursorPosition(i), INITIAL_DELAY_MS + i * LETTER_DELAY_MS)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <S.HeroSection id="hero">
      <S.GridBackground />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <S.HeroContent>
          <motion.div variants={itemVariants}>
            <S.Greeting>Olá, eu sou</S.Greeting>
          </motion.div>
          <motion.div variants={itemVariants}>
            <S.Name>
              <motion.span
                style={{ display: 'inline-block' }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.4,
                    },
                  },
                }}
                initial="hidden"
                animate="visible"
              >
                {cursorPosition === -1 && <S.Cursor />}
                {NAME.split('').map((char, i) => (
                  <motion.span
                    key={`${char}-${i}`}
                    variants={letterVariants}
                    style={{ display: 'inline-block' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                    {cursorPosition === i && <S.Cursor />}
                  </motion.span>
                ))}
              </motion.span>
            </S.Name>
          </motion.div>
          <motion.div variants={itemVariants}>
            <S.Tagline>
              Desenvolvedor full-stack desde 2018. Especialista em back-end, front-end e banco de
              dados, com sólidos conhecimentos em cloud. Atualmente explorando o potencial das IAs.
            </S.Tagline>
          </motion.div>
          <motion.div variants={itemVariants}>
            <S.CTAWrapper>
              <S.CTAButton
                $variant="primary"
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Ver Projetos
              </S.CTAButton>
              <S.CTAButton
                $variant="secondary"
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Entrar em Contato
              </S.CTAButton>
            </S.CTAWrapper>
          </motion.div>
        </S.HeroContent>
      </motion.div>
    </S.HeroSection>
  );
}
