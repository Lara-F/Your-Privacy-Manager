const HDWalletProvider = require("truffle-hdwallet-provider");
MNEMONIC='Mnemonic'
 module.exports = {
  networks: {
	  //this allows us to specify a local network connected to ganache
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },  
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, 'https://ropsten.infura.io/v3/INFURA_API_KEY')
      },
      network_id: 3,
      //gasPrice may vary according to what the needs are, this is a configuration file so one may choose to either keep the default gas limit and gasPrice or set different ones
      gasPrice: 25000000000,  
    }
  },
  //configuration information for other networks, which include test nets and the main Ethereum network can be added in this file
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
} 
