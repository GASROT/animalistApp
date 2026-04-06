import  { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthCard, loginStyles as styles } from "../styles";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const navigation = useNavigation();

  const handleLogin = async () => {
    const savedUsers = await AsyncStorage.getItem("users");
    if (!savedUsers) {
      alert("Nenhum usuário cadastrado no sistema!");
      return;
    }

    const usersList = JSON.parse(savedUsers);
    const foundUser = usersList.find(u => u.usuario === usuario && u.senha === senha);

    if (foundUser) {
      // Usamos a chave "user" para referenciar globalmente quem está logado nesta sessão
      await AsyncStorage.setItem("user", JSON.stringify(foundUser));
      navigation.navigate("Home");
    } else {
      alert("Usuário ou senha inválidos!");
    }
  };

  const handleNavigateRegister = () => {
    navigation.navigate("Register")
  }

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>BEM VINDO DE VOLTA!</Text>
        <Text style={styles.welcomeSubtitle}>
          Faça login para acessar sua lista de animes.
        </Text>
      </View>

      <AuthCard>
        <TextInput
          style={styles.input}
          placeholder="Usuário"
          placeholderTextColor="#000000"
          value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#000000"
        value={senha}
        secureTextEntry={true}
        onChangeText={setSenha}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleNavigateRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </AuthCard>
    </View>
  );
};

export default Login;
