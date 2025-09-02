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
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const VIPScreen = () => {
  const { user } = useAuth();
  const [selectedVIPLevel, setSelectedVIPLevel] = useState(null);
  const [showVIPDetails, setShowVIPDetails] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseDuration, setPurchaseDuration] = useState('30');

  // Animações
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const vipLevels = [
    {
      id: 1,
      name: 'VIP Bronze',
      color: '#CD7F32',
      price: 9.99,
      benefits: [
        'EXP +20%',
        'Drop +15%',
        'Zen +25%',
        'Respawn -30%',
        'Chat Global',
        'Suporte Prioritário',
      ],
      icon: 'star',
    },
    {
      id: 2,
      name: 'VIP Prata',
      color: '#C0C0C0',
      price: 19.99,
      benefits: [
        'EXP +35%',
        'Drop +25%',
        'Zen +40%',
        'Respawn -50%',
        'Chat Global + Regional',
        'Suporte VIP',
        'Itens Exclusivos',
        'Eventos Especiais',
      ],
      icon: 'star',
    },
    {
      id: 3,
      name: 'VIP Ouro',
      color: '#FFD700',
      price: 39.99,
      benefits: [
        'EXP +50%',
        'Drop +40%',
        'Zen +60%',
        'Respawn -70%',
        'Chat Global + Regional + Privado',
        'Suporte VIP 24/7',
        'Itens Exclusivos + Raros',
        'Eventos Exclusivos',
        'Reset +1 por dia',
        'Teleporte Ilimitado',
      ],
      icon: 'star',
    },
    {
      id: 4,
      name: 'VIP Diamante',
      color: '#B9F2FF',
      price: 79.99,
      benefits: [
        'EXP +75%',
        'Drop +60%',
        'Zen +100%',
        'Respawn -90%',
        'Chat Totalmente Ilimitado',
        'Suporte VIP 24/7 + WhatsApp',
        'Itens Exclusivos + Raros + Únicos',
        'Eventos Exclusivos + Personalizados',
        'Reset +2 por dia',
        'Teleporte Ilimitado + Especial',
        'Guild Master',
        'Acesso Beta',
      ],
      icon: 'diamond',
    },
  ];

  const currentVIP = vipLevels.find(level => level.id === user?.vipLevel) || null;

  const handleVIPPurchase = (vipLevel) => {
    setSelectedVIPLevel(vipLevel);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (!selectedVIPLevel) return;

    Alert.alert(
      'Confirmar Compra',
      `Deseja comprar ${selectedVIPLevel.name} por ${purchaseDuration} dias?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Comprar', 
          onPress: () => {
            // Aqui seria implementada a lógica de compra real
            Alert.alert(
              'Compra Realizada!',
              `Parabéns! Você agora é ${selectedVIPLevel.name}!`,
              [{ text: 'OK' }]
            );
            setShowPurchaseModal(false);
          }
        },
      ]
    );
  };

  const renderVIPCard = ({ item }) => {
    const isCurrentVIP = currentVIP?.id === item.id;
    const isHigherLevel = currentVIP && currentVIP.id > item.id;

    return (
      <TouchableOpacity
        style={[
          styles.vipCard,
          isCurrentVIP && styles.currentVIPCard,
          isHigherLevel && styles.higherLevelCard,
        ]}
        onPress={() => setShowVIPDetails(true)}
      >
        <LinearGradient
          colors={[`${item.color}20`, `${item.color}10`]}
          style={styles.vipCardGradient}
        >
          <View style={styles.vipCardHeader}>
            <View style={styles.vipIconContainer}>
              <Icon name={item.icon} size={32} color={item.color} />
              {isCurrentVIP && (
                <View style={styles.currentVIPBadge}>
                  <Text style={styles.currentVIPText}>ATUAL</Text>
                </View>
              )}
            </View>
            
            <View style={styles.vipCardInfo}>
              <Text style={[styles.vipName, { color: item.color }]}>
                {item.name}
              </Text>
              <Text style={styles.vipPrice}>
                R$ {item.price.toFixed(2)}/mês
              </Text>
            </View>
          </View>

          <View style={styles.vipBenefits}>
            {item.benefits.slice(0, 3).map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Icon name="check" size={16} color={item.color} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
            {item.benefits.length > 3 && (
              <Text style={styles.moreBenefits}>
                +{item.benefits.length - 3} benefícios
              </Text>
            )}
          </View>

          {!isCurrentVIP && !isHigherLevel && (
            <TouchableOpacity
              style={[styles.purchaseButton, { backgroundColor: item.color }]}
              onPress={() => handleVIPPurchase(item)}
            >
              <Text style={styles.purchaseButtonText}>COMPRAR</Text>
            </TouchableOpacity>
          )}

          {isCurrentVIP && (
            <View style={styles.currentVIPStatus}>
              <Icon name="check-circle" size={20} color={item.color} />
              <Text style={[styles.currentVIPStatusText, { color: item.color }]}>
                VIP Ativo
              </Text>
            </View>
          )}

          {isHigherLevel && (
            <View style={styles.higherLevelStatus}>
              <Icon name="arrow-upward" size={20} color="#666" />
              <Text style={styles.higherLevelStatusText}>
                Nível Superior
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderVIPDetailsModal = () => (
    <Modal
      visible={showVIPDetails}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowVIPDetails(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes do VIP</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowVIPDetails(false)}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {vipLevels.map((level) => (
              <View key={level.id} style={styles.detailVIPCard}>
                <View style={styles.detailVIPHeader}>
                  <Icon name={level.icon} size={24} color={level.color} />
                  <Text style={[styles.detailVIPName, { color: level.color }]}>
                    {level.name}
                  </Text>
                  <Text style={styles.detailVIPPrice}>
                    R$ {level.price.toFixed(2)}/mês
                  </Text>
                </View>

                <View style={styles.detailBenefits}>
                  {level.benefits.map((benefit, index) => (
                    <View key={index} style={styles.detailBenefitItem}>
                      <Icon name="check" size={16} color={level.color} />
                      <Text style={styles.detailBenefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderPurchaseModal = () => (
    <Modal
      visible={showPurchaseModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowPurchaseModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Comprar VIP</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPurchaseModal(false)}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.purchaseContent}>
            {selectedVIPLevel && (
              <>
                <View style={styles.purchaseVIPInfo}>
                  <Icon name={selectedVIPLevel.icon} size={48} color={selectedVIPLevel.color} />
                  <Text style={[styles.purchaseVIPName, { color: selectedVIPLevel.color }]}>
                    {selectedVIPLevel.name}
                  </Text>
                  <Text style={styles.purchaseVIPPrice}>
                    R$ {selectedVIPLevel.price.toFixed(2)}/mês
                  </Text>
                </View>

                <View style={styles.durationSelector}>
                  <Text style={styles.durationLabel}>Duração:</Text>
                  <View style={styles.durationOptions}>
                    {['7', '30', '90', '365'].map((days) => (
                      <TouchableOpacity
                        key={days}
                        style={[
                          styles.durationOption,
                          purchaseDuration === days && styles.selectedDuration,
                        ]}
                        onPress={() => setPurchaseDuration(days)}
                      >
                        <Text style={[
                          styles.durationText,
                          purchaseDuration === days && styles.selectedDurationText,
                        ]}>
                          {days} dias
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.totalPrice}>
                  <Text style={styles.totalPriceLabel}>Preço Total:</Text>
                  <Text style={styles.totalPriceValue}>
                    R$ {(selectedVIPLevel.price * (parseInt(purchaseDuration) / 30)).toFixed(2)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.confirmPurchaseButton, { backgroundColor: selectedVIPLevel.color }]}
                  onPress={confirmPurchase}
                >
                  <Text style={styles.confirmPurchaseButtonText}>
                    CONFIRMAR COMPRA
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header VIP */}
        <Animated.View
          style={[
            styles.vipHeader,
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
              <View style={styles.vipInfo}>
                <Icon name="star" size={40} color="#FFD700" />
                <View style={styles.vipDetails}>
                  <Text style={styles.vipTitle}>Sistema VIP</Text>
                  <Text style={styles.vipSubtitle}>
                    {currentVIP ? `VIP ${currentVIP.name} Ativo` : 'Nenhum VIP Ativo'}
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.infoButton}
                onPress={() => setShowVIPDetails(true)}
              >
                <Icon name="info" size={24} color="#00D4FF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Status VIP Atual */}
        {currentVIP && (
          <Animated.View
            style={[
              styles.currentVIPStatus,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.currentVIPCard}>
              <LinearGradient
                colors={[`${currentVIP.color}20`, `${currentVIP.color}10`]}
                style={styles.currentVIPGradient}
              >
                <View style={styles.currentVIPContent}>
                  <Icon name={currentVIP.icon} size={48} color={currentVIP.color} />
                  <View style={styles.currentVIPInfo}>
                    <Text style={[styles.currentVIPName, { color: currentVIP.color }]}>
                      {currentVIP.name}
                    </Text>
                    <Text style={styles.currentVIPExpiry}>
                      Expira em: 15 dias
                    </Text>
                    <Text style={styles.currentVIPBenefits}>
                      {currentVIP.benefits.length} benefícios ativos
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </Animated.View>
        )}

        {/* Lista de VIPs */}
        <Animated.View
          style={[
            styles.vipListSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Planos VIP Disponíveis</Text>
          
          <FlatList
            data={vipLevels}
            renderItem={renderVIPCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>

        {/* Informações Adicionais */}
        <Animated.View
          style={[
            styles.additionalInfo,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Por que ser VIP?</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Icon name="trending-up" size={24} color="#4CAF50" />
              <Text style={styles.infoTitle}>Progresso Rápido</Text>
              <Text style={styles.infoText}>
                Aumente sua experiência e drop rate para evoluir mais rápido
              </Text>
            </View>
            
            <View style={styles.infoCard}>
              <Icon name="people" size={24} color="#2196F3" />
              <Text style={styles.infoTitle}>Comunidade VIP</Text>
              <Text style={styles.infoText}>
                Acesso a canais exclusivos e eventos especiais
              </Text>
            </View>
            
            <View style={styles.infoCard}>
              <Icon name="support" size={24} color="#FF9800" />
              <Text style={styles.infoTitle}>Suporte Prioritário</Text>
              <Text style={styles.infoText}>
                Atendimento VIP com resposta mais rápida
              </Text>
            </View>
            
            <View style={styles.infoCard}>
              <Icon name="gift" size={24} color="#E91E63" />
              <Text style={styles.infoTitle}>Itens Exclusivos</Text>
              <Text style={styles.infoText}>
                Acesso a itens raros e únicos exclusivos para VIPs
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Modais */}
      {renderVIPDetailsModal()}
      {renderPurchaseModal()}
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
  vipHeader: {
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
  vipInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vipDetails: {
    marginLeft: 15,
  },
  vipTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  vipSubtitle: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  infoButton: {
    padding: 8,
  },
  currentVIPStatus: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  currentVIPCard: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  currentVIPGradient: {
    padding: 20,
  },
  currentVIPContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentVIPInfo: {
    marginLeft: 20,
    flex: 1,
  },
  currentVIPName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  currentVIPExpiry: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
  },
  currentVIPBenefits: {
    fontSize: 12,
    color: '#888',
  },
  vipListSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  vipCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  currentVIPCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  higherLevelCard: {
    opacity: 0.6,
  },
  vipCardGradient: {
    padding: 20,
  },
  vipCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  vipIconContainer: {
    position: 'relative',
    marginRight: 15,
  },
  currentVIPBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  currentVIPText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000',
  },
  vipCardInfo: {
    flex: 1,
  },
  vipName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  vipPrice: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  vipBenefits: {
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  benefitText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
  },
  moreBenefits: {
    fontSize: 12,
    color: '#ccc',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 5,
  },
  purchaseButton: {
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  currentVIPStatus: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  currentVIPStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  currentVIPStatusText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  higherLevelStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  higherLevelStatusText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  additionalInfo: {
    paddingHorizontal: 20,
  },
  infoGrid: {
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 16,
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
  detailVIPCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  detailVIPHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailVIPName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
  },
  detailVIPPrice: {
    fontSize: 14,
    color: '#00D4FF',
    fontWeight: 'bold',
  },
  detailBenefits: {
    marginLeft: 34,
  },
  detailBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailBenefitText: {
    fontSize: 14,
    color: '#ccc',
    marginLeft: 8,
  },
  purchaseContent: {
    padding: 20,
  },
  purchaseVIPInfo: {
    alignItems: 'center',
    marginBottom: 25,
  },
  purchaseVIPName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  purchaseVIPPrice: {
    fontSize: 18,
    color: '#00D4FF',
    fontWeight: 'bold',
  },
  durationSelector: {
    marginBottom: 25,
  },
  durationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  durationOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationOption: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedDuration: {
    backgroundColor: '#00D4FF',
  },
  durationText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedDurationText: {
    color: '#fff',
  },
  totalPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  totalPriceLabel: {
    fontSize: 16,
    color: '#ccc',
  },
  totalPriceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00D4FF',
  },
  confirmPurchaseButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmPurchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VIPScreen;
