
const express = require('express');
const app = express()

const Block = require('./block');
const Blockchain = require('./blockchain');
const Transaction = require('./transaction');
const BlockchainNode = require('./BlockchainNode');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

let genesisBlock = new Block();
let blockchain = new Blockchain(genesisBlock);
let transactions = [];  //list of Transaction objects 
let nodes = []; //list of BlockchainNode objects

let port = process.env.port || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {

    res.send('hello world');
})

app.get('/resolve', (req, res) => {

    //anytime a node has to resolve the block chain, it will call this route
    // before any node mines, call the resove path
    // nodes is a collection with all of the nodes on the network

    //1. loop throught nodes 
    //fetch to node.url/blockchain 
    // compare the length of the current blockchain length with the other nodes 
    // if the length is greater than the current node, then replace the blockchain 
    // node[0].url = "localhost:3001"
    nodes.forEach(node => {

        fetch(node.url + '/blockchain')
            .then(response => {
                return response.json()
            })
            .then(otherNodeBlockchain => {

                if (blockchain.blocks.length < otherNodeBlockchain.blocks.length) {
                    blockchain = otherNodeBlockchain;
                }

                res.send(blockchain)
            })
    })
    //larger blockchain wins over the smaller blockchain
})

app.get('/nodes', (req, res) => {
    res.json(nodes);
})

app.post('/nodes/register', (req, res) => {

    //list of urls that represent nodes on our system
    let nodesList = req.body.urls;

    // {
    //     "urls": [
    //         {"url": "http://localhost:3002"},
    //         {"url": "http://localhost:3001"},
    //         {"url": "http://localhost:3000"},
    //     ] 
    // }

    nodesList.forEach(nodeObj => {
        let node = new BlockchainNode(nodeObj.url);

        nodes.push(node);
    })

    res.json(nodes);
})

app.get('/blockchain', (req, res) => {

    //create genesis block

    res.json(blockchain);
})

app.post('/transactions', (req, res) => {

    //this info comes from an ejs form. and submitted using post method
    let to = req.body.to;
    let from = req.body.from;
    let amount = req.body.amount;

    //create a Transaction object
    let transaction = new Transaction(from, to, amount);

    //store in the transactions list 
    transactions.push(transaction);

    res.json(transactions);

})


app.get('/mine', (req, res) => {

    let block = blockchain.getNextBlock(transactions)
    blockchain.addBlock(block);

    transaction = []

    res.json(block);
})


app.listen(port, () => {
    console.log(`running on port ${port}`);
})



