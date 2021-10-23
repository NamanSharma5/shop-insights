import * as React from "react";
import { StyleSheet } from "react-native";
import { TextInput, Pressable } from "react-native";
import { useState } from "react";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

// text input
const ProductInput = () => {
  const [text, setText] = useState("");

  // for ingredientBreakdown
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  return (
    <View style={{ paddingTop: 20 }}>
      <TextInput
        style={{ height: 36, paddingBottom: 10 }}
        placeholder="Type company name here:"
        onChangeText={(text) => setText(text)}
        defaultValue={text}
      />
      <Pressable
        style={styles.submitButton}
        onPress={() => {
          const company = text.replace(/\s/g, "%20");
          console.log(company);
          // const ingredients = new Set();
          // const allergies = new Set();

          //Edamam api call
          const requestString =
            "https://tf689y3hbj.execute-api.us-east-1.amazonaws.com/prod/authorization/search?q=" +
            company +
            "&token=d65869ef7649e77f6059160f1cfc1aa4";
          if (company === "") {
            console.log("Invalid input");
          } else {
            console.log(requestString);
            fetch(requestString)
              .then((response) => response.json())
              .then((json) => {
                if (json.length == 0) {
                  console.log("No ESG information available");
                } else {
                  console.log(json);
                }
              })
              .catch((error) => console.log(error));
          }
        }}
      >
        <Text>Submit</Text>
      </Pressable>

      {/* <IngredientBreakdown name={text} /> */}
    </View>
  );
};

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Environment, Social and Governance</Text>
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
        ESG information on company
      </Text>
      <ProductInput />
    </View>
  );
}
// Sustainability api - paid one below
// https://eaternity.docs.apiary.io/#reference
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
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
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
});
