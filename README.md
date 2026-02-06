# Portfólio - Bruno Futema

Site de portfólio pessoal com animações e apresentação profissional.

## Como rodar

```bash
yarn
yarn dev
```

## Personalização

### Projetos

Edite o arquivo `src/mocks/projects.ts` para adicionar seus projetos reais. Cada projeto segue a interface:

```ts
{
  id: string;
  title: string;
  description: string;
  image?: string;        // URL da imagem (opcional)
  technologies: string[];
  link?: string;         // URL do projeto em produção
  repository?: string;   // URL do repositório
  featured?: boolean;
}
```

### Contato

Edite `src/mocks/personalInfo.ts` para atualizar email, LinkedIn e GitHub.

## Deploy (GitHub Pages)

```bash
./deploy
```

O script detecta automaticamente o nome do repositório e configura o base path. O site ficará em `https://<seu-usuario>.github.io/<nome-do-repo>/`.

## Stack

- React 19 + TypeScript
- Vite
- Styled Components
- Framer Motion (animações)
