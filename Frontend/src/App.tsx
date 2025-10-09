import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import DestinationDetail from "./pages/DestinationsDetails";
import { UserLoginIcon } from "../lib/components/Login";
import { AuthContextProvider } from "../lib/contexts/AuthContext";
import { useAuthContext } from "../lib";
import { UserHeaderIcon } from "../lib/components/UserIcon";
import Bookings from "./pages/Bookings";
import type { ReactNode } from "react";
import Host from "./pages/Host";
import { Button } from "@mui/material";

const App = () => {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <div className=" mx-auto w-full">
          <Header />
          <Content />
        </div>
      </BrowserRouter>
    </AuthContextProvider>
  );
};

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const Content = () => {
  return (
    <div className="App mx-10 lg:mx-15">
      <main className="w-full max-w-[1500px] mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/destinations/:destinationId"
            element={<DestinationDetail />}
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host"
            element={
              <ProtectedRoute>
                <Host />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
};
export default App;

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  return (
    <div className=" sticky top-0 z-50 border-b border-gray-400 mb-4 py-4 px-10 lg:px-15 bg-gray-100/95 backdrop-blur-sm">
      <div className=" flex justify-between items-center max-w-[1500px] mx-auto">
        <h1
          onClick={() => navigate("/")}
          className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-purple-900 bg-clip-text text-transparent cursor-pointer w-fit transition-all duration-300"
        >
          CapaBNB
        </h1>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/host")}
                className="bg-gradient-to-r to-purple-800 from-purple-900 rounded-lg text-white hover:opacity-90 normal-case"
              >
                Host BNB
              </Button>
              <UserHeaderIcon />
            </>
          ) : (
            <UserLoginIcon />
          )}
        </div>
      </div>
    </div>
  );
};
