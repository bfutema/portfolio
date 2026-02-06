import { motion } from 'framer-motion';
import * as S from './About.styles';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

const currentYear = new Date().getFullYear();
const yearsOfExperience = currentYear - 2018;

export function About() {
  return (
    <S.Section id="about">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div variants={itemVariants}>
          <S.SectionTitle>Sobre mim</S.SectionTitle>
        </motion.div>
        <S.Content>
          <S.TextBlock>
            <motion.p variants={itemVariants}>
              Meu nome é Bruno Amaral Futema, mas me apresento como Bruno Futema. Sou desenvolvedor
              desde 2018 e ao longo dos anos construí uma base sólida em diversas áreas da
              tecnologia.
            </motion.p>
            <motion.p variants={itemVariants}>
              Tenho forte atuação em <strong>back-end</strong>, <strong>front-end</strong> e{' '}
              <strong>banco de dados</strong>, além de bons conhecimentos em <strong>cloud</strong>.
              Atualmente estou me atualizando em conhecimentos do uso de <strong>IAs</strong> e
              integrando essas tecnologias nos meus projetos.
            </motion.p>
            <motion.p variants={itemVariants}>
              Busco sempre entregar soluções robustas, escaláveis e com código limpo. Acredito em
              aprendizado contínuo e em acompanhar as evoluções do mercado de tecnologia.
            </motion.p>
          </S.TextBlock>
          <motion.div variants={itemVariants}>
            <S.StatsGrid>
              <S.StatCard>
                <S.StatNumber>+{yearsOfExperience}</S.StatNumber>
                <S.StatLabel>Anos de experiência</S.StatLabel>
              </S.StatCard>
              <S.StatCard>
                <S.StatNumber>Full</S.StatNumber>
                <S.StatLabel>Stack Developer</S.StatLabel>
              </S.StatCard>
            </S.StatsGrid>
          </motion.div>
        </S.Content>
      </motion.div>
    </S.Section>
  );
}
