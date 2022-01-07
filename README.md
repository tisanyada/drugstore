# drugstore
    This is a simple react application which is built with the CELO blockchain. 
    It's basic functionality is to enable drug manufacturers to add drug products 
    to the store while other users can purchase any of their choice and verify their
    purchase via the product's verification code(key)

## How to use
    Clone the repository onto your computer, change directory into the folder and use
    "npm install" to install the dependencies from the package.json file. When the 
    dependencies are done installing use "npm start" to launch the application in your 
    browser. Please ensure you have the celo extension browser extension installed.

## Smart Contract/ABI
    The smart contract and abi.json files for this application are located in the
    src/abis and src/contracts folders repectively.

## Routes
    - '/' Home(returns all available drug products created by admin)
    - '/myorders' This sections allows for a user to view his purchased products
    - '/admin' Admin section which allows for the addition of new products