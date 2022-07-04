// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;

import "./BaseNFT.sol";

contract PlotToken is BaseNFT {

    struct properties{
        uint256 max_Height;
        uint256 min_Height;        
        uint8 pesticide;
        address owner;
    }
    properties _properties;
    mapping (uint256 => properties) plot_list;
    
    constructor() BaseNFT() public{ 
        _uri = "";
    }

    function mint(address owner_, uint256 max_Height_, uint256 min_Height_, uint8 pesticide_) onlyOwner public returns(uint256) {
        uint256 id = _getNewId();
        ERC721._mint(owner_, id);

        plot_list[id].max_Height = max_Height_;
        plot_list[id].min_Height = min_Height_;
        plot_list[id].pesticide = pesticide_;
        plot_list[id].owner = owner_;
        return id;
    }

    
    event PlotInfo (uint256 indexed max_Height, uint256 indexed min_Height, uint8 pesticide);

    function getPlotInfo(uint256 id_) public returns (uint256 max_Height, 
                                                      uint256 min_Height, 
                                                      uint8 pesticide, 
                                                      address owner)
    {
        if (id_ == 0){
            id_ = last_id;
        }
        
        require(plot_list[id_].owner != address(0x0), "Parcela no registrado");
        
        emit PlotInfo(  plot_list[id_].max_Height, 
                        plot_list[id_].min_Height,                         
                        plot_list[id_].pesticide);

        return (plot_list[id_].max_Height, 
                plot_list[id_].min_Height,
                plot_list[id_].pesticide, 
                plot_list[id_].owner );
    }

    function getPlotOwner(uint256 id_) public view returns (address owner){
        return plot_list[id_].owner;
    }
}