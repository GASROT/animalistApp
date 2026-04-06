import React, { useState, useCallback } from "react";
import { Keyboard, ActivityIndicator, View, Text, Alert } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  AnimeCard,
  CoverImage,
  AnimeTitle,
  AnimeInfo,
  ProfileButton,
  ProfileButtonText,
  EmptyStateContainer,
  EmptyStateTitle,
  EmptyStateText,
  RemoveButton,
} from "../styles";

export default function Favorites() {
  const [newAnime, setNewAnime] = useState("");
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const loadData = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) {
      const currentUser = JSON.parse(userStr);
      setUser(currentUser);

      const animesKey = `animes_${currentUser.usuario}`;
      const storedAnimes = await AsyncStorage.getItem(animesKey);
      if (storedAnimes) {
        setAnimes(JSON.parse(storedAnimes));
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleAddAnime = async () => {
    if (!newAnime.trim() || !user) return;

    setLoading(true);

    const query = `
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
    `;

    try {
      const response = await api.post("/", {
        query,
        variables: { search: newAnime },
      });

      const media = response.data.data.Media;

      if (!media) {
        Alert.alert("Aviso", "Anime não encontrado!");
        setLoading(false);
        return;
      }

      if (animes.find((a) => a.id === media.id)) {
        Alert.alert("Aviso", "Este anime já está nos seus favoritos!");
        setNewAnime("");
        setLoading(false);
        return;
      }

      const data = {
        id: media.id,
        name: media.title.romaji || media.title.english || "Título Desconhecido",
        status: media.status,
        bio: `${media.status || "?"} - Episódios: ${media.episodes || "?"}\nNota: ${
          media.averageScore || "?"
        }/100`,
        avatar: media.coverImage.large,
        description: media.description,
        episodes: media.episodes,
        averageScore: media.averageScore,
      };

      const updatedAnimes = [...animes, data];
      setAnimes(updatedAnimes);
      setNewAnime("");
      
      const animesKey = `animes_${user.usuario}`;
      await AsyncStorage.setItem(animesKey, JSON.stringify(updatedAnimes));
      
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert("Erro", "Erro ao buscar o anime!");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    const filterAnimes = animes.filter((a) => a.id !== id);
    setAnimes(filterAnimes);
    if (user) {
      const animesKey = `animes_${user.usuario}`;
      await AsyncStorage.setItem(animesKey, JSON.stringify(filterAnimes));
    }
  };

  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCapitalize="words"
          placeholder="Buscar e favoritar anime..."
          value={newAnime}
          onChangeText={setNewAnime}
          returnKeyType="send"
          onSubmitEditing={handleAddAnime}
        />
        <SubmitButton loading={loading} onPress={handleAddAnime}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="star" size={20} color="#fff" />
          )}
        </SubmitButton>
      </Form>

      {animes.length === 0 ? (
        <EmptyStateContainer>
          <Icon name="star-border" size={80} color="#151F2E" style={{ marginBottom: 15 }} />
          <EmptyStateTitle>
            Sua lista de favoritos está vazia
          </EmptyStateTitle>
          <EmptyStateText>
            Adicione animes pela tela principal ou use a barra de pesquisa acima!
          </EmptyStateText>
        </EmptyStateContainer>
      ) : (
        <List
          showsVerticalScrollIndicator={false}
          data={animes}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <AnimeCard>
              <CoverImage source={{ uri: item.avatar }} />
              <AnimeTitle>{item.name}</AnimeTitle>
              <AnimeInfo>{item.bio}</AnimeInfo>
              <ProfileButton
                onPress={() => navigation.navigate("Details", { anime: item })}
              >
                <ProfileButtonText>Ver Mais Detalhes</ProfileButtonText>
              </ProfileButton>
              <RemoveButton
                onPress={() => handleRemove(item.id)}
              >
                <ProfileButtonText>Remover dos Favoritos</ProfileButtonText>
              </RemoveButton>
            </AnimeCard>
          )}
        />
      )}
    </Container>
  );
}
