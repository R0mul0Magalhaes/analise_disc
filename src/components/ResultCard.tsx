import React from 'react';
import { ProfileResult } from '../types';
import { User } from 'lucide-react';
import { DISC_DESCRIPTIONS } from '../utils/discAnalyzer';

interface ResultCardProps {
  result: ProfileResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const description = DISC_DESCRIPTIONS[result.dominantType];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white break-words">
          {result.name || 'Nome não informado'}
        </h3>
      </div>
      <div className="mb-4">
        <h4 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
          Perfil {description.title}
        </h4>
        <div className="flex justify-between mb-2">
          {Object.entries(result.profile).map(([type, value]) => (
            <div key={type} className="text-center">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{type}</div>
              <div className="text-lg font-bold text-gray-800 dark:text-white">{value}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {description.characteristics.map((char, index) => (
          <p key={index} className="text-sm text-gray-600 dark:text-gray-300">
            • {char}
          </p>
        ))}
      </div>
    </div>
  );
};