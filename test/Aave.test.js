const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const AaveTest = artifacts.require("AaveTest");

contract("AaveTest", async accounts => {
    let aave;
    beforeEach(async () => {
        aave = await AaveTest.deployed();
    });

    it("contract deployed", () => {
       assert(aave, "contract was not deployed"); 
    });

    describe("Aave functions test", () => {
        it('check amount deposited', async () => {            
            const amount = web3.utils.toWei('100', 'ether');
            let balance = await web3.eth.getBalance(accounts[0]);

            // console.log(accounts, "accounts")
            console.log(balance, 'balance');
            // await aave.deposit(amount);
            // assert.is.equal(balance, 1000);
        });
    });
});