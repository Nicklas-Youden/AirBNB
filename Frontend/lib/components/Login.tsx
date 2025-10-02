import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Link,
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
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: 0,
  });
  const [error, setError] = useState("");

  const handleOnClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      try {
        await authContext?.signup({
          email: form.email,
          password: form.password,
          confirmPassword: form.confirmPassword,
          name: form.name,
          phone: form.phone,
        });
        handleOnClose();
      } catch (error: unknown) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        setError(err.response?.data?.message || "Signup failed");
      }

      // resetForm();
    } else {
      try {
        await authContext?.login({
          email: form.email,
          password: form.password,
        });
        handleOnClose();
      } catch (error: unknown) {
        const err = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        setError(err.response?.data?.message || "Login failed");
        setForm((prev) => ({ ...prev, password: "" }));
      }
    }
  };

  const resetForm = () => {
    setForm({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: 0,
    });
    setError("");
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <h2 className="text-center text-2xl font-medium">
          CapaBNB {isSignUp ? "sign up" : "login"}
        </h2>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Box className="px-4">
            <p className="text-red-500 text-center">{error}</p>
          </Box>
        )}
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
              value={form.name}
              name="name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          {isSignUp && (
            <TextField
              fullWidth
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: Number(e.target.value) })
              }
              required
            />
          )}

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {isSignUp && (
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              required
            />
          )}
          <Typography variant="body2" textAlign="center">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              component="button"
              variant="body2"
              onClick={toggleMode}
              sx={{ cursor: "pointer" }}
            >
              {isSignUp ? "Login" : "Sign Up"}
            </Link>
          </Typography>
        </Box>
      </DialogContent>
      <div className="px-2 pb-4">
        <DialogActions className="flex flex-col gap-4 ">
          <Button variant="contained" size="large" onClick={handleSubmit}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};
