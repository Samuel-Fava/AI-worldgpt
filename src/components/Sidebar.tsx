import React, { useState } from 'react';
import { Plus, MessageSquare, Settings, LogOut, ChevronDown, Bot, User } from 'lucide-react';

interface SidebarProps {
  user: { name: string; email: string } | null;
  onSignOut: () => void;
  conversations: Array<{ id: string; title: string; lastMessage: string }>;
  activeConversationId: string | null;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  selectedModel: string;
  onModelSelect: (model: string) => void;
}

const AI_MODELS = [
  { id: 'gpt', name: 'GPT-3.5', description: 'Fast and efficient' },
  { id: 'gpt-4', name: 'GPT-4', description: 'Most capable' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Compact power' },
  { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', description: 'Latest mini' },
  { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', description: 'Ultra-fast' },
  { id: 'gpt-4o', name: 'GPT-4o', description: 'Optimized' },
  { id: 'claude', name: 'Claude', description: 'Anthropic AI' },
  { id: 'deepseek', name: 'DeepSeek', description: 'Advanced reasoning' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  onSignOut,
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  selectedModel,
  onModelSelect,
}) => {
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const selectedModelData = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative left-0 top-0 h-full w-80 bg-gray-900 flex flex-col z-50 transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={onNewConversation}
            className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Chat
          </button>
        </div>

        {/* Model Selector */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <button
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bot size={20} />
                <div className="text-left">
                  <div className="font-semibold">{selectedModelData.name}</div>
                  <div className="text-sm text-gray-400">{selectedModelData.description}</div>
                </div>
              </div>
              <ChevronDown size={20} className={`transform transition-transform ${
                isModelDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {isModelDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 max-h-60 overflow-y-auto">
                {AI_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelSelect(model.id);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center gap-3 ${
                      selectedModel === model.id ? 'bg-blue-600' : ''
                    }`}
                  >
                    <Bot size={16} />
                    <div>
                      <div className="font-semibold text-white">{model.name}</div>
                      <div className="text-sm text-gray-400">{model.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onConversationSelect(conv.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeConversationId === conv.id
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{conv.title}</div>
                    <div className="text-sm text-gray-500 truncate">{conv.lastMessage}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* User Menu */}
        {user && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{user.name}</div>
                <div className="text-sm text-gray-400 truncate">{user.email}</div>
              </div>
              <button
                onClick={onSignOut}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-gray-900 text-white rounded-lg"
      >
        <MessageSquare size={20} />
      </button>
    </>
  );
};