'use client';

import React, { useState } from 'react';
import FileExplorer from '@/components/FileExplorer';
import IDEEditor from '@/components/IDEEditor';
import type { FileNode } from '@/components/FileExplorer';
import type { EditorFile } from '@/components/IDEEditor';

// Sample project structure
const SAMPLE_FILE_TREE: FileNode = {
  id: 'root',
  name: 'quantevo',
  type: 'folder',
  children: [
    {
      id: 'folder-app',
      name: 'app',
      type: 'folder',
      children: [
        {
          id: 'file-layout',
          name: 'layout.tsx',
          type: 'file',
          language: 'typescript',
          content: `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuantEvo',
  description: 'Advanced Trading Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
        },
        {
          id: 'file-page',
          name: 'page.tsx',
          type: 'file',
          language: 'typescript',
          content: `import React from 'react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to QuantEvo</h1>
      <p>Advanced AI-Powered Trading Platform</p>
    </main>
  );
}`,
        },
        {
          id: 'folder-api',
          name: 'api',
          type: 'folder',
          children: [
            {
              id: 'file-route1',
              name: 'route.ts',
              type: 'file',
              language: 'typescript',
              content: `import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'ok' });
}`,
            },
          ],
        },
      ],
    },
    {
      id: 'folder-components',
      name: 'components',
      type: 'folder',
      children: [
        {
          id: 'file-header',
          name: 'Header.tsx',
          type: 'file',
          language: 'typescript',
          content: `import React from 'react';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">QuantEvo</h1>
      </nav>
    </header>
  );
}`,
        },
        {
          id: 'file-button',
          name: 'Button.tsx',
          type: 'file',
          language: 'typescript',
          content: `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
    >
      {children}
    </button>
  );
}`,
        },
      ],
    },
    {
      id: 'folder-lib',
      name: 'lib',
      type: 'folder',
      children: [
        {
          id: 'file-utils',
          name: 'utils.ts',
          type: 'file',
          language: 'typescript',
          content: `export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function calculatePercentage(value: number, total: number): number {
  return (value / total) * 100;
}`,
        },
        {
          id: 'file-constants',
          name: 'constants.ts',
          type: 'file',
          language: 'typescript',
          content: `export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PORTFOLIO: '/portfolio',
  SETTINGS: '/settings',
};

export const TRADING_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];`,
        },
      ],
    },
    {
      id: 'file-package',
      name: 'package.json',
      type: 'file',
      language: 'json',
      content: `{
  "name": "quantevo",
  "version": "1.0.0",
  "description": "Advanced AI-Powered Trading Platform",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "lucide-react": "^0.263.1"
  }
}`,
    },
    {
      id: 'file-tsconfig',
      name: 'tsconfig.json',
      type: 'file',
      language: 'json',
      content: `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", ".next", "dist"]
}`,
    },
    {
      id: 'file-readme',
      name: 'README.md',
      type: 'file',
      language: 'markdown',
      content: `# QuantEvo - Advanced Trading Platform

## Overview
QuantEvo is an AI-powered trading platform that leverages machine learning and real-time market data to provide intelligent trading strategies.

## Features
- 🤖 AI-Powered Trading Strategies
- 📊 Real-Time Market Data
- 💼 Portfolio Management
- 🔍 Advanced Analytics
- 🎯 Risk Management Tools

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit \`http://localhost:3000\` in your browser.

## Tech Stack
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

## License
MIT`,
    },
  ],
};

// Sample initial editor files
const INITIAL_EDITOR_FILES = [
  {
    id: 'file-layout',
    name: 'layout.tsx',
    language: 'typescript',
    content: `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuantEvo',
  description: 'Advanced Trading Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}`,
    modified: false,
  },
];

export default function IDEPage() {
  const [openFiles, setOpenFiles] = useState<EditorFile[]>(INITIAL_EDITOR_FILES);
  const [activeFileId, setActiveFileId] = useState(INITIAL_EDITOR_FILES[0].id);

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      // Check if file is already open
      const existingFile = openFiles.find(f => f.id === file.id);
      if (existingFile) {
        setActiveFileId(file.id);
      } else {
        // Add new file to editor
        const newEditorFile: EditorFile = {
          id: file.id,
          name: file.name,
          language: file.language || 'typescript',
          content: file.content || '',
          modified: false,
        };
        setOpenFiles([...openFiles, newEditorFile]);
        setActiveFileId(file.id);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* File Explorer Sidebar */}
      <div className="w-80 border-r border-gray-700 overflow-hidden">
        <FileExplorer
          fileTree={SAMPLE_FILE_TREE}
          onFileSelect={handleFileSelect}
          theme="dark"
        />
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Code Editor</h1>
            <p className="text-sm text-gray-400">
              {openFiles.length} files open
            </p>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          {openFiles.length > 0 ? (
            <IDEEditor initialFiles={openFiles} />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-900">
              <p className="text-gray-500 text-lg">Select a file to start editing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
