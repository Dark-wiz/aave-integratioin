const Web3 = require('web3');
const web3 = new Web3("http://localhost:7545");
const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
const dai_abi = require("./abi/dai.json");

const dai = new web3.eth.Contract(dai_abi, DAI_ADDRESS);

const unlockedAddress = "0x16463c0fdb6ba9618909f5b120ea1581618c1b9e";
const recipientAddress = "0xb9a4961CaCc77C9cd964b0145423062E015eb6D8";

// dai.methods.balanceOf(unlockedAddress).call(function(err, res) {
//   if (err) {
//       console.log("An error occured", err);
//       return
//   }
//   console.log("The balance is: ",res)
// })

// dai.methods.transfer(recipientAddress, "100000000000000000000").send({from: unlockedAddress}, function(err, res) {
//   if (err) {
//       console.log("An error occured", err);
//       return
//   }
//   console.log("Hash of the transaction: " + res)
// })

async function run() {
  let unlockedBalance, recipientBalance;

  ([unlockedBalance, recipientBalance] = await Promise.all([
    dai.methods
      .balanceOf(unlockedAddress)
      .call(),
    dai.methods
      .balanceOf(recipientAddress)
      .call()
  ]));
  console.log(`Balance unlocked: ${unlockedBalance}`);
  console.log(`Balance recipient: ${recipientBalance}`);
  let amountToSend = BigInt(100000000000000000000);
  await dai.methods
    .transfer(recipientAddress, amountToSend)
    .send({from: unlockedAddress});

  ([unlockedBalance, recipientBalance] = await Promise.all([
    dai.methods
      .balanceOf(unlockedAddress)
      .call(),
    dai.methods
      .balanceOf(recipientAddress)
      .call()
  ]));
  console.log(`Balance unlocked: ${unlockedBalance}`);
  console.log(`Balance recipient: ${recipientBalance}`);
}

run();
