import React, { useState, useEffect } from "react";
import Web3 from "web3";
import GLBNFT_CONTRACT from "../contracts/artifacts/GLBNFT.json"; // Replace with the actual ABI file

const GLBNFT_ADDRESS = import.meta.env.VITE_CONTRACT; // Replace with your deployed contract address

const MinterRoleManager = () => {
  const [targetAccount, setTargetAccount] = useState("");
  const [status, setStatus] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [ownerAccount, setOwnerAccount] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const glbNFTContract = new web3Instance.eth.Contract(
        GLBNFT_CONTRACT.abi,
        GLBNFT_ADDRESS
      );
      setContract(glbNFTContract);

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setOwnerAccount(accounts[0]);
        })
        .catch((error) => {
          console.error("Error fetching accounts:", error);
        });
    } else {
      setStatus("Please install MetaMask to interact with this dApp.");
    }
  }, []);

  const addMinter = async () => {
    try {
      if (!targetAccount) {
        setStatus("Please enter a valid account address.");
        return;
      }

      const accounts = await web3.eth.getAccounts();
      await contract.methods
        .addMinter(targetAccount)
        .send({ from: accounts[0] });

      setStatus(`Minter role granted to ${targetAccount}`);
    } catch (error) {
      console.error(error);
      setStatus("Error granting minter role.");
    }
  };

  const removeMinter = async () => {
    try {
      if (!targetAccount) {
        setStatus("Please enter a valid account address.");
        return;
      }

      const accounts = await web3.eth.getAccounts();
      await contract.methods
        .removeMinter(targetAccount)
        .send({ from: accounts[0] });

      setStatus(`Minter role removed from ${targetAccount}`);
    } catch (error) {
      console.error(error);
      setStatus("Error removing minter role.");
    }
  };

  return (
    <div>
      <h2>Minter Role Manager</h2>
      <input
        type="text"
        placeholder="Enter account address"
        value={targetAccount}
        onChange={(e) => setTargetAccount(e.target.value)}
      />
      <button onClick={addMinter}>Add Minter</button>
      <button onClick={removeMinter}>Remove Minter</button>
      <p>{status}</p>
    </div>
  );
};

export default MinterRoleManager;
