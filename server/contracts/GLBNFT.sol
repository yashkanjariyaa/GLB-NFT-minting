// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract GLBNFT is ERC721URIStorage, Ownable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _nextTokenId;

    event TokenMinted(address to, uint256 tokenId, string uri);

    constructor(address initialOwner) ERC721("GLBNFT", "GLB") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
        transferOwnership(initialOwner);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function safeMint(
        address to,
        string memory uri
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
        require(
            hasRole(MINTER_ROLE, msg.sender),
            "GLBNFT: must have minter role to mint"
        );

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit TokenMinted(to, tokenId, uri);
        return tokenId;
    }

    function addMinter(address account) public onlyOwner {
        require(account != address(0), "GLBNFT: invalid account address");

        grantRole(MINTER_ROLE, account);
    }

    function removeMinter(address account) public onlyOwner {
        require(account != address(0), "GLBNFT: invalid account address");

        revokeRole(MINTER_ROLE, account);
    }
}
