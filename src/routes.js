import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "@expo/vector-icons/MaterialIcons";

import Login from "./pages/login";
import Favorites from "./pages/favorites";
import Details from "./pages/details";
import Register from "./pages/register";
import Home from "./pages/home";
import WatchLater from "./pages/watchLater";
import Profile from "./pages/profile";
import { routesStyles as styles, defaultHeaderOptions } from "./styles";

const Stack = createStackNavigator();

function HeaderUser() {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    async function loadUser() {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    loadUser();
  }, []);

  const handleLogout = () => {
    setModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ marginRight: 15 }}
      >
        <Icon name="account-circle" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.userInfo} 
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("Profile");
              }}
            >
              <Icon name="person" size={24} color="#7F8C8D" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.userName}>{user.nome || "Usuário"}</Text>
                <Text style={styles.userEmail}>
                  {user.email || "email@email.com"}
                </Text>
              </View>
            </TouchableOpacity>

            
            <View style={styles.divider} />
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Icon name="logout" size={20} color="#E74C3C" />
              <Text style={styles.logoutText}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={defaultHeaderOptions}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "ANIMALIST" }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: "Descobrir Animes",
            headerRight: () => <HeaderUser />,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Favorites"
          component={Favorites}
          options={{
            title: "Favoritos",
          }}
        />
        <Stack.Screen
          name="WatchLater"
          component={WatchLater}
          options={{
            title: "Assistir Mais Tarde",
          }}
        />
        <Stack.Screen
          name="Details"
          component={Details}
          options={{ title: "Detalhes do Anime" }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: "ANIMALIST" }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: "ANIMALIST" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
