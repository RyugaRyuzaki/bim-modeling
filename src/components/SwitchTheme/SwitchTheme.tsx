import React, {useId} from "react";
import {Button} from "@/components/ui/button";
import {IoIosHelpCircleOutline} from "react-icons/io";
import {FaGithubAlt} from "react-icons/fa";
import {Label} from "@components/ui/label";
import {Switch} from "@components/ui/switch";
import {appTheme} from "@signals/theme";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Helper = ({icon, type, onClick}) => {
  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"outline"}
            className={`h-[30px] w-[30px] my-auto mx-1 hover:bg-green-400 disabled:cursor-none p-0`}
            onClick={onClick}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{type}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const SwitchTheme = () => {
  const themeId = useId();
  const onChangeTheme = (e: boolean) => {
    appTheme.value = e ? "dark" : "light";
  };
  return (
    <div className="absolute top-0 right-0 flex items-center space-x-2 z-7000 p-3">
      <Helper
        icon={<IoIosHelpCircleOutline className="h-[26px] w-[26px]" />}
        type={"Help"}
        onClick={() => {
          console.log("object");
        }}
      />
      <Helper
        icon={<FaGithubAlt className="h-[26px] w-[26px]" />}
        type={"Github"}
        onClick={() => {
          window.open("https://github.com/RyugaRyuzaki/bim-modeling");
        }}
      />
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
