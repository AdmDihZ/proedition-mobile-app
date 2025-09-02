import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Animated,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const { width, height } = Dimensions.get('window');

const ChatScreen = () => {
  const { user } = useAuth();
  const {
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
    connectToChat,
    disconnectFromChat,
  } = useChat();

  const [messageText, setMessageText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showRegions, setShowRegions] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const typingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animações de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Conectar ao chat automaticamente
    if (user && !isConnected) {
      connectToChat();
    }
  }, [user, isConnected]);

  useEffect(() => {
    // Scroll para a última mensagem
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !isConnected) {
      if (!isConnected) {
        Alert.alert('Erro', 'Chat não conectado');
      }
      return;
    }

    const result = await sendMessage(messageText);
    
    if (result.success) {
      setMessageText('');
      // Simular digitação
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
    } else {
      Alert.alert('Erro', result.error);
    }
  };

  const handleTyping = (text) => {
    setMessageText(text);
    setIsTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
  };

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.userId === user?.id;
    const isSystemMessage = item.type === 'system';

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage && styles.ownMessage,
        isSystemMessage && styles.systemMessage,
      ]}>
        {!isSystemMessage && (
          <View style={styles.messageHeader}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.timestamp}>
              {new Date(item.timestamp).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        )}
        
        <Text style={[
          styles.messageText,
          isOwnMessage && styles.ownMessageText,
          isSystemMessage && styles.systemMessageText,
        ]}>
          {item.text}
        </Text>
        
        {item.translations && Object.keys(item.translations).length > 0 && (
          <View style={styles.translationsContainer}>
            {Object.entries(item.translations).map(([lang, translation]) => (
              <View key={lang} style={styles.translationItem}>
                <Text style={styles.translationLang}>{lang.toUpperCase()}:</Text>
                <Text style={styles.translationText}>{translation}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <Animated.View
        style={[
          styles.typingIndicator,
          {
            opacity: typingAnim,
            transform: [{ translateY: typingAnim }],
          },
        ]}
      >
        <Text style={styles.typingText}>Digitando...</Text>
        <View style={styles.typingDots}>
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
        </View>
      </Animated.View>
    );
  };

  const renderChatStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Icon name="people" size={16} color="#00D4FF" />
        <Text style={styles.statText}>{chatStats.onlineUsers || 0} online</Text>
      </View>
      <View style={styles.statItem}>
        <Icon name="chat" size={16} color="#00D4FF" />
        <Text style={styles.statText}>{chatStats.totalMessages || 0} mensagens</Text>
      </View>
      <View style={styles.statItem}>
        <Icon name="public" size={16} color="#00D4FF" />
        <Text style={styles.statText}>{selectedRegion}</Text>
      </View>
    </View>
  );

  const renderRegionSelector = () => (
    <Modal
      visible={showRegions}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowRegions(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Região</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowRegions(false)}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.optionsList}>
            {['global', 'america', 'europe', 'asia', 'oceania'].map((region) => (
              <TouchableOpacity
                key={region}
                style={[
                  styles.optionItem,
                  selectedRegion === region && styles.selectedOption,
                ]}
                onPress={() => {
                  changeRegion(region);
                  setShowRegions(false);
                }}
              >
                <Text style={[
                  styles.optionText,
                  selectedRegion === region && styles.selectedOptionText,
                ]}>
                  {region === 'global' ? 'Global' : 
                   region === 'america' ? 'América' :
                   region === 'europe' ? 'Europa' :
                   region === 'asia' ? 'Ásia' : 'Oceania'}
                </Text>
                {selectedRegion === region && (
                  <Icon name="check-circle" size={24} color="#00D4FF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderLanguageSelector = () => (
    <Modal
      visible={showLanguages}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowLanguages(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Idioma</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowLanguages(false)}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.optionsList}>
            {['auto', 'eng', 'spn', 'por', 'viet', 'fr', 'de', 'it', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi'].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.optionItem,
                  selectedLanguage === lang && styles.selectedOption,
                ]}
                onPress={() => {
                  changeLanguage(lang);
                  setShowLanguages(false);
                }}
              >
                <Text style={[
                  styles.optionText,
                  selectedLanguage === lang && styles.selectedOptionText,
                ]}>
                  {lang === 'auto' ? 'Auto-detect' :
                   lang === 'eng' ? 'English' :
                   lang === 'spn' ? 'Español' :
                   lang === 'por' ? 'Português' :
                   lang === 'viet' ? 'Tiếng Việt' :
                   lang === 'fr' ? 'Français' :
                   lang === 'de' ? 'Deutsch' :
                   lang === 'it' ? 'Italiano' :
                   lang === 'ru' ? 'Русский' :
                   lang === 'zh' ? '中文' :
                   lang === 'ja' ? '日本語' :
                   lang === 'ko' ? '한국어' :
                   lang === 'ar' ? 'العربية' : 'हिन्दी'}
                </Text>
                {selectedLanguage === lang && (
                  <Icon name="check-circle" size={24} color="#00D4FF" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header do Chat */}
      <Animated.View
        style={[
          styles.chatHeader,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={['#1a1a1a', '#2d2d2d']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.chatInfo}>
              <Icon name="chat" size={32} color="#00D4FF" />
              <View style={styles.chatDetails}>
                <Text style={styles.chatTitle}>Chat Global</Text>
                <View style={styles.connectionStatus}>
                  <View style={[styles.statusDot, { backgroundColor: isConnected ? '#4CAF50' : '#f44336' }]} />
                  <Text style={styles.statusText}>
                    {isConnected ? 'Conectado' : 'Desconectado'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowRegions(true)}
              >
                <Icon name="public" size={20} color="#00D4FF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowLanguages(true)}
              >
                <Icon name="language" size={20} color="#00D4FF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowSettings(true)}
              >
                <Icon name="settings" size={20} color="#00D4FF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Estatísticas */}
      {renderChatStats()}

      {/* Lista de Mensagens */}
      <View style={styles.messagesContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00D4FF" />
            <Text style={styles.loadingText}>Conectando ao chat...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            style={styles.messagesList}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderTypingIndicator}
          />
        )}
      </View>

      {/* Input de Mensagem */}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.messageInput}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#666"
            value={messageText}
            onChangeText={handleTyping}
            multiline
            maxLength={200}
          />
          
          <View style={styles.inputActions}>
            <Text style={styles.characterCount}>
              {messageText.length}/200
            </Text>
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!messageText.trim() || !isConnected) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!messageText.trim() || !isConnected}
            >
              <Icon name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Modais */}
      {renderRegionSelector()}
      {renderLanguageSelector()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  chatHeader: {
    marginBottom: 15,
  },
  headerGradient: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatDetails: {
    marginLeft: 15,
  },
  chatTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#ccc',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#ccc',
    marginLeft: 5,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ccc',
    marginTop: 15,
  },
  messagesList: {
    flex: 1,
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 212, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  systemMessage: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
    maxWidth: '90%',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  username: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00D4FF',
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
  },
  messageText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#fff',
  },
  systemMessageText: {
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  translationsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  translationItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  translationLang: {
    fontSize: 10,
    color: '#00D4FF',
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 25,
  },
  translationText: {
    fontSize: 10,
    color: '#ccc',
    flex: 1,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  typingText: {
    fontSize: 12,
    color: '#ccc',
    marginRight: 10,
  },
  typingDots: {
    flexDirection: 'row',
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00D4FF',
    marginHorizontal: 1,
    opacity: 0.6,
  },
  inputContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  messageInput: {
    color: '#fff',
    fontSize: 16,
    minHeight: 40,
    maxHeight: 100,
    textAlignVertical: 'top',
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
  },
  sendButton: {
    backgroundColor: '#00D4FF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2d2d2d',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 5,
  },
  optionsList: {
    padding: 20,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#00D4FF',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
  selectedOptionText: {
    color: '#00D4FF',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
