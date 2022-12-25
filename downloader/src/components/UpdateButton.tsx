import { FormRow, ScrollView } from "enmity/components";
import { React, Dialog } from "enmity/metro/common";
// @ts-ignore
let update = window.enmity.plugins.installPlugin;
import { reload } from "enmity/api/native";
interface Props {
  pluginUrl: string;
  pluginName: string;
}

export default ({ pluginUrl, pluginName }: Props) => {
  return (
    <FormRow
      label="Update"
      trailing={FormRow.Arrow}
      onPress={() => {
        Dialog.show({
          title: "Update " + pluginName + "?",
          body:
            "This will update " +
            pluginName +
            " to the latest version. After updating, Discord will reload to apply the changes.",
          confirmText: "Update",
          cancelText: "Cancel",
          onConfirm: () => {
            console.log("Updating plugin " + pluginUrl + "...");
            update(`${pluginUrl}`);
            reload();
          },
        });
      }}
    />
  );
};
