App = {
  loading: false,
  contracts: {},
  load: async () => {
    console.log("app loading")
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
  },
  loadWeb3: async () => {
     //https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */ })
      } catch (error) {
       //the user has denied access!
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */ })
    }
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },
  loadAccount: async () => {
    App.account = await web3.eth.getAccounts()
  },
  loadContract: async () => {
    const privacyManager = await $.getJSON('PrivacyManager.json')
    App.contracts.PrivacyManager = TruffleContract(privacyManager)
    App.contracts.PrivacyManager.setProvider(App.web3Provider)
    App.privacyManager = await App.contracts.PrivacyManager.deployed()
  },
  setPrivacy: async () => {
    var setting_graph = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]
    //g1: everyone
    //g2:Followers    
    //g3: Followers you follow 
    //g4: people you follow 
    //r1: "photos and videos" is associated with the elements from index "0" to "3" each element of the array in this subset of elements represents the g permission granted by the user
    if ($('#privateProfileOption')[0].checked) {
      //not everyone can see photos end videos
      setting_graph[0] = "0"
      //followers can see photos and videos
      setting_graph[1] = "1"
      //in the extended graph we must consider that followers includes followers you follow
      setting_graph[2] = "1"
      //followed account do not necessarily include only folowed people so there's not going to be an edge here
      setting_graph[3] = "0"
      //r2,"stories" is associated with the elements from index "4" to index "7" each element of the array in this subset of elements represents the g permission granted by the user
      //not everyone can see stories, only followers can
      setting_graph[4] = "0"
      //followers can see stories
      setting_graph[5] = "1"
      //in the extended graph we must consider that followers includes followers you follow
      setting_graph[6] = "1"
      //followed account do not necessarily include only folowed people so there's not going to be an edge here
      setting_graph[7] = "0"
    }
    else if ($('#publicProfileOption')[0].checked) {
      for (var i = 0; i < 8; i++) {
        //everyone can see photos, videos and, since everyone includes all of the other gi we're going to set all of them as 1, this automatically excludes blocked accounts as everyone is non blocked accounts
        setting_graph[i] = "1"
      }
    }

    //r3:Message replies is associated with the elements that go from index 8 to the element at index 11 each position in this subset of elements represents the  permission granted by the user
    if ($('#storyFoll')[0].checked) {
      for (var i = 8; i < 12; i++) {
        //everyone
        setting_graph[i] = "1"
      }
    }
    else if ($('#storyFollFoll')[0].checked) {
      // followers
      setting_graph[9] = "1"
      setting_graph[10] = "1"
    }
    else if ($('#storyFollYFoll')[0].checked) {
      //followers you follow
      setting_graph[10] = "1"
    }
    else if ($('#storyYFoll')[0].checked) {
      //people you follow
      setting_graph[11] = "1"
      setting_graph[10] = "1"
    }
    else if ($('#storyNoOne')[0].checked) {
      //noOne
      for (var i = 8; i < 11; i++) {
        setting_graph[i] = "0"
      }
    }
    //r3: "Comments" is associated with the elements from index 10 to index 14 each position in this subset of elements represents the permission granted by the user to gi users
    if ($('#commEv')[0].checked) {
      for (var i = 12; i < 16; i++) {
        //everyone can comment, since everyone includes all of the other gi we're going to set all of them as 1
        setting_graph[i] = "1"
      }
    }
    else if ($('#commPff')[0].checked) {
      //people you follow (non followers), followers you follow and your followers
      setting_graph[13] = "1"
      setting_graph[14] = "1"
      setting_graph[15] = "1"
    }
    else if ($('#commPf')[0].checked) {
      //people you follow includes followers and non followers followed by the user
      setting_graph[14] = "1"
      setting_graph[15] = "1"
    }
    else if ($('#commFol')[0].checked) {
      setting_graph[13] = "1"
      setting_graph[14] = "1"
    }
    //r5:"active status" is associated with the elements from index 20 to index 24 each position in this subset of elements represents the g permission granted by the user

    if ($('#actY')[0].checked) {
      for (var i = 16; i < 20; i++) {
        setting_graph[i] = "1"
      }
    }
    else if ($('#actN')[0].checked) {
      for (var i = 16; i < 20; i++) {
        setting_graph[i] = "0"
      }
    }

    setting_graph = setting_graph.join("")
    setting_graph = parseInt(setting_graph, 2)
    setting_graph = web3.utils.toHex(setting_graph);
    setting_graph = web3.utils.padLeft(setting_graph, 8);
    var input = App.account + $('#salt').val();
    // Display
    try {
      await App.privacyManager.setPrivacy(web3.utils.keccak256(input), setting_graph)
      const event = await App.privacyManager.PrivacySetting()
      const event1 = await App.privacyManager.SettingChange()
      event.watch(function (error, result) {
        if (!error) {
          $('#setup').css("display", "none");
          $('#eventCatcher').css("display", "block");
          $('#eventinfo').html("<h4 class='header'>" + "Transaction completed! Here's the event information:" + "</h4>" + "Input:" + result.args.user + "<br/>" + "Setting graph:" + result.args.setting + "<br/>" + "event:" + result.event);

        } else {
          console.log(error);
        }
      });
      event1.watch(function (error, result) {
        if (!error) {
          $('#setup').css("display", "none");
          $('#eventCatcher').css("display", "block");
          $('#eventinfo').html("<h4 class='header'>" + "Transaction completed! Here's the event information:" + "</h4>" + "user address:" + result.args.user + "<br/>" + "setting:" + result.args.setting + "<br/>" + "event:" + result.event);

        } else {
          console.log(error);
        }
      });
    }
    catch (error) {
      $('#setup').css("display", "none");
      $('#eventCatcher').css("display", "block");
      $('#eventinfo').html("<h4 class='header'>" + "Transaction failed!" + "</h4>");
    }

  },


}
$(() => {
  $(window).load(() => {
    App.load()
  })
})
