import {
  mdiAccountOutline,
  mdiBedEmpty,
  mdiImageOffOutline,
  mdiStar,
  mdiToilet,
  mdiHomeOutline,
  mdiBedDoubleOutline,
  mdiAccountCircleOutline,
} from "@mdi/js";
import MdiIcon from "@mdi/react";
import React from "react";

const mdiIconPaths = {
  accountCircleOutline: mdiAccountCircleOutline,
  toilet: mdiToilet,
  star: mdiStar,
  imageOffOutline: mdiImageOffOutline,
  bedEmpty: mdiBedEmpty,
  accountOutline: mdiAccountOutline,
  homeOutline: mdiHomeOutline,
  bedDoubleOutline: mdiBedDoubleOutline,
};

const calculateSize: (tempSize: string | number) => string | number = (
  tempSize
) => {
  switch (tempSize) {
    case "small":
      return "16px";
    case "medium":
      return "24px";
    case "large":
      return "32px";
    default:
      return tempSize;
  }
};

type MdiIconPathsKeys = keyof typeof mdiIconPaths;
export type TIconType = MdiIconPathsKeys;
export type IconProps = Omit<typeof MdiIcon, "size" | "color" | "onClick"> & {
  type: TIconType;
  color?:
    | "inherit"
    | "primary"
    | "success"
    | "error"
    | "disabled"
    | "secondary";
  size?: number | string | "small" | "medium" | "large" | "inherit";
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

const Icon: React.FC<IconProps> = ({
  size = "medium",
  color = "inherit",
  type,
  className,
}) => {
  return (
    <MdiIcon
      path={mdiIconPaths[type]}
      size={calculateSize(size)}
      color={color}
      className={className}
    />
  );
};

export default Icon;
