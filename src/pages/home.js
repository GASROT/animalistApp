import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity,  ScrollView, Alert, Dimensions } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { AnimeCard, CoverImage, AnimeTitle, homeStyles as styles } from "../styles";

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
      renderItem={({ item, index }) => {
        const isFullyVisible = visibleIndices.length === 0 || visibleIndices.includes(index);
        return (
          <View style={{ opacity: isFullyVisible ? 1 : 0.4 }}>
            {onRenderItem({ item })}
          </View>
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
  const [user, setUser] = useState(null);
  const [favoritedIds, setFavoritedIds] = useState([]);
  
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      async function loadUserData() {
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
      }
      loadUserData();
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const mediaFields = `
      id
      title { romaji english }
      coverImage { large }
      status
      episodes
      averageScore
      description
    `;

    const query = `
      query {
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
      setPopular(data.popular.media);
      setUpcoming(data.upcoming.media);
      setAllTime(data.allTime.media);
      setTop100(data.top100.media);
    } catch (error) {
      console.log("Erro ao buscar dados", error);
    }
  };

  const formatAnime = (media) => ({
    id: media.id,
    name: media.title.romaji || media.title.english || "Título Desconhecido",
    status: media.status,
    bio: `${media.status || "?"} - Episódios: ${media.episodes || "?"}\nNota: ${media.averageScore || "?"}/100`,
    avatar: media.coverImage.large,
    description: media.description,
    episodes: media.episodes,
    averageScore: media.averageScore,
  });

  const handleAddFavorite = async (item) => {
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
  };

  const handleDetails = (item) => {
    const animeFormatado = formatAnime(item);
    navigation.navigate("Details", { anime: animeFormatado });
  };

  const renderItem = ({ item }) => (
    <AnimeCard style={styles.horizontalCard}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => handleDetails(item)}>
        <CoverImage source={{ uri: item.coverImage.large }} style={styles.horizontalImage} />
        <AnimeTitle numberOfLines={2}>{item.title.romaji}</AnimeTitle>
      </TouchableOpacity>

      {!favoritedIds.includes(item.id) && (
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={() => handleAddFavorite(item)}
        >
          <Text style={styles.buttonText}> Favoritar</Text>
        </TouchableOpacity>
      )}
    </AnimeCard>
  );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
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
