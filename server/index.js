const express = require("express");
const secp = require("ethereum-cryptography/secp256k1.js");
const {toHex} = require("ethereum-cryptography/utils");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04cac16773a44b97ed0750e78d40db1cf00f585b7368b2e7971f7c9cd137eecff0e5211965b5619997b30772af20c6c589d485b348e2466cb0273bc5113c1dd016": 100,
  "046b8811f080e1e7b63476376bb5660f4efc5c9bfc1f30f462d9fad95741a35468e5961cc9083b3fbf242e03b7b88a8cd6eec31d004f3e5f09400bd78e860654cc": 50,
  "04f468cdb4f63f8b49368ac24c188c79dabfcb02277c8a71da12ac3513e813df76c918ce51c8316978d50153e3294707512c5fb73b1e4c0990c80e6f38f52fe0be": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, sig, recoveryBit, hexMessage } = req.body;

  const signatureAddress = toHex(secp.recoverPublicKey(hexMessage, sig, recoveryBit))

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  }
  else if (signatureAddress != sender) {
    res.status(400).send({ message: "Not You!" });
  }
  else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
