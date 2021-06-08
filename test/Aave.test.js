const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3("http://localhost:7545");
const dai_abi = require('../abi/dai.json');
const aDai_abi = require('../abi/aDai.json');
const AaveTest = artifacts.require("AaveTest");

const dai_address = "0x6b175474e89094c44da98b954eedeac495271d0f";
const a_dai_address = "0x028171bCA77440897B824Ca71D1c56caC55b68A3";
const unlockedAddress = "0x16463c0fdb6ba9618909f5b120ea1581618c1b9e";

const dai = new web3.eth.Contract(dai_abi, dai_address);
const aDai = new web3.eth.Contract(aDai_abi, a_dai_address);


const waitTime = (minutes) => new Promise(resolve => setTimeout(resolve, minutes * 60 * 1000));


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
            await sendDai(receiverAddress, amount); //sendDai funds first account with about 100 dai from unlocked address
            let balance = await dai.methods.balanceOf(receiverAddress).call();
            console.log('dai balance: ' + balance);
            const expected = BigInt(100000000000000000000);
            assert.equal(balance, expected, "Must be equal");
        });

        it('check amount deposited', async () => {
            const amount = web3.utils.toWei('50', 'ether');
            console.log(amount, "amount to deposit");

            await dai.methods.approve(aave.address, amount).send({from: receiverAddress}); //this gives the contract permission to use funds sent
            let allowanceBalance = await dai.methods.allowance(receiverAddress, aave.address).call(); //owner address first, then receiver address
            console.log(allowanceBalance, 'allowance balance');
            await aave.deposit();
            console.log('deposited...');
            let expected = await aDai.methods.balanceOf(receiverAddress).call();
            let aDaiBalance = web3.utils.fromWei(expected, 'ether');
            waitTime(2);
            console.log(aDaiBalance, "after 2 minutes");
            assert.equal(aDaiBalance, 50, "balance matches");
        });

        it('withdraw deposited atoken', async () => {
            const amount = web3.utils.toWei('20', 'ether');            
            const currentBalance = await aDai.methods.balanceOf(receiverAddress).call();
            console.log(web3.utils.fromWei(currentBalance, 'ether'), "current balance before withdrawal");
            await aDai.methods.approve(aave.address, amount).send({from:receiverAddress});
            let allowanceBalance = await aDai.methods.allowance(receiverAddress, aave.address).call();
            console.log(web3.utils.fromWei(allowanceBalance, 'ether'), 'allowance balance');
            await aave.withdraw();
            
            const balance = await aDai.methods.balanceOf(receiverAddress).call();
            console.log(web3.utils.fromWei(balance, 'ether'), 'converted adai balance after withdrawal');
            // const expected = web3.utils.fromWei('30', 'ether');
            assert.equal(balance, 30);
        });

        // it('check amount can be borrowed', async () => {            
        //     const amount = web3.utils.toWei('20', 'ether');

        //     let balanceBefore =await dai.methods.balanceOf(receiverAddress).call();
        //     console.log("dai balance before borrow ", balanceBefore);

        //     await aave.borrow(amount);
        //     let balanceAfter = await dai.methods.balanceOf(receiverAddress).call();
        //     console.log("dai balance after borrow ", balanceAfter);

        //     const expected = BigInt(50000000000000000000);
        //     assert.equal(expected, balanceAfter);
        // });

        // it('get supply and borrow balance', async () => {
        //    const {
        //     currentATokenBalance : daiLended ,
        //     currentBorrowBalance : daiBorrowed
        //    } = await aave.balance();

        //    let lendedAmount = web3.utils.toWei('50', 'ether');
        //    let borrowedAmount = web3.utils.toWei('20', 'ether');

        //    console.log("dai lended", daiLended);
        //    console.log("dai borrowed", daiBorrowed);

        //    assert.equal(daiLended, lendedAmount, "dai deposited must be equal");
        //    assert.equal(daiBorrowed, borrowedAmount, "dai borrowed must be equal");
        // });
    });
});