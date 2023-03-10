// Thanks rosie for this amazing template :D
import { SettingsStore } from "enmity/api/settings";
import {
  FormDivider,
  FormRow,
  FormSection,
  FormSwitch,
  ScrollView,
} from "enmity/components";
import { bulk, filters } from "enmity/metro";
import {
  Constants,
  Navigation,
  React,
  Storage,
  StyleSheet,
  Toasts,
} from "enmity/metro/common";
import Credits from "./Credits";
import { check_for_updates, clipboard_toast, debug_info, Icons } from "./utils";

// main settingsStore and manifest interface
interface SettingsProps {
  settings: SettingsStore;
  manifest: object;
  hasToasts: boolean;
  section: any;
  commands: any;
}

// main declaration of modules being altered by the plugin
const [
  Router, // used to open a url externally
  Clipboard, // used to copy the dl link to keyboard
] = bulk(filters.byProps("transitionToGuild"), filters.byProps("setString"));

export default ({
  manifest,
}: SettingsProps) => {
  // icon and styles
  const styles = StyleSheet.createThemedStyleSheet({
    bottom_padding: {
      paddingBottom: 25,
    },
    icon: {
      color: Constants.ThemeColorMap.INTERACTIVE_NORMAL,
    },
    item: {
      color: Constants.ThemeColorMap.TEXT_MUTED,
    },
    text_container: {
      display: "flex",
      flexDirection: "column",
    },
  }); // main stylesheet

  const [touchX, setTouchX] = React.useState(); // the start x position of swiping on the screen
  const [touchY, setTouchY] = React.useState(); // the start y position of swiping on the screen;

  return (
    <>
      <ScrollView
        onTouchStart={(e) => {
          // set them to new position
          setTouchX(e.nativeEvent.pageX);
          setTouchY(e.nativeEvent.pageY);
        }}
        onTouchEnd={(e) => {
          // only triggers if x is negative over 100 (moved right) and y is more than -40 but less than 40 (not much movement)
          if (
            touchX - e.nativeEvent.pageX < -100 &&
            touchY - e.nativeEvent.pageY < 40 &&
            touchY - e.nativeEvent.pageY > -40
          ) {
            Navigation.pop(); // removes the page from the stack
          }
        }}
      >
        <Credits
          manifest={
            manifest
          }
        />
        <FormSection title="Utility">
          <FormRow
            label="Copy Debug Info"
            subLabel={`Copy useful debug information of ${manifest["name"]} to clipboard.`}
            leading={
              <FormRow.Icon style={styles.icon} source={Icons.Settings.Debug} />
            }
            trailing={FormRow.Arrow}
            onPress={async function () {
              Clipboard.setString(
                await debug_info(
                  manifest["name"],
                  manifest["version"],
                  manifest["build"]
                )
              );
              clipboard_toast("plugin debug information");
            }}
          />
          <FormDivider />
          <FormRow
            label="Clear Device List Cache"
            subLabel={`Remove the fetched device list storage. This will not clear Discord's or your iDevice's cache.`}
            leading={<FormRow.Icon style={styles.icon} source={Icons.Delete} />}
            trailing={FormRow.Arrow}
            onPress={async function () {
              await Storage.removeItem("device_list"); // removes the item and waits for promise resolve
              Toasts.open({
                content: `Cleared device list storage.`,
                source: Icons.Settings.Toasts.Settings,
              }); // declares success
            }}
          />
        </FormSection>
        <FormSection title="Source">
          <FormRow
            label="Check for Updates"
            subLabel={`Check if ${manifest["name"]} has an available update.`}
            leading={<FormRow.Icon style={styles.icon} source={Icons.Copy} />}
            trailing={FormRow.Arrow}
            onPress={() => {
              check_for_updates({ manifest });
            }}
          />
          <FormDivider />
          <FormRow
            label="Source"
            subLabel={`View ${manifest["name"]}'s source code`}
            leading={<FormRow.Icon style={styles.icon} source={Icons.Open} />}
            trailing={FormRow.Arrow}
            onPress={() => {
              Router.openURL(
                `https://github.com/ConnorDoesDev/enmity-plugins/tree/master/${manifest["name"]}`
              );
            }}
          />
        </FormSection>
        <FormRow
          style={styles.bottom_padding}
          label={`Plugin Version: ${manifest["version"]}
Plugin Build: ${manifest["build"]}`}
        />
      </ScrollView>
    </>
  );
};
