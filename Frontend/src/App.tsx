import "./App.css";

import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import DestinationDetail from "./pages/DestinationsDetails";

const App = () => {
  return (
    <BrowserRouter>
      <div className=" mx-auto w-full">
        <Header />
        <Content />
      </div>
    </BrowserRouter>
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
        </Routes>
      </main>
    </div>
  );
};
export default App;

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="border-b border-gray-400 mb-4 pt-4 px-10 lg:px-15 bg-gray-100">
      <h1
        onClick={() => navigate("/")}
        className="text-3xl font-bold text-gray-800 mb-6 cursor-pointer w-fit"
      >
        CapaBNB
      </h1>
    </div>
  );
};
