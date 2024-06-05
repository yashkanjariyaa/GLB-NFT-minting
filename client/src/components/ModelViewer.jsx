import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const ModelViewer = ({ file }) => {
  const [model, setModel] = useState(null);

  if (file) {
    const loader = new GLTFLoader();
    loader.load(
      URL.createObjectURL(file),
      (gltf) => {
        setModel(gltf.scene);
      },
      undefined,
      (err) => {
        console.error(err);
      }
    );
  }

  return (
    <>
      {model && (
        <Canvas>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <primitive object={model} />
        </Canvas>
      )}
    </>
  );
};

export default ModelViewer;
