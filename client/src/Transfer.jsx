import { useState } from "react";
import server from "./server";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";
import * as keccak from "ethereum-cryptography/keccak";
import * as secp from "ethereum-cryptography/secp256k1";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      let bodyRequest = {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
      };
      const hashBody = keccak.keccak256(
        utf8ToBytes(JSON.stringify(bodyRequest))
      );
      const hexBody = toHex(hashBody);
      const signature = await secp.sign(hexBody, privateKey, { recovered: true });
      let sig = toHex(signature[0])
      let recoveryBit = signature[1]
      bodyRequest = {
        ...bodyRequest,
        sig: sig,
        recoveryBit: recoveryBit,
        hexMessage: hexBody,
      };
      const {
        data: { balance },
      } = await server.post(`send`, bodyRequest);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
