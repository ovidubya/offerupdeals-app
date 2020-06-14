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

export const Settings = () => {
  const [delivery, setDelievery] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState("");
  const [expoToken, setExpoToken] = useState("");
  const [server, setServer] = useContext(BackendContext);
  const [job, setJob] = useState(false);

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
        <Text>Server: </Text>
        <TextInput
          style={styles.settingsTextInput}
          onChangeText={(text) => setServer(text)}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  settingsTextInput: {
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
