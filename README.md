# PROJETO REACT-NATIVE - 1º BIMESTRE

**Membros da Dupla:**
1. Guilherme de araujo Silva
2. André Coral Rodrigues

## Sobre o Projeto
**Animalist**   
Este projeto foi desenvolvido em React Native (Expo) como parte da avaliação do 1º Bimestre da disciplina focado em desenvolvimento mobile. O aplicativo permite o cadastro e login de usuários, além de consumir a **AniList API** (GraphQL) para buscar, listar e detalhar informações sobre Animes (Cards).

## Estrutura do Projeto
O projeto segue uma arquitetura baseada em componentes e separação de responsabilidades (pastas organizadas), comum em aplicações React Native. Abaixo a representação da árvore de diretórios principal:

```text
├── project-rn/               # Pasta do app em React Native JS
│   ├── src/                  # Código-fonte principal da aplicação
│   │   │
│   │   ├── pages/            # Telas globais da aplicação
│   │   │   ├── register.js   # Tela de registro de novos usuários
│   │   │   ├── details.js    # Tela com detalhes expandidos do anime
│   │   │   ├── favorites.js  # Tela de animes favoritados
│   │   │   ├── home.js       # Tela principal listando animes
│   │   │   ├── login.js      # Tela de autenticação/entrada
│   │   │   ├── profile.js    # Tela de dados do perfil logado
│   │   │   └── watchLater.js # Tela da lista de assistir mais tarde
│   │   │
│   │   ├── services/         # Modelos e regras de serviços 
│   │   │   └── api.js        # Serviço de requisições HTTP (API AniList)
│   │   │
│   │   ├── routes.js         # Gerenciador central das rotas de navegação
│   │   └── styles.js         # Estilizações globais via styled-components
│   │
│   ├── assets/               # Imagens, ícones, fontes e recursos estáticos
│   ├── App.js                # Componente raiz de entrada do React Native
│   ├── index.js              # Registro e Entrypoint do Expo / RN
│   ├── app.json              # Configurações do Expo
│   ├── package.json          # Dependências e scripts do projeto
│   └── README.md             # Documentação principal
```

## Como ele Funciona
O aplicativo funciona como um gerenciador de catálogo de Animes pessoal. Ele opera de forma **híbrida**, combinando dados de uma **API Externa** (a AniList via chamadas GraphQL do tipo POST para buscar informações reias de animes) com **Armazenamento Local** (via `AsyncStorage`). 

Os dados dos usuários, suas respectivas contas e suas listas exclusivas de animes anexados são todos armazenados localmente na memória do celular do usuário.

## Fluxo de Navegação
1. **Ponto de Início (Unauthenticated):** O usuário abre o app e cai na tela de **Login** (`login.js`).
2. **Caso não tenha conta:** O usuário navega para a tela de **Cadastro** (`register.js`) e retorna ao Login após o sucesso.
3. **Fluxo Autenticado:** Ao se logar, o usuário é levado à rota principal (`home.js`). Ao entrar, ele perde propositalmente a possibilidade de voltar à tela de login clicando em "voltar" (proteção de rotas).
4. **Detalhes e Sub-telas:** O usuário pode pesquisar animes, ver mais detalhes (`details.js`) com capa expandida e sinopse, e gerenciar suas listas.
5. **Logout:** O usuário pode ver os dados da sua conta e acionar a função de sair, que o redireciona de volta à estaca zero.

## Funcionalidades Principais
- **Cadastro Múltiplo e Validação Rigorosa:** Verificação de senhas fortes, formatação de CPF/telefone, e bloqueio de usuários duplicados.
- **Gestão de Sessão (Login/Logout):** O sistema guarda temporariamente o usuário logado para renderizar apenas os dados pertinentes a ele.
- **Pesquisa Dinâmica na API AniList:** Usuários podem pesquisar animes do catálogo oficial (trazendo título, nota, capa vertical e episódios).
- **Listas Compartimentadas:** Possibilidade de adicionar ou Excluir Animes da conta. A lista de um usuário não se mistura com a de outro.
- **Tratamento de Dados Exibidos:** Limpeza de tags HTML (`<br>`, `<i>`) vindas da API utilizando Regex para exibir os dados de forma legível.

## As 5 Dependências Principais
1. **`react` e `react-native` (com Expo):** Motor e framework principal para construir interfaces e compilar os componentes móveis utilizando código nativo.
2. **`@react-navigation/native`:** Responsável por todo o algoritmo que compõe o roteamento do app e transição segura entre telas.
3. **`@react-native-async-storage/async-storage`:** Banco de dados local (chave-valor) essencial, onde os dados de login e as listas de animes operam.
4. **`styled-components`:** Biblioteca robusta utilizada para customizações visuais (Dark Mode), centralizando os visuais de alta reutilização na aplicação.
5. **`expo`:** Framework que abstrai e facilita o ciclo de build, permitindo testes rápidos tanto no app *Expo Go* ou via emulador.






