import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DestinationDetail from "./pages/DestinationsDetails";

const App = () => {
  return (
    <div className="container mx-auto px-4 pt-8">
      <Header />
      <Content />
    </div>
  );
};

const Content = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};
export default App;

const Header = () => {
  return (
    <div className="">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">CapaBNBs</h1>
    </div>
  );
};
