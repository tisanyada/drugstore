import "./index.css"
import { useEffect, useState } from "react"
import { BigNumber } from "bignumber.js"
import Loader from "components/Loader/Loader"
import Message from 'components/Message/Message'
import { Link } from "react-router-dom"



const Main = ({ Contract, CeloContract, drugCheckContractAddress, admin, account, message }) => {
    const [drugs, setDrugs] = useState(null)
    const [loading, setLoading] = useState(null)
    const [verificationKey, setVerificationKey] = useState('')
    const [notification, setNotification] = useState(null)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)

    const loadData = async () => {
        const values = []

        setLoading(true)

        const count = await Contract.methods.drugCount().call()
        const drugCount = parseInt(count)

        for (let i = 0; i < drugCount; i++) {
            const drug = await Contract.methods.drugs(i).call()
            values.push(drug)
        }

        setDrugs(values)
        setLoading(null)
    }
    useEffect(() => {
        if (Contract != null && CeloContract != null) {
            loadData()
        }
    }, [Contract, CeloContract])


    const approve = async (price) => {
        const result = await CeloContract.methods.approve(drugCheckContractAddress, price).send({ from: account })
        return result
    }
    const buyDrug = async (index, price) => {
        try {
            const ERC20_DECIMALS = 18
            const amount = new BigNumber(parseInt(price))
                .shiftedBy(ERC20_DECIMALS)
                .toString()
            await approve(amount)
            await Contract.methods.buyDrug(index, amount).send({ from: account })
            setTimeout(() => {
                window.location = '/myorders'
            }, 2000)
        } catch (e) {
            console.log(e)
        }
    }

    const verifyDrug = async () => {
        if (!verificationKey) return
        setLoading(true)
        const key = parseInt(verificationKey)

        const keys = []
        const dcount = await Contract.methods.drugCount().call()
        const count = parseInt(dcount)
        for (let i = 0; i < count; i++) {
            const verified = await Contract.methods.verificationKeys(i).call()
            keys.push(verified)
        }

        const verified = keys.filter(vkey => vkey === key)
        if (verified) {
            setNotification(`success, authentic product ${key}!`)
        } else {
            setError("fake product, please verify product from origin of purchase")
        }

        setLoading(null)
        setTimeout(() => {
            setNotification(null)
            setError(null)
        }, 5000)
    }

    return (
        <div className="col-lg-12 col-md-8 col-sm-8 p-2 mx-auto">
            {loading && <Loader />}
            {message && <Message>{message}</Message>}
            <div className="container-fluid p-2 rounded-2">
                <div className="col-sm-4 mx-auto p-5">
                    {notification && <Message variant="success">{notification}</Message>}
                    {error && <Message variant="warning">{error}</Message>}
                    <label
                        htmlFor="verify"
                        className="badge bg-success p-2"
                        onClick={() => setShowForm(!showForm)}
                        style={{cursor: 'pointer'}}
                    >
                        verify drug
                    </label>
                    {showForm && (
                        <>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="enter your product verification code here"
                                value={verificationKey}
                                onChange={(e) => setVerificationKey(e.target.value)}
                            />
                            <button
                                onClick={verifyDrug}
                                className="btn btn-success col-12"
                            >verify</button>
                        </>
                    )}
                </div>
                <div className="row">
                    {drugs && Object.keys(drugs).length > 0 ? Object.keys(drugs).map((drug, index) => (
                        <div className="col-lg-2 col-md-6 col-sm-12 mb-2" key={index}>
                            <div
                                className="card shadow"
                                style={{
                                    width: "100%",
                                    borderRadius: "1em"
                                }}
                            >
                                <Link to={`/drugs/${index}`}>
                                    <img
                                        src={drugs[drug].image}
                                        className="card-img-top"
                                        alt="drugimage"
                                        style={{
                                            height: '12em',
                                        }}
                                    />
                                </Link>
                                <div className="card-body">
                                    <h5 className="card-title" style={{ fontSize: '12px' }}>
                                        {drugs[drug].name}
                                    </h5>
                                    <p className="card-text">
                                        <span className="badge text-white bg-secondary p-1">{drugs[drug].price} cUSD</span>
                                    </p>
                                    {!admin && (
                                        <button
                                            onClick={() => buyDrug(index, drugs[drug].price)}
                                            className="btn btn-dark btn-sm mb-4 col-12 ms-auto"
                                        >buy</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-md-6 p-4 mx-auto alert-primary mt-5 shadow rounded">
                            no products are currently available
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Main
