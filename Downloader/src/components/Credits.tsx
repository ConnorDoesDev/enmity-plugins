// Thanks rosie for this amazing template :D
import { Image, Text, TouchableOpacity, View } from "enmity/components";
import { bulk, filters } from "enmity/metro";
import { Constants, React, StyleSheet } from "enmity/metro/common";
import { clipboard_toast } from "./utils";

interface Props {
  manifest: object;
}

// @ts-ignore
const Animated = window.enmity.modules.common.Components.General.Animated;
// this is the main 'animated' component of react native, for some reason its not exported in enmity components
// so i had to manually import it and make ts ignore it

// main declaration of modules being altered by the plugin
const [
  Router,
  Clipboard,
] = bulk(filters.byProps("transitionToGuild"), filters.byProps("setString"));

export default ({ manifest }: Props) => {
  const styles = StyleSheet.createThemedStyleSheet({
    // main container styles with everything inside
    container: {
      paddingTop: 30,
      paddingLeft: 20,
      marginBottom: -5,
      flexDirection: "row",
    },
    // styles for the container inside of the container, which has the main text elements
    text_container: {
      paddingLeft: 15,
      paddingTop: 5,
      flexDirection: "column",
      flexWrap: "wrap",
    },
    // main image styling
    image: {
      width: 75,
      height: 75,
      borderRadius: 10,
    },
    // global text styling, shared between both header and subheader
    main_text: {
      opacity: 0.975,
      letterSpacing: 0.25,
    },
    // main header styling
    header: {
      color: Constants.ThemeColorMap.HEADER_PRIMARY,
      fontFamily: Constants.Fonts.DISPLAY_BOLD,
      fontSize: 25,
      letterSpacing: 0.25,
    },
    // main subheader styling
    sub_header: {
      color: Constants.ThemeColorMap.HEADER_SECONDARY,
      opacity: 0.975,
      fontSize: 12.75,
    },
  }); // main stylesheet

  // uses React.useRef() to bind the value to the button
  const animatedButtonScale = React.useRef(new Animated.Value(1)).current; // no scale initially

  const onPressIn = () => {
    // move @param animatedButtonScale to 1.1 in 250ms
    Animated.spring(animatedButtonScale, {
      toValue: 1.1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    // move @param animatedButtonScale to 1 in 250ms
    Animated.spring(animatedButtonScale, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const onPress = () => {
    Router.openURL("https://connor.is-a.dev");
  };
  const animatedScaleStyle = { transform: [{ scale: animatedButtonScale }] }; // main actual styling for the scale

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          // used a TouchableOpacity to add opacity changes to the icon upon any press
          onPress={onPress} // opens spin's personal site
          onPressIn={onPressIn} // in animation
          onPressOut={onPressOut} // out animation
        >
          <Animated.View
            style={[
              animatedScaleStyle,
            ]} /* uses Animated.View to apply new animations to the image */
          >
            <Image
              style={[styles.image]}
              source={{
                // image used for the icon, source takes either a require() or a uri
                uri: "https://cdn.discordapp.com/avatars/744603004493365330/a_81b44cef321fc646226efa048937719d.gif",
              }}
            />
          </Animated.View>
        </TouchableOpacity>
        <View style={styles.text_container /* text only container */}>
          <TouchableOpacity
            onPress={() => {
              Router.openURL(manifest["src"]);
            }}
          >
            <Text
              style={[
                styles.main_text,
                styles.header,
              ]} /* main title text, in this case its "Dislate" */
            >
              {manifest["name"]} {/* the plugin name in manifest.json */}
            </Text>
          </TouchableOpacity>
          <View
            style={
              { flexDirection: "row" } /* makes the elements render inline */
            }
          >
            <Text style={[styles.main_text, styles.sub_header]}>
              A plugin by
            </Text>
            <TouchableOpacity
              onPress={() => {
                Router.openURL("https://connor.is-a.dev");
              }}
            >
              <Text
                style={[
                  styles.main_text,
                  styles.sub_header,
                  {
                    paddingLeft: 4,
                    fontFamily: Constants.Fonts.DISPLAY_BOLD,
                  },
                ]}
              >
                {manifest["authors"][0]["name"]}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={
              { flexDirection: "row" } /* makes the elements render inline */
            }
          >
            <Text style={[styles.main_text, styles.sub_header]}>
              Settings page by
            </Text>
            <TouchableOpacity
              onPress={() => {
                Router.openURL("https://github.com/acquitelol/");
              }}
            >
              <Text
                // opens acquite's github account externally
                style={[
                  styles.main_text,
                  styles.sub_header,
                  {
                    paddingLeft: 4,
                    fontFamily: Constants.Fonts.DISPLAY_BOLD,
                  },
                ]}
              >
                {"rosie <3"}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={{ flexDirection: "row" } /* display text inline */}
              onPress={() => {
                Clipboard.setString(
                  `**${manifest["name"]}** v${manifest["version"]}`
                );
                clipboard_toast("plugin name and version");
              }}
            >
              <Text style={[styles.main_text, styles.sub_header]}>
                Version:
              </Text>
              <Text
                style={[
                  styles.main_text,
                  styles.sub_header,
                  {
                    paddingLeft: 4,
                    fontFamily: Constants.Fonts.DISPLAY_BOLD,
                  },
                ]}
              >
                {manifest["version"]} {/* the version in manifest.json */}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};
