import * as hashjs from "hash.js";
import * as elliptic from "elliptic";
const ec = new elliptic.ec("secp256k1");

export class Transaction {
  public fromAddress: any;
  public toAddress: string | null;
  public amount: number;
  public time: string;
  public signature: any;
  constructor(
    fromAddress: elliptic.ec.KeyPair | null,
    toAddress: string | null,
    amount: number,
    time: string
  ) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.time = time;
  }
  initHash(): any | void {
    if (!this.fromAddress || this.toAddress) return;
    return hashjs
      .sha256()
      .update(this.fromAddress + this.toAddress + this.amount)
      .digest("hex")
      .toString();
  }
  signTransaction(signingKey: any) {
    if (signingKey.getPublic("hex") !== this.fromAddress) {
      throw new Error("You cannot sign transactions for other wallets!");
    }

    const hashTx = this.initHash();
    const sig = signingKey.sign(hashTx, "base64");
    this.signature = sig.toDER("hex");
  }
  isValid() {
    // If the transaction doesn't have a from address we assume it's a
    // mining reward and that it's valid. You could verify this in a
    // different way (special field for instance)
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.initHash(), this.signature);
  }
}
