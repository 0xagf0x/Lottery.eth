const assert = require("assert"); // helper library from Node
const ganache = require("ganache-cli"); // our local TestNet
const Web3 = require("web3"); // creating a Constructor function 
const web3 = new Web3(ganache.provider()); //  new instance. provider() allows us to connect to the network 
const { interface, bytecode } = require("../compile"); // import ABI + bytecode

let lottery;
let accounts;


beforeEach(async () => {
  accounts = await web3.eth.getAccounts(); // get list of accounts 
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery Contract", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows an account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0], 
      value: web3.utils.toWei('3', 'ether'), // converts '100000000000'etc into readable eth 
    });

    const players = await lottery.methods.listPlayers().call({
      from: accounts[0],
    });

    assert.equal(accounts[0] , players[0]);
    assert.equal(1, players.length);
  });


  it("allows multiple account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0], 
      value: web3.utils.toWei('3', 'ether'), // converts '100000000000'etc into readable eth 
    });
    await lottery.methods.enter().send({
      from: accounts[1], 
      value: web3.utils.toWei('3', 'ether'), // converts '100000000000'etc into readable eth 
    });
    await lottery.methods.enter().send({
      from: accounts[2], 
      value: web3.utils.toWei('3', 'ether'), // converts '100000000000'etc into readable eth 
    });

    const players = await lottery.methods.listPlayers().call({
      from: accounts[0],
    });

    assert.equal(accounts[0] , players[0]);
    assert.equal(accounts[1] , players[1]);
    assert.equal(accounts[2] , players[2]);
    assert.equal(3, players.length);
  });
  
});
