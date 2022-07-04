// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;
//pragma experimental ABIEncoderV2;

import "./BaseNFT.sol";


//contract DronTokenColeccion is BaseNFT{}

contract DronToken is BaseNFT {

    //uint256 public lastId = 0;

    struct properties{
        uint256 max_Height;
        uint256 min_Height;
        uint256 cost;
        uint8[] pesticides;
        address owner;
    }
    //properties _properties;    
    mapping (uint256 => properties) dron_list;
    uint256[] _all_dron_ids;

    //constructor(string memory name_, string memory symbol_, address owner_, uint256 max_Height_, uint256 min_Height_, uint256 cost_, Pesticide[] memory pesticides_) BaseNFT(name_, symbol_, owner_) {        
    constructor() BaseNFT() public{ 
        _uri = "";
    }    

    function mint(address owner_, uint256 max_Height_, uint256 min_Height_, uint256 cost_, uint8[] memory pesticides_) onlyOwner public returns(uint256) {        
        uint256 id = _getNewId();
        ERC721._mint( owner_, id);

        dron_list[id].max_Height = max_Height_;
        dron_list[id].min_Height = min_Height_;
        dron_list[id].cost = cost_;
        dron_list[id].pesticides = pesticides_;
        dron_list[id].owner = owner_;
        _all_dron_ids.push(id);
        return id;
    }

    
    event DronInfo (uint256 indexed max_Height, uint256 indexed min_Height, uint256 indexed cost, uint8[] pesticides);

    function getDronInfo(uint256 id_) public returns (uint256 max_Height, 
                                                      uint256 min_Height, 
                                                      uint256 cost, 
                                                      uint8[] memory  pesticides, 
                                                      address owner)
    {
        if (id_ == 0){
            id_ = last_id;
        }
        
        require(dron_list[id_].owner != address(0x0), "Dron no registrado");
        
//        print(dron_list[id_].max_Height);
        emit DronInfo(  dron_list[id_].max_Height, 
                        dron_list[id_].min_Height, 
                        dron_list[id_].cost, 
                        dron_list[id_].pesticides);

        return (dron_list[id_].max_Height, 
                dron_list[id_].min_Height, 
                dron_list[id_].cost, 
                dron_list[id_].pesticides, 
                dron_list[id_].owner );
    }

    function getDronCost(uint256 id_) public view returns (uint256){
        return dron_list[id_].cost;
    }

    function getDronByFilters(uint256 max_Height_,uint256 min_Height_, uint8 pesticide_, uint256 start_point_) public view returns (uint256){
        uint8 stop = 0;
        uint256 i = start_point_;
        uint256 dron_id = 0;
        while (stop == 0)
        {
            if (i > last_id){
                stop = 1;
            } 
            else{            
                if (dron_list[i].min_Height <= max_Height_ &&
                    dron_list[i].max_Height >= min_Height_ &&
                    dron_list[i].pesticides[pesticide_] == 1 ){
                        dron_id = i;
                        stop = 1;
                }
            }
            i++;
        }
        return dron_id;
    }


    // function getAllDronsText() public view returns (properties[] memory){
    //     properties[] memory resu;
    //     uint256 i;
    //     uint dron_id;
    //     for (i = 0; i< _all_dron_ids.length; i++){
    //         dron_id = _all_dron_ids[i];
    //         resu.push(dron_list[dron_id]);
    //     }
    // }
    // function getAllDronsText() public view returns (string[] memory){

    //     string[] resu;
    //     uint256 i;

    //     for (i = 0; i< dron_list.lenth; i++){
    //         resu.push(dron_list[id_].max_Height, 
    //                   dron_list[id_].min_Height, 
    //                   dron_list[id_].cost, 
    //                   dron_list[id_].pesticides, 
    //                   dron_list[id_].owner )
    //     }


    //     properties[] memory resu;
    //     return resu;
    // }

    // dron_list[id_].max_Height, 
    //             dron_list[id_].min_Height, 
    //             dron_list[id_].cost, 
    //             dron_list[id_].pesticides, 
    //             dron_list[id_].owner 

}