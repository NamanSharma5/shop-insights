import * as React from "react";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { TextInput, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// text display under submit button
// const IngredientBreakdown = (product) => {
//   // this shouldn't reload each letter input but once a submit button is pressed - to minimise API calls
//   //console.log(product);
//   return (
//     <View>
//       <Text style={{ textAlign: "center", fontSize: 20 }}>
//         {product.name.replace(/\s/g, "%20")}
//       </Text>
//     </View>
//   );
// };

// text input
const ProductInput = () => {
  const [text, setText] = useState("");

  // for ingredientBreakdown
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [potentialWarnings, setPotentialWarnings] = useState("Warnings:");

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
          const warnings = new Set();
          setPotentialWarnings((previous) => {
            return "Warnings: ";
          });
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

                  ingredients.forEach((ingredient) => {
                    if (allergies.has(ingredient)) {
                      warnings.add(ingredient);
                    } else {
                      const individual = ingredient;
                      const items = individual.split(" ");
                      items.forEach((item) => {
                        if (allergies.has(item)) {
                          warnings.add(item);
                        }
                      });
                    }
                  });

                  warnings.forEach((warning) => {
                    console.log("Warning Contains: " + warning);
                    setPotentialWarnings((previous) => {
                      return previous + "\n - " + warning;
                    });
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

      <Text style={styles.warnings}>{potentialWarnings}</Text>
    </View>
  );
};

/*
Sample API call looks like:
https://api.edamam.com/api/food-database/v2/parser?app_id=3a314a99&app_key=932f9177cb3bada32c54eb4b5b3adc53&ingr=chicken%20%26%20vegetable%20soup&nutrition-type=cooking
https://api.edamam.com/api/food-database/v2/parser?app_id=3a314a99&app_key=932f9177cb3bada32c54eb4b5b3adc53&ingr=classic%20pancakes&nutrition-type=cooking

*/

function TabOneScreen({ navigation }: RootTabScreenProps<"TabOne">) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Allergen Identifier</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <ProductInput />
    </View>
  );
}

export default TabOneScreen;

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
  warnings: {
    alignItems: "center",
    justifyContent: "center",
    color: "#FF0000",
    marginTop: 12,
  },
});
