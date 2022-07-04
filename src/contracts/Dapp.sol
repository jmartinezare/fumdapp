// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";
import "./IERC721Receiver.sol";
import "./Dron.sol";
import "./Plot.sol";
import "./FDT.sol";


contract Dapp is Ownable{

    address _contract_address;
    address _contract_owner;
    address _dron_token_collection_address;
    address _plot_token_collection_address;    
    address _fdt_token_address;
    mapping(uint256 => address) _dron_owner;
    //mapping(uint256 => DronToken) _dron_tokens;

    // Id dron => Indice de pendientes
    mapping(uint256 => int256)  _bookings_dron;

    // id parcela => indice de pendientes
    mapping(uint256 => int256) _bookings_plot;
    mapping(uint256 => address) _plot_owner;

    mapping(address => uint256[]) _plots_by_owner;
    //mapping(uint256 => PlotToken) _plot_tokens;

    struct single_pending_booking{
        uint256 dron_id;
        uint256 plot_id;
    }
    single_pending_booking[] _pending_booking;
    uint256 _num_pending;
    FDT _fdt;
    

    constructor() public{
        _contract_address = address(this);
        _contract_owner = msg.sender;
        _dron_token_collection_address = address(new DronToken());
        _plot_token_collection_address = address(new PlotToken());        

        _fdt = new FDT(_contract_address);
    } 
        

    function getContAddress() public view returns(address){
        return _contract_address;
    }
    function getContOwner() public view returns(address){
        return _contract_owner;
    }

    function createDron(address owner_, uint256 max_Height_, uint256 min_Height_, uint8 cost_, uint8 p1_, uint8 p2_, uint8 p3_, uint8 p4_, uint8 p5_) public returns (uint256)
    {
        uint8[] memory pesticides_ = new uint8[](5);
        pesticides_[0] = p1_;
        pesticides_[1] = p2_;
        pesticides_[2] = p3_;
        pesticides_[3] = p4_;
        pesticides_[4] = p5_;

        DronToken dron_token_collection = DronToken(_dron_token_collection_address);
        uint256 token_Id = dron_token_collection.mint(owner_, max_Height_, min_Height_, cost_, pesticides_);

        _dron_owner[token_Id] = owner_; 
        _bookings_dron[token_Id] = -1;
        return token_Id;
    }

    function createPlot(address owner_, uint256 max_Height_, uint256 min_Height_, uint8 pesticide_) public returns (uint256)
    {
        PlotToken plot_token_collection = PlotToken(_plot_token_collection_address);
        uint256 token_Id = plot_token_collection.mint(owner_, max_Height_, min_Height_, pesticide_);

        _plot_owner[token_Id] = owner_;           
        _plots_by_owner[owner_].push(token_Id);
        _bookings_plot[token_Id] = -1;
        return token_Id;
    }
       

    event BookedDron (uint256 dron_id, uint256 plot_id, uint256 cost_);
    function bookDron(uint256 dron_id_, uint256 plot_id_) public returns (uint256)
    {   _num_pending = _pending_booking.length;
        require(_bookings_dron[dron_id_] == -1, "Dron ya reservado");
        require(_bookings_plot[plot_id_] == -1, "Parcela ya reservada");

        DronToken dron_token_collection = DronToken(_dron_token_collection_address);
        uint256 cost = dron_token_collection.getDronCost(dron_id_);

        PlotToken plot_token_collection = PlotToken(_plot_token_collection_address);
        address plot_owner = plot_token_collection.getPlotOwner(plot_id_);

        require(plot_owner == msg.sender, "La reserva solo la pueda hacer el dueno de la parcela");

        require(isCompatibleDronPlot(dron_id_, plot_id_) == 1, "Dron y parcela no compatibles");

        require(_fdt.balanceOf(msg.sender) > cost, "Coste mayor que el balance");
        _fdt.customTransfer(msg.sender, _contract_address, cost);
                
        _bookings_dron[dron_id_] = int(_num_pending);
        _bookings_plot[plot_id_] = int(_num_pending);
        
        single_pending_booking memory new_booking = single_pending_booking(dron_id_,plot_id_);        
        _pending_booking.push(new_booking);        

        _num_pending = _pending_booking.length;

        emit BookedDron(dron_id_, plot_id_, cost);
        return 0;
    }

    function getPendingBooking() public view returns (single_pending_booking[] memory){
        return _pending_booking;
    }

    event FumigatedPlot (uint256 plot_id, uint256 dron_id);

    function fumigatePlot(uint256 plot_id_) onlyOwner public returns (uint256)
    {
        _num_pending = _pending_booking.length;
        require(_bookings_plot[plot_id_] >= 0, "La parcela no está pendiente de fumigar");
        require(_num_pending > 0, "No hay reservas pendientes de fumigar");
        
        uint256 i_to_delete = uint(_bookings_plot[plot_id_]);
        uint256 dron_id = _pending_booking[i_to_delete].dron_id;
        require(_bookings_dron[dron_id] >= 0, "El dron no está pendiente de fumigar");

        if (_num_pending >1){
            // Movemos la reserva pendiente de la última posición, a la posión de la reserva que quedará libre tras la fumigación
            uint256 dron_id_to_mov = _pending_booking[_num_pending-1].dron_id;
            uint256 plot_id_to_mov = _pending_booking[_num_pending-1].plot_id;
            _bookings_plot[plot_id_to_mov] = int(i_to_delete);
            _bookings_dron[dron_id_to_mov] = int(i_to_delete);
            _pending_booking[i_to_delete].plot_id = plot_id_to_mov;
            _pending_booking[i_to_delete].dron_id = dron_id_to_mov;
        }        
        delete _pending_booking[_num_pending-1];

        _pending_booking.length--;
        _num_pending = _pending_booking.length;
        // liberar reservas del dron y de la parcela
        _bookings_dron[dron_id] = -1;
        _bookings_plot[plot_id_] = -1;

        emit FumigatedPlot(plot_id_, dron_id);
        return 1;
    }

    function isBookedPlot(uint256 plot_id_) public view returns (int256)
    {        
        return _bookings_plot[plot_id_];
    }
    function isBookedDron(uint256 dron_id_) public view returns (int256)
    {        
        return _bookings_dron[dron_id_];
    }

    function isCompatibleDron(uint256 id_dron_, uint256 max_Height_, uint256 min_Height_, uint256 pesticide_) public returns (uint256)
    {        
        uint256 max_Height;
        uint256 min_Height;
        uint256 cost;
        uint8[] memory pesticides;
        address owner;

        DronToken dron_token_collection = DronToken(_dron_token_collection_address);
        (max_Height, min_Height, cost, pesticides, owner) = dron_token_collection.getDronInfo(id_dron_);

         if (max_Height >= max_Height_ && min_Height <= min_Height_ && pesticides[pesticide_] == 1)
         {
            return 1;            
         }
         else {
            return 0;
         }
    }

    function isCompatibleDronPlot(uint256 dron_id_, uint256 plot_id_) public returns (uint256){
        uint256 max_Height;
        uint256 min_Height;        
        uint8 pesticide;
        address owner;

        PlotToken plot_token_collection = PlotToken(_plot_token_collection_address); 
        (max_Height, min_Height, pesticide, owner) = plot_token_collection.getPlotInfo(plot_id_);  

        return isCompatibleDron(dron_id_, max_Height, min_Height, pesticide);
    }

    function getLastDronId() public view returns(uint256) {  
        uint256 id ;
        DronToken dron_token_collection = DronToken(_dron_token_collection_address);
        id = dron_token_collection.getLastId();        
        return id;
    }

    function getDronInfo(uint256 id_) public returns (uint256 max_Height, uint256 min_Height, uint256 cost, uint8[] memory  pesticides, address owner) {  
        DronToken dron_token_collection = DronToken(_dron_token_collection_address);
        return dron_token_collection.getDronInfo(id_);        
    }

    function getDronCost(uint256 dron_id_) public  view returns (uint256){
        DronToken dron_token_collection = DronToken(_dron_token_collection_address);
        return dron_token_collection.getDronCost(dron_id_);
    }

    function getLastPlotId() public view returns(uint256) {  
        uint256 id ;
        PlotToken plot_token_collection = PlotToken(_plot_token_collection_address);
        id = plot_token_collection.getLastId();        
        return id;
    }
    function getPlotInfo(uint256 id_) public returns (uint256 max_Height, uint256 min_Height, uint8 pesticide, address owner) {  
        PlotToken plot_token_collection = PlotToken(_plot_token_collection_address);
        return plot_token_collection.getPlotInfo(id_);        
    }

    function getPlotsByOwner(address owner_) public view returns (uint256[] memory) {          
        return _plots_by_owner[owner_];
    }

    function searchDronAvailable(uint256 plot_id_) public returns (uint256) {          
        uint256 max_Height;
        uint256 min_Height;
        uint8 pesticide;
        address owner;
        uint256 dron_id;
        uint8 stop;

        uint8 i = 0;
        uint8 max_i = 10;

        if (_bookings_plot[plot_id_] == -1){ 
            PlotToken plot_token_collection = PlotToken(_plot_token_collection_address);        
            DronToken dron_token_collection = DronToken(_dron_token_collection_address);

            (max_Height, min_Height, pesticide, owner) = plot_token_collection.getPlotInfo(plot_id_);

            while(stop == 0){
                dron_id = dron_token_collection.getDronByFilters(max_Height, min_Height, pesticide, dron_id+1);
                if (dron_id == 0){
                    stop = 1;
                }
                else if(_bookings_dron[dron_id] == -1){
                    stop = 1;
                }

                // Evitar quedarse sin gas por algún error
                i++;
                if (i >= max_i)
                {
                    stop = 1;
                }            
            }
        }
                
        return dron_id;
    }

    function buyTokensFDT(uint256 units_) public payable {
        require(units_>0, "Cantidad de token no vlida");
        
        uint256 balance = _fdt.totalSupply();
        uint256 amount = units_*(0.001 ether) ;
        
        require(units_ < balance, "No quedan tokens FDT suficientes");
        require(msg.value >= amount , "Cantidad de ETH insuficiente para la compra");

        address address_to = msg.sender;
        uint256 extra_Eth = msg.value - amount;

        _fdt.transfer(address_to, units_);
        if (extra_Eth > 0 ){
            msg.sender.transfer(extra_Eth); //mandar de vuelta, el eth extra (excedente) enviado en el pago
        }
    }

    function getAcountBalance(address account_) public view returns (uint256){
        return _fdt.balanceOf(account_);
    }

    function getDronByFilters(uint256 max_Height_,uint256 min_Height_, uint8 pesticide_, uint256 start_point_) public view returns (uint256){
        DronToken dron_token_collection = DronToken(_dron_token_collection_address);
        return dron_token_collection.getDronByFilters(max_Height_, min_Height_, pesticide_, start_point_);
    }
}
