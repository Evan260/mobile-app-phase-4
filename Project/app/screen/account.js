import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const profile_picture = require("../../assets/blank-profile.png");
const placeH = require("../../assets/blank-profile.png");
const birthdate = require("../../assets/birthday-cake.png");
const location = require("../../assets/location.png");
const gender = require("../../assets/gender.png");
const email = require("../../assets/email.png");
const trash = require("../../assets/trash.png");
const Profile = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.topSection}>
            <View style={styles.profpicSection}>
              <Image source={profile_picture} style={styles.profpic} />
            </View>
            <Text style={styles.name}>Admin</Text>
            <Text style={styles.membership}>Premium</Text>
          </View>

          <TouchableOpacity style={styles.buttonSection} activeOpacity={0.7}>
            <View style={styles.buttonArea}>
              <View style={styles.iconArea}>
                <Image source={birthdate} style={styles.iconStyle} resizeMode="contain" />
              </View>
              <Text style={styles.buttonName}>12/12/2024</Text>
            </View>
            <View style={styles.sp}></View>
          </TouchableOpacity>


          <TouchableOpacity style={styles.buttonSection} activeOpacity={0.7}>
            <View style={styles.buttonArea}>
              <View style={styles.iconArea}>
                <Image source={location} style={styles.iconStyle} resizeMode="contain" />
              </View>
              <Text style={styles.buttonName}>Calgary</Text>
            </View>
            <View style={styles.sp}></View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSection} activeOpacity={0.7}>
            <View style={styles.buttonArea}>
              <View style={styles.iconArea}>
                <Image source={gender} style={styles.iconStyle} resizeMode="contain" />
              </View>
              <Text style={styles.buttonName}>Male</Text>
            </View>
            <View style={styles.sp}></View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSection} activeOpacity={0.7}>
            <View style={styles.buttonArea}>
              <View style={styles.iconArea}>
                <Image source={email} style={styles.iconStyle} resizeMode="contain" />
              </View>
              <Text style={styles.buttonName}>email@email.com</Text>
            </View>
            <View style={styles.sp}></View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSection} activeOpacity={0.7}>
            <View style={styles.buttonArea}>
              <View style={styles.iconAreaDel}>
                <Image source={trash} style={styles.iconStyle} resizeMode="contain" />
              </View>
              <Text style={styles.buttonNameDel}>Delete Account</Text>
            </View>
            <View style={styles.sp}></View>
          </TouchableOpacity>
        </ScrollView>
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
  scrollViewContent: {
    paddingBottom: 20,
  },
  topSection: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  profpicSection: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 4,
    borderColor: "green",
  },
  profpic: {
    width: "100%",
    height: "100%",
    borderRadius: 85,
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
    alignItems: "flex-start",
    flexDirection: "row",
    paddingTop: 5,
  },
  iconArea: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  iconAreaDel: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
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
  buttonNameDel: {
    fontSize: 20,
    color: "red",
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
