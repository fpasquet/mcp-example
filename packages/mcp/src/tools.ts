import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import * as services from './services.js';

export const SearchAstronautSchema = z.object({
  astronautName: z.string().describe("Nom de l'astronaute à rechercher"),
});

export const AddPointsToAstronaut = z.object({
  astronautName: z.string().describe("Nom de l'astronaute"),
  points: z.number().describe('Nombre de points à ajouter'),
  reason: z.string().describe("Raison de l'attribution des points").optional(),
});

export const TOOLS = [
  {
    description: 'Affiche le classement actuel des planètes par points',
    inputSchema: zodToJsonSchema(z.object({})),
    name: 'get_planet_rankings',
  },
  {
    description: "Recherche d'un astronaute par son nom",
    inputSchema: zodToJsonSchema(SearchAstronautSchema),
    name: 'search_astronaut',
  },
  {
    name: 'add_points_to_astronaut',
    description: 'Ajoute des points à un astronaute et met à jour son grade',
    inputSchema: zodToJsonSchema(AddPointsToAstronaut),
  },
] as const;

export const getPlanetRankings = () => {
  const planetsWithRanking = services.getPlanetsWithRanking();

  return {
    content: [
      {
        text:
          `🏆 CLASSEMENT DES PLANÈTES - SAISON GALACTIQUE 2025\n\n` +
            planetsWithRanking
            .map(
              (p) =>
                `${p.position}. ${p.name}\n   Points: ${p.points.toLocaleString()} | Astronautes: ${p.astronauts.length}`
            )
            .join('\n\n') +
          `\n\n⭐ ${planetsWithRanking[0]!.name} mène la course !`,
        type: 'text',
      },
    ],
  };
};

export const searchAstronaut = ({ astronautName }: z.infer<typeof SearchAstronautSchema>) => {
  try {
    const astronaut = services.searchAstronaut({ astronautName });

    if (!astronaut) throw new Error(`Astronaut "${astronautName}" not found`);

    return {
      content: [
        {
          text:
            `🚀 PROFIL ASTRONAUTE\n\n` +
            `👤 Nom: ${astronaut.name}\n` +
            `🌟 Grade: ${astronaut.rank.name}\n` +
            `🪐 Planète: ${astronaut.planet.name}\n` +
            `🏆 Points personnels: ${astronaut.points}\n` +
            `💫 Contribution pour ça planète: ${((astronaut.points / astronaut.planet.points) * 100).toFixed(1)}%`,
          type: 'text',
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          text: `❌ ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'text',
        },
      ],
    };
  }
};

export const addPointsToAstronaut = ({ astronautName, points, reason }: z.infer<typeof AddPointsToAstronaut>) => {
  try {
    const astronaut = services.searchAstronaut({ astronautName });

    if (!astronaut) {
      throw new Error(`Astronaut "${astronautName}" not found`);
    }

    const astronautUpdated = services.addRewardToAstronaut({ astronautId: astronaut.id, points, reason });

    const gradeChange =
      astronaut.rank.name !== astronautUpdated.rank.name
        ? `\n🎉 PROMOTION: ${astronaut.rank.name} → ${astronautUpdated.rank.name} !`
        : '';

    return {
      content: [
        {
          type: 'text',
          text:
            `✅ POINTS ATTRIBUÉS\n\n` +
            `👤 Astronaute: ${astronautUpdated.name}\n` +
            `➕ Points ajoutés: +${points}\n` +
            `📝 Raison: ${reason}\n` +
            `🏆 Total personnel: ${astronautUpdated.points} pts\n` +
            gradeChange,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          text: `❌ ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'text',
        },
      ],
    };
  }
};
