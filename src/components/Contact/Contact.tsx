import { motion } from 'framer-motion';
import * as S from './Contact.styles';
import { personalInfo } from '../../mocks/personalInfo';

const contactLinks = [
  { href: `mailto:${personalInfo.email}`, label: 'Email', icon: '✉️' },
  { href: personalInfo.linkedin, label: 'LinkedIn', icon: '💼' },
  { href: personalInfo.github, label: 'GitHub', icon: '🐙' },
];

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

export function Contact() {
  return (
    <S.Section id="contact">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div variants={itemVariants}>
          <S.SectionTitle>Vamos conversar?</S.SectionTitle>
          <S.SectionSubtitle>
            Estou aberto a novas oportunidades e projetos. Entre em contato para bater um papo sobre
            tecnologia, colaborações ou qualquer ideia que você tenha em mente.
          </S.SectionSubtitle>
        </motion.div>
        <motion.div variants={itemVariants}>
          <S.LinksWrapper>
            {contactLinks.map((link) => (
              <S.ContactLink
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{link.icon}</span>
                {link.label}
              </S.ContactLink>
            ))}
          </S.LinksWrapper>
        </motion.div>
      </motion.div>
    </S.Section>
  );
}
