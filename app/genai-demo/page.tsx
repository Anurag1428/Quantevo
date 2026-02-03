'use client';

import React from 'react';
import GenAI from '@/components/GenAI';
import { Header } from '@/components/Header';

const GenAIDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Generative AI Assistant</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Powered by advanced AI to generate trading code, strategies, market analysis, and insights
          </p>
        </div>
        <GenAI />
      </div>
    </div>
  );
};

export default GenAIDemoPage;
