// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Create2.sol";
//import "hardhat/console.sol";

/* contract Test{
    constructor(bytes memory sig){ //sig is a signed message ("wee") from frontend
        address recovered = ECDSA.recover(ECDSA.toEthSignedMessageHash(keccak256("wee")), sig);
        console.log(recovered);
    }
} */

contract Test {
    address public owner;
    event TestEvent(address ownerAddress);

    constructor(bytes memory sig) {
        address recovered = ECDSA.recover(ECDSA.toEthSignedMessageHash(keccak256("wee")), sig);
        owner = recovered;
    }

    function getOwner() public returns (address) {
        if (owner != address(0xc0EeBF09175808Ced41DF8d80a5cDAafd629c160)){
            revert("Invalid owner");
        }
        emit TestEvent(owner);
        return owner;
    }

    
}


contract Account is IAccount {
    uint public count;
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function validateUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256)
    external view returns (uint256 validationData)
    {
        //address recovered = ECDSA.recover(ECDSA.toEthSignedMessageHash(keccak256("wee")), userOp.signature);
        /* if (owner == address(0xc0EeBF09175808Ced41DF8d80a5cDAafd629c160)){
            revert("Invalid owner");
        } */
        //return owner == recovered ? 0 : 1;

        //stil chapter 3
        address recovered = ECDSA.recover(ECDSA.toEthSignedMessageHash(userOpHash), userOp.signature);
        return owner == recovered ? 0 : 1;
    
        
        
        //return 0;
    }

    function execute() external {
        count++;
    }
}

contract AccountFactory {
    event AccountCreated(address account);

    function createAccount(address owner) external returns (address) {
        //chapter3
        /* Account acc = new Account(owner);
        emit AccountCreated(address(acc));
        return address(acc); */

        //chapter 4 Using Bundler
         bytes32 salt = bytes32(uint256(uint160(owner)));
         bytes memory bytecode = abi.encodePacked(type(Account).creationCode, abi.encode(owner));

         address addr = Create2.computeAddress(salt, keccak256(bytecode));
         if (addr.code.length > 0) {
            return addr;
         }
         return Create2.deploy(0, salt, bytecode);

    }
}