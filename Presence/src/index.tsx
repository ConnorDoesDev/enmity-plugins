import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { React } from 'enmity/metro/common';
import Manifest from './manifest.json';
import Settings from './components/Settings';
import { setActivity } from './rpc';
import { getActivity, hasAppIdAndName } from './activity';
import { get } from 'enmity/api/settings';
import { getByProps } from 'enmity/metro';

const ReactNative = getByProps('AppState')

const Presence: Plugin = {
   ...Manifest,

   onStart() {
      let attempt = 0;
      const attempts = 3;
      const lateStartup = () => {
         try {
            attempt++;

            if (hasAppIdAndName()) {
               console.log("Setting activity in delayed start")
               setActivity(getActivity())
            }

            const { remove } = ReactNative.AppState?.addEventListener('change', (state) => {
               if (state === 'active') {
                  if (hasAppIdAndName()) {
                     console.log("Setting activity on app focus")
                     setActivity(getActivity())
                  }
               }
            })
            this.removeAppStateLister = remove

         } catch (err) {
            if (attempt < attempts) {
               setTimeout(lateStartup, attempt * 10000);
            } else {
               console.error(
                  `${Manifest.name} failed to start. Giving up.`
               );
            }
         }
      };

      setTimeout(() => {
         lateStartup();
      }, 300);
   },

   onStop() {
      setActivity(undefined)

      if (this.removeAppStateLister) {
         this.removeAppStateLister()
      }
   },

   getSettingsPanel({ settings }) {
      return <Settings settings={settings} />;
   }
};

registerPlugin(Presence);
