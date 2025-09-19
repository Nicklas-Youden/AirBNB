import "./App.css";

import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import DestinationDetail from "./pages/DestinationsDetails";

const App = () => {
  return (
    <BrowserRouter>
      <div className="container mx-auto px-4 pt-8">
        <Header />
        <Content />
      </div>
    </BrowserRouter>
  );
};

const Content = () => {
  return (
    <div className="App">
      <main>
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
    <div className="">
      <h1
        onClick={() => navigate("/")}
        className="text-3xl font-bold text-gray-800 mb-6 cursor-pointer hover:text-gray-600 transition-colors"
      >
        CapaBNBs
      </h1>
    </div>
  );
};
