const PrivacyManager = artifacts.require("PrivacyManager");
module.exports = function(deployer) {
deployer.deploy(PrivacyManager);
};