import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
} from "react-native";
import { settingService } from "../services/SettingsService";
import { blacklistService } from "../services/BlacklistService";
import { expoTokenService } from "../services/ExpoTokenService";
import { jobService } from "../services/JobService";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { BackendContext } from "../context/backend";
import { ScrollView } from "react-native-gesture-handler";
import * as SecureStore from "expo-secure-store";

export const Settings = () => {
  const [delivery, setDelievery] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState("");
  const [expoToken, setExpoToken] = useState("");
  const [job, setJob] = useState(false);
  const [minYear, setMinYear] = useState("");
  const [server, setServer] = useContext(BackendContext);
  const [zipCode, setZipCode] = useState("");

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      let token = await Notifications.getExpoPushTokenAsync();
      setExpoToken(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };
  const updateSettings = () => {
    settingService
      .server(server)
      .setSettings({
        query: query,
        delievery: delivery,
        price_min: priceMin,
        price_max: priceMax,
        radius: radius,
        zipCode: zipCode,
        yearMin: minYear,
      })
      .then((result) => {
        alert(JSON.stringify(result));
      });
  };

  const getSettings = () => {
    settingService
      .server(server)
      .getSettings()
      .then((result) => {
        setDelievery(result.delievery);
        setPriceMin(result.price_min);
        setPriceMax(result.price_max);
        setQuery(result.query);
        setRadius(result.radius);
        setZipCode(result.zipCode);
        setMinYear(result.yearMin);
      });
  };

  const getCurrentJobStatus = () => {
    jobService
      .server(server)
      .status()
      .then((data) => {
        setJob(data.isJobRunning);
      });
  };

  useEffect(() => {
    getSettings();
    registerForPushNotificationsAsync();
    getCurrentJobStatus();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <Text>Query:</Text>
          <TextInput
            style={styles.settingsTextInput}
            onChangeText={(text) => setQuery(text)}
            value={query}
          ></TextInput>
        </View>
        <View>
          <Text>Price Min:</Text>
          <TextInput
            style={styles.settingsTextInput}
            onChangeText={(text) => setPriceMin(text)}
            value={priceMin}
            keyboardType={"number-pad"}
          ></TextInput>
        </View>
        <View>
          <Text>Price Max:</Text>
          <TextInput
            style={styles.settingsTextInput}
            onChangeText={(text) => setPriceMax(text)}
            value={priceMax}
            keyboardType={"number-pad"}
          ></TextInput>
        </View>
        <View>
          <Text>Delievery (p (pickup) or s (shipping)):</Text>
          <TextInput
            style={styles.settingsTextInput}
            onChangeText={(text) => setDelievery(text)}
            value={delivery}
          ></TextInput>
        </View>
        <View>
          <Text>Radius: </Text>
          <TextInput
            style={styles.settingsTextInput}
            onChangeText={(text) => setRadius(text)}
            value={radius}
            keyboardType={"number-pad"}
          ></TextInput>
        </View>
        <View>
          <Text>Min post year: </Text>
          <TextInput
            style={styles.settingsTextInput}
            onChangeText={(text) => setMinYear(text)}
            value={minYear}
            keyboardType={"number-pad"}
          ></TextInput>
        </View>
        <View>
          <Text>Zipcode: </Text>
          <TextInput
            style={styles.settingsTextInput}
            onChangeText={(text) => setZipCode(text)}
            value={zipCode}
            keyboardType={"number-pad"}
          ></TextInput>
        </View>
        <View>
          <Text>Server: </Text>
          <TextInput
            style={styles.settingsTextInput}
            onChangeText={(text) => {
              setServer(text);
              SecureStore.setItemAsync("server", text);
            }}
            value={server}
          ></TextInput>
        </View>
        <View
          style={{
            marginTop: 10,
          }}
        >
          <Button
            onPress={() => {
              updateSettings();
            }}
            title="Update"
          />
        </View>
        <View
          style={{
            marginTop: 10,
          }}
        >
          <Button
            onPress={() => {
              getSettings();
            }}
            color="#2ecc71"
            title="Reload"
          />
        </View>
        <View
          style={{
            marginTop: 10,
          }}
        >
          <Button
            onPress={() => {
              blacklistService
                .server(server)
                .clearBlackList()
                .then((data) => {
                  alert(JSON.stringify(data));
                });
            }}
            color="#c0392b"
            title="Clear blacklist"
          />
        </View>
        <View
          style={{
            marginTop: 10,
          }}
        >
          <Button
            onPress={() => {
              expoTokenService
                .server(server)
                .send(expoToken)
                .then((result) => {
                  alert(JSON.stringify(result));
                });
            }}
            color="#7f8c8d"
            title="Send token to server"
          />
        </View>
        <View
          style={{
            marginTop: 10,
          }}
        >
          <Button
            onPress={() => {
              if (job) {
                jobService
                  .server(server)
                  .stop()
                  .then((data) => {
                    setJob(!job);
                    alert("stopped job service");
                  });
              } else {
                jobService
                  .server(server)
                  .start()
                  .then((data) => {
                    setJob(!job);
                    alert("started job service");
                  });
              }
            }}
            color="#ff6b6b"
            title={`Toggle Extract, currently: ${job === true ? "on" : "off"} `}
          />
        </View>
        <View
          style={{
            marginTop: 10,
          }}
        >
          <Button
            onPress={() => {
              jobService
                .server(server)
                .extract()
                .then((data) => {
                  alert(JSON.stringify(data));
                });
            }}
            color="#222f3e"
            title={`Execute Extract`}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  settingsTextInput: {
    padding: 5,
    borderColor: "black",
    borderWidth: 1,
  },
  container: {
    width: "90%",
    marginTop: 30,
    marginLeft: "auto",
    marginRight: "auto",
  },
});
