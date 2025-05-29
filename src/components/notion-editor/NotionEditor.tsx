import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NotionBlock, ParsedContent } from '@/types/notion';
import { MarkdownParser } from './parsers/MarkdownParser';
import { BlockRenderer } from './blocks/BlockRenderer';
import { Button } from '@/components/ui/button';
import { 
  Type,
  Hash,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Lightbulb,
  ChevronRight,
  MoreHorizontal,
  Table,
  Image,
  Video,
  Globe
} from 'lucide-react';

interface NotionEditorProps {
  initialContent?: string;
  onChange?: (content: string, blocks: NotionBlock[]) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

export const NotionEditor: React.FC<NotionEditorProps> = ({
  initialContent = '',
  onChange,
  placeholder = 'Start typing...',
  className = '',
  readOnly = false
}) => {
  const [blocks, setBlocks] = useState<NotionBlock[]>([]);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ x: 0, y: 0 });
  const [currentBlockId, setCurrentBlockId] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const slashMenuRef = useRef<HTMLDivElement>(null);

  // Initialize editor with content
  useEffect(() => {
    if (initialContent && blocks.length === 0) {
      const parsed = MarkdownParser.parseToBlocks(initialContent);
      setBlocks(parsed.blocks);
    }
  }, [initialContent]);

  // Handle content changes
  const handleContentChange = useCallback((blockId: string, content: string) => {
    setBlocks(prevBlocks => {
      const updatedBlocks = prevBlocks.map(block =>
        block.id === blockId ? { ...block, content } : block
      );
      
      // Convert blocks back to markdown for onChange callback
      if (onChange) {
        const markdown = MarkdownParser.blocksToMarkdown(updatedBlocks);
        onChange(markdown, updatedBlocks);
      }
      
      return updatedBlocks;
    });
  }, [onChange]);

  // Handle block type changes
  const handleBlockTypeChange = useCallback((blockId: string, newType: string) => {
    setBlocks(prevBlocks => {
      const updatedBlocks = prevBlocks.map(block =>
        block.id === blockId ? { ...block, type: newType as any } : block
      );
      
      if (onChange) {
        const markdown = MarkdownParser.blocksToMarkdown(updatedBlocks);
        onChange(markdown, updatedBlocks);
      }
      
      return updatedBlocks;
    });
  }, [onChange]);

  // Handle block property updates
  const handleBlockUpdate = useCallback((blockId: string, properties: any) => {
    setBlocks(prevBlocks => {
      const updatedBlocks = prevBlocks.map(block =>
        block.id === blockId ? { ...block, properties } : block
      );
      
      if (onChange) {
        const markdown = MarkdownParser.blocksToMarkdown(updatedBlocks);
        onChange(markdown, updatedBlocks);
      }
      
      return updatedBlocks;
    });
  }, [onChange]);

  // Handle keyboard events for real-time formatting
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    // Handle slash commands
    if (e.key === '/') {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      setSlashMenuPosition({ x: rect.left, y: rect.bottom });
      setShowSlashMenu(true);
      return;
    }

    // Hide slash menu on other keys
    if (showSlashMenu) {
      setShowSlashMenu(false);
    }

    // Handle Enter key for new blocks
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnterKey();
      return;
    }

    // Handle Tab for indentation in lists
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabIndentation(e.shiftKey);
      return;
    }

    // Handle backspace for block deletion
    if (e.key === 'Backspace') {
      handleBackspace();
      return;
    }
  };

  const handleEnterKey = () => {
    const newBlock: NotionBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'paragraph',
      content: ''
    };
    
    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
  };

  const handleTabIndentation = (reverse: boolean) => {
    // TODO: Implement list indentation logic
    console.log('Tab indentation:', reverse ? 'reverse' : 'forward');
  };

  const handleBackspace = () => {
    // TODO: Implement block deletion logic
    console.log('Backspace handling');
  };

  // Slash command menu items
  const slashCommands = [
    {
      icon: Type,
      label: 'Text',
      description: 'Just start typing with plain text',
      command: 'paragraph'
    },
    {
      icon: Hash,
      label: 'Heading 1',
      description: 'Big section heading',
      command: 'heading1'
    },
    {
      icon: Hash,
      label: 'Heading 2', 
      description: 'Medium section heading',
      command: 'heading2'
    },
    {
      icon: Hash,
      label: 'Heading 3',
      description: 'Small section heading',
      command: 'heading3'
    },
    {
      icon: List,
      label: 'Bulleted list',
      description: 'Create a simple bulleted list',
      command: 'bulleted_list'
    },
    {
      icon: ListOrdered,
      label: 'Numbered list',
      description: 'Create a list with numbering',
      command: 'numbered_list'
    },
    {
      icon: ChevronRight,
      label: 'Toggle list',
      description: 'Create a collapsible toggle list',
      command: 'toggle'
    },
    {
      icon: Quote,
      label: 'Quote',
      description: 'Capture a quote',
      command: 'quote'
    },
    {
      icon: Lightbulb,
      label: 'Callout',
      description: 'Make writing stand out',
      command: 'callout'
    },
    {
      icon: Code,
      label: 'Code',
      description: 'Capture a code snippet',
      command: 'code'
    },
    {
      icon: Minus,
      label: 'Divider',
      description: 'Visually divide blocks',
      command: 'divider'
    },
    {
      icon: Table,
      label: 'Table',
      description: 'Create a table',
      command: 'table'
    },
    {
      icon: Image,
      label: 'Image',
      description: 'Insert an image',
      command: 'image'
    },
    {
      icon: Video,
      label: 'Video',
      description: 'Insert a video',
      command: 'video'
    },
    {
      icon: Globe,
      label: 'Embed',
      description: 'Embed external content',
      command: 'embed'
    }
  ];

  const handleSlashCommand = (command: string) => {
    if (currentBlockId) {
      handleBlockTypeChange(currentBlockId, command);
    }
    setShowSlashMenu(false);
  };

  // Handle paste events for markdown content
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    
    if (pastedText) {
      const parsed = MarkdownParser.parseToBlocks(pastedText);
      setBlocks(prevBlocks => [...prevBlocks, ...parsed.blocks]);
      
      if (onChange) {
        const allBlocks = [...blocks, ...parsed.blocks];
        const markdown = MarkdownParser.blocksToMarkdown(allBlocks);
        onChange(markdown, allBlocks);
      }
    }
  };

  // Auto-generate initial block if empty
  useEffect(() => {
    if (blocks.length === 0 && !readOnly) {
      setBlocks([{
        id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'paragraph',
        content: ''
      }]);
    }
  }, [blocks.length, readOnly]);

  return (
    <div className={`notion-editor relative ${className}`}>
      <div
        ref={editorRef}
        className={`
          min-h-[200px] p-4 rounded-lg border 
          bg-white dark:bg-gray-900 
          border-gray-300 dark:border-gray-700
          focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50
          ${readOnly ? 'cursor-default' : 'cursor-text'}
        `}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        style={{ outline: 'none' }}
      >
        {blocks.length === 0 && !readOnly ? (
          <div className="text-gray-400 dark:text-gray-500">
            {placeholder}
          </div>
        ) : (
          blocks.map((block) => (
            <BlockRenderer
              key={block.id}
              block={block}
              isEditing={!readOnly}
              onContentChange={handleContentChange}
              onBlockTypeChange={handleBlockTypeChange}
              onBlockUpdate={handleBlockUpdate}
            />
          ))
        )}
      </div>

      {/* Slash Command Menu */}
      {showSlashMenu && !readOnly && (
        <div
          ref={slashMenuRef}
          className="absolute z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg py-2 min-w-[300px] max-h-[400px] overflow-y-auto"
          style={{
            left: slashMenuPosition.x,
            top: slashMenuPosition.y + 5
          }}
        >
          <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Basic blocks
          </div>
          {slashCommands.map((item) => (
            <button
              key={item.command}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              onClick={() => handleSlashCommand(item.command)}
            >
              <item.icon className="w-4 h-4 mr-3 text-gray-600 dark:text-gray-400" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Editor Toolbar (optional) */}
      {!readOnly && (
        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center">
            <MoreHorizontal className="w-4 h-4 mr-1" />
            Type <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">/</kbd> for commands
          </span>
        </div>
      )}
    </div>
  );
}; 