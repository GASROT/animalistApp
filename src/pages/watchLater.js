import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { AnimeCard, CoverImage, AnimeTitle, AnimeInfo, ProfileButton, ProfileButtonText, watchLaterStyles as styles } from "../styles";

export default function WatchLater() {
  const [animes, setAnimes] = useState([]);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const loadAnimes = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) {
      const currentUser = JSON.parse(userStr);
      setUser(currentUser);
      const watchLaterKey = `watchLater_${currentUser.usuario}`;
      const storedAnimes = await AsyncStorage.getItem(watchLaterKey);
      if (storedAnimes) {
        setAnimes(JSON.parse(storedAnimes));
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadAnimes();
    }, [])
  );

  const handleRemove = async (id) => {
    if (!user) return;
    const filterAnimes = animes.filter((a) => a.id !== id);
    setAnimes(filterAnimes);
    const watchLaterKey = `watchLater_${user.usuario}`;
    await AsyncStorage.setItem(watchLaterKey, JSON.stringify(filterAnimes));
  };

  return (
    <View style={styles.container}>
      {animes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="watch-later" size={60} color="#151F2E" style={{ marginBottom: 15 }} />
          <Text style={styles.emptyTitle}>Sua lista está vazia</Text>
          <Text style={styles.emptySubtitle}>
            Vá até a página de detalhes de um anime para adicioná-lo aqui e assistir depois!
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
          data={animes}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <AnimeCard style={{ marginBottom: 20 }}>
              <CoverImage source={{ uri: item.avatar }} />
              <AnimeTitle>{item.name}</AnimeTitle>
              <AnimeInfo>{item.bio}</AnimeInfo>
              <ProfileButton onPress={() => navigation.navigate("Details", { anime: item })}>
                <ProfileButtonText>Ver Mais Detalhes</ProfileButtonText>
              </ProfileButton>
              <ProfileButton
                style={{ backgroundColor: "#E23946" }}
                onPress={() => handleRemove(item.id)}
              >
                <ProfileButtonText>Remover</ProfileButtonText>
              </ProfileButton>
            </AnimeCard>
          )}
        />
      )}
    </View>
  );
}


