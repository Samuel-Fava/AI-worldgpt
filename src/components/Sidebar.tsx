import React, { useState } from 'react';
import { Plus, MessageSquare, Settings, LogOut, ChevronDown, Bot, User, LogIn } from 'lucide-react';

interface SidebarProps {
  user: { id: string; name: string; email: string; plan: "free" | "premium"; createdAt: string; } | null;
  onSignOut: () => void;
  conversations: Array<{ id: string; title: string; lastMessage: string }>;
  activeConversationId: string | null;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  handleStartSubscription: () => void;
  openCustomerPortal: () => void;
  onProfileClick: () => void;
<<<<<<< HEAD
  onAuthModalOpen: () => void;
  handleEditConversation: (id: string) => void;
  freeMessageCount: number;
  freeMessageLimit: number;
=======
  handleEditConversation: (id: string) => void;
>>>>>>> 45f3f09b57dd7d6b2bddd7bd534a864937a77ea8
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  onSignOut,
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  handleStartSubscription,
  openCustomerPortal,
  onProfileClick,
<<<<<<< HEAD
  onAuthModalOpen,
  freeMessageLimit,
  freeMessageCount,
=======
>>>>>>> 45f3f09b57dd7d6b2bddd7bd534a864937a77ea8
  handleEditConversation,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [input, setInput] = useState('');
  const remainingFreeMessages = user ? Infinity : Math.max(0, freeMessageLimit - freeMessageCount);

<<<<<<< HEAD

=======
>>>>>>> 45f3f09b57dd7d6b2bddd7bd534a864937a77ea8
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
      <div className={`fixed lg:relative left-0 top-0 h-full w-80 bg-gray-900 flex flex-col z-50 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
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

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {conversations.map((conv) => (
              <div key={conv.id} className="relative group">
                <button
                  onClick={() => onConversationSelect(conv.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeConversationId === conv.id
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
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
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
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800">
              <div
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer"
                onClick={onProfileClick}
                title="View Profile"
              >
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{user.name}</div>
                <div className="text-sm text-gray-400 truncate">{user.email}</div>
<<<<<<< HEAD
                <div className={`text-xs px-2 py-1 rounded-full ${user.plan === 'premium'
                    ? 'bg-yellow-600 text-yellow-100'
                    : 'bg-gray-600 text-gray-300'
                  }`}>
=======
                <div className={`text-xs px-2 py-1 rounded-full ${
                  user.plan === 'premium' 
                    ? 'bg-yellow-600 text-yellow-100' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
>>>>>>> 45f3f09b57dd7d6b2bddd7bd534a864937a77ea8
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