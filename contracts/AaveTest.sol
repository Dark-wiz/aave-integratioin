pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/ILendingPool.sol";
import "./interfaces/ILendingPoolAddressesProvider.sol";
// import "@studydefi/money-legos/aave/contracts/ILendingPool.sol";
// import "@studydefi/money-legos/aave/contracts/ILendingPoolAddressesProvider.sol";

contract AaveTest {
    address constant daiAddress =
        address(0x6B175474E89094C44Da98b954EedeAC495271d0F);
    address constant aaveLendingPoolAddressProviderAddress =
        address(0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5);
    address constant aDaiAddress =
        address(0x028171bCA77440897B824Ca71D1c56caC55b68A3);

    ILendingPoolAddressesProvider provider =
        ILendingPoolAddressesProvider(aaveLendingPoolAddressProviderAddress); 
    ILendingPool lendingPool = ILendingPool(provider.getLendingPool());

    function deposit() public returns (bool success) {
        address lpAddr = provider.getLendingPool();
        IERC20 daiToken = IERC20(daiAddress);
        uint256 amountToTransfer = daiToken.allowance(msg.sender, address(this));
        require(amountToTransfer > 0, "dai sent");
        bool isSuccess = daiToken.approve(msg.sender, amountToTransfer);
        require(isSuccess == true, "cannot approve");
        bool transferSuccess = daiToken.transferFrom(msg.sender, address(this), amountToTransfer);
        require(transferSuccess == true, "Transfer must be successful");
        daiToken.approve(lpAddr, amountToTransfer);

        lendingPool.deposit(daiAddress, amountToTransfer, msg.sender, 0);
        return true;
    }

    function withdraw() public returns (bool success) {
        IERC20 aDaiToken = IERC20(aDaiAddress);
        IERC20 daiToken = IERC20(daiAddress);
        // uint aDaiBalance = aDaiToken.balanceOf(msg.sender);
        uint amount = aDaiToken.allowance(msg.sender, address(this));
        // uint daiAmount = daiToken.allowance(msg.sender, address(this));
        aDaiToken.approve(msg.sender, amount);
        // daiToken.approve(msg.sender, daiAmount);
        bool transferSuccess = aDaiToken.transferFrom(msg.sender, address(this), amount);
        require(transferSuccess == true, "transfer failed");
        // bool transferDaiSuccess = daiToken.transferFrom(msg.sender, address(this), daiAmount);
        require(transferSuccess == true, "transfer failed");
        // require(transferDaiSuccess == true, "transfer failed");
        // require(aDaiBalance >= amount, "balance must be greater");
        lendingPool.withdraw(daiAddress, amount, msg.sender);

        return true;
    }
}
