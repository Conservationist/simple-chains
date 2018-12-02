extern crate blake2;
extern crate chrono;

use blake2::{Blake2b, Digest};
use chrono::prelude::*;
use std::mem;

struct Transaction {
    fromAdress: String,
    toAdress: String,
    amount: f64,
    time: String,
}

impl Transaction {
    fn logTransaction(&self) -> String {
        let mut trans_string = String::from("");
        trans_string.push_str(&self.fromAdress);
        trans_string.push_str(" ");
        trans_string.push_str(&self.toAdress);
        trans_string.push_str(" ");
        trans_string.push_str(&self.amount.to_string());
        trans_string.push_str(" ");
        trans_string.push_str(&self.time);
        return trans_string;
    }
}

struct Block {
    timestamp: String,
    transactions: Vec<Transaction>,
    nonce: i32,
    prevhash: String,
    hash: String,
}

impl Block {
    fn hashBlock(&self) {
        let mut hasher = Blake2b::new();
        hasher.input(&self.timestamp);
        let hash = hasher.result();
        println!("Result: {:x}", hash);
    }
    fn logBlock(&self) -> String {
        let mut block_string = String::from("[BLOCK]: ");
        block_string.push_str(&self.timestamp);
        block_string.push_str(" ");
        block_string.push_str(&self.nonce.to_string());
        block_string.push_str(" ");
        block_string.push_str(&self.prevhash);
        block_string.push_str(" ");
        block_string.push_str(&self.hash);
        block_string.push_str("\n[Transactions]: ");
        for item in &self.transactions {
            let trans_string = &item.logTransaction();
            block_string.push_str(trans_string);
        }

        return block_string;
    }
}

struct Chain {
    blocks: Vec<Block>,
    difficulty: i32,
    current_transactions: Vec<Transaction>,
    reward: f64,
    cap: u8,
}

fn main() {
    let trans = Transaction {
        fromAdress: String::from("xd"),
        toAdress: String::from("dx"),
        amount: 20.00,
        time: get_time(),
    };
    let block = Block {
        timestamp: get_time(),
        transactions: vec![trans],
        nonce: 0,
        prevhash: String::from("prev"),
        hash: String::from("hash"),
    };

    println!("{}", block.logBlock());

    let block2 = create_block(
        get_time(),
        vec![trans],
        String::from("hiagane"),
        String::from("asd#adsasd"),
    );
}

fn get_time() -> String {
    let time = Utc::now();
    return time.format("%Y-%m-%d %H:%M:%S").to_string();
}

fn create_block(
    timestamp: String,
    transactions: Vec<Transaction>,
    prevhash: String,
    hash: String,
) -> Block {
    let xd = transactions.clone();
    Block {
        timestamp,
        transactions: xd,
        nonce: 0,
        prevhash,
        hash: "dfgsf".to_string(),
    }
}

fn generate_hash(vecstr: Vec<String>) {
    let mut hasher = Blake2b::new();

    for data in vecstr {
        println!("data: {}", data);
        hasher.input(data);
    }

    let hash = hasher.result();
    println!("Result: {:x}", hash);
}
