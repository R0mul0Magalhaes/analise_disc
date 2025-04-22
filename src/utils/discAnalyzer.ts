import { read, utils } from 'xlsx';
import { DISCProfile, ProfileResult, DISCDescription } from '../types';

export const DISC_DESCRIPTIONS: Record<string, DISCDescription> = {
  D: {
    title: 'Dominante',
    characteristics: [
      'Assertivo e direto',
      'Focado em resultados',
      'Gosta de desafios',
      'Toma decisões rápidas',
      'Assume riscos calculados'
    ]
  },
  I: {
    title: 'Influente',
    characteristics: [
      'Comunicativo e expressivo',
      'Carismático e entusiasta',
      'Gosta de interação social',
      'Otimista e persuasivo',
      'Motivador natural'
    ]
  },
  S: {
    title: 'Estável',
    characteristics: [
      'Calmo e paciente',
      'Leal e confiável',
      'Prefere estabilidade',
      'Bom ouvinte',
      'Trabalha bem em equipe'
    ]
  },
  C: {
    title: 'Conformista',
    characteristics: [
      'Detalhista e preciso',
      'Analítico e sistemático',
      'Segue regras e procedimentos',
      'Busca qualidade e precisão',
      'Organizado e estruturado'
    ]
  }
};

const QUESTION_COLUMNS = [
  '1- Ao enfrentar desafios, você tende a:',
  '2. Como você prefere se comunicar em um ambiente de trabalho:',
  '3.  Ao lidar com mudanças inesperadas, você geralmente:',
  '4. Como você costuma tomar decisões importantes:',
  '5. Quando trabalhando em equipe, como você costuma contribuir:',
  '6. Em situações de conflito, qual é a sua abordagem preferida:',
  '7. Como você lida com tarefas detalhadas e rotineiras:',
  '8. Ao enfrentar situações de estresse, qual é a sua reação típica:',
  '9.  Quando se trata de influenciar os outros, você prefere:',
  '10. Como você lida com a autoridade e as regras estabelecidas:',
  '11.  Ao enfrentar situações de risco, qual é a sua abordagem típica:',
  '12.  Como você lida com a pressão do tempo e prazos apertados:',
  '13.  Em situações de aprendizado e desenvolvimento, você prefere:',
  '14. Como você lida com a mudança e a inovação:',
  '15. Ao lidar com situações de crise, qual é a sua abordagem típica:'
];

const NAME_COLUMNS = [
  'Nome Completo',
  'nome completo',
  'NOME COMPLETO',
  'nomecompleto',
  'Nome completo:',
  'Nome completo',
  'Nome',
  'NOME',
  'name',
  'NAME'
];

const DISC_MAPPING = {
  'A': 'D',
  'B': 'I',
  'C': 'S',
  'D': 'C'
} as const;

const DISC_PRIORITY = {
  D: 4,
  I: 3,
  S: 2,
  C: 1
} as const;

const extractAnswer = (value: unknown): keyof DISCProfile | null => {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^[A-Da-d]/);
  if (!match) return null;
  return DISC_MAPPING[match[0].toUpperCase() as keyof typeof DISC_MAPPING] as keyof DISCProfile;
};

const findNameColumn = (headers: string[]): string | null => {
  return headers.find(header => 
    NAME_COLUMNS.some(nameCol => header.toLowerCase().includes(nameCol.toLowerCase()))
  ) || null;
};

const calculateDominantType = (profile: DISCProfile): keyof DISCProfile => {
  const maxCount = Math.max(...Object.values(profile));
  const dominantTypes = Object.entries(profile)
    .filter(([_, count]) => count === maxCount)
    .map(([type]) => type as keyof DISCProfile);

  return dominantTypes.reduce((prev, current) => 
    DISC_PRIORITY[current] > DISC_PRIORITY[prev] ? current : prev
  );
};

export const analyzeDISC = async (file: File): Promise<ProfileResult[]> => {
  const workbook = read(await file.arrayBuffer());
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = utils.sheet_to_json(worksheet, { raw: false });

  if (!jsonData.length) {
    throw new Error('Arquivo vazio ou sem dados válidos');
  }

  const firstRow = jsonData[0] as Record<string, any>;
  const nameField = Object.keys(firstRow).find(key => findNameColumn([key]));

  if (!nameField) {
    throw new Error('Coluna de nome não encontrada');
  }

  return jsonData
    .map((row: Record<string, any>) => {
      const profile: DISCProfile = { D: 0, I: 0, S: 0, C: 0 };
      const name = row[nameField]?.toString().trim() || 'Nome não informado';

      QUESTION_COLUMNS.forEach(column => {
        const answer = extractAnswer(row[column]);
        if (answer) profile[answer]++;
      });

      return {
        name,
        dominantType: calculateDominantType(profile),
        profile
      };
    })
    .filter(result => 
      result.name !== 'Nome não informado' && 
      Object.values(result.profile).some(count => count > 0)
    );
};