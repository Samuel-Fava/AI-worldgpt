import React from 'react';
import { Menu, X, User, Crown, LogIn, Sun, Moon, Settings, Search, Plus, Sidebar } from 'lucide-react';

interface HeaderProps {
  user: {
    id: string;
    name: string;
    email: string;
    plan: 'free' | 'premium';
    createdAt: string;
  } | null;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onProfileClick: () => void;
  onAuthModalOpen: () => void;
  onSignOut: () => void;
  messageCount: number;
  freeMessageCount: number;
  freeMessageLimit: number;
  onNewChat?: () => void;
  onSearch?: () => void;
  onSettings?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  isSidebarOpen,
  onToggleSidebar,
  onProfileClick,
  onAuthModalOpen,
  onSignOut,
  messageCount,
  freeMessageCount,
  freeMessageLimit,
  onNewChat,
  onSearch,
  onSettings,
  isDarkMode = false,
  onToggleTheme,
}) => {
  const remainingFreeMessages = user ? Infinity : Math.max(0, freeMessageLimit - freeMessageCount);

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 relative z-30">
      {/* Left side - Toggle button and title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors group relative"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          {isSidebarOpen ? (
            <X size={18} className="text-gray-600 group-hover:text-gray-800 transition-colors" />
          ) : (
            <Menu size={18} className="text-gray-600 group-hover:text-gray-800 transition-colors" />
          )}
        </button>
        
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-900">AI Chat</h1>
          
          {/* New Chat Button */}
          {onNewChat && (
            <button
              onClick={onNewChat}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="New Chat"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Center - Search or other functionality */}
      <div className="flex-1 max-w-md mx-4">
        {onSearch && (
          <button
            onClick={onSearch}
            className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
          >
            <Search size={16} className="text-gray-400" />
            <span className="text-sm text-gray-500">Search conversations...</span>
          </button>
        )}
      </div>

      {/* Right side - Functional buttons and profile */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun size={16} className="text-gray-600" />
            ) : (
              <Moon size={16} className="text-gray-600" />
            )}
          </button>
        )}

        {/* Settings */}
        {onSettings && (
          <button
            onClick={onSettings}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings size={16} className="text-gray-600" />
          </button>
        )}

        {/* Message count info - moved to right side */}
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 px-2">
          <span>{messageCount} msgs</span>
          {!user && remainingFreeMessages <= 5 && (
            <>
              <span>•</span>
              <span className={remainingFreeMessages <= 2 ? 'text-amber-600 font-medium' : ''}>
                {remainingFreeMessages} free
              </span>
            </>
          )}
        </div>

        {/* Profile section */}
        {user ? (
          <div className="flex items-center gap-2">
            {/* Plan badge */}
            <div className={`hidden lg:flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              user.plan === 'premium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {user.plan === 'premium' && <Crown size={10} />}
              {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
            </div>

            {/* Profile button */}
            <button
              onClick={onProfileClick}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Profile"
            >
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <span className="hidden xl:block text-sm font-medium text-gray-700 max-w-24 truncate">
                {user.name}
              </span>
            </button>
          </div>
        ) : (
          <button
            onClick={onAuthModalOpen}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <LogIn size={14} />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};