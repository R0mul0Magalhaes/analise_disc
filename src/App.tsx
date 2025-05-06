import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultCard } from './components/ResultCard';
import { ThemeToggle } from './components/ThemeToggle';
import { DownloadResults } from './components/DownloadResults';
import { ThemeProvider } from './context/ThemeContext';
import { analyzeDISC } from './utils/discAnalyzer';
import { ProfileResult } from './types';

function App() {
  const [results, setResults] = useState<ProfileResult[]>([]);

  const handleFileSelect = async (file: File) => {
    try {
      const analysisResults = await analyzeDISC(file);
      setResults(analysisResults);
    } catch (error) {
      console.error('Error analyzing file:', error);
      // You could add proper error handling here
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <img src="https://drive.google.com/file/d/1qKmkInLe7A-ZnOMCbtE1QQGwdD6gtJjy/view usp=sharing" alt="Logo"className="w-12 h-12 object-contain"/>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Análise de Perfil DISC
              </h1>
            </div>
            <ThemeToggle />
          </div>

          <div className="flex flex-col items-center space-y-8">
            <FileUpload onFileSelect={handleFileSelect} />

            {results.length > 0 && (
              <>
                <div className="w-full max-w-6xl">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Resultados da Análise
                  </h2>
                  <div className="grid grid-cols-3 gap-6">
                    {results.map((result, index) => (
                      <ResultCard key={index} result={result} />
                    ))}
                  </div>
                </div>
                <DownloadResults results={results} />
              </>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;