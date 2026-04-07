import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { AuthCard, registerStyles as styles } from "../styles";
import { formatarTelefone, formatarCPF } from "../utils/formatters";

export default function Register() {
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [curso, setCurso] = useState("");

  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!nome || !usuario || !senha || !telefone || !cpf || !email || !curso) {
      alert("Preencha todos os campos!");
      return;
    }

    if (nome.trim().length < 3) {
      alert("O nome deve conter pelo menos 3 caracteres.");
      return;
    }
    if (usuario.trim().length < 4) {
      alert("O nome de usuário deve conter pelo menos 4 caracteres.");
      return;
    }
    if (senha.length < 6 || !/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
      alert("A senha deve ter no mínimo 6 caracteres e incluir um caractere especial (!@#$...).");
      return;
    }
    if (telefone.replace(/\D/g, "").length < 10) {
      alert("O telefone deve ser válido e ter ao menos 10 dígitos.");
      return;
    }
    if (cpf.replace(/\D/g, "").length < 11) {
      alert("O CPF deve conter no mínimo 11 dígitos.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, insira um endereço de e-mail válido.");
      return;
    }
    if (curso.trim().length === 0) {
      alert("Selecione um curso válido.");
      return;
    }

    const savedUsers = await AsyncStorage.getItem("users");
    let usersList = savedUsers ? JSON.parse(savedUsers) : [];

    if (usersList.find(u => u.usuario === usuario)) {
      alert("Este nome de usuário já está em uso!");
      return;
    }

    const user = {
      nome: nome.trim(),
      usuario: usuario.trim(),
      senha,
      telefone: telefone.trim(),
      cpf: cpf.trim(),
      email: email.trim(),
      curso: curso.trim(),
    };

    usersList.push(user);
    await AsyncStorage.setItem("users", JSON.stringify(usersList));
    
    alert("Usuário cadastrado com sucesso!");
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>SEJA BEM VINDO!</Text> 
              <Text style={styles.welcomeSubtitle}>
                Faça o Cadastro para acessar sua lista de animes.
              </Text>
            </View>
      <AuthCard>
      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        placeholderTextColor="#000000"
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
        maxLength={50}
      />
      <TextInput
        style={styles.input}
        placeholder="Usuário (Mínimo 4 caracteres)"
        placeholderTextColor="#000000"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
        maxLength={20}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha (Mín. 6 e caractere especial)"
        placeholderTextColor="#000000"
        secureTextEntry={true}
        value={senha}
        onChangeText={setSenha}
        maxLength={30}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone (XX) XXXXX-XXXX"
        placeholderTextColor="#000000"
        value={telefone}
        onChangeText={(valor) => setTelefone(formatarTelefone(valor))}
        keyboardType="phone-pad"
        maxLength={15}
      />
      <TextInput
        style={styles.input}
        placeholder="XXX.XXX.XXX-XX (CPF)"
        placeholderTextColor="#000000"
        value={cpf}
        onChangeText={(valor) => setCpf(formatarCPF(valor))}
        keyboardType="numeric"
        maxLength={14}
      />
      <TextInput
        style={styles.input}
        placeholder="E-mail (ex: email@email.com)"
        placeholderTextColor="#000000"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        maxLength={60}
      />
      <View style={styles.pickerContainer}>
        <Picker
          style={styles.picker}
          selectedValue={curso}
          onValueChange={(itemValue) => setCurso(itemValue)}
        >
          <Picker.Item label="Selecione um curso..." value="" />
          <Picker.Item label="Análise e Desenvolvimento de Sistemas" value="Análise e Desenvolvimento de Sistemas" />
          <Picker.Item label="Desenvolvimento de Software Multiplataforma" value="Desenvolvimento de Software Multiplataforma" />
          <Picker.Item label="Gestão da Produção Industrial" value="Gestão da Produção Industrial" />
          <Picker.Item label="Gestão de Recursos Humanos" value="Gestão de Recursos Humanos" />
          <Picker.Item label="Gestão Empresarial (a distância)" value="Gestão Empresarial (a distância)" />
        </Picker>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      </AuthCard>
    </View>
  );
}
