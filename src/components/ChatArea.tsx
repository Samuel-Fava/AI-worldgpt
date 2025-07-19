import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ChevronDown, Crown, PanelLeft} from 'lucide-react';
import { BsStars  } from 'react-icons/bs';
import { SiOpenai } from "react-icons/si";
import ClaudeAIIcon from "./claudeAIIcon";
import DeepSeekAIIcon from './DeepSeekAIIcon';
import ThemeToggle from './ThemeToggle';
import { HiAdjustmentsHorizontal } from 'react-icons/hi2';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  model: string;
}

interface ChatAreaProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
  user: { id: string; firstName: string; lastName: string; email: string; plan: "free" | "premium"; createdAt: Date; } | null;
  freeMessageCount: number;
  freeMessageLimit: number;
  onAuthModalOpen: () => void;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  setSidebarstatus: () => void;
  sidebarStatus: boolean;
  onProfileClick: () => void;
}

const AI_MODELS = [
  { id: 'gpt', name: 'GPT-3.5', description: 'Fast and efficient', type: 'free', icon: SiOpenai },
  { id: 'gemini', name: 'Gemini', description: 'Google AI', type: 'free', icon: BsStars },
  { id: 'gpt-4', name: 'GPT-4', description: 'Most capable', type: 'premium', icon: SiOpenai },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Compact power', type: 'premium', icon: SiOpenai }, 
  { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', description: 'Latest mini', type: 'premium', icon: SiOpenai },
  { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', description: 'Ultra-fast', type: 'premium', icon: SiOpenai },
  { id: 'gpt-4o', name: 'GPT-4o', description: 'Optimized', type: 'premium', icon: SiOpenai },
  { id: 'claude', name: 'Claude', description: 'Anthropic AI', type: 'premium', icon: ClaudeAIIcon },
  { id: 'deepseek', name: 'DeepSeek', description: 'Advanced reasoning', type: 'premium', icon: DeepSeekAIIcon },
];

export const ChatArea: React.FC<ChatAreaProps> = ({
  selectedModel,
  onModelSelect,
  user,
  freeMessageCount,
  freeMessageLimit,
  onAuthModalOpen,
  messages,
  onSendMessage,
  isTyping,
  setSidebarstatus,
  sidebarStatus,
  onProfileClick,
}) => {
  const [input, setInput] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const selectedModelData = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];
  const remainingFreeMessages = user ? Infinity : Math.max(0, freeMessageLimit - freeMessageCount);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleModelSelect = (modelId: string) => {
    const model = AI_MODELS.find(m => m.id === modelId);
    if (model?.type === 'premium' && !user) {
      onAuthModalOpen();
      return;
    }
    onModelSelect(modelId);
    setIsModelDropdownOpen(false);
  };

  const onsidebarbutton = () => {
    console.log('Sidebar button clicked');
    setSidebarstatus();
  };

  return (
    
    <div className="bg-gray-200 dark:bg-gray-900 text-black dark:text-white w-full h-full p-2 transition-colors duration-300">
    <div className="flex-1 rounded-xl bg-white dark:bg-gray-800 w-full h-full flex flex-col overflow-hidden relative transition-colors duration-300">
      
      { sidebarStatus ? 
      <div className='flex justify-end'>
        <div className='flex justify-content'>
          <div
            className="w-10 h-10 bg-blue-600 mt-2 mr-2 flex items-center justify-center cursor-pointer"
            onClick={onProfileClick}
            title="View Profile"
          >
            <HiAdjustmentsHorizontal size={16} className="text-white" />
          </div>
          <ThemeToggle/>
        </div>
      </div> : 
      <div className='flex justify-between'>
        <button
          className="w-10 h-10 flex items-center justify-center ml-2 mt-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          onClick={onsidebarbutton}
          title="Toggle Sidebar"
        >
          <PanelLeft size={24} />
        </button> 
        <div className='flex justify-content'>
          <div
            className="w-10 h-10 bg-blue-600 mt-2 mr-2 rounded-full flex items-center justify-center cursor-pointer"
            onClick={onProfileClick}
            title="View Profile"
          >
            <HiAdjustmentsHorizontal size={16} className="text-white" />
          </div>
          <ThemeToggle/>
        </div>
      </div>}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Bot size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start a conversation</h3>
              <p className="text-gray-500 max-w-md">
                Ask me anything! I'm here to help with questions, creative tasks, analysis, and more.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  {(() => {
                    console.log(message)
                    const model = AI_MODELS.find(m => m.id === message.model);
                    const Icon = model?.icon || Bot;
                    return <Icon size={16} className="text-white" />;
                  })()}
                </div>
              )}
              
              <div className={`max-w-3xl ${message.sender === 'user' ? 'order-first' : ''}`}>
                <div className={`px-4 py-3 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white ml-auto'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>

              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-white" />
                </div>
              )}
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              {
                (() => {
                  const model = AI_MODELS.find(m => m.id === selectedModel);
                  const Icon = model?.icon || Bot;
                  return <Icon size={16} className="text-white" />;
                })()
              }
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors">
            <form onSubmit={handleSubmit} className="flex gap-4">
        {/* Model Selector */}
        <div className="flex gap-4 items-start">
          <div className="relative">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-w-[200px] text-gray-900 dark:text-white"
            >
              <div className="flex items-center gap-3">
                {selectedModelData.icon ? React.createElement(selectedModelData.icon, { size: 18, color: "black" }) : <Bot size={18} />}
                <div className="text-left">
                  <div className="font-semibold text-gray-900 flex items-center gap-2 dark:text-white">
                    {selectedModelData.name}
                    {selectedModelData.type === 'premium' && (
                      <Crown size={14} className="text-yellow-600" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{selectedModelData.description}</div>
                </div>
              </div>
              <ChevronDown size={18} className={`transform transition-transform text-gray-400 ${
                isModelDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {isModelDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-10 min-w-[300px] max-h-60 overflow-y-auto text-gray-900 dark:text-white transition-colors">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 py-2">
                    Free Models
                  </div>
                  {AI_MODELS.filter(model => model.type === 'free').map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(model.id)}
                      className={`w-full px-3 py-3 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent ${
                        selectedModel === model.id ? 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-600' : ''
                      } transition-colors flex items-center gap-3 rounded-lg text-gray-900 dark:text-white`}
                    >
                      {model.icon ? React.createElement(model.icon, { size: 16, className: 'text-gray-600' }) : <Bot size={16} className="text-gray-600" />}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 dark:text-white">{model.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{model.description}</div>
                      </div>
                    </button>
                  ))}
                  
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2 mt-2 border-t border-gray-100">
                    Premium Models
                  </div>
                  {AI_MODELS.filter(model => model.type === 'premium').map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(model.id)}
                      className={`w-full px-3 py-3 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent ${
                        selectedModel === model.id ? 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-600' : ''
                      } transition-colors flex items-center gap-3 rounded-lg text-gray-900 dark:text-white`}
                    >
                      {model.icon ? React.createElement(model.icon, { size: 16, className: 'text-black-600', color: 'black' }) : <Bot size={16} className="text-gray-600" />}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 flex items-center gap-2 dark:text-white">
                          {model.name}
                          <Crown size={14} className="text-yellow-600" />
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{model.description}</div>
                      </div>
                      {!user && (
                        <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Login Required
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full h-full px-4 py-[14px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none max-h-32 min-h-[48px] leading-snug"
              rows={1}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!input.trim() || (!user && remainingFreeMessages <= 0)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
        
        {!user && remainingFreeMessages <= 2 && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              {remainingFreeMessages === 0 
                ? 'You\'ve reached your free message limit. Please sign in to continue.'
                : `Only ${remainingFreeMessages} free message${remainingFreeMessages === 1 ? '' : 's'} remaining.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};
