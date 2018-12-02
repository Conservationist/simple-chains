const elliptic = require("elliptic");
import chalk from "chalk";
import { Blockchain } from "./src/chain";
import { Transaction } from "./src/transaction";

const ec = new elliptic.ec("secp256k1");
const key = ec.genKeyPair();

const privateKey = key.getPrivate("hex");
const myKey = ec.keyFromPrivate(privateKey);
const myWalletAddress = myKey.getPublic("hex");

const chain = new Blockchain();

const tx1 = new Transaction(
  myWalletAddress,
  "test if you can transfer currency you do not have.",
  10,
  Date.now().toString()
);
tx1.signTransaction(myKey);
chain.addTransaction(tx1, false);

const maxTrans = 10;
const maxSpent = 250;

while (chain.getChainLength() > 0) {
  for (let i = 0; i < Math.floor(Math.random() * maxTrans); i++) {
    const xdfg = new elliptic.ec("secp256k1");
    const randkey = xdfg.genKeyPair();
    const tx = new Transaction(
      randkey.getPublic("hex"),
      myWalletAddress,
      Math.floor(Math.random() * maxSpent),
      Date.now().toString()
    );
    tx.signTransaction(randkey);
    chain.addTransaction(tx, true);
    console.log(chalk.greenBright("[CREATED TRANSACTION]"));
  }
  chain.mineCurrentTransactions(myWalletAddress);
  console.log(
    `${chalk.yellow("[BALANCE]")} ${chain.getBalanceOfAddress(myWalletAddress)}`
  );
  if (chain.getChainLength() === 100) {
    break;
  }
}
console.log(chain.chain);
