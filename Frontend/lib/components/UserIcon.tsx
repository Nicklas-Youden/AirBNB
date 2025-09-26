import { IconButton } from "@mui/material";
import Icon from "../icon/icon";
import { useState } from "react";

export const UserHeaderIcon = () => {
  const [, setOpenDialog] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpenDialog(true)}>
        <Icon
          type="accountCircleOutline"
          size="large"
          className="inline-block"
        />
      </IconButton>
    </>
  );
};
