import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { TextInput, Pressable } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
//https://github.com/react-native-async-storage/async-storage
import AsyncStorage from "@react-native-async-storage/async-storage";

const AllergyInput = () => {
  const [myAllergies, setText] = useState("");
  const [allMyAllergies, setAllMyAllergies] = useState(
    AsyncStorage.getItem("Allergies")
  );
  // improvement - name of person with allergies

  return (
    <View style={{ paddingTop: 10, marginTop: 10 }}>
      <TextInput
        style={{ height: 36, paddingBottom: 10 }}
        placeholder="Enter name of Allergen:"
        onChangeText={(text) => setText(text)}
        defaultValue={myAllergies}
      />
      <Pressable
        style={styles.log}
        onPress={async () => {
          console.log("input: " + myAllergies);
          setAllMyAllergies((previous) => {
            return previous + "\n -" + myAllergies;
          });
          try {
            const storedAllergies = await AsyncStorage.getItem("Allergies");
            if (storedAllergies !== null) {
              // previously stored allergies -- need to make sure no duplicates!!
              console.log("stored data: " + storedAllergies);
              const dataToStore = storedAllergies + myAllergies + ";";
              await AsyncStorage.setItem("Allergies", dataToStore);
            } else {
              // no previously stored allergies
              const dataToStore = myAllergies + ";";
              await AsyncStorage.setItem("Allergies", dataToStore);
            }
          } catch (e) {
            console.log(e);
          }
          <MyAllergiesDisplay />;
        }}
      >
        <Text>Log Allergy</Text>
      </Pressable>
      <Text style={styles.title}>My Allergies</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={{ paddingTop: 10, marginTop: 10 }}>
        <Text>{myAllergies}</Text>
      </View>
    </View>
  );
};

const MyAllergiesDisplay = () => {
  var toDisplay = "No Allergies";
  const data = async () => {
    try {
      const storedAllergies = await AsyncStorage.getItem("Allergies");
      if (storedAllergies !== null) {
        toDisplay = storedAllergies;
      } else {
        toDisplay = "No Allergies";
      }
    } catch (e) {
      console.log(e);
    }
  };
  data();
  console.log(toDisplay);
  return null;
};

export default function MyInfo() {
  return (
    <View style={styles.container}>
      <AllergyInput />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      <Pressable
        style={styles.clear}
        onPress={async () => {
          try {
            await AsyncStorage.clear();
            console.log("cleared");
          } catch (e) {
            console.log(e);
          }
        }}
      >
        <Text>Clear Allergies</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 12,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "80%",
  },
  log: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: "#ADD8E6",
  },
  clear: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: "#FF7F7F",
  },
});
