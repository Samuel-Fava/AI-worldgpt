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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold mb-2 shadow">
            {profile.firstName}
            {profile.lastName}
          </div>
          <div className="text-xl font-semibold text-gray-900">
            {profile.firstName} {profile.lastName}
          </div>
          <div className="text-sm text-gray-500">{profile.email}</div>
        </div>
        {/* Profile details */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Plan:</span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${profile.plan === "premium" ? "bg-yellow-100 text-yellow-800" : "bg-gray-200 text-gray-700"}`}>
              {profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Subscription End:</span>
            <span className="text-gray-800">
              {profile.subscriptionEndDate ? new Date(profile.subscriptionEndDate).toLocaleDateString() : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Joined:</span>
            <span className="text-gray-800">
              {new Date(profile.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">User ID:</span>
            <span className="text-gray-400 truncate max-w-[120px] text-right">{profile.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};