import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

import { useState } from "react";
import { useAuthContext } from "../hooks/Auth/useAuth";

export const UserLoginIcon = () => {
  const [openLoginDialog, setOpenLoginDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setOpenLoginDialog(true)} variant="contained">
        Sign in
      </Button>
      <LoginDialog
        open={openLoginDialog}
        onClose={() => setOpenLoginDialog(false)}
      />
    </>
  );
};

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
  const authContext = useAuthContext();
  const [isSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleOnClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      // resetForm();
      // // Handle sign up logic
      // console.log("Sign up:", { name, email, password, confirmPassword });
    } else {
      try {
        await authContext?.login({
          email,
          password,
          remember_me: true,
        });
        handleOnClose();
      } catch (error: unknown) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        setError(err.response?.data?.message || err.message || "Login failed");
        setPassword("");
      }
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setPhone("");
    setError("");
  };

  //   const toggleMode = () => {
  //     setIsSignUp(!isSignUp);
  //     resetForm();
  //   };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <h2 className="text-center text-2xl font-medium">
          CapaBNB {isSignUp ? "sign up" : "login"}
        </h2>
      </DialogTitle>

      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 pt-4"
        >
          {isSignUp && (
            <TextField
              fullWidth
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              error={!!error}
              helperText={error}
            />
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={!!error}
            helperText={error}
          />
          {isSignUp && (
            <TextField
              fullWidth
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              error={!!error}
              helperText={error}
            />
          )}

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={!!error}
            helperText={error}
          />

          {isSignUp && (
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={!!error}
              helperText={error}
            />
          )}
        </Box>
      </DialogContent>
      <div className="px-2 pb-3">
        <DialogActions className="flex flex-col gap-2 ">
          <Button variant="contained" size="large" onClick={handleSubmit}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>

          {/* <Typography variant="body2" textAlign="center">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              component="button"
              variant="body2"
              onClick={toggleMode}
              sx={{ cursor: "pointer" }}
            >
              {isSignUp ? "Login" : "Sign Up"}
            </Link>
          </Typography> */}
        </DialogActions>
      </div>
    </Dialog>
  );
};
