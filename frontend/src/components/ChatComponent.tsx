import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setLoading, setError } from '../redux/slices/chatSlice';
import { RootState, AppDispatch } from '../redux/store';
import { ChatMessage } from '../types';
import { v4 as uuidv4 } from './uuid-helper';
import { chatWithAI } from '../services/api';

export const ChatComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const chat = useSelector((state: RootState) => state.chat);
  const complaint = useSelector((state: RootState) => state.complaint);
  const extraction = useSelector((state: RootState) => state.extraction);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  // Get complaint context for API call
  const getComplaintContext = (): string => {
    const form = complaint.form;
    const context = [
      `Product: ${form.productName}`,
      `Batch: ${form.batchNumber}`,
      `Type: ${form.complaintType}`,
      `Severity: ${form.initialSeverity}`,
      `Description: ${form.description}`,
      extraction.extractedText ? `Source: ${extraction.uploadedFileName}` : '',
    ]
      .filter(Boolean)
      .join('; ');

    return context || 'No complaint data available';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    dispatch(addMessage(userMessage));
    setInputValue('');
    dispatch(setLoading(true));
    setIsTyping(true);

    try {
      // Get complaint context
      const complaintContext = getComplaintContext();

      // Call AI chat API
      const response = await chatWithAI(complaintContext, inputValue);

      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      dispatch(addMessage(assistantMessage));
      dispatch(setError(null));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to get response';
      dispatch(setError(errorMessage));

      // Add error message to chat
      const errorChatMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: `Error: ${errorMessage}. Please try again.`,
        timestamp: new Date(),
      };
      dispatch(addMessage(errorChatMessage));
    } finally {
      dispatch(setLoading(false));
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-gray-500 text-sm">
                Ask me anything about this complaint...
              </p>
            </div>
          </div>
        ) : (
          <>
            {chat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-900 rounded-bl-none'
                  }`}
                >
                  {message.content}
                  <p
                    className={`text-xs mt-1 ${
                      message.role === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg rounded-bl-none text-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-200 p-4 bg-white rounded-b-lg"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about this complaint..."
            disabled={chat.isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-inter disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || chat.isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors text-sm font-medium"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
