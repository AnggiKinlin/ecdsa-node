const secp = require('ethereum-cryptography/secp256k1')
const {toHex} = require('ethereum-cryptography/utils')

const privateKey = secp.utils.randomPrivateKey()
const publicKey = secp.getPublicKey(privateKey)
console.log('PRIVATE KEY ======= ', toHex(privateKey));
console.log('PUBLIC KEY ======= ', toHex(publicKey));
