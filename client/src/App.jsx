import "./App.css";
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const Home = lazy(() => import("./components/Home"));
// const FileUpload = lazy(() => import("./components/Upload"));
const Mint = lazy(() => import("./components/Mint"));
const Test = lazy(() => import("./components/test"));
const MinterRoleManager = lazy(() => import("./components/Admin"));

function App() {
  return (
    <>
      <Router>
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home/>} />
              {/* <Route path="/" element={<FileUpload />} /> */}
              <Route path="mint" element={<Mint />} />
              <Route path='test' element={<Test/>}/>
              <Route path='admin' element={<MinterRoleManager/>}/>
            </Routes>
          </Suspense>
        </div>
      </Router>
    </>
  );
}

export default App;
