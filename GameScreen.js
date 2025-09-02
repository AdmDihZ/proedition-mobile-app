import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const GameScreen = () => {
  const { user } = useAuth();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamQuality, setStreamQuality] = useState('high');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const [showStreamSettings, setShowStreamSettings] = useState(false);

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

    // Animação de pulso para o botão de jogar
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const startGame = async () => {
    if (!selectedCharacter) {
      Alert.alert('Erro', 'Selecione um personagem primeiro');
      return;
    }

    setIsConnecting(true);

    try {
      // Simular conexão com o servidor
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsStreaming(true);
      setIsConnecting(false);
      
      Alert.alert(
        'Jogo Iniciado',
        `Conectando como ${selectedCharacter.name}...`,
        [{ text: 'OK' }]
      );
      
      // Aqui seria implementado o sistema de streaming real
      // Parsec, Steam Link, ou solução customizada
      
    } catch (error) {
      setIsConnecting(false);
      Alert.alert('Erro', 'Falha ao conectar ao jogo');
    }
  };

  const stopGame = () => {
    Alert.alert(
      'Parar Jogo',
      'Tem certeza que deseja parar o jogo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Parar', style: 'destructive', onPress: () => setIsStreaming(false) },
      ]
    );
  };

  const selectCharacter = (character) => {
    setSelectedCharacter(character);
    setShowCharacterSelect(false);
  };

  const CharacterSelectModal = () => (
    <Modal
      visible={showCharacterSelect}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCharacterSelect(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Personagem</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCharacterSelect(false)}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.charactersList}>
            {user?.characters && user.characters.length > 0 ? (
              user.characters.map((character) => (
                <TouchableOpacity
                  key={character.id}
                  style={[
                    styles.characterOption,
                    selectedCharacter?.id === character.id && styles.selectedCharacter,
                  ]}
                  onPress={() => selectCharacter(character)}
                >
                  <View style={styles.characterOptionInfo}>
                    <Icon name="person" size={32} color="#00D4FF" />
                    <View style={styles.characterOptionDetails}>
                      <Text style={styles.characterOptionName}>{character.name}</Text>
                      <Text style={styles.characterOptionClass}>{character.class}</Text>
                      <Text style={styles.characterOptionLevel}>Level {character.level}</Text>
                    </View>
                  </View>
                  {selectedCharacter?.id === character.id && (
                    <Icon name="check-circle" size={24} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noCharactersModal}>
                <Icon name="person-add" size={48} color="#666" />
                <Text style={styles.noCharactersModalText}>Nenhum personagem disponível</Text>
                <Text style={styles.noCharactersModalSubtext}>Crie um personagem no jogo primeiro</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const StreamSettingsModal = () => (
    <Modal
      visible={showStreamSettings}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowStreamSettings(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Configurações de Streaming</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowStreamSettings(false)}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.settingsContent}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Qualidade do Stream</Text>
              <View style={styles.qualityOptions}>
                {['low', 'medium', 'high'].map((quality) => (
                  <TouchableOpacity
                    key={quality}
                    style={[
                      styles.qualityOption,
                      streamQuality === quality && styles.selectedQuality,
                    ]}
                    onPress={() => setStreamQuality(quality)}
                  >
                    <Text style={[
                      styles.qualityText,
                      streamQuality === quality && styles.selectedQualityText,
                    ]}>
                      {quality === 'low' ? 'Baixa' : quality === 'medium' ? 'Média' : 'Alta'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Resolução</Text>
              <Text style={styles.settingValue}>
                {streamQuality === 'low' ? '720p' : streamQuality === 'medium' ? '1080p' : '1440p'}
              </Text>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>FPS</Text>
              <Text style={styles.settingValue}>
                {streamQuality === 'low' ? '30' : streamQuality === 'medium' ? '60' : '120'}
              </Text>
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Latência Estimada</Text>
              <Text style={styles.settingValue}>
                {streamQuality === 'low' ? '15-25ms' : streamQuality === 'medium' ? '25-40ms' : '40-60ms'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveSettingsButton}
            onPress={() => setShowStreamSettings(false)}
          >
            <Text style={styles.saveSettingsButtonText}>Salvar Configurações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header do Jogo */}
        <Animated.View
          style={[
            styles.gameHeader,
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
              <View style={styles.gameInfo}>
                <Icon name="games" size={40} color="#00D4FF" />
                <View style={styles.gameDetails}>
                  <Text style={styles.gameTitle}>Mu Online</Text>
                  <Text style={styles.gameSubtitle}>Proedition Global</Text>
                  <Text style={styles.gameVersion}>v33.1</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => setShowStreamSettings(true)}
              >
                <Icon name="settings" size={24} color="#00D4FF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Status de Conexão */}
        <Animated.View
          style={[
            styles.connectionStatus,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: isStreaming ? '#4CAF50' : '#f44336' }]} />
            <Text style={styles.statusText}>
              {isStreaming ? 'Jogando' : 'Desconectado'}
            </Text>
          </View>
          
          {isStreaming && (
            <View style={styles.streamInfo}>
              <Text style={styles.streamInfoText}>Qualidade: {streamQuality}</Text>
              <Text style={styles.streamInfoText}>Ping: 25ms</Text>
            </View>
          )}
        </Animated.View>

        {/* Seleção de Personagem */}
        <Animated.View
          style={[
            styles.characterSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personagem Selecionado</Text>
            <TouchableOpacity
              style={styles.changeCharacterButton}
              onPress={() => setShowCharacterSelect(true)}
            >
              <Text style={styles.changeCharacterText}>Trocar</Text>
            </TouchableOpacity>
          </View>

          {selectedCharacter ? (
            <View style={styles.selectedCharacterCard}>
              <View style={styles.characterAvatar}>
                <Icon name="person" size={48} color="#00D4FF" />
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{selectedCharacter.level}</Text>
                </View>
              </View>
              <View style={styles.characterDetails}>
                <Text style={styles.characterName}>{selectedCharacter.name}</Text>
                <Text style={styles.characterClass}>{selectedCharacter.class}</Text>
                <Text style={styles.characterStats}>
                  HP: 100% | MP: 100% | EXP: 75%
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.selectCharacterCard}
              onPress={() => setShowCharacterSelect(true)}
            >
              <Icon name="person-add" size={48} color="#666" />
              <Text style={styles.selectCharacterText}>Selecionar Personagem</Text>
              <Text style={styles.selectCharacterSubtext}>Toque para escolher</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Controles de Jogo */}
        <Animated.View
          style={[
            styles.gameControls,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {!isStreaming ? (
            <TouchableOpacity
              style={[styles.playButton, !selectedCharacter && styles.playButtonDisabled]}
              onPress={startGame}
              disabled={!selectedCharacter || isConnecting}
            >
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                style={styles.playButtonGradient}
              >
                {isConnecting ? (
                  <View style={styles.connectingContainer}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.connectingText}>Conectando...</Text>
                  </View>
                ) : (
                  <>
                    <Icon name="play-arrow" size={32} color="#fff" />
                    <Text style={styles.playButtonText}>JOGAR AGORA</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.stopButton}
              onPress={stopGame}
            >
              <LinearGradient
                colors={['#f44336', '#d32f2f']}
                style={styles.stopButtonGradient}
              >
                <Icon name="stop" size={32} color="#fff" />
                <Text style={styles.stopButtonText}>PARAR JOGO</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Informações do Servidor */}
        <Animated.View
          style={[
            styles.serverInfo,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Informações do Servidor</Text>
          
          <View style={styles.serverInfoGrid}>
            <View style={styles.infoCard}>
              <Icon name="computer" size={24} color="#00D4FF" />
              <Text style={styles.infoTitle}>IP do Servidor</Text>
              <Text style={styles.infoValue}>206.0.29.38</Text>
            </View>
            
            <View style={styles.infoCard}>
              <Icon name="router" size={24} color="#00D4FF" />
              <Text style={styles.infoTitle}>Porta</Text>
              <Text style={styles.infoValue}>44405</Text>
            </View>
            
            <View style={styles.infoCard}>
              <Icon name="people" size={24} color="#00D4FF" />
              <Text style={styles.infoTitle}>Jogadores Online</Text>
              <Text style={styles.infoValue}>847</Text>
            </View>
            
            <View style={styles.infoCard}>
              <Icon name="schedule" size={24} color="#00D4FF" />
              <Text style={styles.infoTitle}>Uptime</Text>
              <Text style={styles.infoValue}>15d 8h 32m</Text>
            </View>
          </View>
        </Animated.View>

        {/* Dicas de Jogo */}
        <Animated.View
          style={[
            styles.gameTips,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Dicas para Melhor Performance</Text>
          
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Icon name="wifi" size={20} color="#4CAF50" />
              <Text style={styles.tipText}>Use conexão Wi-Fi estável ou cabo de rede</Text>
            </View>
            
            <View style={styles.tipItem}>
              <Icon name="settings" size={20} color="#FF9800" />
              <Text style={styles.tipText}>Ajuste a qualidade do stream conforme sua conexão</Text>
            </View>
            
            <View style={styles.tipItem}>
              <Icon name="phone-android" size={20} color="#2196F3" />
              <Text style={styles.tipText}>Mantenha o app em primeiro plano para melhor performance</Text>
            </View>
            
            <View style={styles.tipItem}>
              <Icon name="battery-charging-full" size={20} color="#4CAF50" />
              <Text style={styles.tipText}>Conecte o carregador durante o jogo</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Modais */}
      <CharacterSelectModal />
      <StreamSettingsModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  gameHeader: {
    marginBottom: 20,
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
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameDetails: {
    marginLeft: 15,
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  gameSubtitle: {
    fontSize: 16,
    color: '#00D4FF',
    marginBottom: 2,
  },
  gameVersion: {
    fontSize: 14,
    color: '#888',
  },
  settingsButton: {
    padding: 8,
  },
  connectionStatus: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  streamInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streamInfoText: {
    fontSize: 14,
    color: '#ccc',
  },
  characterSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
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
  changeCharacterButton: {
    backgroundColor: '#00D4FF',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  changeCharacterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedCharacterCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  characterAvatar: {
    position: 'relative',
    marginRight: 20,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  characterDetails: {
    flex: 1,
  },
  characterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  characterClass: {
    fontSize: 16,
    color: '#00D4FF',
    marginBottom: 5,
  },
  characterStats: {
    fontSize: 14,
    color: '#ccc',
  },
  selectCharacterCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
  },
  selectCharacterText: {
    fontSize: 18,
    color: '#ccc',
    marginTop: 15,
    marginBottom: 5,
  },
  selectCharacterSubtext: {
    fontSize: 14,
    color: '#888',
  },
  gameControls: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  playButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  playButtonDisabled: {
    opacity: 0.5,
  },
  playButtonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  connectingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  stopButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  stopButtonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  serverInfo: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  serverInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 8,
    marginBottom: 5,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  gameTips: {
    paddingHorizontal: 20,
  },
  tipsList: {
    marginTop: 15,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipText: {
    fontSize: 14,
    color: '#ccc',
    marginLeft: 15,
    flex: 1,
    lineHeight: 20,
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
  charactersList: {
    padding: 20,
  },
  characterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  selectedCharacter: {
    borderWidth: 2,
    borderColor: '#00D4FF',
  },
  characterOptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  characterOptionDetails: {
    marginLeft: 15,
  },
  characterOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  characterOptionClass: {
    fontSize: 14,
    color: '#00D4FF',
    marginBottom: 2,
  },
  characterOptionLevel: {
    fontSize: 12,
    color: '#ccc',
  },
  noCharactersModal: {
    alignItems: 'center',
    padding: 40,
  },
  noCharactersModalText: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 15,
    marginBottom: 5,
  },
  noCharactersModalSubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  settingsContent: {
    padding: 20,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  qualityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qualityOption: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedQuality: {
    backgroundColor: '#00D4FF',
  },
  qualityText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedQualityText: {
    color: '#fff',
  },
  settingValue: {
    fontSize: 16,
    color: '#00D4FF',
    fontWeight: 'bold',
  },
  saveSettingsButton: {
    backgroundColor: '#00D4FF',
    margin: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveSettingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GameScreen;
