import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretDown } from "@fortawesome/free-solid-svg-icons";
import "./mint.css";

const Mint = () => {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [cid, setCid] = useState(null);
  const navigate = useNavigate();

  const web3 = new Web3(window.ethereum);

  useEffect(() => {
    const checkAccounts = async () => {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        navigate("/");
      }
    };

    checkAccounts();
  }, [navigate, web3]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const metadata = JSON.stringify({ name: "model.glb" });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({ cidVersion: 0 });
      formData.append("pinataOptions", options);

      await upload(formData);
    } catch (error) {
      console.error("Error with form", error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".glb",
  });

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
      setCid(res.data.IpfsHash);
      setFileUrl(`https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`);
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
    }
    setUploading(false);
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

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      await contract.methods
        .safeMint(accounts[0], fileUrl) // Use safeMint instead of mint
        .send({ from: accounts[0] })
        .on("receipt", (receipt) => {
          const tokenId = receipt.events.TokenMinted.returnValues.tokenId; // Use the correct event name
          alert(`NFT Minted! Token ID: ${tokenId}`);
          setFileUrl("");
          setCid(null);
        });
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Error minting NFT. Please check the console for details.");
    }
  };

  function navigateToNFTList(e) {
    e.preventDefault();
    navigate("/nft");
  }

  return (
    <div className="mint">
      <button onClick={e => {navigateToNFTList(e)}}>View your NFTs</button>
      <div className="head">Upload the GLB file</div>
      <div className="container">
        <div
          {...getRootProps()}
          style={{
            border: "2px dashed #000",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <input className="drop" {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <>
              <p>Drop a GLB file here, or click to select a file</p>
              <FontAwesomeIcon className="drop-icon" icon={faSquareCaretDown} />
            </>
          )}
        </div>
      </div>
      {fileUrl && <p>File uploaded to: {fileUrl}</p>}
      {uploading && <p>Uploading your model...</p>}
      <button onClick={mintNFT}>Mint NFT</button>
    </div>
  );
};

export default Mint;
