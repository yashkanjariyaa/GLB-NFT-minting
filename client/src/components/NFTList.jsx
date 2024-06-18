import React, { useState, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import GLBNFT from "../contracts/artifacts/GLBNFT.json";
import Web3 from "web3";

const Model = ({ uri, ...props }) => {
  const { scene } = useGLTF(uri);
  return <primitive object={scene} {...props} />;
};

const NFTList = () => {
  const [tokenURIs, setTokenURIs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [minter, setMinter] = useState("");
  const [balance, setBalance] = useState("");

  const navigate = useNavigate();

  const web3 = new Web3(window.ethereum);

  const contractAddress = import.meta.env.VITE_CONTRACT;
  const contractABI = GLBNFT.abi;

  useEffect(() => {
    const checkAccounts = async () => {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        navigate("/");
      }
    };

    checkAccounts();
  }, [navigate, web3]);

  useEffect(() => {
    const getNFTs = async () => {
      setLoading(true);
      try {
        const accounts = await web3.eth.getAccounts();
        setMinter(accounts[0]);
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const balance = await contract.methods.balanceOf(accounts[0]).call();
        setBalance(balance.toString());
        const tokenIds = await Promise.all(
          Array.from({ length: Number(balance) }, (_, index) =>
            contract.methods.tokenOfOwnerByIndex(accounts[0], index).call()
          )
        );

        const uris = await Promise.all(
          tokenIds.map((tokenId) => contract.methods.tokenURI(tokenId).call())
        );

        setTokenURIs(uris);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
      setLoading(false);
    };

    if (window.ethereum) {
      getNFTs();
    }
  }, [contractAddress, contractABI]);

  function navigateToMint(e) {
    e.preventDefault();
    navigate("/mint");
  }

  return (
    <div>
      <button
        onClick={(e) => {
          navigateToMint(e);
        }}
      >
        Mint NFTS
      </button>
      <div className="minter">{minter}</div>
      <div className="balance">{balance}</div>
      <h2>Owned NFTs</h2>
      {loading ? (
        <p>Loading NFTs...</p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {tokenURIs.map((uri, index) => (
            <li key={index} style={{ margin: "20px 0" }}>
              <div className="token-id">Token ID: {index}</div>
              <div style={{ height: "600px", width: "600px" }}>
                <Canvas style={{ background: "#000" }}>
                  <OrbitControls />
                  <ambientLight intensity={0.7} />
                  <directionalLight position={[0, 5, 5]} />
                  <Suspense fallback={null}>
                    <Model uri={uri} scale={[1, 1, 1]} position={[0, 0, 0]} />
                  </Suspense>
                </Canvas>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NFTList;
