import * as hashjs from "hash.js";
import { Transaction } from "./transaction";
import chalk from "chalk";
export interface GenesisBlock {
  date: string;
  init: string;
}

export class Block {
  public ts: string;
  public transactions: Transaction[] | GenesisBlock;
  public prevHash: string;
  public hash: string;
  public nonce: number;
  constructor(
    ts: string,
    transactions: Transaction[] | GenesisBlock,
    prevhash: string = ""
  ) {
    this.ts = ts;
    this.transactions = transactions;
    this.prevHash = prevhash;
    this.hash = this.initHash();
    this.nonce = 0;
  }
  initHash(): string {
    return hashjs
      .sha256()
      .update(
        this.ts + JSON.stringify(this.transactions) + this.prevHash + this.nonce
      )
      .digest("hex")
      .toString();
  }
  mineBlock(difficulty: number) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.initHash();
    }
    console.log(`${chalk.redBright("[BLOCK MINED]")} ${this.hash}`);
  }
  hasValidTransactions() {
    for (const tx of this.transactions as Transaction[]) {
      if (!tx.isValid()) {
        return false;
      }
    }

    return true;
  }
}
