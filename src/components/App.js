import React, { Component } from 'react';
import './css/App.css';
import 'jquery'
import 'popper.js'
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';

import Web3 from 'web3'
import Dapp from '../abis/Dapp.json'
import { resolve } from 'url';

//window.plots = new Array();
class App extends Component {
  
  async componentWillMount() {    
    await this.loadWeb3()
    await this.loadBlockchainData()
    //await this.getAcountBalance()
    document.title = "Fumigaciones S.A.";
  }

  async loadWeb3() {
    if(window.ethereum) {      
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      this.setState({user_account: window.ethereum.selectedAddress})
    }
    else if (window.web3) {      
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Metamask no detectado')
    }
  }

  async loadBlockchainData(){
    const web3 = window.web3
    
    // Cargar una cuenta
    
    const accounts = await web3.eth.getAccounts()
    //this.setState({user_account: accounts[0]})
    //this.setState({user_account: web3.selectedAddress})

    const networkId = '5777'
    const networkData = Dapp.networks[networkId]    
    if(networkData) {
      const abi = Dapp.abi 
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({contract_address: address})

      this.setState({contract})
      console.log("Contrato: ", address);
      console.log("Usuario: ", this.state.user_account);
      //console.log("Empresa: ", this.state.company_account);

      // Función 'totalSupply' del Smart Contract
      //const totalSupply = await contract.methods.totalSupply().call()
      //this.setState({totalSupply})      
      // Carga de colores
      // for (var i = 1; i<=totalSupply; i++){
      //   const color = await contract.methods.colors(i-1).call()
      //   this.setState({colors: [...this.state.colors, color] 
      //   })
      // }
    } else {
      window.alert('¡Smart Contract no desplegado en la red!');
    }    
  }  
    
