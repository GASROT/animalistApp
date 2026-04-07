# Animalist - Aplicativo de Gerenciamento de Animes

## Sobre o Projeto   
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

## Queries GraphQL Utilizadas

O projeto utiliza 3 queries GraphQL distintas da **API AniList**, cada uma otimizada para renderizar diferentes tipos de conteúdo:

### 1. Query de Carousel Banner (home.js)
**Arquivo:** `src/pages/home.js`

```graphql
query {
  banners: Page(page: 1, perPage: 5) {
    media(type: ANIME, sort: TRENDING_DESC) {
      id
      title { romaji english }
      bannerImage
    }
  }
  popular: Page(page: 1, perPage: 10) {
    media(type: ANIME, sort: TRENDING_DESC) { ... }
  }
  upcoming: Page(page: 1, perPage: 10) {
    media(type: ANIME, status: NOT_YET_RELEASED, sort: POPULARITY_DESC) { ... }
  }
  allTime: Page(page: 1, perPage: 10) {
    media(type: ANIME, sort: POPULARITY_DESC) { ... }
  }
  top100: Page(page: 1, perPage: 10) {
    media(type: ANIME, sort: SCORE_DESC) { ... }
  }
}
```

**Por quê usar:**
- **Múltiplas categorias em uma única chamada:** Reduz requisições HTTP, otimizando performance
- **Ordenações distintas (TRENDING_DESC, SCORE_DESC, POPULARITY_DESC):** Cada categoria renderiza animes baseado em diferentes critérios relevantes
- **Status de lançamento:** `NOT_YET_RELEASED` filtra apenas animes futuros para a seção "Em Breve"
- **Imagem de Banner:** Campo `bannerImage` fornece dimensões adequadas para o carousel visual da home

---

### 2. Query de Detalhes Expandidos (details.js)
**Arquivo:** `src/pages/details.js`

```graphql
query ($id: Int) {
  Media(id: $id) {
    format
    genres
    source
    season
    seasonYear
    startDate { year month day }
    duration
    status
    averageScore
    reviews(sort: RATING_DESC, limit: 5) {
      nodes {
        id
        summary
        rating
        user { name }
      }
    }
    characters(sort: [ROLE, ID_DESC], page: 1, perPage: 10) {
      nodes {
        id
        name { full }
        image { medium }
      }
    }
    staff(sort: [ROLE, ID_DESC], page: 1, perPage: 10) {
      nodes {
        id
        name { full }
        image { medium }
      }
      edges { role }
    }
    studios(isMain: true) {
      nodes {
        id
        name
      }
    }
  }
}
```

**Por quê usar:**
- **Parâmetro variável ($id):** Permite buscar detalhes específicos de um único anime sem refetch de dados redundantes
- **Dados expandidos:** Inclui personagens, staff, reviews e studios para renderizar uma tela rica com várias seções
- **Ordenações e paginação:** `characters` e `staff` ordenados por `ROLE` mostram personagens/equipe por importância
- **Informações de data:** `startDate`, `season`, `seasonYear` contextualizam quando o anime foi/será lançado
- **Review rating:** Permite exibir avaliações da comunidade ordenadas pela relevância (RATING_DESC)

---

### 3. Query de Busca Dinâmica (favorites.js)
**Arquivo:** `src/pages/favorites.js`

```graphql
query ($search: String) {
  Media(search: $search, type: ANIME) {
    id
    title {
      romaji
      english
    }
    description
    coverImage {
      large
    }
    status
    episodes
    averageScore
  }
}
```

**Por quê usar:**
- **Parâmetro de busca ($search):** Permite que o usuário busque animes por título em tempo real
- **Campos essenciais:** Retorna apenas dados necessários para renderizar um card de anime (sem dados bloated)
- **Cobertura com imagem grande:** `coverImage.large` fornece resolução suficiente para cards visuais sem pesar na requisição
- **Status e episódios:** Informações cruciais para o usuário decidir se quer adicionar à sua lista
- **Score médio:** Facilita decisões de visualização baseadas em avaliações da comunidade

---

### Resumo Comparativo

| Query | Propósito | Tipo | Campos | Performance |
|-------|-----------|------|--------|-------------|
| **Carousel** | Renderizar 5 categorias de animes na home | Sem parâmetro | Muitos (múltiplas Page calls) | Moderada (1 req com múltiplos resultados) |
| **Detalhes** | Exibir página expandida de um anime | Com $id | Muitos (personagens, staff, reviews) | Moderada (1 req com dados profundos) |
| **Busca** | Encontrar animes por título dinâmico | Com $search | Poucos (essenciais) | Rápida (requisição leve e focada) |

Cada query é estrategicamente estruturada para minimizar dados desnecessários enquanto maximiza a experiência do usuário na tela específica.

---

## Documentação e Referência

Para explorar outras queries GraphQL disponíveis na **AniList API** e entender melhor a estrutura de dados que pode ser utilizada em futuras expansões do projeto, consulte a documentação oficial:

📖 **[AniList GraphQL Query Reference](https://docs.anilist.co/reference/query)**
    **[AniList GraphQL Reference](https://docs.anilist.co/guide/graphql/)**
A documentação contém:
- **Todos os campos disponíveis** para Media, User, Character, Staff, Studio e muito mais
- **Filtros avançados** para refinar buscas por gênero, status, formato, etc.
- **Ordenações** para diferentes critérios de relevância
- **Exemplos práticos** de queries complexas
- **Rate limiting** e best practices para otimização de requisições

Você pode adaptar as queries existentes ou criar novas conforme necessário para implementar funcionalidades adicionais no aplicativo.






