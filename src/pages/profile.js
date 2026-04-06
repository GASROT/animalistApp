import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Icon from "@expo/vector-icons/MaterialIcons";
import { AnimeCard, CoverImage, AnimeTitle, profileStyles as styles } from "../styles";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [recentFavorites, setRecentFavorites] = useState([]);
  const [recentWatchLater, setRecentWatchLater] = useState([]);
  const [passwordModal, setPasswordModal] = useState(false);
  const [senhaConfirmacao, setSenhaConfirmacao] = useState("");
  const navigation = useNavigation();

  const loadData = async () => {
    const userStr = await AsyncStorage.getItem("user");
    if (userStr) {
      const currentUser = JSON.parse(userStr);
      setUser(currentUser);

      const favsStr = await AsyncStorage.getItem(`animes_${currentUser.usuario}`);
      if (favsStr) {
        // Pega os últimos adicionados revertendo o array
        const favsList = JSON.parse(favsStr);
        setRecentFavorites(favsList.reverse().slice(0, 8));
      } else {
        setRecentFavorites([]);
      }

      const watchLaterStr = await AsyncStorage.getItem(`watchLater_${currentUser.usuario}`);
      if (watchLaterStr) {
        const watchList = JSON.parse(watchLaterStr);
        setRecentWatchLater(watchList.reverse().slice(0, 8));
      } else {
        setRecentWatchLater([]);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (senhaConfirmacao !== user.senha) {
      Alert.alert("Erro", "Senha incorreta!");
      return;
    }

    try {
      // 1. Remover do array global de usuários
      const allUsersStr = await AsyncStorage.getItem("users");
      if (allUsersStr) {
        let allUsers = JSON.parse(allUsersStr);
        allUsers = allUsers.filter(u => u.usuario !== user.usuario);
        await AsyncStorage.setItem("users", JSON.stringify(allUsers));
      }

      // 2. Apagar as listas vinculadas a este usuário
      await AsyncStorage.removeItem(`animes_${user.usuario}`);
      await AsyncStorage.removeItem(`watchLater_${user.usuario}`);

      // 3. Deslogar
      await AsyncStorage.removeItem("user");

      Alert.alert("Conta Excluída", "Sua conta e todos os dados foram apagados permanentemente.");
      setPasswordModal(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch(err) {
      Alert.alert("Erro", "Falha ao apagar conta.");
    }
  };

  const renderItem = ({ item }) => (
    <AnimeCard style={styles.horizontalCard} onPress={() => navigation.navigate("Details", { anime: item })}>
      <CoverImage source={{ uri: item.avatar }} style={styles.horizontalImage} />
      <AnimeTitle numberOfLines={2}>{item.name}</AnimeTitle>
    </AnimeCard>
  );

  if (!user) return <View style={styles.container} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={styles.headerProfile}>
        <Icon name="account-circle" size={80} color="#3DB4F2" />
        <Text style={styles.profileName}>{user.nome}</Text>
        <Text style={styles.profileUsername}>@{user.usuario}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}><Text style={styles.infoBold}>E-mail: </Text>{user.email}</Text>
        <Text style={styles.infoText}><Text style={styles.infoBold}>Telefone: </Text>{user.telefone}</Text>
        <Text style={styles.infoText}><Text style={styles.infoBold}>Curso: </Text>{user.curso}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimos Favoritos</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        {recentFavorites.length > 0 ? (
          <FlatList
            data={recentFavorites}
            horizontal
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
          />
        ) : (
          <Text style={styles.emptyText}>Nenhum anime favoritado ainda.</Text>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recentes (Assistir Mais Tarde)</Text>
          <TouchableOpacity onPress={() => navigation.navigate("WatchLater")}>
            <Text style={styles.seeAll}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        {recentWatchLater.length > 0 ? (
          <FlatList
            data={recentWatchLater}
            horizontal
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={renderItem}
          />
        ) : (
          <Text style={styles.emptyText}>Nenhum anime na lista de espera.</Text>
        )}
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={() => setPasswordModal(true)}>
        <Icon name="delete-forever" size={24} color="#FFF" />
        <Text style={styles.deleteButtonText}>Excluir Minha Conta</Text>
      </TouchableOpacity>

      <Modal visible={passwordModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirme sua Senha</Text>
            <Text style={styles.modalSubtitle}>Para excluir sua conta e dados permanentemente, digite sua senha.</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Sua senha"
              placeholderTextColor="#748899"
              secureTextEntry
              value={senhaConfirmacao}
              onChangeText={setSenhaConfirmacao}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setPasswordModal(false); setSenhaConfirmacao(""); }}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmDeleteBtn} onPress={handleDeleteAccount}>
                <Text style={styles.confirmDeleteText}>Excluir Conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}
