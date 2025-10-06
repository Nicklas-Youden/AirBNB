import "./App.css";

import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import DestinationDetail from "./pages/DestinationsDetails";
import { UserLoginIcon } from "../lib/components/Login";
import { AuthContextProvider } from "../lib/contexts/AuthContext";
import { useAuthContext } from "../lib";
import { UserHeaderIcon } from "../lib/components/UserIcon";
import Bookings from "./pages/Bookings";

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
          <Route path="/bookings" element={<Bookings />} />
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
          className="text-3xl font-bold text-gray-800 cursor-pointer w-fit"
        >
          CapaBNB
        </h1>
        {isAuthenticated ? <UserHeaderIcon /> : <UserLoginIcon />}
      </div>
    </div>
  );
};
