import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Alert, ActivityIndicator, FlatList } from "react-native";
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
  DetailsInfoRow,
  DetailsInfoLabel,
  DetailsInfoValue,
  DetailsInfoValueHighlight,
  GenreBadge,
  GenreBadgeText,
  StudioBadge,
  StudioBadgeText,
  DetailsContainer,
} from "../styles.js";

export default function Details({ route }) {
  const { anime } = route.params;
  const [reviews, setReviews] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [staff, setStaff] = useState([]);
  const [studios, setStudios] = useState([]);
  const [animeDetails, setAnimeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isInWatchLater, setIsInWatchLater] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        checkIfInWatchLater(userData);
      }
    }
    loadUser();
    fetchDetails();
  }, [anime.id]);

  const checkIfInWatchLater = useCallback(async (userData) => {
    const watchLaterKey = `watchLater_${userData.usuario}`;
    const storedList = await AsyncStorage.getItem(watchLaterKey);
    const watchLaterList = storedList ? JSON.parse(storedList) : [];
    const isAlreadyAdded = watchLaterList.some((a) => a.id === anime.id);
    setIsInWatchLater(isAlreadyAdded);
  }, [anime.id]);

  const fetchDetails = useCallback(async () => {
    const query = ` 
      query ($id: Int) {
        Media(id: $id) {
          format
          genres
          source
          season
          seasonYear
          startDate {
            year
            month
            day
          }
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
              name {
                full
              }
              image {
                medium
              }
            }
          }
          staff(sort: [ROLE, ID_DESC], page: 1, perPage: 10) {
            nodes {
              id
              name {
                full
              }
              image {
                medium
              }
            }
            edges {
              role
            }
          }
          studios(isMain: true) {
            nodes {
              id
              name
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
      setStaff(media.staff?.nodes || []);
      setStudios(media.studios?.nodes || []);
      setAnimeDetails(media);
    } catch (error) {
      console.log("Erro ao buscar dados", error);
    } finally {
      setLoading(false);
    }
  }, [anime.id]);

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
    setIsInWatchLater(true);
    Alert.alert("Sucesso", "Adicionado ao Assistir Mais Tarde! 🕒");
  };

  return (
    <Container>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 30 }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
      >
        <Header>
          <CoverExpanded source={{ uri: anime.avatar }} />
          <AnimeTitleExpanded>{anime.name}</AnimeTitleExpanded>
          <AnimeInfoExpanded>{anime.bio}</AnimeInfoExpanded>
          
          {!isInWatchLater && (
            <WatchLaterButton onPress={handleWatchLater}>
              <WatchLaterText>🕒 Assistir Mais Tarde</WatchLaterText>
            </WatchLaterButton>
          )}
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
          <SectionTitle style={{ marginBottom: 12 }}>Detalhes do Anime</SectionTitle>
          <DetailsContainer>
            {animeDetails?.format && (
              <DetailsInfoRow>
                <DetailsInfoLabel>Formato:</DetailsInfoLabel>
                <DetailsInfoValue>
                  {
                    animeDetails.format === "TV"
                      ? "Série TV"
                      : animeDetails.format === "MOVIE"
                      ? "Filme"
                      : animeDetails.format
                  }
                </DetailsInfoValue>
              </DetailsInfoRow>
            )}

            {animeDetails?.episodes && (
              <DetailsInfoRow>
                <DetailsInfoLabel>Episódios:</DetailsInfoLabel>
                <DetailsInfoValue>
                  {animeDetails.episodes}
                </DetailsInfoValue>
              </DetailsInfoRow>
            )}

            {animeDetails?.duration && (
              <DetailsInfoRow>
                <DetailsInfoLabel>Duração por Episódio:</DetailsInfoLabel>
                <DetailsInfoValue>
                  {animeDetails.duration} min
                </DetailsInfoValue>
              </DetailsInfoRow>
            )}

            {animeDetails?.averageScore && (
              <DetailsInfoRow>
                <DetailsInfoLabel>Nota Média:</DetailsInfoLabel>
                <DetailsInfoValueHighlight>
                  ⭐ {animeDetails.averageScore / 10}/10
                </DetailsInfoValueHighlight>
              </DetailsInfoRow>
            )}

            {animeDetails?.status && (
              <DetailsInfoRow>
                <DetailsInfoLabel>Status:</DetailsInfoLabel>
                <DetailsInfoValue>
                  {
                    animeDetails.status === "FINISHED"
                      ? "Finalizado"
                      : animeDetails.status === "RELEASING"
                      ? "Em Transmissão"
                      : animeDetails.status === "NOT_YET_RELEASED"
                      ? "A Lançar"
                      : animeDetails.status
                  }
                </DetailsInfoValue>
              </DetailsInfoRow>
            )}

            {animeDetails?.source && (
              <DetailsInfoRow>
                <DetailsInfoLabel>Fonte:</DetailsInfoLabel>
                <DetailsInfoValue>
                  {
                    animeDetails.source === "MANGA"
                      ? "Mangá"
                      : animeDetails.source === "LIGHT_NOVEL"
                      ? "Light Novel"
                      : animeDetails.source === "VISUAL_NOVEL"
                      ? "Visual Novel"
                      : animeDetails.source === "VIDEO_GAME"
                      ? "Videogame"
                      : animeDetails.source === "ORIGINAL"
                      ? "Original"
                      : animeDetails.source
                  }
                </DetailsInfoValue>
              </DetailsInfoRow>
            )}

            {animeDetails?.startDate && (
              <DetailsInfoRow>
                <DetailsInfoLabel>Data de Estreia:</DetailsInfoLabel>
                <DetailsInfoValue>
                  {animeDetails.startDate.day || "?"}/{animeDetails.startDate.month || "?"}/{animeDetails.startDate.year || "?"}
                </DetailsInfoValue>
              </DetailsInfoRow>
            )}

            {animeDetails?.season && (
              <DetailsInfoRow>
                <DetailsInfoLabel>Temporada:</DetailsInfoLabel>
                <DetailsInfoValue>
                  {
                    animeDetails.season === "WINTER"
                      ? "Inverno"
                      : animeDetails.season === "SPRING"
                      ? "Primavera"
                      : animeDetails.season === "SUMMER"
                      ? "Verão"
                      : animeDetails.season === "FALL"
                      ? "Outono"
                      : animeDetails.season
                  }{" "}
                  {animeDetails.seasonYear}
                </DetailsInfoValue>
              </DetailsInfoRow>
            )}
          </DetailsContainer>
        </SectionContainer>

        {animeDetails?.genres && animeDetails.genres.length > 0 && (
          <SectionContainer>
            <SectionTitle style={{ marginBottom: 12 }}>Gêneros</SectionTitle>
            <View style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
            }}>
              {animeDetails.genres.map((genre, index) => (
                <GenreItem_ genre={genre} index={index} key={`genre-${genre}`} />
              ))}
            </View>
          </SectionContainer>
        )}

        <SectionContainer>
          <SectionTitle>Personagens</SectionTitle>
          {loading ? (
            <ActivityIndicator color="#3DB4F2" size="large" />
          ) : characters.length > 0 ? (
            <FlatList
              data={characters}
              renderItem={({ item, index }) => (
                <CharacterCard_ char={item} index={index} key={`char-${item.id}`} />
              )}
              keyExtractor={(item, index) => `char-${item.id}`}
              horizontal
              scrollEnabled={true}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <EmptyText>Nenhum personagem encontrado.</EmptyText>
          )}
        </SectionContainer>

        <SectionContainer>
          <SectionTitle>Staff</SectionTitle>
          {loading ? (
            <ActivityIndicator color="#3DB4F2" size="large" />
          ) : staff.length > 0 ? (
            <FlatList
              data={staff}
              renderItem={({ item, index }) => (
                <StaffCard_ staffMember={item} index={index} key={`staff-${item.id}`} />
              )}
              keyExtractor={(item, index) => `staff-${item.id}`}
              horizontal
              scrollEnabled={true}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <EmptyText>Nenhum membro da staff encontrado.</EmptyText>
          )}
        </SectionContainer>

        <SectionContainer>
          <SectionTitle>Estúdios</SectionTitle>
          {loading ? (
            <ActivityIndicator color="#3DB4F2" size="large" />
          ) : studios.length > 0 ? (
            <View style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
            }}>
              {studios.map((studio, index) => (
                <StudioItem_ studio={studio} index={index} key={`studio-${studio.id}`} />
              ))}
            </View>
          ) : (
            <EmptyText>Nenhum estúdio encontrado.</EmptyText>
          )}
        </SectionContainer>

        <SectionContainer>
          <SectionTitle>Reviews da Comunidade</SectionTitle>
          {loading ? (
            <ActivityIndicator color="#3DB4F2" size="large" />
          ) : reviews.length > 0 ? (
            <FlatList
              data={reviews}
              renderItem={({ item, index }) => (
                <ReviewItem_ review={item} index={index} key={`review-${item.id}`} />
              )}
              keyExtractor={(item, index) => `review-${item.id}`}
              scrollEnabled={false}
              removeClippedSubviews={true}
            />
          ) : (
            <EmptyText>
              Nenhuma review encontrada para este anime.
            </EmptyText>
          )}
        </SectionContainer>
      </ScrollView>
    </Container>
  );
}

// Componentes memoizados para otimizar renderização
const CharacterCard_ = React.memo(({ char, index }) => (
  <CharacterCard key={`char-${char.id}-${index}`}>
    <CharacterImage
      source={{
        uri: char.image?.medium || 'https://via.placeholder.com/80x120',
      }}
    />
    <CharacterName>{char.name?.full}</CharacterName>
  </CharacterCard>
));

const StaffCard_ = React.memo(({ staffMember, index }) => (
  <CharacterCard key={`staff-${staffMember.id}-${index}`}>
    <CharacterImage
      source={{
        uri: staffMember.image?.medium || 'https://via.placeholder.com/80x120',
      }}
    />
    <CharacterName>{staffMember.name?.full}</CharacterName>
  </CharacterCard>
));

const GenreItem_ = React.memo(({ genre, index }) => (
  <GenreBadge key={`genre-${genre}-${index}`}>
    <GenreBadgeText>{genre}</GenreBadgeText>
  </GenreBadge>
));

const StudioItem_ = React.memo(({ studio, index }) => (
  <StudioBadge key={`studio-${studio.id}-${index}`}>
    <StudioBadgeText>{studio.name}</StudioBadgeText>
  </StudioBadge>
));

const ReviewItem_ = React.memo(({ review, index }) => (
  <ReviewCard key={`review-${review.id}-${index}`}>
    <ReviewHeader>
      <ReviewAuthor>
        {review.user?.name || "Anônimo"}
      </ReviewAuthor>
      <ReviewRating>
        ⭐ {review.rating}/100
      </ReviewRating>
    </ReviewHeader>
    <ReviewText>{review.summary}</ReviewText>
  </ReviewCard>
));
