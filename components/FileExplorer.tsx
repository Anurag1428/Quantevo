'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  FileJson,
  FileCode,
  FileText,
  Search,
  Plus,
  MoreVertical,
} from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  language?: string;
}

interface FileExplorerProps {
  fileTree: FileNode;
  onFileSelect?: (file: FileNode) => void;
  onCreateFile?: (parentId: string, name: string) => void;
  onCreateFolder?: (parentId: string, name: string) => void;
  onDeleteItem?: (itemId: string) => void;
  onRenameItem?: (itemId: string, newName: string) => void;
  theme?: 'dark' | 'light';
}

const getFileIcon = (fileName: string, isFolder: boolean) => {
  if (isFolder) return null;

  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  const iconMap: Record<string, React.ReactNode> = {
    'json': <FileJson size={16} />,
    'ts': <FileCode size={16} />,
    'tsx': <FileCode size={16} />,
    'js': <FileCode size={16} />,
    'jsx': <FileCode size={16} />,
    'css': <FileCode size={16} />,
    'scss': <FileCode size={16} />,
    'html': <FileCode size={16} />,
    'py': <FileCode size={16} />,
    'java': <FileCode size={16} />,
    'md': <FileText size={16} />,
    'txt': <FileText size={16} />,
  };

  return iconMap[extension] || <File size={16} />;
};

interface TreeItemProps {
  node: FileNode;
  level: number;
  onFileSelect?: (file: FileNode) => void;
  onCreateFile?: (parentId: string) => void;
  onCreateFolder?: (parentId: string) => void;
  onDelete?: (itemId: string) => void;
  onRename?: (itemId: string, newName: string) => void;
  expandedFolders: Set<string>;
  onToggleExpand: (nodeId: string) => void;
  selectedFileId?: string;
  theme: 'dark' | 'light';
}

