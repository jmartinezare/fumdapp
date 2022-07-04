// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

import "./CutomERC20.sol";

//FDT: Fumigate dron token
contract FDT is CustomERC20{

    string _name = "Fumigate Dron Token";
    string _symbol = "FDT";
    uint256 _total_amount = 10000;    

    //constructor (address _auctionOwner, uint256 _amount, string memory name_, string memory symbol_) ERC20(name_, symbol_) {
    constructor (address owner_) public{        
       _mint(owner_, _total_amount);        
    }    

    function customTransfer(address sender, address recipient, uint256 amount) public returns (bool){
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(_balances[sender] > amount, "No hay saldo suficiente"); // añadido sobre el contrado ERC0

        _balances[sender] = _balances[sender].sub(amount);
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
        return true;
    }
}

