import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import qs from "qs";
import React from "react";

const ESP_IP = "http://192.168.3.61";

export default function App() {
  const [ledStatus, setLedStatus] = useState(false);
  const [loading, setLoading] = useState(false);
 const [analog ,setAnalog]= useState(null);



  async function handleButton() {
    setLoading(true);

    const newStatus = ledStatus ? "off" : "on";

    try {
      const response = await axios.post(
        `${ESP_IP}/led`,
        qs.stringify({ state: newStatus }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.status === 200) {
        setLedStatus(!ledStatus);
      } else {
        Alert.alert("Erro", "Não foi possivel acionar o led");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha na conexão");
      
    } finally {
      setLoading(false);
    }
  }

  async function fetchAnalog(){
    setLoading(true);
try {
  
  const response = await axios.get(`${ESP_IP}/analog`);

  if (response.status === 200) {
   setAnalog(response.data);

  } else {
    Alert.alert("Erro", "Não foi possivel ler a analogica");
  }


} catch (error) {
  console.error(error);
  setAnalog(null)
  Alert.alert("Erro", "Falha na conexão");
} finally {
  setLoading(false);
}

  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle ESP32</Text>
      <View
        style={[
          styles.status,
          { backgroundColor: ledStatus ? "#10a83e" : "#c50c2b" },
        ]}
      ></View>

      {loading && <ActivityIndicator size={"large"} color={"#040d8a"} />}

      <TouchableOpacity
        style={[
          styles.botao,
          { backgroundColor: !ledStatus ? "#30b909" : "#c50c2b" },
        ]}
        onPress={handleButton}
      >
        <Text style={styles.textoBotao}>
          {ledStatus ? "Desligar" : "Ligar"}
        </Text>
      </TouchableOpacity>

     <TouchableOpacity style={styles.analogButton} onPress={fetchAnalog}>
       <Text style={styles.textoBotao}>Ler</Text>
     </TouchableOpacity>

    {analog != null && (<Text style={styles.analogText}>Valor analógico : {analog}</Text>)}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  status: {
    marginTop: 10,
    width: 50,
    height: 50,
    borderRadius: 15,
  },
  botao: {
    padding: 18,
    margin: 10,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  title: {
    fontSize: 24,
  },
  textoBotao: {
    color: "#fff",
    textTransform: "uppercase",
    fontSize: 16,
  },
  analogButton:{
    padding: 18,
    margin: 10,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    backgroundColor:'#f5a623'
  },
  analogText:{
    marginTop:10,
    fontSize:20,
    color:'#000'
  }
});
