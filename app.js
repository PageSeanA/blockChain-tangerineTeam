
const express = require('express');
const app = express()

const Block = require('./block');
const Blockchain = require('./blockchain');
const Transaction = require('./transaction');


app.get('/', (req, res) => {

    res.send('hello world');
})

app.get('/blockchain', (req, res) => {


    //create genesis block

    let genesisBlock = new Block();

    let blockchain = new Blockchain(genesisBlock);

    let transaction = new Transaction('Alina', 'Sean', 50);

    let block = blockchain.getNextBlock([transaction]);

    blockchain.addBlock(block);

    let anotherTransaction = new Transaction("Alex", "Alina", 30);

    let block1 = blockchain.getNextBlock([anotherTransaction, transaction]);

    blockchain.addBlock(block1);

    res.json(blockchain);
})

app.listen(3000, () => {
    console.log('running on port 3000');
})



