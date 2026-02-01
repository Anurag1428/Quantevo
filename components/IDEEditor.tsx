'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Plus, Settings, Search, Copy, Download } from 'lucide-react';

interface EditorFile {
  id: string;
  name: string;
  language: string;
  content: string;
  modified: boolean;
}

interface EditorState {
  files: EditorFile[];
  activeFileId: string;
  theme: 'dark' | 'light';
  fontSize: number;
  showMinimap: boolean;
  lineNumbers: boolean;
}

const LANGUAGE_EXTENSIONS: Record<string, string> = {
  'typescript': 'ts',
  'javascript': 'js',
  'python': 'py',
  'jsx': 'jsx',
  'tsx': 'tsx',
  'css': 'css',
  'html': 'html',
  'json': 'json',
  'sql': 'sql',
  'bash': 'sh',
};

const SYNTAX_COLORS: Record<string, Record<string, string>> = {
  dark: {
    keyword: '#569CD6',
    string: '#CE9178',
    function: '#DCDCAA',
    comment: '#6A9955',
    number: '#B5CEA8',
    operator: '#D4D4D4',
    bracket: '#D4D4D4',
    background: '#1E1E1E',
    foreground: '#D4D4D4',
    lineNumber: '#858585',
    lineNumberBackground: '#1E1E1E',
    selectionBackground: '#264F78',
  },
  light: {
    keyword: '#0000FF',
    string: '#A31515',
    function: '#795E26',
    comment: '#008000',
    number: '#098658',
    operator: '#000000',
    bracket: '#000000',
    background: '#FFFFFF',
    foreground: '#000000',
    lineNumber: '#999999',
    lineNumberBackground: '#F3F3F3',
    selectionBackground: '#ADD6FF',
  },
};

const KEYWORDS = [
  'function', 'const', 'let', 'var', 'return', 'if', 'else', 'for', 'while',
  'class', 'interface', 'import', 'export', 'async', 'await', 'try', 'catch',
  'throw', 'new', 'this', 'super', 'extends', 'implements', 'public', 'private',
];