  // Constructor
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0
    }
  }

  

  async SetUpExamples() {
    // Drones
    this.state.contract.methods.createDron(this.state.user_account, 100, 10, 12, 1, 1, 0, 0, 0).send({ from: this.state.user_account })
    this.state.contract.methods.createDron(this.state.user_account, 100, 10, 15, 0, 1, 0, 0, 0).send({ from: this.state.user_account })
    // this.state.contract.methods.createDron(this.state.user_account,  90, 70,  7, 0, 0, 0, 0, 1).send({ from: this.state.user_account })
    // this.state.contract.methods.createDron(this.state.user_account,  80, 30,  8, 0, 0, 0, 0, 1).send({ from: this.state.user_account })    
    // // Parcelas
    this.state.contract.methods.createPlot(this.state.user_account,  10, 10, 0).send({ from: this.state.user_account }) //A
    this.state.contract.methods.createPlot(this.state.user_account, 100, 10, 0).send({ from: this.state.user_account }) //A
    this.state.contract.methods.createPlot(this.state.user_account,  50, 10, 1).send({ from: this.state.user_account }) //B
    // this.state.contract.methods.createPlot(this.state.user_account,  50, 20, 2).send({ from: this.state.user_account }) //C
    // this.state.contract.methods.createPlot(this.state.user_account,  20, 10, 4).send({ from: this.state.user_account }) //E
    // this.state.contract.methods.createPlot(this.state.user_account,  60, 20, 4).send({ from: this.state.user_account }) //E
  }

  async createDron(max_Height_, min_Height_, cost_, p1_, p2_, p3_, p4_, p5_) {        
    const txt = await this.state.contract.methods.createDron(this.state.user_account, max_Height_, min_Height_, cost_, p1_, p2_, p3_, p4_, p5_).send({ from: this.state.user_account })
    console.log(txt);
  }

  getLastDronId = () => {        
    this.state.contract.methods.getLastDronId().call({ from: this.state.user_account }, function(error, result){
      console.log("Dron LastId: ", Number(result));
      return Number(result);
    });               
  }
  getDronInfo = (dron_id) => {      
    console.log("Buscar info del dron")
    this.state.contract.methods.getDronInfo(dron_id).call({ from: this.state.user_account }, function(error, result){
      console.log(result);
    });               
  }

  async createPlot(max_Height_, min_Height_, pesticide_) {        
    const txt = await this.state.contract.methods.createPlot(this.state.user_account, max_Height_, min_Height_, pesticide_).send({ from: this.state.user_account })
    console.log(txt);
  }
  getLastPlotId = () => {          
    this.state.contract.methods.getLastPlotId().call({ from: this.state.user_account }, function(error, result){
      console.log("Parcela LastId: ", Number(result));
      return Number(result);
    });               
  }
  getPlotInfo = (plot_id) => {      
    console.log("Buscar info de la parcela")
    this.state.contract.methods.getPlotInfo(plot_id).call({ from: this.state.user_account }, function(error, result){
      console.log(result);
    });               
  }
  loadPlotsOwner = () => {     
    var plots = [];

    this.state.contract.methods.getPlotsByOwner(this.state.user_account).call({ from: this.state.user_account }, function(error, result){                        
      for (var i = 0; i< result.length;i++ ){
        var plot_id = parseInt(result[i]);
        plots.push('<option value="' + plot_id + '">Parcela ' + plot_id +'</option>');              
      }      
      $("#PlotsOwner").html(plots.join(''));

    });
  }

  isBookedDron = (dron_id_) => { 
    
    this.state.contract.methods.isBookedDron(dron_id_).call({ from: this.state.user_account }, function(error, result){                        
      console.log("Disponibilidad dron " + dron_id_ + ": " + parseInt(result));
    });
  }
  isBookedPlot = (plot_id_) => { 
  
    this.state.contract.methods.isBookedPlot(plot_id_).call({ from: this.state.user_account }, function(error, result){                        
      console.log("Disponibilidad parcela " + plot_id_ + ": " + parseInt(result));
    });
  }
  

  loadDronAvailable = (plot_id_) => {     
    var plots = [];

    this.state.contract.methods.searchDronAvailable(plot_id_).call({ from: this.state.user_account }, function(error, result){              
      if (error){
        console.log(error);
      }
      else{

        console.log("Dron disponible (parcela " + plot_id_ + ") ", result); 
        var dron_id = parseInt(result);
        
        if (dron_id > 0){
          plots.push('<option value="' + dron_id + '">Dron ' + dron_id +'</option>');              
        }
        else{
          window.alert("No hay drones disponibles para esta parcela: " + plot_id_);
        }
                
        $("#DronAvailable").html(plots.join(''));  
      }

    });                    
  
  }

  async bookDron(dron_id_, plot_id_) {        
    //let st_gas = this.state.contract.methods.bookDron(dron_id_, plot_id_).estimateGas({gas:5000000});
    //const txt = await this.state.contract.methods.bookDron(dron_id_, plot_id_).send({ from: this.state.user_account, gas:parseInt(st_gas)});
    const txt = await this.state.contract.methods.bookDron(dron_id_, plot_id_).send({ from: this.state.user_account, gas:500000});
    console.log(txt);
  }  
  // bookDron = (dron_id_, plot_id_) => {  
  //   await this.state.contract.methods.bookDron(dron_id_, plot_id_).send({ from: this.state.user_account });
  // }  
   
  getPendingBooking = () => {  
    var plots = [];

    this.state.contract.methods.getPendingBooking().call({ from: this.state.user_account }, function(error, result){              
        if (error){
          console.log(error);
        }
        else{
          console.log("Obtener reservas pendientes"); 
          console.log(result);

          for (var i = 0; i< result.length;i++ ){
            var plot_id = parseInt(result[i].plot_id);
            var dron_id = parseInt(result[i].dron_id);
            if (plot_id > 0 ){
              plots.push('<option value="' + plot_id + '">Parcela ' + plot_id + ' y Dron ' + dron_id + '</option>');
            }
          }      
          $("#PendingBooking").html(plots.join(''));
                             
        }
    });
  }


  // fumigatePlot = (plot_id_) => {
  //   this.state.contract.methods.fumigatePlot(plot_id_).sender({ from: this.state.user_account }, function(error, result){              
  //       if (error){
  //         console.log(error);
  //       }
  //       else{
  //         window.alert("Fumigar la parcela " + plot_id_);
  //       }
  //   });
  // }

  async fumigatePlot(plot_id_) {        
      const txt = await this.state.contract.methods.fumigatePlot(plot_id_).send({ from: this.state.user_account, gas:500000});
      console.log(txt);
  } 

  async buyTokensFDT(units_to_buy_) { 
    const weis = window.web3.utils.toWei((units_to_buy_*0.001).toString(), "ether");
    console.log("comprar tokens: " + units_to_buy_ + " con " + weis + " weis ")
    const txt = await this.state.contract.methods.buyTokensFDT(units_to_buy_).send({from: this.state.user_account, value: weis, gas:500000});
    console.log(txt);
  } 
    
  getAcountBalance = (account_) => {
    console.log("balance de" + this.state.user_account)        
    this.state.contract.methods.getAcountBalance(account_).call({ from: this.state.user_account }, function(error, result){
      console.log(result)
      const balance = Number(parseInt(result))
      console.log("Balance de usuario: ", balance);
      //this.setState({user_balance: balance})

      $("#Balance").val(balance);
      
      return Number(result);
    });               
  }

  getDronCost = (dron_id_) => {
    console.log("Coste dron " + dron_id_ + ": " + this.state.user_account)        
    this.state.contract.methods.getDronCost(dron_id_).call({ from: this.state.user_account }, function(error, result){
      console.log(result)
      return Number(result);
    });               
  }  

  getDronByFilters = (max_Height_, min_Height_, pesticide_, start_point_) => {
    console.log("dron by filter " + max_Height_ + " " + min_Height_ + " " + pesticide_ + " " + start_point_)        ;
    this.state.contract.methods.getDronByFilters(max_Height_, min_Height_, pesticide_, start_point_).call({ from: this.state.user_account }, function(error, result){
      console.log(result)      
    });               
  }  
  


  render() {    
    return (
      <div>   
        <div className='row justify-content-between text-white bg-dark'>
          <label className='col'>Usuario: {this.state.user_account}</label>
          {/* <label className='col'>Balance de FDT: {this.state.user_balance}</label> */}
          <label className='col d-flex justify-content-end'>Contrato: {this.state.contract_address}</label>
        </div>
        <div> 
          <main role="main" >
            
            {/* DRONES */}  
            <div className="container mb-3 mt-3">       
              <h1>Fumigaciones SA</h1> 
            </div>
            <div className="container mb-3 mt-3">                           
              <h2>Registros de nuevos drones en la flota</h2>              
              <form onSubmit={(event) => {
                    event.preventDefault();                    
                      var p1 = 0;
                      var p2 = 0;
                      var p3 = 0;
                      var p4 = 0;
                      var p5 = 0;

                      $("#Dron_Pesticides :selected").map(function(i, el) {
                        //return $(el).val();                        
                        switch($(el).val() ){
                          case "1": 
                            p1 = 1;break;
                          case "2": 
                            p2 = 1;break;
                          case "3": 
                            p3 = 1;break;
                          case "4": 
                            p4 = 1;break;
                          case "5": 
                            p5 = 1;break;
                          default: break;
                        } 
                        return i;
                      }).get();
                      
                      this.createDron($('#Dron_MaxHeight').val(),
                                      $('#Dron_MinHeight').val(),
                                      $('#Dron_Cost').val(),
                                      p1, p2, p3, p4, p5);                                                          
                }}>
                  <div className="form-group">

                      <label htmlFor="Dron_MaxHeight">Altura máxima</label>
                      <input type="text" className="form-control" id="Dron_MaxHeight" placeholder="Límite altura máxima de vuelo (metros)"/>
                  </div>
                  <div className="form-group">
                      <label htmlFor="Dron_MinHeight">Altura mínima</label>
                      <input type="text" className="form-control" id="Dron_MinHeight" placeholder="Límite altura mínima de vuelo (metros)"/>
                  </div>                  
                  
                  <div className="form-group">
                      <label htmlFor="Dron_Pesticides">Pesticidas disponibles</label>
                      <select multiple className="form-control" id="Dron_Pesticides">
                        <option value = "1">Pesticida A</option>
                        <option value = "2">Pesticida B</option>
                        <option value = "3">Pesticida C</option>
                        <option value = "4">Pesticida D</option>
                        <option value = "5">Pesticida E</option>
                      </select>
                  </div>

                  <div className="form-group">
                      <label htmlFor="Dron_Cost">Coste en tokens FDT</label>
                      <input type="number" className="form-control" id="Dron_Cost" placeholder="Coste"/>
                  </div>

                  <button type="submit" className="btn btn-success btn-lg">Registrar Dron</button>

              </form>
            </div>  
            <br></br>
            <br></br>
            <br></br>


            {/* PARCELAS */}
            <div className="container mb-3 mt-3">              
              <h2>Registro de nuevas parcelas</h2>
              <br></br>
              <form onSubmit={(event) => {
                      event.preventDefault();
                      var pesticide = 0;                                       
                      switch($("#Plot_Pesticide :selected").val() ){
                        case "1": 
                          pesticide = 1;break;
                        case "2": 
                          pesticide = 2;break;
                        case "3": 
                          pesticide = 3;break;
                        case "4": 
                          pesticide = 4;break;
                        case "5": 
                          pesticide = 5;break;
                        default: break;
                      }

                      this.createPlot($('#Plot_MaxHeight').val(),
                                      $('#Plot_MinHeight').val(),
                                      pesticide-1);                                                          
                }}>                  
                  <div className="form-group">
                      <label htmlFor="Plot_MaxHeight">Altura máxima</label>
                      <input type="text" className="form-control" id="Plot_MaxHeight" placeholder="Límite altura máxima de vuelo (metros)" />
                  </div>
                  <div className="form-group">
                      <label htmlFor="Plot_MinHeight">Altura mínima</label>
                      <input type="text" className="form-control" id="Plot_MinHeight" placeholder="Límite altura mínima de vuelo (metros)" />
                  </div>

                  <div className="form-group">
                      <label htmlFor="Plot_Pesticide">Pesticida aceptado</label>
                      <select className="form-control" id="Plot_Pesticide">
                        <option value = "1">Pesticida A</option>
                        <option value = "2">Pesticida B</option>
                        <option value = "3">Pesticida C</option>
                        <option value = "4">Pesticida D</option>
                        <option value = "5">Pesticida E</option>
                      </select>
                  </div>            

                  <button type="submit" className="btn btn-success btn-lg">Registrar Parcela</button>

              </form>
           </div> 

           <br></br>
           <br></br>
           <br></br>


           {/* APARTADO DE RESERVA DE FUMIGACIONES */}       
           <div className="container mb-3 mt-3"> 
           <h2>Reserva un dron para la fumigación de tu parcela</h2> 
           <form onSubmit={(event) => {
                      event.preventDefault();                      
                      this.loadPlotsOwner();
                }}>
                <div className="form-group">
                  <label htmlFor="PlotsOwner">Parcelas del propietario</label>
                  <select className="form-control" id="PlotsOwner">
                  </select>                  
                </div>
                <button type="submit" className="btn btn-secondary">Recargar parcelas</button>
           </form>
           </div>

           {/* BUSCAR DRON COMPATIBLE */}
           <div className="container mb-3 mt-3">  
           <form onSubmit={(event) => {
                      event.preventDefault();  
                      var plot_id = parseInt($("#PlotsOwner :selected").val() );
                      console.log(plot_id);
                      if (plot_id > 0){
                        console.log("Buscar dron para parcela: " + plot_id);
                        this.loadDronAvailable(plot_id);  
                      }else{
                        window.alert("Seleccione una parcela");
                      }                      
                }}>
                <div className="form-group">
                  <label htmlFor="DronAvailable">Drones disponibles y compatibles</label>
                  <select className="form-control" id="DronAvailable">
                  </select>                  
                </div>
                <button type="submit" className="btn btn-secondary">Buscar Drones dispobibles y compatibles</button>
           </form>
           </div>

           {/* RESERVAR DRON PARA FUMIGAR LA PARCELA */}
           <div className="container mb-3 mt-3">  
           
           <form onSubmit={(event) => {
                      event.preventDefault();  
                      var plot_id = parseInt($("#PlotsOwner :selected").val() );
                      var dron_id = parseInt($("#DronAvailable :selected").val() );                      

                      if (plot_id > 0 && dron_id> 0){
                        console.log("Reservar dron " + dron_id + " para parcela " + plot_id);
                        this.bookDron(dron_id, plot_id);  
                      }else{
                        window.alert("Seleccione una parcela y un dron para la reserva de la fumigación");
                      }                      
                }}>                
                <button type="submit" className="btn btn-success btn-lg">Reservar dron</button>
           </form>
           </div>

          <br></br>
          <br></br>
          <br></br>        

          {/* OBTENER RESERVAS PENDIENTES */}
          <div className="container mb-3 mt-3">  
          <h2>Fumigaciones pendientes</h2>
           <form onSubmit={(event) => {
                      event.preventDefault();                                                
                      this.getPendingBooking();                        
                }}>
                
              <label htmlFor="PendingBooking">Parcelas con reserva pendiente</label>
              <select className="form-control" id="PendingBooking">
              </select>     
              <button type="submit" className="btn btn-secondary">Obtener Reservar</button>
           </form>
           </div>

           <div className="container mb-3 mt-3">  
           <form onSubmit={(event) => {
                      event.preventDefault();   
                      var plot_id = parseInt($("#PendingBooking :selected").val() );
                      var txt = $("#PendingBooking :selected").text();
                      if (plot_id <= 0){
                        window.alert("Selleccione una reserva para poder realiza la fumigación")
                      }
                      else{
                        console.log("Fumigar: " + txt);
                        this.fumigatePlot(plot_id);
                      }                      
                }}>   
              <button type="submit" className="btn btn-success btn-lg">Fumigar</button>
           </form>
           </div> 
      
          <br></br>
          <br></br>
          <br></br>        

          {/* COMPRAR TOKEN ERC20 FDT */}      
          <div className="container mb-3 mt-3">  
            <h2>Exchange para clientes</h2>
           <form onSubmit={(event) => {
                      event.preventDefault();   
                      const units_to_buy = $("#UnitsToBuy").val();                      
                      console.log("Comprar token FDT (ERC20): " + units_to_buy);
                      this.buyTokensFDT(units_to_buy); 
                      //this.getAcountBalance();                     
                }}> 
              <p> Los token FDT son necesarios para realizar contrataciones de drones para fumigar parcelas</p>
              <label htmlFor="UnitsToBuy">Cantidad de FDT tokens (1 FDT  = 0.001 ETH)</label>
              <input type="text" className="form-control" id="UnitsToBuy" placeholder="Cantidad de token FDT a comprar"/>

              <button type="submit" className="btn btn-success btn-lg">Comprar token FDT (ERC20)</button>
           </form>
          </div>         
           
           <br></br>
           <br></br>
           <br></br>
           <br></br>


          {/* CONSULTAR SALDO*/} 
          <div className="container mb-3 mt-3">  
            <h2>Consulta de balance FDT</h2>
           <form onSubmit={(event) => {
                      event.preventDefault();                                          
                      const acc = $("#Account").val(); 
                      this.getAcountBalance(acc);                     
                }}>               
              <label htmlFor="Account">Cuenta a consultar balance de FDT</label>
              <input type="text" className="form-control" id="Account" placeholder="Cuenta a consultar"/>

              <label htmlFor="Balance">Cantidad de FDT disponible</label>
              <input type="text" className="form-control" id="Balance" placeholder="Balance"/>
              <button type="submit" className="btn btn-success btn-lg">Consultar</button>
           </form>
          </div>         
           
           <br></br>
           <br></br>
           <br></br>
           <br></br> 

          {/* HERRAMIENTAS */}
            
                     
          <div className="container mb-3 mt-3">        
          <h2>Kit De Herramientas</h2>
            <form onSubmit={(event) => {
                    event.preventDefault();                      
                    this.getLastDronId();                
                }}>
              <input type = 'submit' className="btn btn-block btn-primary" value = "Último Id dron"/>
            </form>        
                    
            <form onSubmit={(event) => {
                    event.preventDefault();                  
                    this.getDronInfo(parseInt($("#Dron_to_show").val()));                                                
                }}>
              <label htmlFor="Dron_to_show">Dron a mostrar</label>
              <input type="text" className="form-control" id="Dron_to_show" placeholder="Dron a mostrar"/>    
              <input type = 'submit' className="btn btn-block btn-primary" value = "Info dron"/>
            </form> 

            <form onSubmit={(event) => {
                    event.preventDefault();                  
                    this.isBookedDron(parseInt($("#Dron_to_show").val()));                                                
                }}>                        
              <input type = 'submit' className="btn btn-block btn-primary" value = "Disponibilidad Dron"/>
            </form>

            <form onSubmit={(event) => {
                    event.preventDefault();                  
                    this.getDronCost(parseInt($("#Dron_to_show").val()));                                                
                }}>                        
              <input type = 'submit' className="btn btn-block btn-primary" value = "Coste Dron"/>
            </form>

          </div>

          <br></br>
          <br></br>


          <div className="container mb-3 mt-3">        
            <form onSubmit={(event) => {
                    event.preventDefault();     
                    this.getLastPlotId();                
                }}>
              <input type = 'submit' className="btn btn-block btn-primary" value = "Último Id Parcela"/>
            </form>        
                    
            <form onSubmit={(event) => {
                    event.preventDefault();           
                    this.getPlotInfo(parseInt($("#Plot_to_show").val()));
                }}>
              <label htmlFor="Plot_to_show">Parcela a mostrar</label>
              <input type="text" className="form-control" id="Plot_to_show" placeholder="Parcela a mostrar"/>

              <input type = 'submit' className="btn btn-block btn-primary" value = "Info parcela"/>
            </form> 
            <form onSubmit={(event) => {
                    event.preventDefault();                  
                    this.isBookedPlot(parseInt($("#Plot_to_show").val()));                                                
                }}>                        
              <input type = 'submit' className="btn btn-block btn-primary" value = "Disponibilidad Parcela"/>
            </form>
          </div>




          <br></br>
          <br></br>


          <div className="container mb-3 mt-3">        
            <form onSubmit={(event) => {
                    event.preventDefault();   
                    const max_Height = $("#F_Dron_MaxHeight").val();
                    const min_Height = $("#F_Dron_MinHeight").val();
                    const pesticide = $("#F_Dron_pesticide").val();
                    const start_point = $("#F_Dron_start_point").val();
                    //console.log("obtener dron con filtros: " + max_Height + " " + min_Height + " " + pesticide + " " + start_point);
                    this.getDronByFilters(max_Height, min_Height, pesticide, start_point);                
                }}>
            
              <label htmlFor="F_Dron_MaxHeight">Altura máxima</label>
              <input type="text" className="form-control" id="F_Dron_MaxHeight" placeholder="Límite altura máxima de vuelo (metros)"/>
              
              <label htmlFor="F_Dron_MinHeight">Altura mínima</label>
              <input type="text" className="form-control" id="F_Dron_MinHeight" placeholder="Límite altura mínima de vuelo (metros)"/>
              
              <label htmlFor="F_Dron_pesticide">Pesticida</label>
              <input type="text" className="form-control" id="F_Dron_pesticide" placeholder="Peticida"/>
              
              <label htmlFor="F_Dron_start_point">Comienzo con este dron id</label>
              <input type="text" className="form-control" id="F_Dron_start_point" placeholder="Comienzo con este id de dron"/>

              <input type = 'submit' className="btn btn-block btn-primary" value = "Obtener dron con filtros"/>
            </form> 
          </div>


          <br></br>
          <br></br>

          <div className="container mb-3 mt-3">        
            <form onSubmit={(event) => {
                    event.preventDefault();     
                    this.SetUpExamples();                
                }}>
              <input type = 'submit' className="btn btn-block btn-danger" value = "Setup Ejemplos"/>
            </form>        
          </div>        






          </main>        
        </div>
                

      

      </div>                  
    );    
  }  
}

export default App;
