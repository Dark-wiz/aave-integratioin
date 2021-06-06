const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3("http://localhost:7545");
const dai_abi = require('../abi/dai.json');
const AaveTest = artifacts.require("AaveTest");

const dai_address = "0x6b175474e89094c44da98b954eedeac495271d0f";
const unlockedAddress = "0x16463c0fdb6ba9618909f5b120ea1581618c1b9e";
const dai = new web3.eth.Contract(dai_abi, dai_address);

contract("AaveTest", async accounts => {
    let aave;
    beforeEach(async () => {
        aave = await AaveTest.deployed();
    });
    const receiverAddress = accounts[0];

    async function sendDai(recipient, amount) {
        const recipientAddress = recipient;

        let unlockedBalance, recipientBalance;

        unlockedBalance = await dai.methods.balanceOf(unlockedAddress).call();
        recipientBalance = await dai.methods.balanceOf(recipientAddress).call();

        console.log(`sender ${unlockedAddress} balance: ${unlockedBalance}`);
        console.log(`recipient ${recipientAddress} balance: ${recipientBalance}`);

        console.log("sending tokens....");
        let amountToSend = BigInt(amount);
        await dai.methods.transfer(recipientAddress, amountToSend).send({ from: unlockedAddress });

        
        unlockedBalance = await dai.methods.balanceOf(unlockedAddress).call();
        recipientBalance = await dai.methods.balanceOf(recipientAddress).call();

        console.log(`sender ${unlockedAddress} balance: ${unlockedBalance}`);
        console.log(`recipient ${recipientAddress} balance: ${recipientBalance}`);
    }

    it("contract deployed", () => {
        assert(aave, "contract was not deployed");
    });

    describe("Aave functions test", () => {
        it('check account has enough  dai', async () => {
            let amount = web3.utils.toWei('100', 'ether');
            await sendDai(receiverAddress, amount);
            let balance = await dai.methods.balanceOf(receiverAddress).call();
            // balance = web3.utils.toWei('100', 'wei');
            console.log('dai balance: ' + balance);
            const expected = BigInt(100000000000000000000);
            assert.equal(balance, expected, "Must be equal");
        });

        it('check amount deposited', async () => {
            const amount = web3.utils.toWei('10', 'ether');
            let balance = await web3.eth.getBalance(receiverAddress);

            console.log(amount, "amount to deposit")
            console.log(balance, 'aave balance');

            console.log(aave.address, 'aave address');

            await dai.methods.approve(aave.address, amount).send({from: receiverAddress});
            let allowanceBalance = await dai.methods.allowance(receiverAddress, aave.address).call(); //owner address first, then receiver address
            console.log(allowanceBalance, 'allowance balance');
            console.log('approved');
            await aave.deposit();
            console.log('deposited...');
            let expected = web3.utils.toWei('10', 'ether');
            assert.equal(allowanceBalance, expected);
        });
    });
});