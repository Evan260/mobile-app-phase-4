import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { DrawerToggleButton } from "@react-navigation/drawer";

const _layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: { backgroundColor: "black", width: 393 },
          drawerLabelStyle: {
            fontSize: 20,
            color: "white",
            fontWeight: "bold",
          },
          drawerPosition: "right",
          headerLeft: false,
          headerRight: () => <DrawerToggleButton />,
        }}
      >
        <Drawer.Screen name="Setting" />
        <Drawer.Screen name="inbox" />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default _layout;
