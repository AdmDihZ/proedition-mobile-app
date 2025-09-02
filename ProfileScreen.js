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
  Switch,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const ProfileScreen = () => {
  const { user, logout, updateUser } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  
  // Estados para edição de perfil
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPassword, setEditPassword] = useState('');
  const [editConfirmPassword, setEditConfirmPassword] = useState('');

  // Configurações
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoLogin, setAutoLogin] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

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
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleSaveProfile = () => {
    if (editPassword !== editConfirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    const updatedUser = {
      ...user,
      username: editUsername,
      email: editEmail,
    };

    if (editPassword) {
      // Aqui seria implementada a validação de senha
      updatedUser.password = editPassword;
    }

    updateUser(updatedUser);
    setShowEditProfile(false);
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
  };

  const renderEditProfileModal = () => (
    <Modal
      visible={showEditProfile}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowEditProfile(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowEditProfile(false)}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome de Usuário</Text>
              <TextInput
                style={styles.textInput}
                value={editUsername}
                onChangeText={setEditUsername}
                placeholder="Nome de usuário"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.textInput}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Email"
                placeholderTextColor="#666"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nova Senha (opcional)</Text>
              <TextInput
                style={styles.textInput}
                value={editPassword}
                onChangeText={setEditPassword}
                placeholder="Nova senha"
                placeholderTextColor="#666"
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirmar Nova Senha</Text>
              <TextInput
                style={styles.textInput}
                value={editConfirmPassword}
                onChangeText={setEditConfirmPassword}
                placeholder="Confirmar nova senha"
                placeholderTextColor="#666"
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>SALVAR ALTERAÇÕES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderSettingsModal = () => (
    <Modal
      visible={showSettings}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowSettings(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Configurações</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSettings(false)}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Icon name="notifications" size={24} color="#00D4FF" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Notificações Push</Text>
                  <Text style={styles.settingDescription}>Receber notificações do jogo</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#666', true: '#00D4FF' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Icon name="volume-up" size={24} color="#00D4FF" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Sons</Text>
                  <Text style={styles.settingDescription}>Ativar sons do app</Text>
                </View>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: '#666', true: '#00D4FF' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Icon name="login" size={24} color="#00D4FF" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Login Automático</Text>
                  <Text style={styles.settingDescription}>Manter conectado</Text>
                </View>
              </View>
              <Switch
                value={autoLogin}
                onValueChange={setAutoLogin}
                trackColor={{ false: '#666', true: '#00D4FF' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Icon name="dark-mode" size={24} color="#00D4FF" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Modo Escuro</Text>
                  <Text style={styles.settingDescription}>Tema escuro do app</Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#666', true: '#00D4FF' }}
                thumbColor="#fff"
              />
            </View>

            <TouchableOpacity
              style={styles.resetSettingsButton}
              onPress={() => {
                setNotificationsEnabled(true);
                setSoundEnabled(true);
                setAutoLogin(true);
                setDarkMode(true);
                Alert.alert('Sucesso', 'Configurações resetadas para padrão!');
              }}
            >
              <Text style={styles.resetSettingsButtonText}>Resetar Configurações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderStatisticsModal = () => (
    <Modal
      visible={showStatistics}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowStatistics(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Estatísticas</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowStatistics(false)}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.statCard}>
              <Icon name="schedule" size={32} color="#00D4FF" />
              <Text style={styles.statTitle}>Tempo de Jogo</Text>
              <Text style={styles.statValue}>127 horas</Text>
              <Text style={styles.statSubtitle}>Este mês</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="trending-up" size={32} color="#4CAF50" />
              <Text style={styles.statTitle}>Nível Máximo</Text>
              <Text style={styles.statValue}>400</Text>
              <Text style={styles.statSubtitle}>Dark Knight</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="people" size={32} color="#FF9800" />
              <Text style={styles.statTitle}>Guild</Text>
              <Text style={styles.statValue}>Proedition Elite</Text>
              <Text style={styles.statSubtitle}>Membro desde 2024</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="emoji-events" size={32} color="#E91E63" />
              <Text style={styles.statTitle}>Conquistas</Text>
              <Text style={styles.statValue}>47/100</Text>
              <Text style={styles.statSubtitle}>47% completado</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="monetization-on" size={32} color="#FFD700" />
              <Text style={styles.statTitle}>Goblin Points</Text>
              <Text style={styles.statValue}>1,500</Text>
              <Text style={styles.statSubtitle}>Saldo atual</Text>
            </View>

            <View style={styles.statCard}>
              <Icon name="star" size={32} color="#FFD700" />
              <Text style={styles.statTitle}>VIP Status</Text>
              <Text style={styles.statValue}>VIP Bronze</Text>
              <Text style={styles.statSubtitle}>Ativo por 15 dias</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderSupportModal = () => (
    <Modal
      visible={showSupport}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowSupport(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Suporte</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowSupport(false)}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <TouchableOpacity style={styles.supportOption}>
              <Icon name="chat" size={24} color="#00D4FF" />
              <View style={styles.supportText}>
                <Text style={styles.supportTitle}>Chat ao Vivo</Text>
                <Text style={styles.supportDescription}>Falar com suporte em tempo real</Text>
              </View>
              <Icon name="arrow-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.supportOption}>
              <Icon name="email" size={24} color="#00D4FF" />
              <View style={styles.supportText}>
                <Text style={styles.supportTitle}>Email</Text>
                <Text style={styles.supportDescription}>suporte@proedition.com</Text>
              </View>
              <Icon name="arrow-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.supportOption}>
              <Icon name="help" size={24} color="#00D4FF" />
              <View style={styles.supportText}>
                <Text style={styles.supportTitle}>FAQ</Text>
                <Text style={styles.supportDescription}>Perguntas frequentes</Text>
              </View>
              <Icon name="arrow-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.supportOption}>
              <Icon name="bug-report" size={24} color="#00D4FF" />
              <View style={styles.supportText}>
                <Text style={styles.supportTitle}>Reportar Bug</Text>
                <Text style={styles.supportDescription}>Reportar problemas encontrados</Text>
              </View>
              <Icon name="arrow-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.supportOption}>
              <Icon name="feedback" size={24} color="#00D4FF" />
              <View style={styles.supportText}>
                <Text style={styles.supportTitle}>Feedback</Text>
                <Text style={styles.supportDescription}>Enviar sugestões</Text>
              </View>
              <Icon name="arrow-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header do Perfil */}
        <Animated.View
          style={[
            styles.profileHeader,
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
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <Icon name="person" size={60} color="#00D4FF" />
                <View style={styles.vipBadge}>
                  <Text style={styles.vipText}>VIP {user?.vipLevel || 0}</Text>
                </View>
              </View>
              
              <View style={styles.userDetails}>
                <Text style={styles.username}>{user?.username || 'Usuário'}</Text>
                <Text style={styles.userEmail}>{user?.email || 'email@proedition.com'}</Text>
                <Text style={styles.userStatus}>Online</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Estatísticas Rápidas */}
        <Animated.View
          style={[
            styles.quickStats,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.statItem}>
            <Icon name="schedule" size={24} color="#00D4FF" />
            <Text style={styles.statValue}>127h</Text>
            <Text style={styles.statLabel}>Jogadas</Text>
          </View>
          
          <View style={styles.statItem}>
            <Icon name="trending-up" size={24} color="#4CAF50" />
            <Text style={styles.statValue}>400</Text>
            <Text style={styles.statLabel}>Nível</Text>
          </View>
          
          <View style={styles.statItem}>
            <Icon name="emoji-events" size={24} color="#FF9800" />
            <Text style={styles.statValue}>47</Text>
            <Text style={styles.statLabel}>Conquistas</Text>
          </View>
          
          <View style={styles.statItem}>
            <Icon name="monetization-on" size={24} color="#FFD700" />
            <Text style={styles.statValue}>1.5k</Text>
            <Text style={styles.statLabel}>GP</Text>
          </View>
        </Animated.View>

        {/* Ações do Perfil */}
        <Animated.View
          style={[
            styles.profileActions,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowEditProfile(true)}
          >
            <LinearGradient
              colors={['#00D4FF', '#0099CC']}
              style={styles.actionButtonGradient}
            >
              <Icon name="edit" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Editar Perfil</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowStatistics(true)}
          >
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.actionButtonGradient}
            >
              <Icon name="analytics" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Estatísticas</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowSettings(true)}
          >
            <LinearGradient
              colors={['#FF9800', '#f57c00']}
              style={styles.actionButtonGradient}
            >
              <Icon name="settings" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Configurações</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowSupport(true)}
          >
            <LinearGradient
              colors={['#2196F3', '#1976d2']}
              style={styles.actionButtonGradient}
            >
              <Icon name="support" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Suporte</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Informações da Conta */}
        <Animated.View
          style={[
            styles.accountInfo,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Informações da Conta</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Icon name="person" size={20} color="#00D4FF" />
              <Text style={styles.infoLabel}>Nome de Usuário:</Text>
              <Text style={styles.infoValue}>{user?.username || 'N/A'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="email" size={20} color="#00D4FF" />
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="star" size={20} color="#FFD700" />
              <Text style={styles.infoLabel}>VIP Level:</Text>
              <Text style={styles.infoValue}>{user?.vipLevel || 0}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="schedule" size={20} color="#00D4FF" />
              <Text style={styles.infoLabel}>Membro desde:</Text>
              <Text style={styles.infoValue}>Janeiro 2024</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="login" size={20} color="#00D4FF" />
              <Text style={styles.infoLabel}>Último login:</Text>
              <Text style={styles.infoValue}>Hoje às 14:30</Text>
            </View>
          </View>
        </Animated.View>

        {/* Botão de Logout */}
        <Animated.View
          style={[
            styles.logoutSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LinearGradient
              colors={['#f44336', '#d32f2f']}
              style={styles.logoutButtonGradient}
            >
              <Icon name="logout" size={24} color="#fff" />
              <Text style={styles.logoutButtonText}>SAIR DA CONTA</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Modais */}
      {renderEditProfileModal()}
      {renderSettingsModal()}
      {renderStatisticsModal()}
      {renderSupportModal()}
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
  profileHeader: {
    marginBottom: 20,
  },
  headerGradient: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  vipBadge: {
    position: 'absolute',
    bottom: -5,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 5,
  },
  userStatus: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  profileActions: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  actionButton: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  accountInfo: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#ccc',
    marginLeft: 15,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  logoutSection: {
    paddingHorizontal: 20,
  },
  logoutButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  logoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
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
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  saveButton: {
    backgroundColor: '#00D4FF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#ccc',
  },
  resetSettingsButton: {
    backgroundColor: '#666',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  resetSettingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00D4FF',
    marginBottom: 5,
  },
  statSubtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  supportText: {
    marginLeft: 15,
    flex: 1,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  supportDescription: {
    fontSize: 14,
    color: '#ccc',
  },
});

export default ProfileScreen;
