pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ILendingPool.sol";
import "./interfaces/ILendingPoolAddressesProvider.sol";
// import "@studydefi/money-legos/aave/contracts/ILendingPool.sol";
// import "@studydefi/money-legos/aave/contracts/ILendingPoolAddressesProvider.sol";

// import {IAaveInterface} from "../interfaces/IAaveInterface.sol"

contract AaveTest {
    address constant daiAddress =
        address(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    address constant aaveLendingPoolAddressProviderAddress =
        address(0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5);
    address constant aDaiAddress =
        address(0x028171bCA77440897B824Ca71D1c56caC55b68A3);

    ILendingPoolAddressesProvider provider =
        ILendingPoolAddressesProvider(aaveLendingPoolAddressProviderAddress); // mainnet address, for other addresses: https://docs.aave.com/developers/developing-on-aave/deployed-contract-instances
    ILendingPool lendingPool = ILendingPool(provider.getLendingPool());

    function deposit() public payable {
        IERC20 daiToken = IERC20(daiAddress);
        uint256 amountToTransfer =
            daiToken.allowance(msg.sender, address(this));

        require(amountToTransfer > 0, "dai sent");
        daiToken.transferFrom(msg.sender, address(this), amountToTransfer);

        daiToken.approve(provider.getLendingPoolCore(), amountToTransfer);

        lendingPool.deposit(daiAddress, amountToTransfer, msg.sender, 0);
    }

    function withdraw(uint256 amount) public {
        IERC20 aDaiToken = IERC20(aDaiAddress);
        uint aDaiBalance = aDaiToken.balanceOf(address(this));
        require(aDaiBalance >= amount);
        lendingPool.withdraw(daiAddress, amount, msg.sender);
    }

    // function borrow(uint256 amount) public {
    //     uint256 rate = 2; //stable is 1, variable is 2
    //     lendingPool.borrow(daiAddress, amount, rate, 0);
    // }

    // function balance() public returns (uint256, uint256) {
    //     uint256 currentATokenBalance;
    //     uint256 currentBorrowBalance;
    //     uint256 principalBorrowBalance;
    //     uint256 borrowRateMode;
    //     uint256 borrowRate;
    //     uint256 liquidityRate;
    //     uint256 originationFee;
    //     uint256 variableBorrowIndex;
    //     uint256 lastUpdateTimestamp;
    //     uint256 extra;
    //     bool usageAsCollateralEnabled;
    //     (
    //         currentATokenBalance,
    //         currentBorrowBalance,
    //         ,
    //         ,
    //         ,
    //         ,
    //         ,
    //         ,
    //         ,
    //         ,

    //     ) = lendingPool.getUserReserveData(daiAddress, msg.sender);
    //     return (currentATokenBalance, currentBorrowBalance);
    // }
}
