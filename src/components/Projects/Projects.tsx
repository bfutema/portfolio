import { motion } from 'framer-motion';
import * as S from './Projects.styles';
import { ProjectCard } from '../ProjectCard';
import { projects } from '../../mocks/projects';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
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

export function Projects() {
  return (
    <S.Section id="projects">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.div variants={itemVariants}>
          <S.SectionTitle>Projetos</S.SectionTitle>
          <S.SectionSubtitle>
            Alguns dos projetos em que trabalhei. Em breve, mais projetos reais serão adicionados.
          </S.SectionSubtitle>
        </motion.div>
        <S.ProjectsGrid>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </S.ProjectsGrid>
      </motion.div>
    </S.Section>
  );
}
