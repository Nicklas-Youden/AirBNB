import { IconButton, Menu, MenuItem } from "@mui/material";
import Icon from "../icon/icon";
import { useState } from "react";
import { useAuthContext } from "../hooks/Auth/useAuth";
import { useNavigate } from "react-router-dom";

export const UserHeaderIcon = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout } = useAuthContext();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const handlePageChange = () => {
    navigate("/bookings");
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-controls={open ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <Icon
          type="accountCircleOutline"
          size="large"
          className="inline-block"
        />
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handlePageChange}>Manage Bookings</MenuItem>
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
      </Menu>
    </>
  );
};
