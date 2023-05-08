const Lottery = artifacts.require("Lottery");

module.exports = function (deployer) {
  deployer.deploy(Lottery, web3.utils.toWei("0.01", "ether"));
};
