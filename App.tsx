
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { Loader } from './components/Loader';
import { analyzeCropImage } from './services/geminiService';
import type { AnalysisResponse } from './types';
import { LeafIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setAnalysis(null);
    setError(null);
  };

  const handleAnalysis = useCallback(async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeCropImage(imageFile);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze the image. Please try again with a clearer picture.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);
  
  const handleReset = () => {
    setImageFile(null);
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return (
        <div className="text-center p-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleReset}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    if (analysis && imageFile) {
      return (
        <AnalysisResult 
          analysis={analysis} 
          imagePreviewUrl={URL.createObjectURL(imageFile)}
          onReset={handleReset} 
        />
      );
    }
    return (
      <ImageUploader 
        onImageUpload={handleImageUpload} 
        onAnalyze={handleAnalysis}
      />
    );
  };

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
          {renderContent()}
        </div>
        <footer className="text-center py-4 mt-8 text-gray-500 dark:text-gray-400 text-sm">
            <p>Powered by AI for a healthier harvest.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
