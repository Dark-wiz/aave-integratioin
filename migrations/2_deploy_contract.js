const AaveContract = artifacts.require("AaveTest");

module.exports = function (deployer) {
    deployer.deploy(AaveContract);
};