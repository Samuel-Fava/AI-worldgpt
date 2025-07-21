import React from "react";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    plan: "free" | "premium";
    subscriptionEndDate?: string;
    createdAt: string;
  } | null;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose, profile }) => {
  if (!open || !profile) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-professional-lg w-full max-w-md p-8 relative animate-fade-in border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-2xl font-bold p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus-ring"
          aria-label="Close"
        >
          ×
        </button>
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-professional">
            {profile.firstName}
            {profile.lastName}
          </div>
          <div className="text-xl font-bold text-heading">
            {profile.firstName} {profile.lastName}
          </div>
          <div className="text-sm text-caption">{profile.email}</div>
        </div>
        {/* Profile details */}
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold text-body">Plan:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${profile.plan === "premium" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>
              {profile.plan === "premium" && <span className="text-yellow-500">👑</span>}
              {profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-body">Subscription End:</span>
            <span className="text-heading">
              {profile.subscriptionEndDate ? new Date(profile.subscriptionEndDate).toLocaleDateString() : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-body">Joined:</span>
            <span className="text-heading">
              {new Date(profile.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-body">User ID:</span>
            <span className="text-caption truncate max-w-[120px] text-right font-mono text-xs">{profile.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};