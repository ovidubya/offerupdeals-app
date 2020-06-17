import React, { useContext, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "./screens/Home";
import { Settings } from "./screens/Settings";
import { MaterialIcons } from "@expo/vector-icons";
import { BackendContext } from "./context/backend";
import * as SecureStore from "expo-secure-store";

const Stack = createStackNavigator();

const HomeStackScreen = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

export default function App() {
  const [server, setServer] = useState("");
  useEffect(async () => {
    const key = await SecureStore.getItemAsync("server");
    if (key) {
      setServer(key);
    } else {
      setServer("http://192.168.0.2:3000/offerup");
    }
  }, []);
  return (
    <BackendContext.Provider value={[server, setServer]}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Home") {
                iconName = "home";
              } else if (route.name === "Settings") {
                iconName = "settings";
              }

              return (
                <MaterialIcons name={iconName} size={size} color={color} />
              );
            },
          })}
        >
          <Tab.Screen name="Home" component={HomeStackScreen} />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      </NavigationContainer>
    </BackendContext.Provider>
  );
}
