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
    
    <div className={`bg-gray-50 dark:bg-gray-900 text-black dark:text-white w-full h-full ${sidebarStatus ? 'md:pt-4' : '' } pt-0 transition-colors duration-300 relative`}>
    {/* Mobile header for when sidebar is hidden */}
    {!sidebarStatus && (
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={setSidebarstatus}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 shadow-sm focus-ring"
          title="Open Sidebar"
        >
          <PanelLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-heading">World GPT</h1>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 focus-ring"
            onClick={onProfileClick}
            title="View Profile"
          >
            <HiAdjustmentsHorizontal size={16} className="text-white" />
          </div>
          <ThemeToggle />
        </div>
      </div>
    )}

    <div
      className="fixed -right-4 z-20 h-16 w-36 max-sm:hidden max-lg:hidden overflow-hidden"
      style={{ top: -1 }}
    >
      {sidebarStatus && (
        <div
          className="group pointer-events-none absolute top-4 right-0 z-10 -mb-8 h-32 w-full origin-top transition-all ease-snappy"
        >
          <svg
            className="absolute -right-8 h-9 origin-top-left skew-x-[30deg] overflow-visible"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 158 32"
            xmlSpace="preserve"
          >
            <line
              strokeWidth="2px"
              shapeRendering="optimizeQuality"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeMiterlimit={10}
              x1={1}
              y1={0}
              x2={158}
              y2={0}
            />
            <path
              className="translate-y-[0.5px] stroke-gray-200 dark:stroke-gray-700 fill-gray-50 dark:fill-gray-900"
              shapeRendering="optimizeQuality"
              strokeWidth="1px"
              strokeLinecap="round"
              strokeMiterlimit={10}
              vectorEffect="non-scaling-stroke"
              d="M0,0c5.9,0,10.7,4.8,10.7,10.7v10.7c0,5.9,4.8,10.7,10.7,10.7H128V0"
            />
          </svg>
        </div>
      )}
    </div>
    <div className={`${!sidebarStatus ? 'bg-gray-200 dark:bg-gray-900 rounded-md' : ''} p-2`} style={{position: 'absolute', right: 6, top: 6, width: 80, display: 'flex', zIndex: 1000, justifyContent: 'center'}}>
      <div
      className="w-8 h-8 flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 shadow-sm focus-ring hover:shadow-md hover:scale-105"
        style={{ marginRight: '10px' }}
        onClick={onProfileClick}
        title="View Profile"
      >
        <HiAdjustmentsHorizontal size={16} className="text-white" />
      </div>
      <ThemeToggle />
    </div>
    <div className={`flex-1 ${sidebarStatus ? 'lg:rounded-tl-2xl' : ''} bg-white dark:bg-gray-800 w-full h-full flex flex-col overflow-hidden relative transition-colors duration-300 shadow-professional-lg border border-gray-200 dark:border-gray-700`}>
      
      {!sidebarStatus && (
      <div className='hidden lg:flex justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm'>
        <button
          className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 shadow-sm focus-ring"
          onClick={onsidebarbutton}
          title="Toggle Sidebar"
        >
          <PanelLeft size={20} />
        </button>
      </div>)}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 scrollbar-thin mt-8">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md px-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bot size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-heading mb-3">Start a conversation</h3>
              <p className="text-sm sm:text-base text-body leading-relaxed">
                Ask me anything! I'm here to help with questions, creative tasks, analysis, and more.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div>
              <div
                key={message.id}
                className={`flex gap-3 sm:gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{alignItems: 'center'}}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    {(() => {
                      console.log(message)
                      const model = AI_MODELS.find(m => m.id === message.model);
                      const Icon = model?.icon || Bot;
                      return <Icon size={16} className="text-white" />;
                    })()}
                  </div>
                )}
                
                <div className={`max-w-xs sm:max-w-md lg:max-w-3xl ${message.sender === 'user' ? 'order-first' : ''}`}>
                  <div className={`message-bubble ${
                    message.sender === 'user'
                      ? 'user shadow-professional'
                      : 'ai shadow-professional'
                  }`}>
                    <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">{message.content}</p>
                  </div>
                </div>

                {message.sender === 'user' && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
              <div className={`flex gap-3 sm:gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 shadow-sm" />
                <div className={`text-xs text-caption mt-1 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex gap-3 sm:gap-4 animate-fade-in">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              {
                (() => {
                  const model = AI_MODELS.find(m => m.id === selectedModel);
                  const Icon = model?.icon || Bot;
                  return <Icon size={16} className="text-white" />;
                })()
              }
            </div>
            <div className="message-bubble ai shadow-professional">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-colors">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Model Selector */}
        <div className="flex gap-3 sm:gap-4 items-start">
          <div className="relative">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 min-w-[160px] sm:min-w-[200px] text-gray-900 dark:text-white shadow-professional focus-ring"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                {selectedModelData.icon ? React.createElement(selectedModelData.icon, { size: 16, color: "black" }) : <Bot size={16} />}
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-heading flex items-center gap-1 text-sm">
                    {selectedModelData.name}
                    {selectedModelData.type === 'premium' && (
                      <Crown size={12} className="text-yellow-500" />
                    )}
                  </div>
                  <div className="text-xs text-caption truncate max-w-[120px]">{selectedModelData.description}</div>
                </div>
                <div className="sm:hidden text-xs font-medium text-heading">
                  {selectedModelData.name}
                </div>
              </div>
              <ChevronDown size={14} className={`transform transition-transform text-gray-400 ${
                isModelDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {isModelDropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-professional-lg z-10 w-[280px] sm:min-w-[320px] max-h-64 overflow-y-auto text-gray-900 dark:text-white transition-colors scrollbar-thin">
                <div className="p-2">
                  <div className="text-xs font-bold text-caption uppercase tracking-wider px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                    Free Models
                  </div>
                  {AI_MODELS.filter(model => model.type === 'free').map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(model.id)}
                      className={`w-full px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent ${
                        selectedModel === model.id ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-600' : ''
                      } transition-all duration-200 flex items-center gap-3 rounded-lg text-gray-900 dark:text-white focus-ring`}
                    >
                      {model.icon ? React.createElement(model.icon, { size: 18, className: 'text-gray-600 dark:text-gray-400' }) : <Bot size={18} className="text-gray-600 dark:text-gray-400" />}
                      <div className="flex-1">
                        <div className="font-semibold text-heading text-sm">{model.name}</div>
                        <div className="text-xs text-caption">{model.description}</div>
                      </div>
                    </button>
                  ))}
                  
                  <div className="text-xs font-bold text-caption uppercase tracking-wider px-3 py-2 mt-2 border-t border-gray-100 dark:border-gray-800">
                    Premium Models
                  </div>
                  {AI_MODELS.filter(model => model.type === 'premium').map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(model.id)}
                      className={`w-full px-3 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent ${
                        selectedModel === model.id ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-600' : ''
                      } transition-all duration-200 flex items-center gap-3 rounded-lg text-gray-900 dark:text-white focus-ring`}
                    >
                      {model.icon ? React.createElement(model.icon, { size: 18, className: 'text-gray-600 dark:text-gray-400', color: 'currentColor' }) : <Bot size={18} className="text-gray-600 dark:text-gray-400" />}
                      <div className="flex-1">
                        <div className="font-semibold text-heading flex items-center gap-2 text-sm">
                          {model.name}
                          <Crown size={12} className="text-yellow-500" />
                        </div>
                        <div className="text-xs text-caption">{model.description}</div>
                      </div>
                      {!user && (
                        <div className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
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
              className="w-full h-full px-3 sm:px-4 py-3 sm:py-[14px] border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none max-h-32 min-h-[48px] sm:min-h-[52px] leading-relaxed shadow-professional transition-all duration-200 text-sm sm:text-base"
              rows={1}
            />
          </div>
          <div className="flex gap-2 items-end">
            <button
              type="submit"
              disabled={!input.trim() || (!user && remainingFreeMessages <= 0)}
              className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-professional font-medium focus-ring group"
            >
              <Send size={18} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              <span className="hidden sm:inline text-sm font-semibold">Send</span>
            </button>
          </div>
        </form>
        
        {!user && remainingFreeMessages <= 2 && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl shadow-professional">
            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-400 font-medium text-center sm:text-left">
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
