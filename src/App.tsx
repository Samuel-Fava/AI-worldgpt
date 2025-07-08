import { useState, useEffect } from 'react';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';

interface User {
  name: string;
  email: string;
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

  const handleAuth = (userData: User) => {
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const handleSignOut = () => {
    setUser(null);
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

  const handleSendMessage = (content: string) => {
    if (!activeConversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    // Update conversation with user message
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

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'm a simulated AI response using ${selectedModel}. In a real implementation, this would be connected to the actual AI service. Your message was: "${content}"`,
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
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  const handleGetStarted = () => {
    setIsAuthModalOpen(true);
    // axios.post('/signup', { "email": "user@example.com", "password": "password", "firstName": "John", "lastName": "Doe" })
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
            user={user}
            onSignOut={handleSignOut}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onConversationSelect={handleConversationSelect}
            onNewConversation={handleNewConversation}
            selectedModel={selectedModel}
            onModelSelect={setSelectedModel}
          />

          <ChatArea
            activeConversationId={activeConversationId}
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