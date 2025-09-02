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
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const ShopScreen = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [userBalance, setUserBalance] = useState(1500); // Goblin Points

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

  const categories = [
    { id: 'all', name: 'Todos', icon: 'apps' },
    { id: 'weapons', name: 'Armas', icon: 'gps-fixed' },
    { id: 'armor', name: 'Armaduras', icon: 'security' },
    { id: 'wings', name: 'Asas', icon: 'flight' },
    { id: 'pets', name: 'Pets', icon: 'pets' },
    { id: 'consumables', name: 'Consumíveis', icon: 'local-pharmacy' },
    { id: 'cosmetics', name: 'Cosméticos', icon: 'palette' },
  ];

  const shopItems = [
    // Armas
    {
      id: 1,
      name: 'Sword of Destruction +15',
      category: 'weapons',
      price: 500,
      currency: 'gp',
      rarity: 'legendary',
      image: '⚔️',
      description: 'Espada lendária com poder destrutivo máximo',
      stats: {
        attack: '+1500',
        skill: '+800',
        speed: '+200',
      },
      effects: ['Destruction', 'Skill Boost', 'Speed Increase'],
    },
    {
      id: 2,
      name: 'Staff of Magic +15',
      category: 'weapons',
      price: 450,
      currency: 'gp',
      rarity: 'legendary',
      image: '🔮',
      description: 'Cajado mágico com poder elemental supremo',
      stats: {
        magic: '+1800',
        skill: '+1000',
        mana: '+500',
      },
      effects: ['Magic Boost', 'Elemental Power', 'Mana Regeneration'],
    },
    // Armaduras
    {
      id: 3,
      name: 'Dragon Armor Set +15',
      category: 'armor',
      price: 800,
      currency: 'gp',
      rarity: 'mythical',
      image: '🛡️',
      description: 'Conjunto de armadura de dragão com proteção máxima',
      stats: {
        defense: '+2000',
        hp: '+1500',
        resistance: '+300',
      },
      effects: ['Dragon Protection', 'HP Boost', 'Elemental Resistance'],
    },
    // Asas
    {
      id: 4,
      name: 'Angel Wings +15',
      category: 'wings',
      price: 1200,
      currency: 'gp',
      rarity: 'mythical',
      image: '👼',
      description: 'Asas angelicais com poder divino',
      stats: {
        speed: '+500',
        flight: '+1000',
        luck: '+200',
      },
      effects: ['Divine Speed', 'Flight Mastery', 'Luck Boost'],
    },
    // Pets
    {
      id: 5,
      name: 'Dragon Pet - Ultimate',
      category: 'pets',
      price: 1500,
      currency: 'gp',
      rarity: 'mythical',
      image: '🐉',
      description: 'Pet de dragão com habilidades únicas',
      stats: {
        attack: '+800',
        defense: '+600',
        special: '+1000',
      },
      effects: ['Dragon Companion', 'Battle Support', 'Special Skills'],
    },
    // Consumíveis
    {
      id: 6,
      name: 'Reset Stone x10',
      category: 'consumables',
      price: 200,
      currency: 'gp',
      rarity: 'rare',
      image: '💎',
      description: 'Pedras de reset para evolução rápida',
      stats: {
        reset: '+10',
        bonus: '+100%',
      },
      effects: ['Level Reset', 'Bonus Experience'],
    },
    // Cosméticos
    {
      id: 7,
      name: 'Rainbow Aura',
      category: 'cosmetics',
      price: 300,
      currency: 'gp',
      rarity: 'epic',
      image: '🌈',
      description: 'Aura colorida para personalização',
      stats: {
        style: '+1000',
        effect: '+500',
      },
      effects: ['Visual Enhancement', 'Special Effects'],
    },
  ];

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#9E9E9E';
      case 'uncommon': return '#4CAF50';
      case 'rare': return '#2196F3';
      case 'epic': return '#9C27B0';
      case 'legendary': return '#FF9800';
      case 'mythical': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getRarityText = (rarity) => {
    switch (rarity) {
      case 'common': return 'Comum';
      case 'uncommon': return 'Incomum';
      case 'rare': return 'Raro';
      case 'epic': return 'Épico';
      case 'legendary': return 'Lendário';
      case 'mythical': return 'Mítico';
      default: return 'Comum';
    }
  };

  const handleItemPurchase = (item) => {
    if (userBalance < item.price) {
      Alert.alert('Saldo Insuficiente', 'Você não tem Goblin Points suficientes para esta compra.');
      return;
    }

    setSelectedItem(item);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (!selectedItem) return;

    Alert.alert(
      'Confirmar Compra',
      `Deseja comprar ${selectedItem.name} por ${selectedItem.price} Goblin Points?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Comprar', 
          onPress: () => {
            // Simular compra
            setUserBalance(prev => prev - selectedItem.price);
            Alert.alert(
              'Compra Realizada!',
              `${selectedItem.name} foi adicionado ao seu inventário!`,
              [{ text: 'OK' }]
            );
            setShowPurchaseModal(false);
          }
        },
      ]
    );
  };

  const renderCategoryButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Icon 
        name={item.icon} 
        size={24} 
        color={selectedCategory === item.id ? '#fff' : '#666'} 
      />
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.selectedCategoryText,
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderShopItem = ({ item }) => (
    <TouchableOpacity
      style={styles.shopItem}
      onPress={() => {
        setSelectedItem(item);
        setShowItemDetails(true);
      }}
    >
      <View style={styles.itemImageContainer}>
        <Text style={styles.itemImage}>{item.image}</Text>
        <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(item.rarity) }]}>
          <Text style={styles.rarityText}>{getRarityText(item.rarity)}</Text>
        </View>
      </View>
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.itemPrice}>
          <Icon name="monetization-on" size={16} color="#FFD700" />
          <Text style={styles.priceText}>{item.price} GP</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.buyButton}
        onPress={() => handleItemPurchase(item)}
      >
        <Text style={styles.buyButtonText}>COMPRAR</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderItemDetailsModal = () => (
    <Modal
      visible={showItemDetails}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowItemDetails(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalhes do Item</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowItemDetails(false)}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {selectedItem && (
            <ScrollView style={styles.modalBody}>
              <View style={styles.itemDetailHeader}>
                <Text style={styles.itemDetailImage}>{selectedItem.image}</Text>
                <View style={styles.itemDetailInfo}>
                  <Text style={styles.itemDetailName}>{selectedItem.name}</Text>
                  <View style={[styles.itemDetailRarity, { backgroundColor: getRarityColor(selectedItem.rarity) }]}>
                    <Text style={styles.itemDetailRarityText}>
                      {getRarityText(selectedItem.rarity)}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.itemDetailDescription}>
                {selectedItem.description}
              </Text>

              <View style={styles.itemDetailStats}>
                <Text style={styles.statsTitle}>Estatísticas:</Text>
                {Object.entries(selectedItem.stats).map(([stat, value]) => (
                  <View key={stat} style={styles.statRow}>
                    <Text style={styles.statName}>{stat.toUpperCase()}:</Text>
                    <Text style={styles.statValue}>{value}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.itemDetailEffects}>
                <Text style={styles.effectsTitle}>Efeitos Especiais:</Text>
                {selectedItem.effects.map((effect, index) => (
                  <View key={index} style={styles.effectItem}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.effectText}>{effect}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.detailBuyButton, { backgroundColor: getRarityColor(selectedItem.rarity) }]}
                onPress={() => {
                  setShowItemDetails(false);
                  handleItemPurchase(selectedItem);
                }}
              >
                <Text style={styles.detailBuyButtonText}>
                  COMPRAR POR {selectedItem.price} GP
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
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
            <Text style={styles.modalTitle}>Confirmar Compra</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPurchaseModal(false)}
            >
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {selectedItem && (
            <View style={styles.purchaseContent}>
              <View style={styles.purchaseItemInfo}>
                <Text style={styles.purchaseItemImage}>{selectedItem.image}</Text>
                <Text style={styles.purchaseItemName}>{selectedItem.name}</Text>
                <Text style={styles.purchaseItemPrice}>
                  {selectedItem.price} Goblin Points
                </Text>
              </View>

              <View style={styles.balanceInfo}>
                <Text style={styles.balanceLabel}>Seu Saldo:</Text>
                <Text style={styles.balanceValue}>{userBalance} GP</Text>
                <Text style={styles.balanceAfter}>
                  Saldo após compra: {userBalance - selectedItem.price} GP
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.confirmPurchaseButton, { backgroundColor: getRarityColor(selectedItem.rarity) }]}
                onPress={confirmPurchase}
              >
                <Text style={styles.confirmPurchaseButtonText}>
                  CONFIRMAR COMPRA
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header da Loja */}
        <Animated.View
          style={[
            styles.shopHeader,
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
              <View style={styles.shopInfo}>
                <Icon name="shopping-cart" size={40} color="#00D4FF" />
                <View style={styles.shopDetails}>
                  <Text style={styles.shopTitle}>Cash Shop</Text>
                  <Text style={styles.shopSubtitle}>Itens Exclusivos</Text>
                </View>
              </View>
              
              <View style={styles.balanceContainer}>
                <Icon name="monetization-on" size={24} color="#FFD700" />
                <Text style={styles.balanceText}>{userBalance}</Text>
                <Text style={styles.balanceLabel}>GP</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Categorias */}
        <Animated.View
          style={[
            styles.categoriesSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <FlatList
            data={categories}
            renderItem={renderCategoryButton}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </Animated.View>

        {/* Lista de Itens */}
        <Animated.View
          style={[
            styles.itemsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'Todos os Itens' : 
             categories.find(cat => cat.id === selectedCategory)?.name}
          </Text>
          
          <FlatList
            data={filteredItems}
            renderItem={renderShopItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={styles.itemsRow}
          />
        </Animated.View>

        {/* Informações da Loja */}
        <Animated.View
          style={[
            styles.shopInfoSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Sobre a Cash Shop</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Icon name="security" size={24} color="#4CAF50" />
              <Text style={styles.infoTitle}>Segurança</Text>
              <Text style={styles.infoText}>
                Todas as transações são seguras e verificadas
              </Text>
            </View>
            
            <View style={styles.infoCard}>
              <Icon name="support" size={24} color="#2196F3" />
              <Text style={styles.infoTitle}>Suporte</Text>
              <Text style={styles.infoText}>
                Suporte 24/7 para todas as suas compras
              </Text>
            </View>
            
            <View style={styles.infoCard}>
              <Icon name="gift" size={24} color="#FF9800" />
              <Text style={styles.infoTitle}>Bônus</Text>
              <Text style={styles.infoText}>
                Bônus especiais para compras em lote
              </Text>
            </View>
            
            <View style={styles.infoCard}>
              <Icon name="update" size={24} color="#E91E63" />
              <Text style={styles.infoTitle}>Atualizações</Text>
              <Text style={styles.infoText}>
                Novos itens adicionados semanalmente
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Modais */}
      {renderItemDetailsModal()}
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
  shopHeader: {
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
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopDetails: {
    marginLeft: 15,
  },
  shopTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  shopSubtitle: {
    fontSize: 16,
    color: '#00D4FF',
    fontWeight: '600',
  },
  balanceContainer: {
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 5,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#ccc',
  },
  categoriesSection: {
    marginBottom: 25,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedCategory: {
    backgroundColor: '#00D4FF',
    borderColor: '#00D4FF',
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    fontWeight: 'bold',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  itemsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  itemsRow: {
    justifyContent: 'space-between',
  },
  shopItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  itemImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemImage: {
    fontSize: 48,
  },
  rarityBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  rarityText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemInfo: {
    marginBottom: 10,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  itemDescription: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 16,
  },
  itemPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  priceText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  buyButton: {
    backgroundColor: '#00D4FF',
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  shopInfoSection: {
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
  itemDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  itemDetailImage: {
    fontSize: 64,
    marginRight: 20,
  },
  itemDetailInfo: {
    flex: 1,
  },
  itemDetailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  itemDetailRarity: {
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  itemDetailRarityText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemDetailDescription: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
    marginBottom: 20,
  },
  itemDetailStats: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  statName: {
    fontSize: 14,
    color: '#ccc',
  },
  statValue: {
    fontSize: 14,
    color: '#00D4FF',
    fontWeight: 'bold',
  },
  itemDetailEffects: {
    marginBottom: 25,
  },
  effectsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  effectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  effectText: {
    fontSize: 14,
    color: '#ccc',
    marginLeft: 8,
  },
  detailBuyButton: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailBuyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  purchaseContent: {
    padding: 20,
  },
  purchaseItemInfo: {
    alignItems: 'center',
    marginBottom: 25,
  },
  purchaseItemImage: {
    fontSize: 64,
    marginBottom: 15,
  },
  purchaseItemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
  purchaseItemPrice: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  balanceInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 5,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  balanceAfter: {
    fontSize: 14,
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

export default ShopScreen;
