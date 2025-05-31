# Monorepo MCP Example

Bienvenue dans le monorepo **MCP Example** : une démonstration moderne autour du protocole Model Context Protocol (MCP) et de la gamification spatiale.

## 🚀 Présentation

Ce projet regroupe :

- Un package central [`mcp`](./packages/mcp) qui contient :
  - Un serveur MCP STDIO prêt à l’emploi pour la gamification spatiale
  - Des outils pour créer facilement vos propres serveurs MCP HTTP
  - Un client MCP TypeScript
- Une application exemple [`mcp-server-http`](./apps/mcp-server-http) montrant comment déployer un serveur MCP HTTP utilisant ce package
- Des configurations partagées pour TypeScript, ESLint et Prettier

> **Ce monorepo s’appuie sur [Turborepo](https://turborepo.com/) et PNPM pour la gestion moderne de monorepo TypeScript.**

---

## 🗂 Structure du monorepo

```
.
├── apps/
│   └── mcp-server-http/      # Exemple d'application serveur MCP HTTP
├── packages/
│   ├── mcp/                 # Serveur MCP STDIO, outils de création de serveur MCP HTTP, client MCP
│   ├── eslint-config/       # Configurations ESLint partagées
│   ├── prettier-config/     # Configuration Prettier commune
│   └── typescript-config/   # Configurations TypeScript partagées
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

- **apps/** : applications prêtes à l’emploi (ici, le serveur MCP HTTP d’exemple)
- **packages/** : packages réutilisables (serveur MCP, clients, configs…)

---

## 📦 Packages et applications principaux

### Applications

- [`apps/mcp-server-http`](./apps/mcp-server-http)  
  Exemple d’application serveur MCP accessible via HTTP, basée sur le package `mcp`.

### Packages

- [`packages/mcp`](./packages/mcp)  
  **Le cœur du projet. Il propose :**

  - Un serveur MCP STDIO prêt à l’emploi (gamification spatiale)
  - Des utilitaires pour créer vos propres serveurs MCP HTTP
  - Un client MCP TypeScript réutilisable
  - [Voir la documentation détaillée](./packages/mcp/README.md)

- [`packages/eslint-config`](./packages/eslint-config)  
  Configurations ESLint partagées pour garantir la qualité du code dans tous les packages.

- [`packages/prettier-config`](./packages/prettier-config)  
  Configuration Prettier commune pour un formatage homogène.

- [`packages/typescript-config`](./packages/typescript-config)  
  Bases de configurations TypeScript partagées.

---

## 🚀 Prise en main rapide

### Installer les dépendances

```bash
pnpm install
```

### Développement (toutes apps/packages)

```bash
pnpm dev
```

### Build global

```bash
pnpm build
```

### Lint & format

```bash
pnpm lint
pnpm format
```

---

## 📚 Documentation spécifique

- [Serveur MCP (README détaillé)](./packages/mcp/README.md)
- [Turborepo documentation](https://turborepo.com/docs)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)

---

## 💡 À propos

Ce monorepo sert de démonstrateur, mais peut être utilisé comme base pour vos propres projets MCP ou tout monorepo TypeScript moderne.

Pour toute question, suggestion ou PR, n’hésitez pas à contribuer !
