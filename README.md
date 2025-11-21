# HL Tech SaaS - Portal Frontend

Interface web responsiva para o sistema de gestão da HL Tech. O portal oferece funcionalidades de SPA (Single Page Application) para gerenciamento de clientes, ordens de serviço, equipe técnica e financeiro.

## 🎨 Tecnologias e Bibliotecas

- **HTML5 & CSS3:** Layout moderno, responsivo, com suporte a temas Claro/Escuro (Light/Dark Mode) e Glassmorphism no login.
- **JavaScript (Vanilla):** Lógica de interação, chamadas assíncronas à API (Fetch) e manipulação do DOM.
- **Chart.js:** Renderização de gráficos para o Dashboard analítico.
- **Signature Pad:** Captura de assinatura digital do cliente em tela sensível ao toque ou mouse.
- **Animação:** Canvas HTML5 para fundo animado de partículas na tela de login.

## 🖥️ Funcionalidades

1.  **Dashboard Inteligente:**
    * Gráficos de O.S. por status.
    * Faturamento dos últimos 7 dias.
    * Performance da equipe técnica.
2.  **Gestão de Ordens de Serviço (O.S.):**
    * Criação rápida (Modal).
    * Gerenciamento completo (Adicionar peças/serviços, fotos, logs).
    * Geração de PDF automático.
    * Envio de status via WhatsApp.
    * Assinatura digital do cliente.
3.  **Cadastros:**
    * Clientes (com busca de CEP automática via ViaCEP).
    * Dispositivos (Histórico por aparelho).
    * Técnicos (Equipe).
4.  **Financeiro:**
    * Controle de entradas (O.S. concluídas) e saídas (Despesas).
    * Cálculo de Lucro Líquido em tempo real.
5.  **Interface:**
    * Busca Global (Clientes, O.S., Serial).
    * Alternância de Tema (Claro/Escuro).

## 🔧 Configuração da API

Antes de usar, verifique a configuração da URL da API no arquivo `script.js`.

Abra o `script.js` e procure por:

```javascript
// Para produção:
const API_LOGIN_URL = '[https://api.hltech.org/api/login](https://api.hltech.org/api/login)';
const API_BASE_URL = '[https://api.hltech.org/api](https://api.hltech.org/api)';

// Para testes locais (comentar as linhas acima e descomentar abaixo):
// const API_LOGIN_URL = 'http://localhost:4000/api/login';
// const API_BASE_URL = 'http://localhost:4000/api';
