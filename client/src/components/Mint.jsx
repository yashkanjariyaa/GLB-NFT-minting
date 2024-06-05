import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import axios from "axios";
import GLBNFT from "../contracts/artifacts/GLBNFT.json";
import ModelViewer from "./ModelViewer";

const Mint = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [cid, setCid] = useState(null);
  const [nfts, setNFTs] = useState([]);
  const [tokenURIs, setTokenURIs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const contractAddress = import.meta.env.VITE_CONTRACT;
  const contractABI = GLBNFT.abi;

  useEffect(() => {
    const checkAccounts = async () => {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        navigate("/");
      }
    };

    checkAccounts();
  }, [navigate]);

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const getNFTs = async () => {
        setLoading(true);
        try {
          const accounts = await web3.eth.getAccounts();
          console.log("Current account:", accounts[0]);

          const contract = new web3.eth.Contract(contractABI, contractAddress);
          const balance = await contract.methods.balanceOf(accounts[0]).call();
          console.log("Balance:", balance);

          const tokenIds = await Promise.all(
            Array.from({ length: Number(balance) }, (_, index) =>
              contract.methods.tokenOfOwnerByIndex(accounts[0], index).call()
            )
          );
          console.log("Token IDs:", tokenIds);

          setNFTs(tokenIds);

          const uris = await Promise.all(
            tokenIds.map((tokenId) => contract.methods.tokenURI(tokenId).call())
          );
          setTokenURIs(uris);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        }
        setLoading(false);
      };

      getNFTs();
    }
  }, [contractAddress, contractABI]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log(file);

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const metadata = JSON.stringify({ name: "model.glb" });
      formData.append("pinataMetadata", [metadata]);

      const options = JSON.stringify({ cidVersion: 0 });
      formData.append("pinataOptions", [options]);

      for (const pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      upload(formData);
    } catch (error) {
      console.error("Error with form", error);
    }
  };

  const upload = async (formData) => {
    setUploading(true);
    try {
      const res = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res);
      setCid(res.IpfsHash);
      setFileUrl(`https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`);
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
    }
  };

  const mintNFT = async () => {
    if (!fileUrl) {
      alert("Please upload a file first");
      return;
    }

    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }

    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      await contract.methods
        .safeMint(accounts[0], fileUrl)
        .send({ from: accounts[0] })
        .on("receipt", (receipt) => {
          const tokenId = receipt.events.Transfer.returnValues.tokenId;
          alert(`NFT Minted! Token ID: ${tokenId}`);
          setFileUrl("");
          setSelectedFile(null);
          setCid(null);
          setNFTs([...nfts, tokenId]);
        });
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Error minting NFT. Please check the console for details.");
    }
  };

  return (
    <div>
      <h1>Mint GLB NFT</h1>
      <label className="form-label"> Choose File</label>
      <input type="file" accept=".glb" onChange={handleFileChange} />
      {fileUrl && <p>File uploaded to: {fileUrl}</p>}
      {uploading ? <>Uploading your model...</> : <></>}
      <button onClick={mintNFT}>Mint NFT</button>
      {selectedFile && (
        <>
          <div>Your Model : </div>
          <ModelViewer file={selectedFile} />
        </>
      )}
      <h2>Owned NFTs</h2>
      {loading ? (
        <p>Loading NFTs...</p>
      ) : (
        <ul>
          {tokenURIs.map((uri, index) => (
            <li key={index}>
              <img src={uri} alt={`NFT ${index}`} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Mint;
