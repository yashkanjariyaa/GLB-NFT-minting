import "./App.css";
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const Home = lazy(() => import("./components/Home"));
// const FileUpload = lazy(() => import("./components/Upload"));
const Mint = lazy(() => import("./components/Mint"));
const MinterRoleManager = lazy(() => import("./components/Admin"));
const NFTList = lazy(() => import("./components/NFTList"));

function App() {
  return (
    <>
      <Router>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="mint" element={<Mint />} />
              <Route path="admin" element={<MinterRoleManager />} />
              <Route path="nft" element={<NFTList />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </>
  );
}

export default App;
