import React, {useId} from "react";
import {Label} from "@components/ui/label";
import {Switch} from "@components/ui/switch";
import {appTheme} from "@signals/theme";
const SwitchTheme = () => {
  const themeId = useId();
  const onChangeTheme = (e: boolean) => {
    appTheme.value = e ? "dark" : "light";
  };
  return (
    <div className="absolute top-0 right-0 flex items-center space-x-2 z-7000 p-3">
      <Switch
        id={themeId}
        checked={appTheme.value === "dark"}
        onCheckedChange={onChangeTheme}
      />
      <Label htmlFor={themeId}>Dark</Label>
    </div>
  );
};

export default SwitchTheme;
