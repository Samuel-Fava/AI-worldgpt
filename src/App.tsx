import { useState, useEffect } from 'react';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ProfileModal } from "./components/ProfileModal";
import { aipRoute } from "../utils/apis";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  plan: 'free' | 'premium'; // 'free' or 'premium'
  createdAt: Date;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  messages: Message[];
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [isTyping, setIsTyping] = useState(false);
  const [isfreeuser, setIsfreeuser] = useState(-1);
  const premiumModels = [
    'gpt', 'gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-4.1-mini', 'gpt-4.1-nano',
    'claude', 'deepseek'
  ];
  const isPremiumModel = (model: string) => premiumModels.includes(model);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const GEMINI_FREE_LIMIT = 8;

  // Initialize with sample conversations
  useEffect(() => {
    const sampleConversations: Conversation[] = [
      {
        id: '1',
        title: 'Welcome to AI Chat',
        lastMessage: 'Hello! How can I help you today?',
        messages: [
          {
            id: '1-1',
            content: 'Hello! How can I help you today?',
            sender: 'ai',
            timestamp: new Date(Date.now() - 60000),
          },
        ],
      },
    ];
    setConversations(sampleConversations);
    setActiveConversationId('1');
  }, []);

  const fetchUser = async (token: string): Promise<User | null> => {
    try {
      const res = await aipRoute().get<{ user: any }>('/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { user } = res.data;
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        plan: user.plan, // <-- include plan
        createdAt: new Date(user.createdAt),
      };
    } catch {
      return null;
    }
  };

  const handleProfileClick = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await aipRoute().get('/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success && res.data.user) {
        setProfile(res.data.user);
        setIsProfileModalOpen(true);
      }
    } catch {
      alert('Failed to fetch profile.');
    }
  };
  // const fetchUserPlan = async (): Promise<'free' | 'premium' | null> => {
  //   const token = localStorage.getItem('token');
  //   if (!token) return null;
  //   try {
  //     const res = await aipRoute().get<{ plan: 'free' | 'premium' }>('/api/plan', {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     return res.data.plan;
  //   } catch {
  //     return null;
  //   }
  // };

  // const changeUserPlan = async (userId: string, plan: 'free' | 'premium') => {
  //   const adminToken = localStorage.getItem('adminToken'); // Make sure to store admin token securely
  //   if (!adminToken) {
  //     alert('Admin authentication required.');
  //     return null;
  //   }
  //   try {
  //     const res = await aipRoute().post(
  //       '/admin/change-plan',
  //       { userId, plan },
  //       { headers: { Authorization: `Bearer ${adminToken}` } }
  //     );
  //     if (res.data && res.data.success) {
  //       alert('User plan updated successfully.');
  //       return res.data.user; // Updated user object
  //     } else {
  //       alert('Failed to update user plan.');
  //       return null;
  //     }
  //   } catch (err) {
  //     alert('Error updating user plan.');
  //     return null;
  //   }
  // };

  const handleAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = await fetchUser(token);
      if (user) {
        setUser(user);
        setIsAuthModalOpen(false);
        return;
      }
    }
    localStorage.removeItem('geminiFreeCount');
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const user = await fetchUser(token);
        if (user) {
          setUser(user);
        }
      }
    };
    checkAuth();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirect to home page
    setUser(null);
  };

  const handleStartSubscription = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be signed in to subscribe.');
      return;
    }
    try {
      const res = await aipRoute().post(
        '/create-checkout-session',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data && res.data.url) {
        window.location.href = res.data.url; // Redirect to Stripe checkout
      } else {
        alert('Failed to start subscription.');
      }
    } catch (err) {
      alert('Error launching payment page.');
    }
  };

  const openCustomerPortal = async () => {
    try {
      const token = localStorage.getItem('authToken'); // or however you store it

      const response = await aipRoute().post(
        '/customer-portal',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const portalUrl = response.data?.url;
      if (portalUrl) {
        window.location.href = portalUrl; // redirect to Stripe portal
      } else {
        alert("No portal URL returned");
      }
    } catch (error) {
      alert("Error opening Stripe customer portal:", error);
    }
  };

  const fetchUserConversations = async (): Promise<Conversation[] | null> => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const res = await aipRoute().get<{ success: boolean; conversations: any[] }>('/api/history/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('API response:', res.data);
      if (res.data && res.data.success && Array.isArray(res.data.conversations)) {
        // Map API data to your Conversation type
        return res.data.conversations.map(conv => ({
          id: conv.id,
          title: conv.messages.length > 0 ? conv.messages[0].text.slice(0, 10) + '...' : 'New Conversation',
          lastMessage: conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].text : 'No messages yet',
          messages: conv.messages.map((msg: any) => ({
            id: msg.id,
            content: msg.text,
            sender: msg.role,
            timestamp: new Date(msg.timestamp),
          })),
        }));
      }
      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const loadConversations = async () => {
      const conversations = await fetchUserConversations();
      console.log('Fetched conversations:', conversations);
      if (conversations && conversations.length > 0) {
        setConversations(conversations);
        setActiveConversationId(conversations[0].id);
      }
    };
    if (user) {
      loadConversations();
    }
  }, [user]);

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      lastMessage: 'New conversation started',
      messages: [],
    };
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);
  };

  const handleEditConversation = (conversationId: string) => {
    // Example: prompt for new title
    const newTitle = prompt('Edit conversation title:');
    if (newTitle) {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? { ...conv, title: newTitle } : conv
        )
      );
    }
  };

  // const handleDeleteConversation = async (conversationId: string) => {
  //   const token = localStorage.getItem('token');
  //   if (!token) return;

  //   try {
  //     await aipRoute().delete(`/api/history/${conversationId}`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setConversations(prev => prev.filter(conv => conv.id !== conversationId));
  //     if (activeConversationId === conversationId) {
  //       setActiveConversationId(null);
  //     }
  //   } catch (err) {
  //     alert('Failed to delete conversation.');
  //   }
  // };


  const handleConversationSelect = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) return;
    if ( !user && isfreeuser > 0) 
      setIsfreeuser(isfreeuser-1);
    else if (!user && isfreeuser ==0 ){
      setIsAuthModalOpen(true)
    }

    if (!user) {
      // Only apply limit to Gemini model
      if (selectedModel === 'gemini') {
        const count = parseInt(localStorage.getItem('geminiFreeCount') || '0', 10);
        if (count >= GEMINI_FREE_LIMIT) {
          alert('You have reached the free Gemini message limit. Please create an account to continue.');
          setIsAuthModalOpen(true); // Open your auth modal
          return;
        }
        localStorage.setItem('geminiFreeCount', (count + 1).toString());
      }
    } 

      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date(),
      };

      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              lastMessage: content,
              title: conv.messages.length === 0 ? content.slice(0, 30) + '...' : conv.title,
            }
            : conv
        )
      );

      setIsTyping(true);

      try {
        const headers: Record<string, string> = {};
        if (isPremiumModel(selectedModel)) {
          const token = localStorage.getItem('token');
          if (token) headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await aipRoute().post('/chat', {
          message: content,
          model: selectedModel,
          sessionId: activeConversationId,
        }, { headers });

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: (res.data as { reply: string }).reply,
          sender: 'ai',
          timestamp: new Date(),
        };

        setConversations(prev =>
          prev.map(conv =>
            conv.id === activeConversationId
              ? {
                ...conv,
                messages: [...conv.messages, aiMessage],
                lastMessage: aiMessage.content,
              }
              : conv
          )
        );
      } catch (err) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Sorry, there was an error contacting the AI service.',
          sender: 'ai',
          timestamp: new Date(),
        };
        setConversations(prev =>
          prev.map(conv =>
            conv.id === activeConversationId
              ? {
                ...conv,
                messages: [...conv.messages, aiMessage],
                lastMessage: aiMessage.content,
              }
              : conv
          )
        );
      } finally {
        setIsTyping(false);
      }

  };

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  const handleGetStarted = () => {
    // setIsAuthModalOpen(true);
    setIsfreeuser(8);
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuth={handleAuth}
      />

      {!user && isfreeuser == -1 ? (
        <Dashboard onGetStarted={handleGetStarted} />
      ) : (
        <>
          <Sidebar
            user={user ? { name: `${user.firstName} ${user.lastName}`, email: user.email, plan: user.plan } : null}
            onSignOut={handleSignOut}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onConversationSelect={handleConversationSelect}
            onNewConversation={handleNewConversation}
            selectedModel={selectedModel}
            onModelSelect={setSelectedModel}
            handleStartSubscription={handleStartSubscription}
            openCustomerPortal={openCustomerPortal}
            handleEditConversation={handleEditConversation}
            onProfileClick={handleProfileClick}
          // onDeleteConversation={handleDeleteConversation}
          />

          <ChatArea
            selectedModel={selectedModel}
            messages={activeConversation?.messages || []}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />

          <ProfileModal
            open={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            profile={profile}
          />
        </>
      )}
    </div>
  );
}

export default App;