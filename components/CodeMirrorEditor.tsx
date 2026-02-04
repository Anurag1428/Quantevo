'use client';

import React, { useEffect, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { Copy, Download, Settings } from 'lucide-react';

interface CodeMirrorEditorProps {
  initialCode?: string;
  language?: 'javascript' | 'typescript' | 'python' | 'html' | 'css' | 'json';
  theme?: 'dark' | 'light';
  fontSize?: number;
  onCodeChange?: (code: string) => void;
}

const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({
  initialCode = '',
  language = 'javascript',
  theme = 'dark',
  fontSize = 14,
  onCodeChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [code, setCode] = useState(initialCode);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);

  // Language configuration
  const getLanguageSupport = () => {
    switch (language) {
      case 'python':
        return python();
      case 'html':
        return html();
      case 'css':
        return css();
      case 'json':
        return json();
      case 'javascript':
      case 'typescript':
      default:
        return javascript({ typescript: language === 'typescript' });
    }
  };

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        getLanguageSupport(),
        currentTheme === 'dark' ? oneDark : [],
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newCode = update.state.doc.toString();
            setCode(newCode);
            onCodeChange?.(newCode);
          }
        }),
        EditorView.lineNumbers(),
        EditorView.theme({
          '.cm-content': {
            fontSize: `${currentFontSize}px`,
            fontFamily: 'Fira Code, monospace',
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [language, currentTheme, currentFontSize]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(code)}`);
    element.setAttribute('download', `code.${language}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden border border-gray-700">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">Code Editor</span>
          <span className="text-gray-400 text-sm">{language}</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={currentFontSize}
            onChange={(e) => setCurrentFontSize(Number(e.target.value))}
            className="px-2 py-1 bg-gray-800 text-white rounded text-sm"
          >
            <option value={12}>12px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
            <option value={18}>18px</option>
            <option value={20}>20px</option>
          </select>
          <button
            onClick={() => setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark')}
            className="p-2 hover:bg-gray-800 rounded transition"
            title="Toggle theme"
          >
            <Settings size={18} className="text-white" />
          </button>
          <button
            onClick={copyCode}
            className="p-2 hover:bg-gray-800 rounded transition"
            title="Copy code"
          >
            <Copy size={18} className="text-white" />
          </button>
          <button
            onClick={downloadCode}
            className="p-2 hover:bg-gray-800 rounded transition"
            title="Download file"
          >
            <Download size={18} className="text-white" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div ref={editorRef} className="flex-1 overflow-hidden" />
    </div>
  );
};

export default CodeMirrorEditor;
