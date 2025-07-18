import { useState, useEffect } from 'react';
import { LogIn, LucideRockingChair } from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { ProfileModal } from "./components/ProfileModal";
import { aipRoute } from "../utils/apis";
import axios from 'axios';

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
  model?: string;
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
  const [selectedModel, setSelectedModel] = useState('gpt');
  const [isTyping, setIsTyping] = useState(false);
  const [freeMessageCount, setFreeMessageCount] = useState(0);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [userPlan, setUserPlan] = useState<'free' | 'premium'>('free');

  // Define free and premium models
  const freeModels = ['gpt', 'gemini'];
  const premiumModels = ['gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-4.1-mini', 'gpt-4.1-nano', 'claude', 'deepseek'];
  const isPremiumModel = (model: string) => premiumModels.includes(model);
  const isFreeModel = (model: string) => freeModels.includes(model);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState<User | null>(null);
  const FREE_MESSAGE_LIMIT = 8;
  const [subscriptionEndDate, setSubscriptionEndDate] = useState<string | null>(null);

  // Initialize with sample conversations or load from localStorage for guests
  useEffect(() => {
    // Initialize free message count from localStorage
    const savedCount = localStorage.getItem('freeMessageCount');
    if (savedCount) {
      setFreeMessageCount(parseInt(savedCount, 10));
    }

    // If user is not signed in, load conversations and style from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      const savedConvs = localStorage.getItem('guestConversations');
      const savedStyle = localStorage.getItem('guestChatStyle');
      if (savedConvs) {
        try {
          const parsed = JSON.parse(savedConvs);
          // Convert timestamps back to Date objects
          parsed.forEach((conv: any) => {
            conv.messages.forEach((msg: any) => {
              msg.timestamp = new Date(msg.timestamp);
            });
          });
          setConversations(parsed);
          if (parsed.length > 0) setActiveConversationId(parsed[0].id);
        } catch {
          // fallback to sample
          setConversations([{
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
          }]);
          setActiveConversationId('1');
        }
      } else {
        setConversations([{
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
        }]);
        setActiveConversationId('1');
      }
      // Restore guest chat style/theme if present
      if (savedStyle) {
        document.body.setAttribute('data-chat-style', savedStyle);
      }
    } else {
      // If signed in, fallback to sample until backend loads
      setConversations([{
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
      }]);
      setActiveConversationId('1');
    }
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

  const fetchUserPlan = async (token: string) => {
    try {
      const res = await aipRoute().get<{ plan: 'free' | 'premium' }>('/api/plan', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPlan(res.data.plan);
    } catch {
      setUserPlan('free');
    }
  };

  const handleAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      // On sign-in, migrate guest conversations and style to backend if they exist
      const guestConvs = localStorage.getItem('guestConversations');
      const guestStyle = localStorage.getItem('guestChatStyle');
      if (guestConvs) {
        try {
          const parsed = JSON.parse(guestConvs);
          // For each guest conversation, send to backend
          for (const conv of parsed) {
            // Only migrate if there are messages
            if (conv.messages && conv.messages.length > 0) {
              await aipRoute().post('/api/history/import', {
                id: conv.id,
                title: conv.title,
                lastMessage: conv.lastMessage,
                messages: conv.messages.map((msg: any) => ({
                  id: msg.id,
                  content: msg.content,
                  sender: msg.sender,
                  timestamp: msg.timestamp,
                })),
                // Optionally migrate style/theme if present
                style: guestStyle || undefined,
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });
            }
          }
        } catch (e) {
          // ignore migration errors
        }
        // Clear guest conversations and style after migration
        localStorage.removeItem('guestConversations');
        localStorage.removeItem('guestChatStyle');
      }
      const user = await fetchUser(token);
      if (user) {
        setUser(user);
        await fetchUserPlan(token);
        const endDate = await fetchSubscriptionEndDate();
        setSubscriptionEndDate(endDate);
        setIsAuthModalOpen(false);
        setIsFirstTime(false);
        // Restore style/theme from backend if available (optional, backend must support)
        // If not, fallback to default or previously set style
        return;
      }
    }
    setIsFirstTime(false);
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
    // Clear guest conversations on signout
    localStorage.removeItem('guestConversations');
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
    } catch (err: any) {
      console.error(err);
      // Show subscription prompt if model is for premium users only
      if (
        err?.response?.data?.error === "Ce modèle est réservé aux abonnés Premium." ||
        err?.message?.includes("Ce modèle est réservé aux abonnés Premium.")
      ) {
        handleStartSubscription(); // Or set a modal state to show your subscription modal
        return;
      }
      if (
        err?.response?.data?.error === "Connexion requise pour ce modèle." ||
        err?.message?.includes("Connexion requise pour ce modèle.")
      ) {
        setIsAuthModalOpen(true);
        return;
      }
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

  const fetchSubscriptionEndDate = async (): Promise<string | null> => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const res = await aipRoute().get<{ subscriptionEndDate: string | null }>('/api/subscription', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.subscriptionEndDate;
    } catch {
      return null;
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

      if (res.data.success && Array.isArray(res.data.conversations)) {
        console.log("Loaded conversations:", res.data.conversations);

        const sessionMap: Record<string, { id: string; title: string; messages: Message[] }> = {};
        res.data.conversations.forEach((conversation: any) => {
          const sessionId = conversation.sessionId || 'unknown-session';
          if (!sessionMap[sessionId]) {
            sessionMap[sessionId] = {
              id: sessionId,
              title: conversation.sessionTitle || `Chat ${Object.keys(sessionMap).length + 1}`,
              messages: []
            };
          }
          // Flatten conversation.messages [{role, text}] into session messages
          if (Array.isArray(conversation.messages)) {
            conversation.messages.forEach((msg: any, idx: number) => {
              sessionMap[sessionId].messages.push({
                id: `${conversation.id || sessionId}-${idx}`,
                content: msg.text,
                sender: msg.role === 'ai' ? 'ai' : msg.role,
                timestamp: conversation.createdAt ? new Date(conversation.createdAt) : new Date(),
                model: msg.role === 'ai' ? conversation.model : undefined
              });
            });
            // Sort messages by timestamp ascending
            sessionMap[sessionId].messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          }
        });
        const loadedSessions = Object.values(sessionMap);
        return loadedSessions;
      }

      return null;
    } catch (error) {
      console.error('Error fetching conversations:', error);
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
      } else {
        setConversations([]);
        setActiveConversationId(null);
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
    setConversations(prev => {
      const updated = [newConversation, ...prev];
      // Save to localStorage for guests
      if (!user) {
        localStorage.setItem('guestConversations', JSON.stringify(updated));
      }
      return updated;
    });
    setActiveConversationId(newConversation.id);
  };

  const handleEditConversation = (conversationId: string) => {
    // Example: prompt for new title
    const newTitle = prompt('Edit conversation title:');
    if (newTitle) {
      setConversations(prev => {
        const updated = prev.map(conv =>
          conv.id === conversationId ? { ...conv, title: newTitle } : conv
        );
        if (!user) {
          localStorage.setItem('guestConversations', JSON.stringify(updated));
        }
        return updated;
      });
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) return;

    //  Prevent non-logged users from using premium models
    if (!user && isPremiumModel(selectedModel)) {
      setIsAuthModalOpen(true);
      return;
    }

    // Enforce free-message limit for guest users
    if (!user) {
      if (freeMessageCount >= FREE_MESSAGE_LIMIT) {
        setIsAuthModalOpen(true);
        return;
      }
      const newCount = freeMessageCount + 1;
      setFreeMessageCount(newCount);
      localStorage.setItem('freeMessageCount', newCount.toString());
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
            title:
              conv.messages.length === 0
                ? content.slice(0, 30) + '...'
                : conv.title,
          }
          : conv
      )
    );
    if (!user) {
      localStorage.setItem(
        'guestConversations',
        JSON.stringify(conversations)
      );
    }

    setIsTyping(true);

    try {
      let res;

      if (user) {
        const token = localStorage.getItem('token');
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined;

        res = await aipRoute().post(
          '/chat',
          {
            message: content,
            model: selectedModel,
            sessionId: activeConversationId,
          },
          config
        );
      } else {
        // // Isolated Axios for guests
        // const guestAxios = axios.create({
        //   baseURL: 'https://worldgpt.up.railway.app',
        //   headers: { 'Content-Type': 'application/json' },
        //   withCredentials: false,
        // });
        res = await aipRoute().post('/chat', {
          message: content,
          model: selectedModel
        });
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: (res.data as { reply: string }).reply,
        sender: 'ai',
        timestamp: new Date(),
        model: selectedModel,
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
      if (!user) {
        localStorage.setItem(
          'guestConversations',
          JSON.stringify(conversations)
        );
      }
    } catch (err: any) {
      console.error(err);
      console.log('Error response:', err?.response?.data);

      if (
        err?.response?.data?.error ===
        'Connexion requise pour ce modèle.' ||
        err?.message?.includes(
          'Connexion requise pour ce modèle.'
        )
      ) {
        setIsAuthModalOpen(true);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          'Sorry, there was an error contacting the AI service.',
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
      if (!user) {
        localStorage.setItem(
          'guestConversations',
          JSON.stringify(conversations)
        );
      }
    } finally {
      setIsTyping(false);
    }
  };


  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  return (
    <div className="h-screen bg-gray-100 flex">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuth={handleAuth}
      />

      {isFirstTime ? (
        <Dashboard onGetStarted={() => setIsFirstTime(false)} />
      ) : (
        <>
          <Sidebar
            user={user ? {
              id: user.id,
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              plan: user.plan,
              createdAt: user.createdAt.toISOString()
            } : null}
            onSignOut={handleSignOut}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onConversationSelect={handleConversationSelect}
            onNewConversation={handleNewConversation}
            handleStartSubscription={handleStartSubscription}
            openCustomerPortal={openCustomerPortal}
            handleEditConversation={handleEditConversation}
            onProfileClick={handleProfileClick}
            onAuthModalOpen={() => setIsAuthModalOpen(true)}
          // onDeleteConversation={handleDeleteConversation}
          />

          {/* Login button below sidebar for non-logged users */}
          {!user && (
            <div className="fixed left-0 bottom-0 w-80 bg-gray-900 z-40">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full text-white py-4 px-6 hover:bg-gray-800 transition-colors flex items-center gap-3 text-left border-t border-gray-700"
              >
                <LogIn size={20} />
                <span className="font-medium">Login</span>
              </button>
            </div>
          )}
          {isAuthModalOpen ? <></> :
            <ChatArea
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
              user={user}
              freeMessageCount={freeMessageCount}
              freeMessageLimit={FREE_MESSAGE_LIMIT}
              onAuthModalOpen={() => setIsAuthModalOpen(true)}
              messages={activeConversation?.messages || []}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
            />
          }

          <ProfileModal
            open={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            profile={profile}
            subscriptionEndDate={subscriptionEndDate}
            onStartSubscription={handleStartSubscription}
          />
        </>
      )}
    </div>
  );
}

export default App;