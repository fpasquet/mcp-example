# 🚀 MCP – Serveur & Outils Model Context Protocol (STDIO + HTTP + Client)

Ce package fournit :

- Un serveur MCP STDIO d'exemple, qui implémente un système de gamification spatial avec des astronautes, des planètes et un système de classement par points.
- Des outils et utilitaires pour créer facilement vos propres serveurs MCP Streamable HTTP
- Un client MCP TypeScript pour communiquer avec tout serveur MCP

> **📝 Note :** Ce projet est créé à titre d'exemple pour illustrer les concepts et l'implémentation d'un serveur MCP dans un article. Il démontre l'utilisation complète des outils, prompts et ressources du protocole MCP.

## 📋 Table des matières

- [Description](#description)
- [Structure du projet](#structure-du-projet)
- [Démarrage](#démarrage)
- [Fonctionnalités](#fonctionnalités)
- [Utilisation](#utilisation)
- [Exemples de prompts](#exemples-de-prompts)
- [Ressources complémentaires](#ressources-complémentaires)

## 📖 Description

Ce projet implémente un serveur MCP qui expose :

- **Tools** : Pour récupérer des informations sur les astronautes et classements
- **Prompts** : Pour générer des rapports hebdomadaires
- **Ressources** : Pour accéder aux règles et profils d'astronautes

Le système de gamification comprend 4 planètes en compétition avec leurs astronautes respectifs, un système de grades basé sur les points, et des mécaniques de collaboration.

### 🎓 Objectif

Ce serveur sert d'exemple pratique pour comprendre :

- L'architecture d'un serveur MCP complet
- L'implémentation des trois fonctionnalités (`tools`, `prompts`, `resources`)
- Les bonnes pratiques de structuration d'un projet MCP
- L'intégration avec des clients MCP comme Claude Desktop

---

## 📁 Structure du projet

```
src/
├── resources/                      # Documents de ressources
│   └── rules.md                    # Règles du système
├── utils
│   └── register-mcp-server-http.ts # Fonction d'enregistrement du serveur MCP avec transport Streamable HTTP
├── constants.ts                    # Constantes du projet
├── db.json                         # Données JSON
├── mcp-client.ts                   # Client MCP
├── mcp-server.ts                   # Serveur MCP principal
├── mcp-server-stdio.ts             # Serveur MCP avec transport STDIO
├── prompts.ts                      # Prompts disponibles
├── resources.ts                    # Ressources disponibles
├── services.ts                     # Services métier
├── tools.ts                        # Outils exposés
└── types.ts                        # Types du projet
```

---

## 🚀 Démarrage

### Installer les dépendances

```bash
pnpm install
```

### Démarrage Server STDIO en mode watch avec MCP Inspector

```bash
pnpm dev
```

La commande `pnpm dev` lance le serveur en mode `watch` et le mode debug de l'inspecteur MCP est disponible à l'adresse `http://localhost:6274`.

**Fonctionnalités de l'inspector :**

- ✅ **Test interactif** de tous les tools
- 📝 **Prévisualisation** des prompts avec paramètres
- 📚 **Navigation** dans les ressources
- 🐛 **Debugging** des réponses en temps réel
- 🔧 **Validation** des schémas JSON

**Exemple de test avec l'inspector :**

1. Testez le tool `get_planet_rankings` (sans paramètres)
2. Testez `search_astronaut` avec `{"astronautName": "Alice"}`
3. Testez `add_points_to_astronaut` avec `{"astronautName": "Alice", "points": 50, "reason": "Mission réussie"}`
4. Générez un prompt `weekly_report` avec `{"weekNumber": "15"}`
5. Explorez la ressource `docs://rules`

> **💡 Workflow recommandé :** Utilisez l'inspector pendant le développement pour valider chaque fonctionnalité avant l'intégration avec un client MCP.

---

## ✨ Fonctionnalités

### 🔧 Outils (Tools)

- **get_planet_rankings** : Affiche le classement des planètes par points
- **search_astronaut** : Recherche d'un astronaute par son nom
- **add_points_to_astronaut** : Ajoute des points à un astronaute et met à jour son grade automatiquement

### 📝 Prompts

- **weekly_report** : Génère un rapport hebdomadaire des performances

### 📚 Ressources

- **rules.md** : Document complet des règles et mécaniques du système planétaire

---

## 💡 Utilisation

### Avec un client MCP compatible comme Claude Desktop

Configurez votre client MCP pour utiliser ce serveur :

```json
{
  "mcpServers": {
    "mcp-server": {
      "command": "node",
      "args": ["path/to/dist/mcp-server-stdio.js"]
    }
  }
}
```

## 🎯 Exemples de prompts

### Utilisation des Tools

#### 1. Obtenir le classement des planètes

```
Peux-tu me montrer le classement actuel des planètes ?
```

_Le tool `get_planet_rankings` sera automatiquement appelé_

#### 2. Informations sur un astronaute spécifique

```
Donne-moi les détails sur l'astronaute Alice
```

```
Quelles sont les performances de Bob ?
```

```
Je veux connaître le grade et la planète de Charlie
```

_Le tool `search_astronaut` sera appelé avec le nom fourni_

#### 3. Attribution de points

```
Ajoute 50 points à Alice pour sa mission réussie
```

```
Donne 100 points à Bob parce qu'il a aidé un collègue
```

```
Récompense Charlie avec 75 points pour son innovation
```

_Le tool `add_points_to_astronaut` sera appelé avec les paramètres fournis_

### Utilisation des Prompts

#### 4. Rapport hebdomadaire

```
Génère-moi le rapport hebdomadaire de cette semaine
```

```
Je veux un rapport de la semaine 15
```

```
Peux-tu créer un rapport hebdomadaire motivant pour l'équipe ?
```

_Le prompt `weekly_report` sera utilisé pour générer un rapport structuré_

### Utilisation des Ressources

#### 5. Consulter les règles

```
Explique-moi les règles du système de gamification
```

```
Comment fonctionne le système de points ?
```

```
Quels sont les différents grades disponibles ?
```

_La ressource `docs://rules` sera consultée_

### Exemples de prompts combinés

#### 6. Gestion complète d'un astronaute

```
Recherche les infos sur Alice, puis ajoute-lui 100 points pour sa performance exceptionnelle cette semaine
```

#### 7. Analyse comparative

```
Compare les performances d'Alice et Eve, puis donne-moi le classement actuel des planètes
```

#### 8. Rapport complet

```
Génère un rapport complet incluant :
- Le classement des planètes
- Les top 3 astronautes
- Les règles de progression des grades
- Un résumé motivant pour l'équipe
```

#### 9. Analyse d'équipe

```
Analyse la planète "Donut Factory" : qui sont ses astronautes, quelles sont leurs performances, et comment se situe cette planète dans le classement général ?
```

#### 10. Recommandations avec action

```
Basé sur les règles du système et le classement actuel, quelles recommandations donnerais-tu aux astronautes de la planète en dernière position ? Si tu penses qu'ils méritent des points d'encouragement, attribue-leur en !
```

#### 11. Simulation et application

```
Si Charlie gagne 100 points supplémentaires, quel sera son nouveau grade et comment cela affectera-t-il le classement de sa planète ? Applique ces points maintenant !
```

---

## 📚 Ressources complémentaires

- [Documentation officielle MCP](https://modelcontextprotocol.io/)
- Article détaillé sur l'implémentation de ce serveur d'exemple
- [SDK MCP TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)
