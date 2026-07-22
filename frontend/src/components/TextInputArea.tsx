import React, { useState } from 'react';

interface TextInputAreaProps {
  onSubmit: (text: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const TextInputArea: React.FC<TextInputAreaProps> = ({
  onSubmit,
  isLoading = false,
  placeholder = 'Paste complaint text or email content here...',
}) => {
  const [text, setText] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    setCharCount(newText.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
      setCharCount(0);
    }
  };

  const handleClear = () => {
    setText('');
    setCharCount(0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label
          htmlFor="textInput"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Paste Complaint Text/Email
        </label>
        <textarea
          id="textInput"
          value={text}
          onChange={handleChange}
          disabled={isLoading}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-inter resize-vertical min-h-32 disabled:bg-gray-100"
          maxLength={5000}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500">
            {charCount}/5000 characters
          </p>
          {text && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors text-sm font-medium"
        >
          {isLoading ? 'Processing...' : 'Extract from Text'}
        </button>
      </div>
    </form>
  );
};

export default TextInputArea;
