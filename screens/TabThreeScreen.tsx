import * as React from "react";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { TextInput, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

//text input
const ProductInput = () => {
  const [text, setText] = useState("");

  // for ingredientBreakdown
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  return (
    <View style={{ paddingTop: 20 }}>
      <TextInput
        style={{ height: 36, paddingBottom: 10 }}
        placeholder="Type product name here:"
        onChangeText={(text) => setText(text)}
        defaultValue={text}
      />
      <Pressable
        style={styles.submitButton}
        onPress={() => {
          const ingr = text.replace(/\s/g, "%20");
          console.log(ingr);
          const ingredients = new Set();
          const allergies = new Set();

          //Edamam api call
          const requestString =
            "https://api.edamam.com/api/food-database/v2/parser?app_id=3a314a99&app_key=932f9177cb3bada32c54eb4b5b3adc53&ingr=" +
            ingr +
            "&nutrition-type=cooking";
          if (ingr === "") {
            console.log("Invalid input");
          } else {
            console.log(requestString);
            fetch(requestString)
              .then((response) => response.json())
              .then((json) => {
                //console.log(json);
                // assumed json structure: hints -> food -> foodContentsLabel
                //console.log(Object.keys(json));
                // assume json.hints exists regardless of the input & is array
                for (let i = 0; i < json.hints.length; i++) {
                  //console.log(json.hints[i]);
                  //console.log(Object.keys(json.hints[i]));
                  //console.log(Object.keys(json.hints[i].food));
                  if (
                    Object.keys(json.hints[i].food).includes(
                      "foodContentsLabel"
                    )
                  ) {
                    json.hints[i].food.foodContentsLabel
                      .toLowerCase()
                      .split(";")
                      .forEach((item) => {
                        ingredients.add(item.trim());
                      });
                  }
                }

                const data = async () => {
                  try {
                    const storedAllergies = await AsyncStorage.getItem(
                      "Allergies"
                    );
                    if (storedAllergies !== null) {
                      //console.log(stored);
                      storedAllergies
                        .toLowerCase()
                        .split(";")
                        .forEach((item) => {
                          allergies.add(item.trim());
                        });
                    }
                  } catch (e) {
                    console.log(e);
                  }
                  console.log(" \n Allergies");
                  console.log(allergies);
                  allergies.forEach((allergen) => {
                    if (ingredients.has(allergen)) {
                      console.log("Warning contains: " + allergen);
                    }
                  });
                  console.log("complete");
                };
                data();
                console.log("\n Ingredients");
                console.log(ingredients);
              })
              .catch((error) => console.log(error));
          }
        }}
      >
        <Text>Submit</Text>
      </Pressable>

      <FontAwesome.Button name="barcode" size={30} style={styles.barcodeButton}>
        Scan
      </FontAwesome.Button>

      {/* <IngredientBreakdown name={text} /> */}
    </View>
  );
};

export default function TabThreeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Desired Nutrients</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Text
        style={styles.getStartedText}
        lightColor="rgba(0,0,0,0.8)"
        darkColor="rgba(255,255,255,0.8)"
      >
        Check if a product contains specific desired nutrients!
      </Text>
      <ProductInput />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 12,
    marginTop: 12,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "80%",
  },
  submitButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 14,
    borderRadius: 8,
    elevation: 4,
    backgroundColor: "#ADD8E6",
  },
  barcodeButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ADD8E6",
    elevation: 4,
    borderRadius: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
});
