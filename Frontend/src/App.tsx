import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DestinationDetail from "./pages/DestinationsDetails";

const App = () => {
  return <Content />;
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
