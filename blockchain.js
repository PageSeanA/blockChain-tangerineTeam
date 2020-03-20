
const sha256 = require('js-sha256');
const Block = require('./block');

class Blockchain {

    // genesis block is first block at index 0 and will contain
    // different kinds of rewards depending on application
    // contains the rewards for miners
    // configuration
    // genesis block a required block to create the blockchain.
    // this is the first block in the blockchain
    constructor(genesisBlock) {

        this.blocks = [];

        //2 [0, 2]
        this.addBlock(genesisBlock);
    }

    addBlock(block) {

        //if this blockchain is currently empty
        //assign a previous hash 
        //

        if (this.blocks.length == 0) {
            block.previousHash = "000000000000";

            //write a function that generates a hash 
            //based on teh key it generate a hash 

            block.hash = this.generateHash(block)
        }

        this.blocks.push(block);
    }

    //get next block 

    getNextBlock(transactions) {
        //transctions is a list transactions [transobj, transobj]

        let block = new Block();

        transactions.forEach((xaction) => {

            block.addTransaction(xaction)
        })

        let previousBlock = this.getPreviousBlock();

        block.index = this.blocks.length;

        block.previousHash = previousBlock.hash;

        block.hash = this.generateHash(block);

        return block

    }


    //get previous block

    getPreviousBlock() {

        return this.blocks[this.blocks.length - 1]
    }


    generateHash(block) {
        ///need js-sha256

        let hash = sha256(block.key);

        while (!hash.startsWith('000')) {
            block.nonce += 1; //increment nonce by 1 

            hash = sha256(block.key);
            // console.log(`hash: ${hash} \n`);
        }

        return hash;
    }
}


module.exports = Blockchain