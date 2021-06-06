pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@studydefi/money-legos/aave/contracts/ILendingPool.sol";
import "@studydefi/money-legos/aave/contracts/ILendingPoolAddressesProvider.sol";
// import {IAaveInterface} from "../interfaces/IAaveInterface.sol"


contract AaveTest {
    address constant daiAddress = address(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    address constant aaveLendingPoolAddressProviderAddress = address(0x24a42fD28C976A61Df5D00D0599C34c4f90748c8);


    ILendingPoolAddressesProvider provider = ILendingPoolAddressesProvider(aaveLendingPoolAddressProviderAddress); // mainnet address, for other addresses: https://docs.aave.com/developers/developing-on-aave/deployed-contract-instances
// LendingPool lendingPool = LendingPool(provider.getLendingPool());

    ILendingPool lendingPool = ILendingPool(provider.getLendingPool());

    function deposit() public payable {
        IERC20 daiToken = IERC20(daiAddress);
        uint amountToTransfer = daiToken.allowance(msg.sender, address(this));
        
        require(amountToTransfer > 0, 'somto sent');
        daiToken.transferFrom(msg.sender, address(this), amountToTransfer);

        daiToken.approve(provider.getLendingPoolCore(), amountToTransfer);
        
        lendingPool.deposit(daiAddress, amountToTransfer, 0);
    }

    function borrow(uint amount, uint variableRate) public { 
        // uint256 variableRate = 2;
        lendingPool.borrow(daiAddress, amount, variableRate, 0);
    }
    // address constant aaveProtocolAddress =
    //     address(0x9198F13B08E299d85E096929fA9781A1E3d5d827);
    // address constant daiAddress =
    //     address(0x6b175474e89094c44da98b954eedeac495271d0f);

    // IAaveInterface aaveVault = IAaveInterface(aaveProtocolAddress);
    // IERC20 daiToken = IERC20(daiAddress);

    // function deposit(uint256 amount) public payable {
    //     daiToken.approve(address(this), amount);

    //     aaveVault.deposit(daiAddress, amount, address(this), 0);
    // }

    // function withdraw(uint256 amount) public {
    //     // daiToken.approve(address(this), amount);
    //     aaveVault.withdraw(daiAddress, amount, address(this));
    // }
}
