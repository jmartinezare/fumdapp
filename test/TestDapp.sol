
// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.5.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../src/contracts/Dapp.sol";

 contract TestDapp {

    function testOwnerOfDeployedContract() public {
        // ARRANGE
        Dapp dapp = Dapp(DeployedAddresses.Dapp());
        
        // ACT and ASSERT
        Assert.equal(address(dapp.getContOwner()), msg.sender, "Owner is different than a deployer");
  }

}  