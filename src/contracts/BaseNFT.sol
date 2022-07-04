// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

import "./Ownable.sol";
import "./ERC721.sol";


// TODO: create a IPFS file ipfs.io


contract BaseNFT is ERC721, Ownable {

    uint256 public last_id;
    address internal _owner;
    string internal _uri = "";

    
    constructor() ERC721() public {
        //Ownable.transferOwnership(owner_);                
    }


     /*
    function _baseURI() internal view override(ERC721) returns (string memory) {
        return _uri;
    }
    */

    // function mint(address _owner) onlyOwner public returns(uint256) {
    //     uint256 _id = _getNewId();
    //     ERC721._mint(_owner, _id);
    //     return _id;
    // }

    function _getNewId() internal returns(uint256) {        
        last_id = last_id + 1;
        return last_id;
    }

    function getLastId() public view returns(uint256) {        
        return last_id;
    }

}