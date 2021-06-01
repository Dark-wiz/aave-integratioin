const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const dai_abi = require('../dai_abi.json');
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
            const amount = web3.utils.toWei('10', 'ether');
            let balance = await web3.eth.getBalance(accounts[0]);

            // console.log(accounts, "accounts")
            console.log(balance, 'balance');

            let daiTokenInstance = await new web3.eth.Contract(dai_abi, '0x639cB7b21ee2161DF9c882483C9D55c90c20Ca3e');

            await daiTokenInstance.methods.approve(aave.address, amount)

            await aave.deposit(amount);

            assert.is.equal(balance, 1000);
        });
    });
});