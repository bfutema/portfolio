import type { Project } from '../types';

/**
 * Mock de projetos - substitua pelos seus projetos reais.
 * Basta editar o array abaixo ou importar de uma API.
 */
export const projects: Project[] = [
  {
    id: '1',
    title: 'Projeto E-commerce',
    description:
      'Plataforma de e-commerce completa com carrinho, checkout e integração com gateway de pagamento. Arquitetura escalável com microserviços.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    link: 'https://exemplo.com',
    repository: 'https://github.com/bfutema/exemplo',
    featured: true,
  },
  {
    id: '2',
    title: 'Sistema de Gestão',
    description:
      'Sistema interno de gestão empresarial com dashboards, relatórios e controle de estoque. API REST documentada com OpenAPI.',
    technologies: ['TypeScript', 'NestJS', 'Prisma', 'React', 'Tailwind'],
    link: 'https://exemplo.com',
    repository: 'https://github.com/bfutema/exemplo',
    featured: true,
  },
  {
    id: '3',
    title: 'API de Integração',
    description:
      'API robusta para integração entre sistemas com autenticação JWT, rate limiting e documentação interativa.',
    technologies: ['Node.js', 'Express', 'MongoDB', 'Swagger'],
    repository: 'https://github.com/bfutema/exemplo',
    featured: false,
  },
];