const TreeItem: React.FC<TreeItemProps> = ({
  node,
  level,
  onFileSelect,
  onCreateFile,
  onCreateFolder,
  onDelete,
  onRename,
  expandedFolders,
  onToggleExpand,
  selectedFileId,
  theme,
}) => {
  const isExpanded = expandedFolders.has(node.id);
  const isSelected = selectedFileId === node.id;
  const colors = theme === 'dark'
    ? {
        bg: '#252526',
        hoverBg: '#2d2d30',
        selectedBg: '#37373d',
        text: '#cccccc',
        mutedText: '#858585',
      }
    : {
        bg: '#ffffff',
        hoverBg: '#f0f0f0',
        selectedBg: '#e8e8ff',
        text: '#333333',
        mutedText: '#999999',
      };

  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  return (
    <>
      {node.type === 'folder' ? (
        <>
          <div
            onClick={() => onToggleExpand(node.id)}
            onContextMenu={handleContextMenu}
            className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:opacity-80 transition relative"
            style={{
              paddingLeft: `${level * 16 + 8}px`,
              backgroundColor: isSelected ? colors.selectedBg : 'transparent',
              color: colors.text,
            }}
          >
            <div className="w-4 flex items-center justify-center">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>
            {isExpanded ? (
              <FolderOpen size={16} style={{ color: '#DCDCAA' }} />
            ) : (
              <Folder size={16} style={{ color: '#DCDCAA' }} />
            )}
            <span className="text-sm truncate">{node.name}</span>

            {isSelected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleContextMenu(e as any);
                }}
                className="ml-auto opacity-0 hover:opacity-100 p-1"
              >
                <MoreVertical size={14} />
              </button>
            )}
          </div>

          {/* Context Menu */}
          {showContextMenu && (
            <div
              className="fixed bg-gray-800 border border-gray-700 rounded shadow-lg z-50 py-1 min-w-40"
              style={{
                top: menuPosition.y,
                left: menuPosition.x,
              }}
              onMouseLeave={() => setShowContextMenu(false)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateFile?.(node.id);
                  setShowContextMenu(false);
                }}
                className="w-full text-left px-3 py-1 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
              >
                <Plus size={14} /> New File
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateFolder?.(node.id);
                  setShowContextMenu(false);
                }}
                className="w-full text-left px-3 py-1 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
              >
                <Plus size={14} /> New Folder
              </button>
              <hr className="border-gray-700 my-1" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRenaming(true);
                  setShowContextMenu(false);
                }}
                className="w-full text-left px-3 py-1 text-sm text-gray-300 hover:bg-gray-700"
              >
                Rename
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(node.id);
                  setShowContextMenu(false);
                }}
                className="w-full text-left px-3 py-1 text-sm text-red-400 hover:bg-gray-700"
              >
                Delete
              </button>
            </div>
          )}

          {isExpanded && node.children && !isRenaming && (
            <div>
              {node.children.map((child) => (
                <TreeItem
                  key={child.id}
                  node={child}
                  level={level + 1}
                  onFileSelect={onFileSelect}
                  onCreateFile={onCreateFile}
                  onCreateFolder={onCreateFolder}
                  onDelete={onDelete}
                  onRename={onRename}
                  expandedFolders={expandedFolders}
                  onToggleExpand={onToggleExpand}
                  selectedFileId={selectedFileId}
                  theme={theme}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div
          onClick={() => onFileSelect?.(node)}
          onContextMenu={handleContextMenu}
          className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:opacity-80 transition relative group"
          style={{
            paddingLeft: `${level * 16 + 8}px`,
            backgroundColor: isSelected ? colors.selectedBg : 'transparent',
            color: colors.text,
          }}
        >
          <div className="w-4" />
          {getFileIcon(node.name, false)}
          <span className="text-sm truncate">{node.name}</span>

          {isSelected && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleContextMenu(e as any);
              }}
              className="ml-auto opacity-0 group-hover:opacity-100 p-1"
            >
              <MoreVertical size={14} />
            </button>
          )}

          {/* Context Menu */}
          {showContextMenu && (
            <div
              className="fixed bg-gray-800 border border-gray-700 rounded shadow-lg z-50 py-1 min-w-40"
              style={{
                top: menuPosition.y,
                left: menuPosition.x,
              }}
              onMouseLeave={() => setShowContextMenu(false)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRenaming(true);
                  setShowContextMenu(false);
                }}
                className="w-full text-left px-3 py-1 text-sm text-gray-300 hover:bg-gray-700"
              >
                Rename
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(node.id);
                  setShowContextMenu(false);
                }}
                className="w-full text-left px-3 py-1 text-sm text-red-400 hover:bg-gray-700"
              >
                Delete
              </button>
            </div>
          )}

          {isRenaming && (
            <div
              className="absolute inset-0 flex items-center gap-2 px-2 bg-gray-700 rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={() => {
                  if (newName && newName !== node.name) {
                    onRename?.(node.id, newName);
                  }
                  setIsRenaming(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (newName && newName !== node.name) {
                      onRename?.(node.id, newName);
                    }
                    setIsRenaming(false);
                  } else if (e.key === 'Escape') {
                    setNewName(node.name);
                    setIsRenaming(false);
                  }
                }}
                className="flex-1 bg-gray-600 text-white px-2 py-1 rounded text-sm outline-none border border-blue-500"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({
  fileTree,
  onFileSelect,
  onCreateFile,
  onCreateFolder,
  onDeleteItem,
  onRenameItem,
  theme = 'dark',
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set([fileTree.id])
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileId, setSelectedFileId] = useState<string>();

  const toggleExpand = (nodeId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileSelect = (file: FileNode) => {
    setSelectedFileId(file.id);
    onFileSelect?.(file);
  };

  const colors = theme === 'dark'
    ? {
        bg: '#1e1e1e',
        border: '#3e3e42',
        text: '#cccccc',
        headerBg: '#252526',
      }
    : {
        bg: '#ffffff',
        border: '#d0d0d0',
        text: '#333333',
        headerBg: '#f3f3f3',
      };

  return (
    <div
      className="h-full flex flex-col border-r"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b"
        style={{
          borderColor: colors.border,
          backgroundColor: colors.headerBg,
        }}
      >
        <h3 style={{ color: colors.text }} className="text-sm font-semibold mb-3">
          EXPLORER
        </h3>
        <div className="relative">
          <Search size={14} className="absolute left-2 top-2.5" style={{ color: colors.text }} />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 rounded text-sm"
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              borderColor: colors.border,
            }}
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto">
        <TreeItem
          node={fileTree}
          level={0}
          onFileSelect={handleFileSelect}
          onCreateFile={onCreateFile}
          onCreateFolder={onCreateFolder}
          onDelete={onDeleteItem}
          onRename={onRenameItem}
          expandedFolders={expandedFolders}
          onToggleExpand={toggleExpand}
          selectedFileId={selectedFileId}
          theme={theme}
        />
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2 border-t text-xs"
        style={{
          borderColor: colors.border,
          backgroundColor: colors.headerBg,
          color: colors.text,
        }}
      >
        <div className="flex gap-2">
          <button className="hover:opacity-80">
            <Plus size={14} />
          </button>
          <button className="hover:opacity-80">
            <MoreVertical size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
export type { FileNode, FileExplorerProps };
