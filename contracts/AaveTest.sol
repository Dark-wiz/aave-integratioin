pragma solidity ^0.7.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IAaveInterface {
    function deposit(address _asset, uint256 _amount, address _onBehalfOf, uint16 _referralCode) external;
    function withdraw(address _asset, uint256 _amount, address _to) external;
    function borrow(
        address _asset,
        uint256 _amount,
        uint256 _interestRateMode,
        uint16 _referralCode,
        address _onBehalfOf
    ) external;
    function repay(address _asset, uint256 _amount, uint256 _rateMode, address _onBehalfOf) external;
    function setUserUseReserveAsCollateral(address _asset, bool _useAsCollateral) external;
    function swapBorrowRateMode(address _asset, uint256 _rateMode) external;
}

//get dai interface token IERC20

contract AaveTest {

    address constant aaveProtocolAddress = address(0x9198F13B08E299d85E096929fA9781A1E3d5d827);
    address constant daiAddress = address(0x639cB7b21ee2161DF9c882483C9D55c90c20Ca3e);

    IAaveInterface aaveVault = IAaveInterface(aaveProtocolAddress);
    IERC20 daiToken = IERC20(daiAddress);

    function deposit(uint256 amount) public {
        daiToken.approve(address(this), amount);

        aaveVault.deposit(daiAddress, amount, address(this), 0);
    }

    function withdraw(uint amount) public {
       // daiToken.approve(address(this), amount);
        aaveVault.withdraw(daiAddress, amount, address(this));
    }
}