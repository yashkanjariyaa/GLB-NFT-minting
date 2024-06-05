import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Web3 } from "web3";

function WalletConnection() {
  const [isChecked, setIsChecked] = useState(false);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        if (accounts.length > 0) {
          localStorage.setItem("account", account[0]);
          setConnected(true);
          isChecked ? navigate("/admin") : navigate("/mint");
        }
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      alert("MetaMask not detected");
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        if (accounts.length > 0) {
          localStorage.setItem("account", accounts[0]);
          setConnected(true);
          isChecked ? navigate("/admin") : navigate("/mint");
        }
      }
    };

    checkConnection();
  }, [account]);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <div>
      {!connected ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <p>Wallet Connected</p>
      )}
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        ></input>
        Admin?
      </label>
    </div>
  );
}

export default WalletConnection;
