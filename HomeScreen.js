import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const { isConnected, chatStats } = useChat();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [serverStatus, setServerStatus] = useState('online');
  const [onlinePlayers, setOnlinePlayers] = useState(0);
  const [serverUptime, setServerUptime] = useState('0d 0h 0m');

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

    // Simular dados do servidor
    simulateServerData();
  }, []);

  const simulateServerData = () => {
    // Simular status do servidor
    setOnlinePlayers(Math.floor(Math.random() * 1000) + 500);
    
    // Simular uptime
    const days = Math.floor(Math.random() * 30) + 1;
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    setServerUptime(`${days}d ${hours}h ${minutes}m`);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Atualizar dados do servidor
      simulateServerData();
      
      // Aguardar um pouco para mostrar o refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  };

  const QuickActionCard = ({ icon, title, subtitle, onPress, color = '#00D4FF' }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
      <LinearGradient
        colors={[`${color}20`, `${color}10`]}
        style={styles.quickActionGradient}
      >
        <Icon name={icon} size={32} color={color} />
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, icon, color = '#00D4FF' }) => (
    <View style={styles.statCard}>
      <View style={styles.statIconContainer}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor="#00D4FF"
          colors={['#00D4FF']}
        />
      }
    >
      {/* Header com informações do usuário */}
      <Animated.View
        style={[
          styles.header,
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
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Icon name="person" size={40} color="#00D4FF" />
              <View style={styles.vipBadge}>
                <Text style={styles.vipText}>VIP {user?.vipLevel || 0}</Text>
              </View>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.username}>{user?.username || 'Usuário'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'email@proedition.com'}</Text>
              <Text style={styles.lastLogin}>
                Último login: {new Date().toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Icon name="logout" size={24} color="#ff6b6b" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Status do Servidor */}
      <Animated.View
        style={[
          styles.serverStatusSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.serverStatusHeader}>
          <Text style={styles.sectionTitle}>Status do Servidor</Text>
          <View style={[styles.statusIndicator, { backgroundColor: serverStatus === 'online' ? '#4CAF50' : '#f44336' }]}>
            <Text style={styles.statusText}>{serverStatus === 'online' ? 'ONLINE' : 'OFFLINE'}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Jogadores Online"
            value={onlinePlayers.toLocaleString()}
            icon="people"
            color="#4CAF50"
          />
          <StatCard
            title="Uptime"
            value={serverUptime}
            icon="schedule"
            color="#FF9800"
          />
          <StatCard
            title="Chat Status"
            value={isConnected ? 'Conectado' : 'Desconectado'}
            icon="chat"
            color={isConnected ? '#4CAF50' : '#f44336'}
          />
          <StatCard
            title="Versão"
            value="33.1"
            icon="info"
            color="#2196F3"
          />
        </View>
      </Animated.View>

      {/* Ações Rápidas */}
      <Animated.View
        style={[
          styles.quickActionsSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        
        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            icon="games"
            title="Jogar Agora"
            subtitle="Iniciar Mu Online"
            onPress={() => Alert.alert('Jogar', 'Iniciando o jogo...')}
            color="#4CAF50"
          />
          <QuickActionCard
            icon="chat"
            title="Chat Global"
            subtitle="Conversar com jogadores"
            onPress={() => Alert.alert('Chat', 'Abrindo chat global...')}
            color="#2196F3"
          />
          <QuickActionCard
            icon="star"
            title="Sistema VIP"
            subtitle="Gerenciar benefícios"
            onPress={() => Alert.alert('VIP', 'Abrindo sistema VIP...')}
            color="#FF9800"
          />
          <QuickActionCard
            icon="shopping-cart"
            title="Cash Shop"
            subtitle="Comprar itens"
            onPress={() => Alert.alert('Shop', 'Abrindo cash shop...')}
            color="#E91E63"
          />
        </View>
      </Animated.View>

      {/* Personagens */}
      <Animated.View
        style={[
          styles.charactersSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Seus Personagens</Text>
        
        {user?.characters && user.characters.length > 0 ? (
          user.characters.map((character, index) => (
            <View key={character.id} style={styles.characterCard}>
              <View style={styles.characterInfo}>
                <Icon name="person" size={32} color="#00D4FF" />
                <View style={styles.characterDetails}>
                  <Text style={styles.characterName}>{character.name}</Text>
                  <Text style={styles.characterClass}>{character.class}</Text>
                  <Text style={styles.characterLevel}>Level {character.level}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.playCharacterButton}>
                <Text style={styles.playCharacterText}>JOGAR</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.noCharacters}>
            <Icon name="person-add" size={48} color="#666" />
            <Text style={styles.noCharactersText}>Nenhum personagem encontrado</Text>
            <Text style={styles.noCharactersSubtext}>Crie um personagem no jogo</Text>
          </View>
        )}
      </Animated.View>

      {/* Notícias e Eventos */}
      <Animated.View
        style={[
          styles.newsSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Notícias e Eventos</Text>
        
        <View style={styles.newsCard}>
          <View style={styles.newsHeader}>
            <Icon name="event" size={24} color="#FF9800" />
            <Text style={styles.newsTitle}>Evento Especial</Text>
            <Text style={styles.newsDate}>Hoje</Text>
          </View>
          <Text style={styles.newsContent}>
            Evento de PvP em massa com prêmios especiais! Participe agora e ganhe itens únicos.
          </Text>
          <TouchableOpacity style={styles.newsButton}>
            <Text style={styles.newsButtonText}>Ver Detalhes</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  vipBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  vipText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 2,
  },
  lastLogin: {
    fontSize: 12,
    color: '#888',
  },
  logoutButton: {
    padding: 8,
  },
  serverStatusSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  serverStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: '#ccc',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    marginBottom: 15,
  },
  quickActionGradient: {
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
  },
  charactersSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  characterCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  characterDetails: {
    marginLeft: 15,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  characterClass: {
    fontSize: 14,
    color: '#00D4FF',
    marginBottom: 2,
  },
  characterLevel: {
    fontSize: 12,
    color: '#ccc',
  },
  playCharacterButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  playCharacterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noCharacters: {
    alignItems: 'center',
    padding: 30,
  },
  noCharactersText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 15,
    marginBottom: 5,
  },
  noCharactersSubtext: {
    fontSize: 14,
    color: '#888',
  },
  newsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  newsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
    flex: 1,
  },
  newsDate: {
    fontSize: 12,
    color: '#888',
  },
  newsContent: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
    marginBottom: 15,
  },
  newsButton: {
    backgroundColor: '#00D4FF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  newsButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
