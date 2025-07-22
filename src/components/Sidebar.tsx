import React, { useState } from 'react';
import { Plus, MessageSquare, Settings, LogOut, ChevronDown, Bot, User, LogIn, X, PanelLeftClose, PanelLeft, Crown, Sparkles, Menu  } from 'lucide-react';
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
      {isOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative left-0 top-0 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col z-50 transform transition-all duration-300 ease-in-out shadow-professional-lg lg:shadow-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`} style={{height: '100vh'}}>
        {/* Header */}
        
        
        <div className='flex justify-between items-center bg-white dark:bg-gray-900 px-4 py-4 border-b border-gray-200 dark:border-gray-700'>
          {/* Mobile menu button */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 focus-ring"
            onClick={onClose}
            title="Close Sidebar"
          >
            <X size={20} />
          </button>

          <button
            className="hidden lg:flex w-10 h-10 items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 focus-ring"
            onClick={setSidebarstatus}
            title="Toggle Sidebar"
          >
            <PanelLeft size={20} />
          </button>

          <div className="flex items-center gap-3 flex-1 justify-center lg:justify-start lg:ml-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-heading hidden sm:block">World GPT</h1>
          </div>
        </div>

          {/* New Chat Button */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <button
              onClick={onNewConversation}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-professional font-medium focus-ring group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
              <span className="font-semibold">New Chat</span>
            </button>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="p-4 space-y-2">
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare size={32} className="mx-auto text-gray-400 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No conversations yet</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Start a new chat to begin</p>
                </div>
              ) : (
              {conversations.map((conv) => (
                <div key={conv.id} className="relative group">
                  <button
                    onClick={() => onConversationSelect(conv.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeConversationId === conv.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <MessageSquare size={16} className="mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-heading truncate text-sm leading-tight">{conv.title}</div>
                        <div className="text-xs text-caption truncate mt-1 leading-relaxed">{conv.lastMessage}</div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
              )}
            </div>
          </div>

          {/* Subscription Management */}
          {user && user.plan === 'free' && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
              <div className="space-y-3">
                <div className="text-center mb-3">
                  <Crown size={20} className="mx-auto text-yellow-500 mb-1" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Upgrade for unlimited access</p>
                </div>
                <button
                  onClick={handleStartSubscription}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 text-sm font-semibold shadow-professional flex items-center gap-2 justify-center group"
                >
                  <Crown size={16} className="group-hover:scale-110 transition-transform duration-200" />
                  <span>Upgrade to Premium</span>
                </button>
                <button
                  onClick={openCustomerPortal}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium shadow-sm"
                >
                  Manage Billing
                </button>
              </div>
            </div>
          )}

          {/* User Menu */}
          {user ? (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 shadow-professional border border-gray-200 dark:border-gray-700 hover:shadow-professional-lg transition-all duration-200">
                <div
                  className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                  onClick={onProfileClick}
                  title="View Profile"
                >
                  <User size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-heading truncate text-sm leading-tight">{user.name}</div>
                  <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${user.plan === 'premium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                    {user.plan === 'premium' && <Crown size={10} />}
                    {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-200 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-sm"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50">
              {!user && (
                <button
                  type="button"
                  onClick={onAuthModalOpen}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-professional font-semibold focus-ring group"
                >
                  <LogIn size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                  <span>Sign In</span>
                </button>
              )}
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};