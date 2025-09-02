# 📱 **Proedition Global Mu - Mobile App**

## 🎯 **Descrição**
Aplicativo móvel oficial do servidor **Proedition Global Mu** desenvolvido em React Native, oferecendo uma experiência completa para jogadores Android com sistema híbrido de streaming.

## ✨ **Características Principais**

### 🎮 **Sistema Híbrido com Streaming**
- **App Mobile**: Gerenciamento de conta, chat global, sistema VIP
- **Game Streaming**: Jogo via streaming da VPS para dispositivos móveis
- **Cross-Platform**: Jogadores Android podem jogar junto com PC

### 🔐 **Sistema de Autenticação**
- Login/Registro de usuários
- Gerenciamento de perfil
- Sistema VIP integrado
- Persistência de dados com AsyncStorage

### 💬 **Chat Global em Tempo Real**
- WebSocket para comunicação instantânea
- Suporte a múltiplos idiomas
- Tradução automática
- Chat regional e global
- Sistema de moderação

### 🎯 **Funcionalidades do App**
- **Dashboard**: Visão geral da conta e servidor
- **Game Screen**: Interface para streaming do jogo
- **Chat Global**: Comunicação em tempo real
- **Sistema VIP**: Gerenciamento de benefícios
- **Loja**: Cash shop e itens especiais
- **Perfil**: Configurações e estatísticas

## 🛠 **Tecnologias Utilizadas**

### **Frontend**
- **React Native 0.72.6**
- **React 18.2.0**
- **JavaScript ES6+**

### **Navegação**
- **@react-navigation/native**
- **@react-navigation/stack**
- **@react-navigation/bottom-tabs**

### **UI/UX**
- **react-native-vector-icons** (MaterialIcons)
- **react-native-linear-gradient**
- **react-native-gesture-handler**
- **react-native-reanimated**

### **Estado e Persistência**
- **Context API** (React Hooks)
- **@react-native-async-storage/async-storage**
- **useState, useEffect, useRef**

### **Comunicação**
- **react-native-websocket** (Chat em tempo real)
- **@react-native-community/netinfo** (Status da conexão)

## 📱 **Estrutura do Projeto**

```
MobileApp/
├── src/
│   ├── screens/           # Telas do aplicativo
│   │   ├── SplashScreen.js
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── GameScreen.js
│   │   ├── ChatScreen.js
│   │   ├── VIPScreen.js
│   │   ├── ShopScreen.js
│   │   └── ProfileScreen.js
│   ├── context/           # Contextos React
│   │   ├── AuthContext.js
│   │   └── ChatContext.js
│   └── App.js            # Componente principal
├── package.json          # Dependências e scripts
├── app.json             # Configuração do app
└── index.js             # Ponto de entrada
```

## 🚀 **Instalação e Configuração**

### **Pré-requisitos**
- **Node.js 16+**
- **React Native CLI**
- **Android Studio** (para desenvolvimento Android)
- **JDK 11+**

### **1. Instalar Dependências**
```bash
cd MobileApp
npm install
```

### **2. Configurar Android**
```bash
# Verificar se o Android SDK está configurado
npx react-native doctor

# Instalar dependências do Android
cd android
./gradlew clean
cd ..
```

### **3. Executar o App**
```bash
# Iniciar Metro bundler
npm start

# Executar no Android
npm run android

# Executar no iOS (apenas macOS)
npm run ios
```

## 📦 **Scripts Disponíveis**

```json
{
  "android": "react-native run-android",
  "ios": "react-native run-ios",
  "start": "react-native start",
  "test": "jest",
  "lint": "eslint .",
  "build:android": "cd android && ./gradlew assembleRelease",
  "build:apk": "cd android && ./gradlew assembleRelease && cp app/build/outputs/apk/release/app-release.apk ../ProeditionMobileApp.apk"
}
```

## 🔧 **Configurações do Servidor**

### **Endpoints da API**
```javascript
const SERVER_URL = 'http://206.0.29.38';
const API_URL = `${SERVER_URL}/api`;

// Endpoints principais:
// POST /api/login - Autenticação
// POST /api/register - Registro
// GET /api/user/profile - Perfil do usuário
// GET /api/chat/history - Histórico do chat
// GET /api/chat/stats - Estatísticas do chat
```

### **WebSocket para Chat**
```javascript
const CHAT_WS_URL = `ws://206.0.29.38/chat`;

