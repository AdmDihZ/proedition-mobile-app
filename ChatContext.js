import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user, SERVER_URL } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [chatStats, setChatStats] = useState({
    totalMessages: 0,
    onlineUsers: 0,
    regions: {},
  });

  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  // Configurações do chat
  const CHAT_CONFIG = {
    maxMessageLength: 200,
    floodProtectionDelay: 3000, // 3 segundos
    reconnectDelay: 5000, // 5 segundos
    maxRetries: 5,
  };

  useEffect(() => {
    if (user && isConnected) {
      connectToChat();
    }
    
    return () => {
      disconnectFromChat();
    };
  }, [user, isConnected]);

  const connectToChat = async () => {
    try {
      setIsLoading(true);
      
      // Tentar conectar via WebSocket primeiro
      if (wsRef.current) {
        wsRef.current.close();
      }

      const wsUrl = `ws://${SERVER_URL.replace('http://', '')}/chat`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Conectado ao chat via WebSocket');
        setIsConnected(true);
        setIsLoading(false);
        
        // Enviar dados de autenticação
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'auth',
            userId: user.id,
            username: user.username,
            region: selectedRegion,
            language: selectedLanguage,
          }));
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleChatMessage(data);
        } catch (error) {
          console.error('Erro ao processar mensagem do chat:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('Conexão WebSocket fechada');
        setIsConnected(false);
        scheduleReconnect();
      };

      wsRef.current.onerror = (error) => {
        console.error('Erro WebSocket:', error);
        setIsConnected(false);
        scheduleReconnect();
      };

    } catch (error) {
      console.error('Erro ao conectar ao chat:', error);
      setIsLoading(false);
      
      // Fallback para polling HTTP
      startHttpPolling();
    }
  };

  const startHttpPolling = () => {
    console.log('Iniciando polling HTTP como fallback');
    setIsConnected(true);
    
    // Polling a cada 2 segundos
    const pollInterval = setInterval(async () => {
      if (!isConnected) {
        clearInterval(pollInterval);
        return;
      }
      
      try {
        await fetchChatMessages();
      } catch (error) {
        console.error('Erro no polling:', error);
      }
    }, 2000);
  };

  const scheduleReconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    reconnectTimeoutRef.current = setTimeout(() => {
      if (user) {
        connectToChat();
      }
    }, CHAT_CONFIG.reconnectDelay);
  };

  const disconnectFromChat = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    setIsConnected(false);
  };

  const handleChatMessage = (data) => {
    switch (data.type) {
      case 'message':
        addMessage(data.message);
        break;
      case 'stats':
        setChatStats(data.stats);
        break;
      case 'user_joined':
        addSystemMessage(`${data.username} entrou no chat`);
        break;
      case 'user_left':
        addSystemMessage(`${data.username} saiu do chat`);
        break;
      case 'error':
        Alert.alert('Erro no Chat', data.message);
        break;
      default:
        console.log('Tipo de mensagem desconhecido:', data.type);
    }
  };

  const addMessage = (message) => {
    setMessages(prev => {
      const newMessages = [...prev, message];
      
      // Manter apenas as últimas 100 mensagens
      if (newMessages.length > 100) {
        return newMessages.slice(-100);
      }
      
      return newMessages;
    });
  };

  const addSystemMessage = (text) => {
    const systemMessage = {
      id: Date.now(),
      type: 'system',
      text,
      timestamp: new Date().toISOString(),
      username: 'Sistema',
    };
    
    addMessage(systemMessage);
  };

  const sendMessage = async (text, region = selectedRegion, language = selectedLanguage) => {
    if (!text.trim() || !isConnected) {
      return { success: false, error: 'Chat não conectado' };
    }

    if (text.length > CHAT_CONFIG.maxMessageLength) {
      return { success: false, error: `Mensagem muito longa (máx: ${CHAT_CONFIG.maxMessageLength})` };
    }

    try {
      const message = {
        id: Date.now(),
        type: 'user_message',
        text: text.trim(),
        region,
        language,
        timestamp: new Date().toISOString(),
        userId: user.id,
        username: user.username,
      };

      // Enviar via WebSocket se disponível
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'message',
          message,
        }));
        
        // Adicionar mensagem localmente
        addMessage(message);
        return { success: true };
      }

      // Fallback para HTTP
      const response = await fetch(`${SERVER_URL}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        addMessage(message);
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Erro ao enviar mensagem' };
      }

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return { success: false, error: 'Erro de conexão' };
    }
  };

  const fetchChatMessages = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/chat/messages?region=${selectedRegion}&limit=50`);
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setChatStats(data.stats || chatStats);
      }
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  const changeRegion = (region) => {
    setSelectedRegion(region);
    
    if (isConnected && wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'change_region',
        region,
      }));
    }
  };

  const changeLanguage = (language) => {
    setSelectedLanguage(language);
    
    if (isConnected && wsRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'change_language',
        language,
      }));
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const value = {
    messages,
    isConnected,
    isLoading,
    selectedRegion,
    selectedLanguage,
    chatStats,
    sendMessage,
    changeRegion,
    changeLanguage,
    clearMessages,
    fetchChatMessages,
    connectToChat,
    disconnectFromChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
