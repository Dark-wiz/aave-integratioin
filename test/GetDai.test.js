const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const AaveTest = artifacts.require("AaveTest");

const DAIContractABI = require("../abi/dai.json");
const erc20ContractAbi = require("../abi/erc20.json");

//dai address from etherum mainnet network
const unlockedAddress =  "0x16463c0fdb6ba9618909f5b120ea1581618c1b9e";
const DAIContractAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";

const DAIContract = new web3.eth.Contract(erc20ContractAbi, DAIContractAddress);

async function sendDAI(amount, recipient){
    console.log("calling send dai");
    // var amountToSend = BigInt(amount);

    let senderBalance = await DAIContract.methods.balanceOf(unlockedAddress).call();
    console.log(`sender balance: ${senderBalance}`);

    console.log(`Sending  ${ amountToSend } x 10^-18 Dai to  ${recipient}`);

    await DAIContract.methods.transfer(recipient, amountToSend).send({from: unlockedAddress});

    let recipientBalance = await DAIContract.methods.balanceOf(recipient).call();

    console.log(`Recipient: ${recipient} DAI Balance: ${recipientBalance}`);
}



contract("AaveTest", async accounts => {
    let aave;
    beforeEach(async () => { 
        aave = await AaveTest.deployed();
        let amountToSend = web3.utils.toWei('10', 'wei');
        account1 = accounts[0]; 
        const result = await web3.eth.getBalance(account1);
        // balance = web3.utils.fromWei(result, "ether");
        console.log(`${account1} balance is ${result}`);
        await sendDAI(amountToSend, account1);
        // web3.eth.getBalance(account1, function(err, result) {
        //     if(err) {
        //         console.log(err);
        //     }else {
        //         balance = web3.utils.fromWei(result, "ether");
        //         console.log(`${account1} balance is ${balance}`);
        //         sendDAI(amountToSend, account1);
        //     }
        // });
    });

    describe("check account balance", () => {
        it("check balance", async () => {
            let balance = await web3.eth.getBalance(accounts[0]);
            console.log(balance, 'recipient balance');
            assert(balance === 10);
        });
    });
});

// web3.eth.getAccounts().then(function(accounts) {
//     account1 = accounts[0];
//     let amountToSend = BigInt(10000000000000000000); 
//     web3.eth.getBalance(account1, function(err, result) {
//         if(err) {
//             console.log(err);
//         }else {
//             balance = web3.utils.fromWei(result, "ether");
//             console.log(`${account} balance is ${balance}`);
//             sendDAI(amountToSend, account1);
//         }
//     });
// });