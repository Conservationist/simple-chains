import { Block } from "./block";
import { Transaction } from "./transaction";

export class Blockchain {
  public chain: Block[];
  public difficulty: number;
  public currentTransactions: Transaction[];
  public reward: number;
  public capped: boolean;
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.currentTransactions = [];
    this.reward = 50;
    this.capped = false;
  }

  createGenesisBlock(): Block {
    return new Block(
      "01/12/2018",
      { date: Date.now().toString(), init: "xd" },
      "0"
    );
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  getPrevHashBlock(): string {
    return this.chain[this.chain.length - 1].hash;
  }
  getChainLength(): number {
    return this.chain.length;
  }
  determineReward(): number | void {
    if (this.capped === true) {
      return;
    }
    const softCap = (this.getChainLength() / 50) % 1;
    if (softCap === 0) {
      return (this.reward = this.reward / 2);
    }
    return;
  }
  setCap(): void {
    this.capped = true;
  }

  // createTransaction(trans: Transaction): void {
  //   // There should be some validation here!

  //   // Push into onto the "pendingTransactions" array
  //   this.currentTransactions.push(trans);
  // }
  mineCurrentTransactions(miningRewardAddress: string) {
    // Create new block with all pending transactions and mine it..
    let block = new Block(
      Date.now().toString(),
      this.currentTransactions,
      this.getPrevHashBlock()
    );
    block.mineBlock(this.difficulty);

    if (this.getChainLength() < 100) {
      this.chain.push(block);
    }

    if (this.getChainLength() === 100) {
      this.setCap();
    }

    // Reset the pending transactions and send the mining reward
    this.currentTransactions = [
      new Transaction(
        null,
        miningRewardAddress,
        this.reward,
        Date.now().toString()
      )
    ];
    this.determineReward();
  }
  addTransaction(transaction: Transaction, debug: boolean) {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Transaction must include from and to address");
    }

    if (!transaction.isValid()) {
      throw new Error("Cannot add invalid transaction to chain");
    }
    if (!debug) {
      if (debug === false) {
        if (
          this.getBalanceOfAddress(transaction.fromAddress) >
            transaction.amount ||
          !this.getBalanceOfAddress(transaction.fromAddress)
        ) {
          console.log("Insufficient funds.");
          return;
        }
      }
    }

    this.currentTransactions.push(transaction);
  }
  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (
        currentBlock.hash !== currentBlock.initHash() ||
        currentBlock.prevHash !== previousBlock.hash
      ) {
        return false;
      }
      if (!currentBlock.hasValidTransactions()) {
        return false;
      }
    }
    return true;
  }

  getBalanceOfAddress(address: string): number {
    let balance = 0; // init bal

    // Loop over each block and each transaction inside the block
    for (const block of this.chain) {
      for (const trans of block.transactions as Transaction[]) {
        // If the given address is the sender -> reduce the balance
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        // If the given address is the receiver -> increase the balance
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }
}