// Eventos suportados:
// - auth: Autenticação do usuário
// - sendMessage: Enviar mensagem
// - updatePreferences: Atualizar preferências
```

## 🎨 **Tema e Design**

### **Paleta de Cores**
```javascript
const AppTheme = {
  colors: {
    primary: '#00D4FF',      // Azul vibrante
    background: '#1a1a1a',   // Fundo escuro
    card: '#2d2d2d',         // Cartões
    text: '#ffffff',          // Texto principal
    border: '#3a3a3a',       // Bordas
    notification: '#FFD700',  // Amarelo (notificações)
    accent: '#4CAF50',       // Verde (ações positivas)
    danger: '#f44336',       // Vermelho (ações negativas)
  }
};
```

### **Animações**
- **Fade In/Out**: Transições suaves
- **Slide**: Movimento lateral
- **Scale**: Efeitos de zoom
- **Pulse**: Indicadores de carregamento

## 📱 **Compatibilidade**

### **Android**
- **Versão Mínima**: API 21 (Android 5.0)
- **Versão Recomendada**: API 29+ (Android 10+)
- **Arquitetura**: ARM64, x86_64

### **iOS** (Futuro)
- **Versão Mínima**: iOS 12.0
- **Dispositivos**: iPhone 6s+, iPad Air 2+

## 🎮 **Sistema de Streaming**

### **Tecnologias de Streaming**
- **Parsec**: Streaming de baixa latência
- **Steam Link**: Integração com Steam
- **Solução Customizada**: Desenvolvimento próprio

### **Configurações de Qualidade**
```javascript
const streamQualities = {
  low: { resolution: '720p', fps: 30, latency: '15-25ms' },
  medium: { resolution: '1080p', fps: 60, latency: '25-40ms' },
  high: { resolution: '1440p', fps: 120, latency: '40-60ms' }
};
```

### **Otimizações de Performance**
- **Adaptive Quality**: Qualidade adaptativa
- **Local Caching**: Cache local para melhor performance
- **Auto-reconnection**: Reconexão automática
- **Memory Management**: Gerenciamento de memória

## 🔒 **Segurança**

### **Autenticação**
- **JWT Tokens**: Autenticação segura
- **AsyncStorage**: Armazenamento local criptografado
- **Session Management**: Gerenciamento de sessões

### **Comunicação**
- **HTTPS/WSS**: Comunicação criptografada
- **Input Validation**: Validação de entrada
- **Rate Limiting**: Proteção contra spam

## 📊 **Monitoramento e Analytics**

### **Métricas do App**
- **Performance**: Tempo de carregamento, FPS
- **Usabilidade**: Tempo de sessão, telas mais acessadas
- **Erros**: Crash reports, logs de erro

### **Métricas do Chat**
- **Usuários Online**: Contagem em tempo real
- **Mensagens**: Volume e frequência
- **Idiomas**: Distribuição por idioma

## 🚀 **Deploy e Distribuição**

### **Android APK**
```bash
# Gerar APK de release
npm run build:apk

# Arquivo gerado: ProeditionMobileApp.apk
```

### **Google Play Store**
- **Bundle ID**: com.proedition.muonline
- **Version Code**: 1.0.0
- **Target SDK**: 33 (Android 13)

### **Distribuição Externa**
- **APK**: Download direto do servidor
- **QR Code**: Compartilhamento fácil
- **OTA Updates**: Atualizações automáticas

## 🐛 **Troubleshooting**

### **Problemas Comuns**

#### **Erro de Metro Bundler**
```bash
# Limpar cache
npx react-native start --reset-cache
```

#### **Erro de Gradle**
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

#### **Erro de Dependências**
```bash
# Limpar node_modules
rm -rf node_modules
npm install
```

### **Logs e Debug**
```bash
# Logs do Android
adb logcat | grep ReactNativeJS

# Logs do Metro
npx react-native log-android
```

## 📚 **Recursos Adicionais**

### **Documentação**
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)

### **Ferramentas de Desenvolvimento**
- **Flipper**: Debug e inspeção
- **React DevTools**: Debug de componentes
- **Metro Bundler**: Bundler JavaScript

## 🤝 **Contribuição**

### **Padrões de Código**
- **ESLint**: Linting automático
- **Prettier**: Formatação de código
- **Conventional Commits**: Padrão de commits

### **Estrutura de Commits**
```
feat: adicionar nova funcionalidade
fix: corrigir bug
docs: atualizar documentação
style: formatação de código
refactor: refatoração
test: adicionar testes
chore: tarefas de manutenção
```

## 📞 **Suporte**

### **Canais de Suporte**
- **Email**: suporte@proedition.com
- **Discord**: [Link do servidor]
- **Telegram**: [Link do grupo]

### **Issues e Bugs**
- **GitHub Issues**: [Repositório do projeto]
- **Bug Report**: Via app (Configurações > Suporte)

## 📄 **Licença**

Este projeto está sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🎉 **Status do Projeto**

✅ **App Mobile Completo**  
✅ **Sistema de Autenticação**  
✅ **Chat Global em Tempo Real**  
✅ **Interface de Streaming**  
✅ **Sistema VIP Integrado**  
✅ **Todas as Telas Implementadas**  
✅ **Documentação Completa**  

**🎯 Pronto para deploy e distribuição!**

🚀 Teste para ativar GitHub Actions

todos os direitos reservador equipe Jogosproedition 

