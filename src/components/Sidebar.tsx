import React, { useState } from 'react';
import { Plus, MessageSquare, Settings, LogOut, ChevronDown, Bot, User, LogIn, X, PanelLeftClose, PanelLeft, Crown, Sparkles  } from 'lucide-react';
// import { HiAdjustmentsHorizontal } from 'react-icons/hi2';

interface SidebarProps {
  user: { id: string; name: string; email: string; plan: "free" | "premium"; createdAt: string; } | null;
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  onSignOut: () => void;
  conversations: Array<{ id: string; title: string; lastMessage: string }>;
  activeConversationId: string | null;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  handleStartSubscription: () => void;
  openCustomerPortal: () => void;
  onProfileClick: () => void;
  onAuthModalOpen: () => void;
  handleEditConversation: (id: string) => void;
  sidebarStatus: boolean;
  setSidebarstatus: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  isOpen,
  onClose,
  onToggle,
  onSignOut,
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  handleStartSubscription,
  openCustomerPortal,
  onProfileClick,
  onAuthModalOpen,
  handleEditConversation,
  sidebarStatus,
  setSidebarstatus,
}) => {
  const [input, setInput] = useState('');


  return (
    <div>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative left-0 top-0 w-80 bg-white dark:bg-gray-900 flex flex-col z-50 transform transition-transform duration-300 shadow-professional-lg border-r border-gray-200 dark:border-gray-700
        }`} style={{height: '100vh'}}>
        {/* Header */}
        
        
        <div className='flex justify-between bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4'>
          <button
            className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 focus-ring"
            onClick={setSidebarstatus}
            title="Toggle Sidebar"
          >
            <PanelLeft size={24} />
          </button>

          <div className="flex items-center gap-3 flex-1 justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-heading">World GPT</h1>
          </div>
        </div>
        {/* <div className={`fixed lg:relative left-0 top-0 h-full w-80 bg-gray-200 dark:bg-gray-900 flex flex-col z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0' */}
          {/* }`}> */}
          {/* Header */}
          {/* <div className="p-4 border-b border-gray-700 flex items-center justify-between text-white">
            <h2 className="text-lg font-semibold">World GPT</h2>
            <div className="flex items-center gap-2">
              {/* Toggle button - always visible *
              <button
                onClick={setSidebarstatus}
                className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                title={isOpen ? "Hide sidebar" : "Show sidebar"}
                aria-label={isOpen ? "Hide sidebar" : "Show sidebar"}
              >
                <PanelLeftClose size={18} />
              </button>
              {/* Close button for mobile only *
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </div>
          </div> */}

          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={onNewConversation}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-professional font-medium focus-ring"
            >
              <Plus size={20} />
              New Chat
            </button>
          </div>

          {/* Conversations */}
          <div className="p-4 overflow-y-auto flex-1 scrollbar-thin">
            <div className="space-y-1">
              {conversations.map((conv) => (
                <div key={conv.id} className="relative group">
                  <button
                    onClick={() => onConversationSelect(conv.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeConversationId === conv.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-3 border-blue-600'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MessageSquare size={18} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-heading truncate text-sm">{conv.title}</div>
                        <div className="text-xs text-caption truncate mt-1">{conv.lastMessage}</div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Management */}
          {user && user.plan === 'free' && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <button
                  onClick={handleStartSubscription}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2.5 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 text-sm font-medium shadow-professional flex items-center gap-2 justify-center"
                >
                  <Crown size={16} />
                  Upgrade to Premium
                </button>
                <button
                  onClick={openCustomerPortal}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 text-sm font-medium"
                >
                  Manage Billing
                </button>
              </div>
            </div>
          )}

          {/* User Menu */}
          {user ? (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 shadow-professional border border-gray-200 dark:border-gray-700">
                <div
                  className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center cursor-pointer shadow-sm"
                  onClick={onProfileClick}
                  title="View Profile"
                >
                  <User size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-heading truncate text-sm">{user.name}</div>
                  {/* <div className="text-sm text-gray-400 truncate">{user.email}</div> */}
                  <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${user.plan === 'premium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                    {user.plan === 'premium' && <Crown size={10} />}
                    {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {!user && (
                <button
                  type="button"
                  onClick={onAuthModalOpen}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-professional font-medium focus-ring"
                >
                  <LogIn size={16} />
                  Login
                </button>
              )}
              
            </div>
          )}
        </div>
      </div>
    // </div>
  );
};