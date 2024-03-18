import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home, Competitors, NoPage } from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />}></Route>
        <Route path="/Competitors" element={<Competitors />}></Route>
        <Route path="*" element={<NoPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
