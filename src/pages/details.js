import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import {
  Container,
  Header,
  CoverExpanded,
  AnimeTitleExpanded,
  AnimeInfoExpanded,
  WatchLaterButton,
  WatchLaterText,
  SectionContainer,
  SectionTitle,
  SectionDescription,
  CharacterCard,
  CharacterImage,
  CharacterName,
  EmptyText,
  ReviewCard,
  ReviewHeader,
  ReviewAuthor,
  ReviewRating,
  ReviewText,
} from "../styles.js";

export default function Details({ route }) {
  const { anime } = route.params;
  const [reviews, setReviews] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    loadUser();
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    const query = `
      query ($id: Int) {
        Media(id: $id) {
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
              name {
                full
              }
              image {
                medium
              }
            }
          }
        }
      }
    `;

    try {
      const response = await api.post("", { query, variables: { id: anime.id } });
      const media = response.data.data.Media || {};
      setReviews(media.reviews?.nodes || []);
      setCharacters(media.characters?.nodes || []);
    } catch (error) {
      console.log("Erro ao buscar dados", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchLater = async () => {
    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado!");
      return;
    }

    const watchLaterKey = `watchLater_${user.usuario}`;
    const storedList = await AsyncStorage.getItem(watchLaterKey);
    let watchLaterList = storedList ? JSON.parse(storedList) : [];

    if (watchLaterList.find((a) => a.id === anime.id)) {
      Alert.alert("Aviso", "Anime já está na sua lista de Assistir Mais Tarde!");
      return;
    }

    watchLaterList.push(anime);
    await AsyncStorage.setItem(watchLaterKey, JSON.stringify(watchLaterList));
    Alert.alert("Sucesso", "Adicionado ao Assistir Mais Tarde! 🕒");
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <Header>
          <CoverExpanded source={{ uri: anime.avatar }} />
          <AnimeTitleExpanded>{anime.name}</AnimeTitleExpanded>
          <AnimeInfoExpanded>{anime.bio}</AnimeInfoExpanded>
          
          <WatchLaterButton onPress={handleWatchLater}>
            <WatchLaterText>🕒 Assistir Mais Tarde</WatchLaterText>
          </WatchLaterButton>
        </Header>
        
        <SectionContainer>
          <SectionTitle style={{ marginBottom: 12 }}>Sinopse / Descrição</SectionTitle>
          <SectionDescription>
            {anime.description
              ? anime.description.replace(/<[^>]+>/g, "")
              : "Sem descrição disponível."}
          </SectionDescription>
        </SectionContainer>

        <SectionContainer>
          <SectionTitle>Personagens</SectionTitle>
          {loading ? (
            <ActivityIndicator color="#3DB4F2" size="large" />
          ) : characters.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {characters.map((char) => (
                <CharacterCard key={char.id}>
                  <CharacterImage
                    source={{ uri: char.image?.medium || 'https://via.placeholder.com/80x120' }}
                  />
                  <CharacterName>
                    {char.name?.full}
                  </CharacterName>
                </CharacterCard>
              ))}
            </ScrollView>
          ) : (
            <EmptyText>Nenhum personagem encontrado.</EmptyText>
          )}
        </SectionContainer>

        <SectionContainer>
          <SectionTitle>Reviews da Comunidade</SectionTitle>
          {loading ? (
            <ActivityIndicator color="#3DB4F2" size="large" />
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewCard key={review.id}>
                <ReviewHeader>
                  <ReviewAuthor>
                    {review.user?.name || "Anônimo"}
                  </ReviewAuthor>
                  <ReviewRating>
                    ⭐ {review.rating}/100
                  </ReviewRating>
                </ReviewHeader>
                <ReviewText>
                  {review.summary}
                </ReviewText>
              </ReviewCard>
            ))
          ) : (
            <EmptyText>Nenhuma review encontrada para este anime.</EmptyText>
          )}
        </SectionContainer>
      </ScrollView>
    </Container>
  );
}
