import { motion } from 'framer-motion';
import * as S from './Skills.styles';

const skills = [
  { icon: '⚙️', name: 'Back-end', description: 'APIs, servidores e lógica de negócio' },
  { icon: '🎨', name: 'Front-end', description: 'Interfaces modernas e responsivas' },
  { icon: '🗄️', name: 'Banco de Dados', description: 'SQL, NoSQL e modelagem' },
  { icon: '☁️', name: 'Cloud', description: 'Infraestrutura e deploy em nuvem' },
  { icon: '🤖', name: 'IA & LLMs', description: 'Integração e uso de inteligência artificial' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export function Skills() {
  return (
    <S.Section id="skills">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div variants={itemVariants}>
          <S.SectionTitle>Skills</S.SectionTitle>
        </motion.div>
        <S.SkillsGrid>
          {skills.map((skill) => (
            <motion.div key={skill.name} variants={itemVariants}>
              <S.SkillCard>
                <S.SkillIcon>{skill.icon}</S.SkillIcon>
                <S.SkillName>{skill.name}</S.SkillName>
                <S.SkillDescription>{skill.description}</S.SkillDescription>
              </S.SkillCard>
            </motion.div>
          ))}
        </S.SkillsGrid>
      </motion.div>
    </S.Section>
  );
}
