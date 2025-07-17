import React, { useRef, useEffect, useState } from 'react';

const RichTextEditor = ({ value = '', onChange, placeholder = 'Start writing...' }) => {
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    if (editorRef.current && !isEditorReady) {
      // Initialize the editor
      setIsEditorReady(true);
    }
  }, [isEditorReady]);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold');
          handleInput();
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic');
          handleInput();
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline');
          handleInput();
          break;
        default:
          break;
      }
    }
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const formatBlock = (tag) => {
    executeCommand('formatBlock', tag);
  };

  return (
    <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-900">
      {/* Toolbar */}
      <div className="border-b border-gray-600 p-3 bg-gray-800 flex flex-wrap gap-2">
        {/* Headers */}
        <select
          onChange={(e) => formatBlock(e.target.value)}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-green-400"
          defaultValue=""
        >
          <option value="">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <div className="w-px h-6 bg-gray-600 mx-1"></div>

        {/* Text formatting */}
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 text-white text-sm font-bold transition-colors"
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 text-white text-sm italic transition-colors"
          title="Italic (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 text-white text-sm underline transition-colors"
          title="Underline (Ctrl+U)"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => executeCommand('strikeThrough')}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 text-white text-sm line-through transition-colors"
          title="Strikethrough"
        >
          S
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 text-white text-sm transition-colors"
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 text-white text-sm transition-colors"
          title="Numbered List"
        >
          1. List
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1"></div>

        {/* Other formatting */}
        <button
          type="button"
          onClick={() => executeCommand('indent')}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 text-white text-sm transition-colors"
          title="Indent"
        >
          →
        </button>
        <button
          type="button"
          onClick={() => executeCommand('outdent')}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 text-white text-sm transition-colors"
          title="Outdent"
        >
          ←
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1"></div>

        {/* Link */}
        <button
          type="button"
          onClick={insertLink}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 text-white text-sm transition-colors"
          title="Insert Link"
        >
          🔗
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1"></div>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => formatBlock('blockquote')}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 text-white text-sm transition-colors"
          title="Blockquote"
        >
          " "
        </button>

        {/* Code */}
        <button
          type="button"
          onClick={() => formatBlock('pre')}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 text-white text-sm font-mono transition-colors"
          title="Code Block"
        >
          &lt;/&gt;
        </button>

        <div className="w-px h-6 bg-gray-600 mx-1"></div>

        {/* Clear formatting */}
        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          className="px-3 py-1 bg-gray-700 border border-gray-600 rounded hover:bg-gray-600 text-white text-sm transition-colors"
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="p-6 min-h-[300px] focus:outline-none bg-white text-gray-900"
        style={{
          lineHeight: '1.6',
          fontSize: '16px'
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        
        [contenteditable] blockquote {
          margin: 1em 0;
          padding-left: 1em;
          border-left: 4px solid #e5e7eb;
          color: #6b7280;
        }
        
        [contenteditable] pre {
          background-color: #f3f4f6;
          padding: 1em;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
