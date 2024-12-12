import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const profile_picture = require("../assets/blank-profile.png");
const placeH = require("../assets/blank-profile.png");
const Profile = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topSection}>
          <View style={styles.profpicSection}>
            <Image source={profile_picture} style={styles.profpic} />
          </View>
          <Text style={styles.name}>Account Name</Text>
          <Text style={styles.membership}>Premium</Text>
        </View>

        <TouchableOpacity style={styles.buttonSection} activeOpacity={0.7}>
          <View style={styles.buttonArea}>
            <View style={styles.iconArea}>
              {/* placeH is a placeholder */}
              <Image
                source={placeH}
                style={styles.iconStyle}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.buttonName}>placeH</Text>
          </View>
          <View style={styles.sp}></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSection} activeOpacity={0.7}>
          <View style={styles.buttonArea}>
            <View style={styles.iconArea}>
              {/* placeH is a placeholder */}
              <Image
                source={placeH}
                style={styles.iconStyle}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.buttonName}>placeH</Text>
          </View>
          <View style={styles.sp}></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSection} activeOpacity={0.7}>
          <View style={styles.buttonArea}>
            <View style={styles.iconArea}>
              {/* placeH is a placeholder */}
              <Image
                source={placeH}
                style={styles.iconStyle}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.buttonName}>placeH</Text>
          </View>
          <View style={styles.sp}></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSection} activeOpacity={0.7}>
          <View style={styles.buttonArea}>
            <View style={styles.iconArea}>
              {/* placeH is a placeholder */}
              <Image
                source={placeH}
                style={styles.iconStyle}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.buttonName}>placeH</Text>
          </View>
          <View style={styles.sp}></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSection} activeOpacity={0.7}>
          <View style={styles.buttonArea}>
            <View style={styles.iconArea}>
              {/* placeH is a placeholder */}
              <Image
                source={placeH}
                style={styles.iconStyle}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.buttonName}>placeH</Text>
          </View>
          <View style={styles.sp}></View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  safeArea: {
    flex: 1,
  },
  topSection: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  profpicSection: {
    width: 170,
    height: 170,
    borderRadius: "100%",
    borderWidth: 4,
    borderColor: "green",
  },
  profpic: {
    width: "100%",
    height: "100%",
    borderRadius: "100%",
  },
  name: {
    marginTop: 20,
    color: "white",
    fontSize: 30,
  },
  membership: {
    color: "yellow",
    fontSize: 19,
  },
  buttonSection: {
    padding: 12,
    paddingLeft: 25,
    paddingRight: 25,
  },
  buttonArea: {
    alignItems: "left",
    flexDirection: "row",
    paddingTop: 5,
  },
  iconArea: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
  },
  iconStyle: {
    width: 30,
    height: 30,
  },
  buttonName: {
    fontSize: 20,
    color: "white",
    paddingTop: 12,
    paddingLeft: 10,
  },
  sp: {
    width: "100%",
    height: 1,
    backgroundColor: "white",
    marginTop: 10,
  },
});
