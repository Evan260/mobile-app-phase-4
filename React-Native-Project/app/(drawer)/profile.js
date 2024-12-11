import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const profile_picture = require("React-Native-Project\assets\blank-profile-picture-973460_1280.webp")
const placeH = require("React-Native-Project\assets\account.png")
const Profile = () => {
  return (
    <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.topSection}>
            <View style={styles.profpicSection}>
              <Image source={profile_picture} style={styles.profpic}/>
            </View>
              <Text style={styles.name}>Account Name</Text>
              <Text style={styles.membership}>Premium</Text>
          </View>

        <TouchableOpacity style={styles.buttonSection} activeOpacity={0.7}>
          <View style={styles.buttonArea}>
            <View style={styles.iconArea}>
              {/* placeH is a placeholder */}
              <Image source={placeH} style={styles.iconStyle} resizeMode="contain"/>
          </View>
            <Text style={styles.buttonName}>placeH</Text>
          </View>
          <View style={styles.sp}></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSection} activeOpacity={0.7}>
          <View style={styles.buttonArea}>
            <View style={styles.iconArea}>
              {/* placeH is a placeholder */}
              <Image source={placeH} style={styles.iconStyle} resizeMode="contain"/>
          </View>
            <Text style={styles.buttonName}>placeH</Text>
          </View>
          <View style={styles.sp}></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSection} activeOpacity={0.7}>
          <View style={styles.buttonArea}>
            <View style={styles.iconArea}>
              {/* placeH is a placeholder */}
              <Image source={placeH} style={styles.iconStyle} resizeMode="contain"/>
          </View>
            <Text style={styles.buttonName}>placeH</Text>
          </View>
          <View style={styles.sp}></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSection} activeOpacity={0.7}>
          <View style={styles.buttonArea}>
            <View style={styles.iconArea}>
              {/* placeH is a placeholder */}
              <Image source={placeH} style={styles.iconStyle} resizeMode="contain"/>
          </View>
            <Text style={styles.buttonName}>placeH</Text>
          </View>
          <View style={styles.sp}></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSection} activeOpacity={0.7}>
          <View style={styles.buttonArea}>
            <View style={styles.iconArea}>
              {/* placeH is a placeholder */}
              <Image source={placeH} style={styles.iconStyle} resizeMode="contain"/>
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
    backgroundColor: black,
  },
  safeArea: {
    flex: 1,
  },
  topSection: {
    height : 300,
    justifyContent: "center",
    alignItems: "center",
  },
  profpicSection: {
    width : 170,
    height : 170,
    borderRadius : "100%",
    borderWidth: 4,
    borderColor:"green",
  },
  profpic: {
    width: "100%",
    height: "100%",
  },
  name: {
    marginTop: 20,
    color : "white",
    fontSize: 30,
  },
  membership: {
    color : "yellow",
    fontSize: 19,
  },
  buttonSection: {
    padding: 12,
    paddingLeft: 25,
    paddingRight: 25,
  },
  buttonArea: {
    flexDirection: "row",
    justifyContent: "center",
    alighnItems: "center",
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
    width: 300,
    fontSize: 20,
    color: "white",
    marginLeft: 20,
  },
  sp: {
    width: 400,
    marginTop: 10,
    height: 1,
    backgroundColor: "white",
  },
});