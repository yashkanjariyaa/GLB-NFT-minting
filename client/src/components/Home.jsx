import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import WalletConnection from "./MetaMask";
import "./home.css";

const Model = (props) => {
  const { scene } = useGLTF("/models/pokemon_substitute_plushie.glb");
  console.log(scene)
  return <primitive object={scene} {...props} position={[0, -2, -1]} />;
};

const Home = () => {
  return (
    <div className="home">
      <div className="connect">
        <div className="logo">
          <div id="eth">
            <img src="\assets\ethereum-eth-logo-colored.svg" alt="" />
          </div>
          <div id="three">
            <i className="devicon-threejs-original-wordmark"></i>
          </div>
        </div>
        <div className="head">
          Mint GLB-NFTs<div className="hash">#</div>
        </div>

        <WalletConnection />
      </div>
      <div className="model">
        <div className="canvas">Canvas</div>
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 5, 5]} />
          <Suspense fallback={null}>
            <Model scale={[1, 1, 1]} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default Home;