const IDEEditor: React.FC<{
  initialFiles?: EditorFile[];
  onSave?: (files: EditorFile[]) => void;
}> = ({ initialFiles = [], onSave }) => {
  const [editorState, setEditorState] = useState<EditorState>({
    files: initialFiles.length > 0 ? initialFiles : [
      {
        id: '1',
        name: 'example.tsx',
        language: 'typescript',
        content: `import React from 'react';\n\nexport default function App() {\n  return (\n    <div className="p-8">\n      <h1>IDE Editor</h1>\n    </div>\n  );\n}`,
        modified: false,
      },
    ],
    activeFileId: initialFiles.length > 0 ? initialFiles[0].id : '1',
    theme: 'dark',
    fontSize: 14,
    showMinimap: true,
    lineNumbers: true,
  });

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchIndex, setSearchIndex] = useState(0);

  const activeFile = editorState.files.find(f => f.id === editorState.activeFileId);
  const colors = SYNTAX_COLORS[editorState.theme];

  const highlightCode = (code: string, language: string): React.ReactNode => {
    const lines = code.split('\n');
    return lines.map((line, lineIndex) => (
      <div key={lineIndex} className="flex">
        {editorState.lineNumbers && (
          <div
            className="select-none px-4 py-0 text-right min-w-12"
            style={{
              backgroundColor: colors.lineNumberBackground,
              color: colors.lineNumber,
              fontSize: `${editorState.fontSize}px`,
              lineHeight: '1.5',
            }}
          >
            {lineIndex + 1}
          </div>
        )}
        <div
          className="flex-1 px-4 py-0 whitespace-pre-wrap break-words"
          style={{
            fontSize: `${editorState.fontSize}px`,
            lineHeight: '1.5',
            color: colors.foreground,
          }}
        >
          {highlightLine(line, language)}
        </div>
      </div>
    ));
  };

  const highlightLine = (line: string, language: string): React.ReactNode => {
    const tokens: React.ReactNode[] = [];
    let currentPos = 0;

    const regex = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\/\/.*|\/\*[\s\S]*?\*\/|\b\w+\b|[{}()\[\];,.]|[+\-*/%=<>!&|^])/g;
    let match;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > currentPos) {
        tokens.push(
          <span key={`text-${currentPos}`} style={{ color: colors.foreground }}>
            {line.substring(currentPos, match.index)}
          </span>
        );
      }

      const token = match[0];
      let color = colors.foreground;

      if (token.startsWith('"') || token.startsWith("'")) {
        color = colors.string;
      } else if (token.startsWith('//') || token.startsWith('/*')) {
        color = colors.comment;
      } else if (KEYWORDS.includes(token)) {
        color = colors.keyword;
      } else if (/^\d+$/.test(token)) {
        color = colors.number;
      } else if (/[{}()\[\];,.]/.test(token)) {
        color = colors.bracket;
      } else if (/[+\-*/%=<>!&|^]/.test(token)) {
        color = colors.operator;
      } else if (/^[a-zA-Z_]\w*\(/.test(line.substring(match.index))) {
        color = colors.function;
      }

      tokens.push(
        <span key={`token-${match.index}`} style={{ color }}>
          {token}
        </span>
      );

      currentPos = regex.lastIndex;
    }

    if (currentPos < line.length) {
      tokens.push(
        <span key={`text-end-${currentPos}`} style={{ color: colors.foreground }}>
          {line.substring(currentPos)}
        </span>
      );
    }

    return tokens.length > 0 ? tokens : line || ' ';
  };

  const updateFileContent = (fileId: string, content: string) => {
    setEditorState(prev => ({
      ...prev,
      files: prev.files.map(f =>
        f.id === fileId ? { ...f, content, modified: true } : f
      ),
    }));
  };

  const addNewFile = () => {
    const newId = Date.now().toString();
    const newFile: EditorFile = {
      id: newId,
      name: 'untitled.tsx',
      language: 'typescript',
      content: '',
      modified: false,
    };
    setEditorState(prev => ({
      ...prev,
      files: [...prev.files, newFile],
      activeFileId: newId,
    }));
  };

  const closeFile = (fileId: string) => {
    setEditorState(prev => {
      const newFiles = prev.files.filter(f => f.id !== fileId);
      return {
        ...prev,
        files: newFiles,
        activeFileId: newFiles.length > 0 ? newFiles[0].id : '',
      };
    });
  };

  const copyContent = () => {
    if (activeFile) {
      navigator.clipboard.writeText(activeFile.content);
    }
  };

  const downloadFile = () => {
    if (!activeFile) return;
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(activeFile.content)}`);
    element.setAttribute('download', activeFile.name);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const saveFiles = () => {
    if (onSave) {
      onSave(editorState.files);
    }
    setEditorState(prev => ({
      ...prev,
      files: prev.files.map(f => ({ ...f, modified: false })),
    }));
  };

  return (
    <div
      className="flex flex-col h-screen rounded-lg overflow-hidden border"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header/Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: colors.lineNumberBackground }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: colors.foreground }} className="font-semibold">
            IDE Editor
          </span>
          <span style={{ color: colors.comment }} className="text-sm">
            {editorState.files.length} files
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditorState(prev => ({
              ...prev,
              theme: prev.theme === 'dark' ? 'light' : 'dark',
            }))}
            className="p-2 hover:opacity-70 transition"
            title="Toggle theme"
          >
            <Settings size={18} style={{ color: colors.foreground }} />
          </button>
          <button
            onClick={copyContent}
            className="p-2 hover:opacity-70 transition"
            title="Copy content"
          >
            <Copy size={18} style={{ color: colors.foreground }} />
          </button>
          <button
            onClick={downloadFile}
            className="p-2 hover:opacity-70 transition"
            title="Download file"
          >
            <Download size={18} style={{ color: colors.foreground }} />
          </button>
          <button
            onClick={saveFiles}
            className="px-3 py-1 rounded text-sm"
            style={{
              backgroundColor: colors.keyword,
              color: colors.background,
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div
        className="flex items-center overflow-x-auto border-b"
        style={{ borderColor: colors.lineNumberBackground, backgroundColor: colors.lineNumberBackground }}
      >
        {editorState.files.map(file => (
          <div
            key={file.id}
            onClick={() => setEditorState(prev => ({ ...prev, activeFileId: file.id }))}
            className="flex items-center gap-2 px-4 py-2 border-r cursor-pointer hover:opacity-80 transition relative"
            style={{
              borderColor: colors.lineNumberBackground,
              backgroundColor: file.id === editorState.activeFileId ? colors.background : colors.lineNumberBackground,
              borderBottom: file.id === editorState.activeFileId ? `2px solid ${colors.keyword}` : 'none',
            }}
          >
            <span style={{ color: colors.foreground }} className="text-sm">
              {file.name}
            </span>
            {file.modified && (
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeFile(file.id);
              }}
              className="hover:opacity-70"
            >
              <X size={14} style={{ color: colors.foreground }} />
            </button>
          </div>
        ))}
        <button
          onClick={addNewFile}
          className="px-3 py-2 hover:opacity-70 transition"
          title="New file"
        >
          <Plus size={18} style={{ color: colors.foreground }} />
        </button>
      </div>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 relative overflow-hidden">
          {/* Syntax Highlighted Display */}
          <div
            className="absolute inset-0 overflow-auto font-mono"
            style={{
              backgroundColor: colors.background,
              color: colors.foreground,
            }}
          >
            {activeFile && (
              <div className="p-0">
                {highlightCode(activeFile.content, activeFile.language)}
              </div>
            )}
          </div>

          {/* Transparent Textarea for Input */}
          {activeFile && (
            <textarea
              ref={editorRef}
              value={activeFile.content}
              onChange={(e) => updateFileContent(activeFile.id, e.target.value)}
              className="absolute inset-0 w-full h-full font-mono resize-none"
              style={{
                backgroundColor: 'transparent',
                color: 'transparent',
                caretColor: colors.keyword,
                fontSize: `${editorState.fontSize}px`,
                lineHeight: '1.5',
                padding: editorState.lineNumbers ? '0 4px 0 0' : '0 4px',
                outline: 'none',
                border: 'none',
                zIndex: 10,
              }}
              spellCheck="false"
            />
          )}
        </div>

        {/* Minimap */}
        {editorState.showMinimap && activeFile && (
          <div
            className="w-12 border-l overflow-hidden"
            style={{
              borderColor: colors.lineNumberBackground,
              backgroundColor: colors.lineNumberBackground,
            }}
          >
            <div className="text-xs" style={{ color: colors.comment }}>
              {activeFile.content.split('\n').map((line, i) => (
                <div key={i} className="whitespace-nowrap overflow-hidden opacity-50">
                  {line.substring(0, 20)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div
        className="flex items-center justify-between px-4 py-2 text-sm border-t"
        style={{
          borderColor: colors.lineNumberBackground,
          backgroundColor: colors.lineNumberBackground,
          color: colors.foreground,
        }}
      >
        <div>
          {activeFile && (
            <>
              Ln {activeFile.content.split('\n').length}, Col{' '}
              {(activeFile.content.split('\n').pop()?.length || 0) + 1}
            </>
          )}
        </div>
        <div className="flex gap-4">
          {activeFile && (
            <>
              <span>{LANGUAGE_EXTENSIONS[activeFile.language] || activeFile.language}</span>
              <span>{editorState.theme === 'dark' ? '🌙 Dark' : '☀️ Light'}</span>
              <span>{editorState.fontSize}px</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IDEEditor;
