import * as plugins from "enmity/managers/plugins";
// @ts-ignore
let plugin = window.enmity.plugins.installPlugin;
// @ts-ignore
let theme = window.enmity.themer.installTheme;
import { getByProps } from "enmity/metro";
import { Icons } from "./components/utils";
import { React, Toasts } from "enmity/metro/common";
import { create } from "enmity/patcher";
import { FormRow, ScrollView } from "enmity/components";
const Patcher = create("downloader");
const Opener = getByProps("openLazy");

import Settings from "./components/Settings";

import UpdateButton from "./components/UpdateButton";
import manifest from "../manifest.json";

const Downloader: plugins.Plugin = {
  ...manifest,
  patches: [],
  onStart() {
    Patcher.before(
      Opener,
      "openLazy",
      ({ hideActionSheet }, [component, sheet]) => {
        if (sheet === "LongPressUrl") {
          component.then((instance: any) => {
            Patcher.after(instance, "default", (_, args, res) => {
              if (!res.props) {
                console.log(
                  `[Downloader Error: "props" doesn't exist on "res"]`
                );
                return res;
              }
              let finalLocation = res.props.children[1].props.children;
              // log the names to find the right button to add the download button after
              // console.log('finallocation: ' + finalLocation.map((e: any) => JSON.stringify(e.props.label.props.text)))
              const addItem = (finalLocation: any) => {
                let findItem: any = finalLocation.find(
                  (e: any) => e.props.label.props.text == "Open Link"
                );
                if (!findItem) return false;
                let indexOfButon = finalLocation.indexOf(findItem);
                return indexOfButon + 1;
              };
              if (finalLocation[addItem(finalLocation)].key == "69420") return;
              const link = res.props.children[0].props.title;
              const form = (
                <FormRow
                  label="Download"
                  key="69420"
                  onPress={() => {
                    if (link.endsWith("js")) {
                      plugin(link);
                    } else if (link.endsWith("json")) {
                      theme(link);
                    } else {
                      Toasts.open({
                        content: "That is not a valid plugin or theme!",
                        source: Icons.Failed,
                      });
                      hideActionSheet();
                    }
                  }}
                />
              );

              finalLocation.splice(addItem(finalLocation), 0, form);
            });
          });
        }
      }
    );
  },
  onStop() {
    Patcher.unpatchAll();
  },
  getSettingsPanel({ settings }): any {
    return <Settings manifest={manifest} settings={settings} hasToasts={true} section={null} commands={null} />;
},
};

plugins.registerPlugin(Downloader);
