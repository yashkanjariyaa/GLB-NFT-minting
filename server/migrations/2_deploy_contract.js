const GLBNFT = artifacts.require("GLBNFT");
// const address = process.env.ADDRESS;
module.exports = function (deployer) {
  deployer.deploy(GLBNFT, process.env.ADDRESS);
};
