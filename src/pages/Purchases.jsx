import Loader from "components/Loader/Loader"
import Message from "components/Message/Message"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"



const Purchases = ({ Contract, account }) => {
    const [drugs, setDrugs] = useState(null)
    const [loading, setLoading] = useState(null)
    const [notification, setNotification] = useState(null)
    const [error, setError] = useState(null)


    const loadData = async () => {
        const values = []

        setLoading(true)

        const count = await Contract.methods.purchasedDrugCount().call()
        const drugCount = parseInt(count)

        for (let i = 0; i < drugCount; i++) {
            const drug = await Contract.methods.purchasedDrugs(i, account).call()

            if (drug.serialNumber) {
                values.push(drug)
            }
        }

        setDrugs(values)
        setLoading(null)
    }
    useEffect(() => {
        if (Contract != null) {
            loadData()
        }
    }, [Contract])


    const verifyDrug = async (key) => {
        if (!key) return
        setLoading(true)

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
        <div className="col-lg-12 col-md-8 col-sm-8 p-5 mx-auto">
            <div className="col-4 mx-auto">
                {loading && <Loader />}
                {notification && <Message>{notification}</Message>}
                {error && <Message variant="warning">{error}</Message>}
            </div>
            <div className="container-fluid p-5 rounded-2">
                <div className="row">
                    {drugs && Object.keys(drugs).length > 0 ? Object.keys(drugs).map((drug, index) => (
                        <div className="col-lg-3 col-md-6 col-sm-8" key={index}>
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
                                    <h5 className="card-title">
                                        {drugs[drug].name}
                                    </h5>
                                    <p className="card-text">Batch Number - &nbsp;&nbsp;&nbsp;
                                        <span className="rounded ">{drugs[drug].batchNumber}</span>
                                    </p>
                                    <hr />
                                    <p className="card-text">Serial Number - &nbsp;&nbsp;&nbsp;
                                        <span className="rounded ">{drugs[drug].serialNumber}</span>
                                    </p>
                                    <hr />
                                    <p className="card-text">
                                        Verification Key - {drugs[drug].verificationKey}

                                    </p>
                                    <hr />
                                    <p className="card-text">
                                        Manufactured - {drugs[drug].prdDate}
                                    </p>
                                    <hr />
                                    <p className="card-text">
                                        Expires - {drugs[drug].expDate}
                                    </p>
                                    <hr />
                                    <button
                                        onClick={() => verifyDrug(drugs[drug].verificationKey)}
                                        className="btn btn-sm btn-info mb-4 col-12"
                                    >verify</button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-md-6 p-4 mx-auto alert-info mt-5 shadow rounded">
                            you have not purchased any products
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Purchases
