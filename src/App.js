import './app.css'
import { useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Web3 from 'web3'
import { newKitFromWeb3 } from "@celo/contractkit"
import DrugCheckAbi from 'abis/DrugCheck.json'
import IERC20Abi from 'abis/IERC20Token'

// import components
import Navbar from 'components/NavBar/Navbar'
import Main from 'pages/Main'
import AddDrug from 'pages/AddDrug'
import Drug from 'pages/Drug'
import Purchases from 'pages/Purchases'

// import constants from constants.js
import { drugCheckContractAddress, cUSDContractAddress, ERC20_DECIMALS } from "./utils/constants";

// build app
const App = () => {
    const [message, setMessage] = useState(null)
    const [account, setAccount] = useState('')
    const [DrugKit, setKit] = useState(null)
    const [Contract, setContract] = useState(null)
    const [CeloContract, setCeloContract] = useState(null)
    const [balance, setBalance] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        loadCelo()
    }, [])
    useEffect(() => {
        if (DrugKit && account) {
            loadBlockchainData()
            setMessage(null)
        } else {
            setMessage('no contract kit or address');
        }
    }, [DrugKit, account])
    useEffect(() => {
        if (Contract) {
            setAdmin()
        }
    }, [Contract])

    const loadCelo = async () => {
        if (window.celo) {
            setMessage("⚠️ Please approve this DApp to use it.")
            try {
                await window.celo.enable()
                setMessage()
                const web3 = new Web3(window.celo)
                let kit = newKitFromWeb3(web3)

                const accounts = await kit.web3.eth.getAccounts()
                const user_address = accounts[0]

                kit.defaultAccount = user_address

                setAccount(user_address)
                setKit(kit)
            } catch (error) {
                setMessage(`⚠️ ${error}.`)
            }
        } else {
            setMessage("⚠️ Please install the CeloExtensionWallet.")
        }
    }
    const loadBlockchainData = async () => {
        try {
            const balance = await DrugKit.getTotalBalance(account)
            const USD = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
            const contract = new DrugKit.web3.eth.Contract(DrugCheckAbi, drugCheckContractAddress)
            const celoContract = new DrugKit.web3.eth.Contract(IERC20Abi, cUSDContractAddress)

            setContract(contract)
            setCeloContract(celoContract)
            setBalance(USD)
        } catch (error) {
            // removed error console.log and pushed error to setMessage
            setMessage(error);
        }
    }
    const setAdmin = async () => {
        try {
            const isAdmin = await Contract.methods.isAdmin().call()
            setIsAdmin(isAdmin)
        } catch (error) {
            // removed error console.log and pushed error to setMessage
            setMessage(error);
        }
    }

    return (
        <Router>
            <Navbar
                account={account}
                admin={isAdmin}
                balance={balance}
            />
            <Switch>
                <Route exact path="/">
                    <Main
                        Contract={Contract}
                        CeloContract={CeloContract}
                        admin={isAdmin}
                        account={account}
                        message={message}
                        drugCheckContractAddress={drugCheckContractAddress}
                    />
                </Route>

                <Route exact path="/admin">
                    <AddDrug
                        admin={isAdmin}
                        account={account}
                        Contract={Contract}
                    />
                </Route>

                <Route exact path="/drugs/:id">
                    <Drug
                        Contract={Contract}
                        admin={isAdmin}
                    />
                </Route>

                <Route exact path="/myorders">
                    <Purchases
                        Contract={Contract}
                        admin={isAdmin}
                        account={account}
                    />
                </Route>
            </Switch>
        </Router>
    )
}

export default App
