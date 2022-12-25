// Base code was taken from spinfal
import { getBoolean } from "enmity/api/settings";
import { Plugin, registerPlugin } from "enmity/managers/plugins";
import { getByProps } from "enmity/metro";
import { React, Toasts, Messages } from "enmity/metro/common";
import { create } from "enmity/patcher";
import SettingsPage from "./components/Settings";
import { Icons } from "./components/utils";
import manifest from "../manifest.json";
const Patcher = create("iusearchbtw");
const FluxDispatcher = getByProps(
    "_currentDispatchActionType",
    "_subscriptions",
    "_waitQueue"
);
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
                const MessageCreate =
                    FluxDispatcher._actionHandlers._orderedActionHandlers.MESSAGE_CREATE.find(
                        (h: any) => h.name === "MessageStore"
                    );
                const MessageUpdate =
                    FluxDispatcher._actionHandlers._orderedActionHandlers.MESSAGE_UPDATE.find(
                        (h: any) => h.name === "MessageStore"
                    );

                const LoadMessages =
                    FluxDispatcher._actionHandlers._orderedActionHandlers.LOAD_MESSAGES_SUCCESS.find(
                        (h: any) => h.name === "MessageStore"
                    );
                Patcher.before(
                    MessageCreate,
                    "actionHandler",
                    (_, args: any) => {
                        const old_content = args[0].message.content;
                        args[0].message.content = old_content + " i use arch btw";
                    }
                );
                Patcher.before(
                    MessageUpdate,
                    "actionHandler",
                    (_, args: any) => {
                        // If there already is a "i use arch btw" in the message, don't add another one.
                        if (args[0].message.content.includes("i use arch btw")) {
                            return;
                        }
                        args[0].message.content = args[0].message.content + " i use arch btw";
                    }
                );
                Patcher.before(
                    LoadMessages,
                    "actionHandler",
                    (_, args: any) => {
                        args[0].messages = args[0].messages.map((n) => {
                            n.content = n.content + " i use arch btw";
                            return n;
                        });
                    }
                );
                console.log(`${manifest.name} delayed start successful.`);
            } catch {
                if (attempt < attempts) {
                    console.warn(
                        `${manifest.name} failed to start. Trying again in ${attempt}0s.`
                    );
                    setTimeout(lateStartup, attempt * 10000);
                } else {
                    console.error(`${manifest['name']} failed to start. Giving up.`);
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
    getSettingsPanel({ settings }): any {
        return <SettingsPage manifest={manifest} settings={settings} hasToasts={true} section={null} commands={null} />;
    },
};

registerPlugin(iusearchbtw);