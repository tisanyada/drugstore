// SPDX-License-Identifier: MIT
// pragma solidity 0.5.16;
pragma solidity >=0.7.0 <0.9.0;

import "./safeMath.sol";

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);
    function approve(address, uint256) external returns (bool);
    function transferFrom(address, address, uint256) external returns (bool);
    function totalSupply() external view returns (uint256);
    function balanceOf(address) external view returns (uint256);
    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract DrugCheck{
    // using safemath for uint256
    using SafeMath for uint256;

    string public name = 'Drug Scanner';
    address payable admin;
    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    // drug addresses array for multiple payments
    address[] public drugAddresses;

    uint public drugCount = 0;
    uint public purchasedDrugCount = 0;
    struct Drug{
        address payable manufacturer;
        string image;
        string batchNumber;
        string serialNumber;
        string name;
        string prdDate;
        string expDate;
        uint price;
        uint verificationKey;
    }
    mapping(uint => Drug) public drugs;
    mapping(uint => mapping(address => Drug)) public purchasedDrugs;
    mapping(uint => uint) public verificationKeys;
    mapping(string => string) public drugDosage;

    // made casting and coverted constructor to abstract
    constructor() payable{
        admin = payable(msg.sender);
    }

    modifier onlyAdmin(){
        require(msg.sender == admin);
        _;
    }

    function isAdmin()public view returns(bool){
        if(msg.sender == admin){
            return true;
        }else{
            return false;
        }
    }

    function addDrug(
        string memory _image,
        string memory _bn,
        string memory _sn, 
        string memory _name, 
        string memory _prdDate,
        string memory _expDate,
        uint _price,
        uint _verificationKey,
        string memory _directions
    ) public payable onlyAdmin {
        {
            drugs[drugCount] = Drug(payable(msg.sender), _image, _bn, _sn, _name, _prdDate, _expDate, _price, _verificationKey);
        }

        {
            verificationKeys[drugCount] = _verificationKey;
        }
        
        {
            drugDosage[_sn] = _directions;
        }
        drugCount++;
    }


    function buyDrug(uint _drugindex, uint _amount) public payable {
        require(
		  IERC20Token(cUsdTokenAddress).transferFrom(
			msg.sender,
			drugs[_drugindex].manufacturer,
            _amount
		  ),
		  "Transfer failed."
		);

        purchasedDrugs[purchasedDrugCount][msg.sender] = drugs[_drugindex];
        
        purchasedDrugCount++;
    }

    function addMulDrug(address sellerAdd) public returns (address[] memory){
        drugAddresses.push(sellerAdd);
        return (drugAddresses);
    }

    function buyMulDrug(uint totalPrice) public payable {
        for (uint i = 0; i < drugAddresses.length; i++) {
            payable(drugAddresses[i]).transfer(totalPrice);
        }
    }
}