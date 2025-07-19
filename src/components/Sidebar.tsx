import React, { useState } from 'react';
import { Plus, MessageSquare, Settings, LogOut, ChevronDown, Bot, User, LogIn, X, PanelLeftClose, PanelLeft  } from 'lucide-react';
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
      <div className={`fixed lg:relative left-0 top-0 w-80 bg-gray-200 flex flex-col z-50 transform transition-transform duration-300 dark:bg-gray-900
        }`} style={{height: '100vh'}}>
        {/* Header */}
        
        
        <div className='flex justify-between bg-gray-200 dark:bg-gray-900 border-b dark:border-gray-200 px-2 py-2'>
          <button
            className="w-10 h-10 flex items-center justify-center ml-2 mt-2 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors bg-gray-200 dark:bg-gray-900"
            onClick={setSidebarstatus}
            title="Toggle Sidebar"
          >
            <PanelLeft size={24} />
          </button>

          <div className="p-4 w-full dark:border-gray-700 text-center text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-900">
            World GPT
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

          <div className="p-4 border-b border-gray-700">
            <button
              onClick={onNewConversation}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              New Chat
            </button>
          </div>

          {/* Conversations */}
          <div className="p-4 overflow-y-auto flex-1">
            <div className="space-y-2 border border-gray-700 rounded-lg">
              {conversations.map((conv) => (
                <div key={conv.id} className="relative group">
                  <button
                    onClick={() => onConversationSelect(conv.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeConversationId === conv.id
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare size={18} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white truncate">{conv.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{conv.lastMessage}</div>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Management */}
          {user && user.plan === 'free' && (
            <div className="p-4 border-t border-gray-700">
              <div className="space-y-2">
                <button
                  onClick={handleStartSubscription}
                  className="w-full bg-blue-600 text-white  px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition text-sm"
                >
                  Upgrade to Premium
                </button>
                <button
                  onClick={openCustomerPortal}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
                >
                  Manage Billing
                </button>
              </div>
            </div>
          )}

          {/* User Menu */}
          {user ? (
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer"
                  onClick={onProfileClick}
                  title="View Profile"
                >
                  <User size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate">{user.name}</div>
                  {/* <div className="text-sm text-gray-400 truncate">{user.email}</div> */}
                  <div className={`text-xs px-1 py-1 rounded-full ${user.plan === 'premium'
                      ? 'bg-yellow-600 text-yellow-100'
                      : 'bg-gray-600 text-gray-300'
                    }`}>
                    {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                  </div>
                </div>
                <button
                  onClick={onSignOut}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-10 rounded-lg bg-gray-800">
              {!user && (
                <button
                  type="button"
                  onClick={onAuthModalOpen}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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