import  { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity,  ScrollView, Alert, Dimensions, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { 
  AnimeCard, 
  CoverImage, 
  AnimeTitle, 
  homeStyles as styles,
  BannerCarouselContainer,
  BannerOverlay,
  BannerTitleText,
  GenreBadgesContainer,
  GenreBadgeItem,
  GenreBadgeItemText,
  CarouselItemWrapper,
  bannerCarouselStyles,
} from "../styles";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.38; // Cards se adaptam a diferentes tamanhos de tela
const CARD_MARGIN = 10;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;

const CarouselList = ({ data, onRenderItem }) => {
  const [visibleIndices, setVisibleIndices] = useState([]);

  const onViewRef = useRef(({ viewableItems }) => {
    setVisibleIndices(viewableItems.map((v) => v.index));
  });

  const viewConfigRef = useRef({ itemVisiblePercentThreshold: 70 });

  return (
    <FlatList
      data={data}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      onViewableItemsChanged={onViewRef.current}
      viewabilityConfig={viewConfigRef.current}
      snapToInterval={SNAP_INTERVAL}
      decelerationRate="fast"
      contentContainerStyle={{ paddingRight: 20 }}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      renderItem={({ item, index }) => {
        const isFullyVisible = visibleIndices.length === 0 || visibleIndices.includes(index);
        return (
          <CarouselItemWrapper visible={isFullyVisible}>
            {onRenderItem({ item })}
          </CarouselItemWrapper>
        );
      }}
    />
  );
};

const Home = () => {
  const [popular, setPopular] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [allTime, setAllTime] = useState([]);
  const [top100, setTop100] = useState([]);
  const [recentBanners, setRecentBanners] = useState([]);
  const [user, setUser] = useState(null);
  const [favoritedIds, setFavoritedIds] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const bannerFlatListRef = useRef(null);
  
  const navigation = useNavigation();

  const loadUserData = useCallback(async () => {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
      const currentUser = JSON.parse(storedUser);
      setUser(currentUser);
      
      const animesKey = `animes_${currentUser.usuario}`;
      const storedAnimes = await AsyncStorage.getItem(animesKey);
      if (storedAnimes) {
        const animesList = JSON.parse(storedAnimes);
        setFavoritedIds(animesList.map((a) => a.id));
      } else {
        setFavoritedIds([]);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [loadUserData])
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (recentBanners.length === 0) return;

    const bannerInterval = setInterval(() => {
      setBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % recentBanners.length;
        bannerFlatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 5000); // Troca de banner a cada 5 segundos

    return () => clearInterval(bannerInterval);
  }, [recentBanners]);

  const fetchData = useCallback(async () => {
    const mediaFields = `
      id
      title { romaji english }
      coverImage { large }
      status
      episodes
      averageScore
      description
      genres
    `;

    const query = `
      query {
        banners: Page(page: 1, perPage: 5) {
          media(type: ANIME, sort: TRENDING_DESC) {
            id
            title { romaji english }
            bannerImage
          }
        }
        popular: Page(page: 1, perPage: 10) {
          media(type: ANIME, sort: TRENDING_DESC) { ${mediaFields} }
        }
        upcoming: Page(page: 1, perPage: 10) {
          media(type: ANIME, status: NOT_YET_RELEASED, sort: POPULARITY_DESC) { ${mediaFields} }
        }
        allTime: Page(page: 1, perPage: 10) {
          media(type: ANIME, sort: POPULARITY_DESC) { ${mediaFields} }
        }
        top100: Page(page: 1, perPage: 10) {
          media(type: ANIME, sort: SCORE_DESC) { ${mediaFields} }
        }
      }
    `;

    try {
      const response = await api.post("", { query });
      const data = response.data.data;
      setRecentBanners(data.banners.media);
      setPopular(data.popular.media);
      setUpcoming(data.upcoming.media);
      setAllTime(data.allTime.media);
      setTop100(data.top100.media);
    } catch (error) {
      console.log("Erro ao buscar dados", error);
    }
  }, []);

  const formatAnime = useCallback((media) => ({
    id: media.id,
    name: media.title.romaji || media.title.english || "Título Desconhecido",
    status: media.status,
    bio: `${media.status || "?"} - Episódios: ${media.episodes || "?"}\nNota: ${media.averageScore || "?"}/100`,
    avatar: media.coverImage.large,
    description: media.description,
    episodes: media.episodes,
    averageScore: media.averageScore,
    genres: media.genres || [],
  }), []);

  const formatBannerAnime = useCallback((bannerMedia) => ({
    id: bannerMedia.id,
    name: bannerMedia.title.romaji || bannerMedia.title.english || "Título Desconhecido",
    avatar: bannerMedia.bannerImage,
    // Campos padrão para evitar erros na página de detalhes
    status: "UNKNOWN",
    bio: "Carregando detalhes...",
    description: "",
    episodes: 0,
    averageScore: 0,
    genres: [],
  }), []);

  const handleAddFavorite = useCallback(async (item) => {
    if (!user) {
      Alert.alert("Erro", "Nenhum usuário logado!");
      return;
    }
    const animeFormatado = formatAnime(item);
    const animesKey = `animes_${user.usuario}`;
    const storedAnimes = await AsyncStorage.getItem(animesKey);
    let animesList = storedAnimes ? JSON.parse(storedAnimes) : [];

    if (animesList.find((a) => a.id === animeFormatado.id)) {
      Alert.alert("Aviso", "Anime já adicionado aos favoritos!");
      return;
    }

    animesList.push(animeFormatado);
    await AsyncStorage.setItem(animesKey, JSON.stringify(animesList));
    setFavoritedIds([...favoritedIds, animeFormatado.id]);
    Alert.alert("Sucesso", "Anime salvo nos seus favoritos! ");
  }, [user, favoritedIds, formatAnime]);

  const handleDetails = useCallback((item) => {
    // Se tem bannerImage, é um banner, senão é um anime normal
    const animeFormatado = item.bannerImage ? formatBannerAnime(item) : formatAnime(item);
    navigation.navigate("Details", { anime: animeFormatado });
  }, [navigation, formatAnime, formatBannerAnime]);

  const renderItem = useCallback(({ item }) => (
    <AnimeCard style={styles.horizontalCard}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => handleDetails(item)}>
        <CoverImage source={{ uri: item.coverImage.large }} style={styles.horizontalImage} />
        <AnimeTitle numberOfLines={2}>{item.title.romaji}</AnimeTitle>
      </TouchableOpacity>

      {item.genres && item.genres.length > 0 && (
        <GenreBadgesContainer>
          {item.genres.slice(0, 2).map((genre, index) => (
            <GenreBadgeItem key={`genre-${genre}-${index}`}>
              <GenreBadgeItemText>
                {genre}
              </GenreBadgeItemText>
            </GenreBadgeItem>
          ))}
        </GenreBadgesContainer>
      )}

      {!favoritedIds.includes(item.id) && (
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={() => handleAddFavorite(item)}
        >
          <Text style={styles.buttonText}> Favoritar</Text>
        </TouchableOpacity>
      )}
    </AnimeCard>
  ), [handleDetails, handleAddFavorite, favoritedIds]);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
    >
      {recentBanners.length > 0 && (
        <BannerCarouselContainer>
          <FlatList
            ref={bannerFlatListRef}
            data={recentBanners}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            snapToInterval={width}
            decelerationRate="fast"
            scrollEventThrottle={16}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            onScroll={(event) => {
              const contentOffsetX = event.nativeEvent.contentOffset.x;
              const currentIndex = Math.round(contentOffsetX / width);
              setBannerIndex(currentIndex);
            }}
            renderItem={({ item }) => (
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => handleDetails(item)}
                style={bannerCarouselStyles.bannerImageWrapper}
              >
                <Image 
                  source={{ uri: item.bannerImage || 'https://via.placeholder.com/1280x200' }}
                  style={bannerCarouselStyles.bannerImageFullSize}
                />
                <BannerOverlay>
                  <BannerTitleText numberOfLines={2}>
                    {item.title.romaji || item.title.english}
                  </BannerTitleText>
                </BannerOverlay>
              </TouchableOpacity>
            )}
          />
        </BannerCarouselContainer>
      )}

      <View style={styles.topButtonsContainer}>
        <TouchableOpacity style={styles.myAnimesButton} onPress={() => navigation.navigate("Favorites")}>
          <Text style={styles.myAnimesText}> Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.watchLaterButton} onPress={() => navigation.navigate("WatchLater")}>
          <Text style={styles.watchLaterText}> Assistir Mais Tarde</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tendências Atuais</Text>
        <CarouselList data={popular} onRenderItem={renderItem} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próxima Temporada</Text>
        <CarouselList data={upcoming} onRenderItem={renderItem} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mais Populares (Todos os Tempos)</Text>
        <CarouselList data={allTime} onRenderItem={renderItem} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Avaliados</Text>
        <CarouselList data={top100} onRenderItem={renderItem} />
      </View>
    </ScrollView>
  );
};

export default Home;
