import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  Button,
  Alert,
  ToastAndroid,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { blacklistService } from "../services/BlacklistService";
import { Link } from "@react-navigation/native";
import { BackendContext } from "../context/backend";

export const Card = ({ item }) => {
  const [server, setServer] = useContext(BackendContext);
  return (
    <TouchableHighlight
      underlayColor="transparent"
      onPress={() => console.log("hi")}
    >
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardImageContainer}>
            <Image
              style={styles.image}
              source={{
                uri: item.imageUrls[0],
              }}
            />
          </View>
          <View style={styles.cardMainContainer}>
            <Text>{item.title}</Text>
            {item.description !== "" && (
              <Text style={styles.description}>{item.description}</Text>
            )}
          </View>
          <View style={styles.ownerInfo}>
            <View style={styles.ownerInfoRow}>
              <MaterialIcons name="star" size={24} color="black" />
              <Text>{item.owner.ownerStars} Stars</Text>
            </View>
            <View style={styles.ownerInfoRow}>
              <MaterialIcons name="thumb-up" size={24} color="black" />
              <Text>{item.owner.ownerReviews} review(s)</Text>
            </View>
            {item.owner.isTruYou === true && (
              <View style={styles.ownerInfoRow}>
                <MaterialIcons name="check" size={24} color="black" />
                <Text>TruYouVerfied</Text>
              </View>
            )}
          </View>
          <View style={styles.ownerInfo}>
            <View style={styles.ownerInfoRow}>
              <Text>
                Posted by {new Date(item.postDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.ownerInfoRow}>
              <Text>Owner joined by {item.owner.ownerJoinedYear}</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <View style={styles.priceColumn}>
              <Text>Total Price</Text>
              <Text style={styles.priceText}>${item.price}</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <Button
              onPress={() => {
                Linking.openURL(item.url);
              }}
              title="Open"
            />
          </View>
          <View style={styles.actionButtons}>
            <Button
              onPress={() => {
                Alert.alert(
                  "Confirm",
                  "You sure you want to delete this item?",
                  [
                    {
                      text: "No",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        blacklistService
                          .server(server)
                          .blacklist(item.id)
                          .then((data) => {
                            ToastAndroid.show(
                              "Blacklisted",
                              ToastAndroid.SHORT
                            );
                          });
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }}
              color="black"
              title="Blacklist"
            />
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  actionButtons: {
    marginTop: 10,
    marginBottom: 10,
  },
  priceText: {
    fontWeight: "bold",
    fontSize: 28,
  },
  priceColumn: {
    display: "flex",
    flexDirection: "column",
  },
  priceContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  ownerInfoRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  ownerInfo: {
    display: "flex",
    flexDirection: "row",
  },
  description: {
    fontSize: 24,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 300,
  },
  cardImageContainer: {
    flex: 1,
  },
  cardMainContainer: {
    flex: 2,
    padding: 10,
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 0,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
});
