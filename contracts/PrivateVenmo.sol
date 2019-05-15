pragma solidity >= 0.5.0 <0.7.0;

import "@aztec/protocol/contracts/ERC1724/ZkAsset.sol";

contract PrivateVenmo is ZkAsset {

  address aceAddress;

  constructor(
    address _aceAddress,
    address _erc20Address
   ) public ZkAsset(_aceAddress, address(0), 1, true, false) {
     aceAddress = _aceAddress;
  }
}
