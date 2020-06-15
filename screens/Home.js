import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, SafeAreaView, ScrollView, View } from "react-native";
import { Card } from "../components/Card";
import { dataService } from "../services/DataService";
import { MaterialIcons } from "@expo/vector-icons";
import { BackendContext } from "../context/backend";

export const Home = () => {
  const [data, setData] = useState([]);
  const [server, setServer] = useContext(BackendContext);
  const getData = () => {
    try {
      dataService
        .server(server)
        .getData()
        .then((data) => {
          setData(data);
        });
    } catch (e) {
      alert("unable to fetch data");
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          position: "absolute",
          bottom: 10,
          color: "black",
          zIndex: 999,
          left: 10,
        }}
      >
        <MaterialIcons.Button
          backgroundColor="#34495e"
          onPress={() => {
            getData();
          }}
          name="refresh"
          size={24}
          color="white"
        >
          Refresh
        </MaterialIcons.Button>
      </View>
      <ScrollView>
        {data &&
          data.length !== 0 &&
          data.map((item, index) => {
            return <Card key={index} item={item} />;
          })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flex: 1,
  },
});
