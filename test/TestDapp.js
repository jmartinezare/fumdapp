
const Dapp = artifacts.require("Dapp");
//const SZABO = 10**12; // 10^12 wei

contract('Dapp', (accounts) => {
    // PRE-ARRANGE
    const [firstAccount, secondAccount] = accounts;
  
    // Requerimiento: Solo el propietario puede crearlo
    it("sets an owner", async () => {
      // ARRANGE
      const dapp = await Dapp.new();
      // ACT and ASSERT
      assert.equal(await dapp.owner.call(), firstAccount);
    });
    
    it("Initial customer FDT balance ", async () => {
        // ARRANGE
        const dapp = await Dapp.deployed();
        balance_DFT_contract_spected = 0;
        
        // ACT
        const balance_DFT_contract = (
            await dapp.getAcountBalance(secondAccount)
        ).toNumber();

        // ASSERT
        assert.equal(balance_DFT_contract_spected, balance_DFT_contract);
      });

      it("Customer balance after buy 5 FDT", async () => {

        // El saldo inicial del contrato en 10000. El cliente comprará 5 FDT y pasarán a su cuenta

        // ARRANGE
        const dapp = await Dapp.deployed(); 
        //const dapp = await  Dapp.new({from: firstAccount});
        const units_to_buy = 5
        const balance_DFT_customer_spected = 5;
        const weis = web3.utils.toWei((units_to_buy*0.001).toString(), "ether");
           
        // ACT                
        await dapp.buyTokensFDT(units_to_buy, {from: secondAccount, value: weis, gas: 500000});
        
        const balance_DFT_customer = (
            await dapp.getAcountBalance(secondAccount)
        ).toNumber();


        // ASSERT                        
        assert.equal(balance_DFT_customer_spected, balance_DFT_customer);
      });  

      it("Create a dron", async () => {

        // comprobar que el lastid de drones = 0 (no hay drones).
        // Crear un dron
        // Comprobar que lastid = 1 ( se ha creado un dron )
        // Comprobar que el valor de coste del dron creado es 12 ( el valor que le hemos dado) 

        // ARRANGE
        const dapp = await Dapp.deployed();        
        const getLastDronId_before_spected = 0;
        const getLastDronId_afterd_spected = 1;         
        const max_Height = 100;
        const min_Height = 10;
        const cost = 12;        
        const got_cost_espected = 12;
        const [p1, p2, p3, p4, p5] = [1, 1, 0, 0, 0]; // // Pesticides del dron  (A y B)    
           
        // ACT                
        const getLastDronId_before = (
            await dapp.getLastDronId()
        ).toNumber();

        await dapp.createDron(firstAccount, max_Height, min_Height, cost, p1, p2, p3, p4, p5, {from: firstAccount, gas:500000});

        const getLastDronId_after = (
            await dapp.getLastDronId()
        ).toNumber();

        const getCost_value = (
            await dapp.getDronCost(1)
        ).toNumber();

        // ASSERT
        assert.equal(getLastDronId_before_spected, getLastDronId_before);
        assert.equal(getLastDronId_afterd_spected, getLastDronId_afterd_spected);
        assert.equal(cost, getCost_value);

      }); 

      it("Create a plot", async () => {

        // comprobar que el lastid de parcelas = 0 (no hay parcelas).
        // Crear una parcela
        // Comprobar que lastid = 1 ( se ha creado una parcela )        

        // ARRANGE
        const dapp = await Dapp.deployed();
        const getLastPlotId_before_spected = 0;
        const getLastPlotId_afterd_spected = 1;         
        const max_Height = 100;
        const min_Height = 10;        
        const p = 1;
           
        // ACT                
        const getLastPlotId_before = (
            await dapp.getLastPlotId()
        ).toNumber();

        await dapp.createPlot(secondAccount, max_Height, min_Height, p, {from: secondAccount, gas:500000});

        const getLastDronId_after = (
            await dapp.getLastPlotId()
        ).toNumber();

        // ASSERT
        assert.equal(getLastPlotId_before_spected, getLastPlotId_before);
        assert.equal(getLastPlotId_afterd_spected, getLastPlotId_afterd_spected);        
      });



    //   it("Transfering FDT when a dron is booked to fumigate a plot", async () => {

    //     // Crear un dron ( propietario )
    //     // Crear una parcela (cliente)
    //     // Reservar un dron (cliente)
    //     // Comprobar trasfetencia de 5 FDT de una cuenta a otra

    //     // ARRANGE
    //     const dapp = await Dapp.deployed();                
    //     const dron_id = 1;
    //     const plot_id = 1;
    //     const max_Height = 100;
    //     const min_Height = 10;           
    //     const [p1, p2, p3, p4, p5] = [1, 1, 0, 0, 0]; // Pesticides del dron  (A y B)                  
    //     const cost = 12
    //     const p = 1; // Pesticida de la parcela ( Pesticida B )
    //     const units_to_buy = 20;
    //     const initial_balance_contract_spected = 10000;
    //     const balance_contract_after_customer_buy_20_spected = 9980;
    //     const balance_customer_after_buy_20_spected = 20;
    //     const balance_customer_after_book_spected = 12;
           
    //     // ACT                        

    //     await dapp.createPlot(secondAccount, max_Height, min_Height, p, {from: secondAccount, gas:500000});        
    //     await dapp.createDron(firstAccount, max_Height, min_Height, cost, p1, p2, p3, p4, p5, {from: firstAccount, gas:500000});

    //     await dapp.buyTokensFDT(units_to_buy,{from: secondAccount, value: weis, gas:500000});
        


    //     await dapp.bookDron(secondAccount, dron_id, plot_id, {from: firstAccount, gas:500000});
        


    //     // ASSERT       
        
    //     const balance_DFT_contract = (
    //         await dapp.getAcountBalance(firstAccount)
    //     ).toNumber();


    //     // ASSERT
    //     assert.equal(balance_DFT_contract_spected, balance_DFT_contract);
    //   }); 
          
  });