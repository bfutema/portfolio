import { motion } from 'framer-motion';
import * as S from './ProjectCard.styles';
import type { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <S.Card>
        <S.CardImage $image={project.image}>
          {!project.image && '📁'}
        </S.CardImage>
        <S.CardContent>
          <S.CardTitle>{project.title}</S.CardTitle>
          <S.CardDescription>{project.description}</S.CardDescription>
          <S.TechList>
            {project.technologies.map((tech) => (
              <S.TechTag key={tech}>{tech}</S.TechTag>
            ))}
          </S.TechList>
          <S.CardLinks>
            {project.link && (
              <S.CardLink href={project.link} target="_blank" rel="noopener noreferrer">
                Ver projeto →
              </S.CardLink>
            )}
            {project.repository && (
              <S.CardLink href={project.repository} target="_blank" rel="noopener noreferrer">
                Repositório
              </S.CardLink>
            )}
          </S.CardLinks>
        </S.CardContent>
      </S.Card>
    </motion.div>
  );
}
