import { useState, useEffect } from 'react';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
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
  const premiumModels = [
    'gpt', 'gpt-4', 'gpt-4o', 'gpt-4o-mini', 'gpt-4.1-mini', 'gpt-4.1-nano',
    'claude', 'deepseek'
  ];
  const isPremiumModel = (model: string) => premiumModels.includes(model);

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
            createdAt: new Date(user.createdAt),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            plan: user.plan, // <-- include plan
      };
    } catch {
          return null;
      }
  };

  const handleAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = await fetchUser(token);
      if(user) {
        setUser(user);
        setIsAuthModalOpen(false);
        return;
      }
    }
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

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const handleSendMessage = async (content: string) => {
  if (!activeConversationId) return;

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
    setIsAuthModalOpen(true);
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuth={handleAuth}
      />

      {!user ? (
        <Dashboard onGetStarted={handleGetStarted} />
      ) : (
        <>
          <Sidebar
            user={user ? { name: `${user.firstName} ${user.lastName}`, email: user.email } : null}
            onSignOut={handleSignOut}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onConversationSelect={handleConversationSelect}
            onNewConversation={handleNewConversation}
            selectedModel={selectedModel}
            onModelSelect={setSelectedModel}
          />

          <ChatArea
            selectedModel={selectedModel}
            messages={activeConversation?.messages || []}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        </>
      )}
    </div>
  );
}

export default App;