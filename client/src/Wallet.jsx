import server from "./server";
import { useState } from "react";
import * as secp from "ethereum-cryptography/secp256k1.js"
import {toHex } from "ethereum-cryptography/utils"

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {

  async function onChange(evt) {
    const pritaveKey = evt.target.value;
    setPrivateKey(pritaveKey);

    const publicKey = toHex(secp.getPublicKey(pritaveKey))
    setAddress(publicKey)
    if (publicKey) {
      const {
        data: { balance },
      } = await server.get(`balance/${publicKey}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address(privateKey for education purpose))" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        <label htmlFor="">Public</label>
        <span>{address? `${address}` : ""}</span>

      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
