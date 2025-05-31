import type { ZodObject, ZodRawShape } from 'zod';

import { z } from 'zod';

import { getAstronauts, getPlanets } from './services.js';

interface PromptArgument {
  description?: string;
  name: string;
  required: boolean;
}

function zodToPromptArguments<T extends ZodRawShape>(schema: ZodObject<T>): PromptArgument[] {
  const shape = schema.shape;

  return Object.entries(shape).map(([key, value]) => {
    const typedValue = value;

    return {
      description: typedValue.description,
      name: key,
      required: !typedValue.isOptional(),
    };
  });
}

export const GetWeeklyReportSchema = z.object({
  weekNumber: z
    .string()
    .describe('Numéro de la semaine (optionnel)')
    .optional()
    .default(Math.ceil((new Date().getDate() + new Date().getDay()) / 7).toString())
    .transform((currentValue) => currentValue.padStart(2, '0')),
});

export const PROMPTS = [
  {
    name: 'weekly_report',
    arguments: zodToPromptArguments(GetWeeklyReportSchema),
    description: 'Génère un rapport de performance des planètes',
  },
] as const;

export const weeklyReport = (weekNumber: string) => {
  const rankings = getPlanets().sort((a, b) => b.points - a.points);
  const topAstronauts = getAstronauts()
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  return {
    description: `Rapport hebdomadaire de la semaine ${weekNumber}`,
    messages: [
      {
        content: {
          text: `Génère un rapport hebdomadaire professionnel et engageant pour la semaine ${weekNumber} de notre système planétaire.

Données actuelles:
- Classement des planètes: ${rankings.map((p) => `${p.name} (${p.points} pts)`).join(', ')}
- Top 3 astronautes: ${topAstronauts.map((a) => `${a.name} (${a.points} pts)`).join(', ')}

Structure attendue:
1. 🏆 Titre accrocheur
2. 📊 Classement des planètes avec évolution
3. 🌟 Mise en avant des performances individuelles

Écrit d'un ton motivant et professionnel, avec des emojis appropriés.`,
          type: 'text',
        },
        role: 'user',
      },
    ],
  };
};
