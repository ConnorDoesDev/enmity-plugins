// Base code was taken from spinfal
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps } from "enmity/metro";
import { React, Toasts, Messages, Settings, Dialog } from "enmity/metro/common";
import { create } from "enmity/patcher";
import SettingsPage from "./components/Settings";
import { Icons } from "./components/utils";
import manifest from "../manifest.json";
import { FormIcon, FormRow, FormSection, FormSwitch } from "enmity/components";
import { get, set, SettingsStore } from "enmity/api/settings";
import { reload } from "enmity/api/native";
const Patcher = create("iusearchbtw");
const FluxDispatcher = getByProps(
  "_currentDispatchActionType",
  "_subscriptions",
  "_waitQueue"
);

interface SettingsProps {
  settings: SettingsStore
}

const iusearchbtw: Plugin = {
  ...manifest,
  onStart() {
    FluxDispatcher.dispatch({
      type: "LOAD_MESSAGES",
    });

    FluxDispatcher.dispatch({
      type: "LOAD_MESSAGES_SUCCESS",
      channelId: 0,
      messages: [],
      isBefore: false,
      isAfter: false,
      hasMoreBefore: false,
      hasMoreAfter: false,
      limit: 25,
      jump: undefined,
      isStale: false,
      truncate: undefined,
    });
    let attempt = 0;
    const attempts = 3;
    const lateStartup = () => {
      try {
        attempt++;
        console.log(
          `[${manifest.name}] delayed start attempt ${attempt}/${attempts}.`
        );
        const MessageCreate = FluxDispatcher._actionHandlers._orderedActionHandlers.MESSAGE_CREATE.find(
          (h: any) => h.name === "MessageStore"
        );
        const MessageUpdate = FluxDispatcher._actionHandlers._orderedActionHandlers.MESSAGE_UPDATE.find(
          (h: any) => h.name === "MessageStore"
        );

        const LoadMessages = FluxDispatcher._actionHandlers._orderedActionHandlers.LOAD_MESSAGES_SUCCESS.find(
          (h: any) => h.name === "MessageStore"
        );
        // Before creating the Messages patcher, check if the setting "iuabtw-appendtoself" is true
        if (get("iuabtw", "appendtoself", false)) {
          console.log("IUABTW: Self-IUABTW-Append is enabled.");
          Patcher.before(Messages, "sendMessage", (self, args, orig) => {
            args[1].content += " i use arch btw"
        });
        } else console.log("IUABTW: Self-IUABTW-Append is disabled.");
        Patcher.before(MessageCreate, "actionHandler", (_, args: any) => {
          const old_content = args[0].message.content;
          if (old_content.includes("i use arch btw")) return;
          args[0].message.content = old_content + " i use arch btw";
        });
        Patcher.before(MessageUpdate, "actionHandler", (_, args: any) => {
          args[0].message.content = args[0].message.content + " i use arch btw";
        });
        Patcher.before(LoadMessages, "actionHandler", (_, args: any) => {
          args[0].messages = args[0].messages.map((n) => {
            n.content = n.content + " i use arch btw";
            return n;
          });
        });
        console.log(`${manifest.name} delayed start successful.`);
      } catch {
        if (attempt < attempts) {
          console.warn(
            `${manifest.name} failed to start. Trying again in ${attempt}0s.`
          );
          setTimeout(lateStartup, attempt * 10000);
        } else {
          console.error(`${manifest["name"]} failed to start. Giving up.`);
          Toasts.open({
            content: `${manifest.name} failed to start. Giving up.`,
            source: Icons.Failed,
          });
        }
      }
    };
    setTimeout(() => {
      lateStartup();
    }, 300);
  },
  onStop() {
    Patcher.unpatchAll();
  },
  patches: [],
  getSettingsPanel({ settings }): SettingsProps {
    return (
      <SettingsPage
        manifest={manifest}
        settings={settings}
        hasToasts={true}
        section={
          <>
            <FormSection title="General">
              <FormRow
                label="Append to self"
                subLabel="Appends 'i use arch btw' to your own messages (which others can see too)."
                leading={<FormRow.Icon source={Icons.Settings.Self} />}
                trailing={
                  <FormSwitch
                    value={settings.getBoolean("iuabtw_appendtoself", true)}
                    onValueChange={(v) => {
                      try {
                        settings.toggle("iuabtw_appendtoself", true);
                        if (settings.getBoolean("iuabtw_appendtoself", true)) {
                            set("iuabtw", "appendtoself", true);
                        } else {
                            set("iuabtw", "appendtoself", false);
                        }
                        Dialog.show({
                          title: "Restart required",
                          body: "You need to restart Discord for this change to take effect.",
                          confirmText: "Reload",
                          cancelText: "Not now",
                          onConfirm: () => {
                            reload();
                          },
                        });
                    } catch (err) {
                        console.log("IUABTW Error", err);

                        Toasts.open({
                            content: "An error has occurred. Check debug logs for more info.",
                            source: Icons.Failed,
                        });
                    }
                    }}
                  />
                }
              />
              </FormSection>
          </>
        }
        commands={null}
      />
    );
  },
};

registerPlugin(iusearchbtw);
