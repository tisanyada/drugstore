import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Loader from "components/Loader/Loader";

const Drug = ({ Contract }) => {
    const params = useParams()

    const [drug, setDrug] = useState(null)
    const [loading, setLoading] = useState(null)
    const [dosage, setDosage] = useState(null)


    const loadData = async () => {
        setLoading(true)

        const drug = await Contract.methods.drugs(params.id).call()
        const dosage = await Contract.methods.drugDosage(drug.serialNumber).call()

        await setDrug(drug)
        await setDosage(dosage)
        await setLoading(null)
    }
    useEffect(() => {
        if (Contract != null) {
            loadData()
        }
    }, [Contract])


    return (
        <div className="col-lg-12 col-md-8 col-sm-8 p-5 mx-auto">
            <div className="col-4 mx-auto">
                {loading && <Loader />}
            </div>
            {drug ? (
                <div className="col-md-8 col-lg-6 col-sm-4 mx-auto shadow">
                    <div className="card" style={{ width: "100%", borderRadius: '1em' }}>
                        <div className="row">
                            <div className="col-sm-6">
                                <img
                                    src={drug.image}
                                    alt="drugimage"
                                    style={{
                                        width: '100%',
                                        height: '20em',
                                        borderTopRightRadius: '15px',
                                        borderBottomRightRadius: '15px'
                                    }}
                                />
                            </div>
                            <div className="col-sm-6 p-2">
                                {dosage && (
                                    <>
                                        <span className="fw-bold">Directions for use -</span> <br />
                                        {dosage ? dosage : null}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="col-12 mx-auto mt-3">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Name - <span className="ms-auto">{drug.name}</span></li>
                                <li className="list-group-item">Batch Number - {drug.batchNumber}</li>
                                <li className="list-group-item">Serial Number - {drug.serialNumber}</li>
                                <li className="list-group-item">Manufactured - {drug.prdDate}</li>
                                <li className="list-group-item">Expires - {drug.expDate}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="col-md-6 p-4 mx-auto alert-danger mt-5 shadow rounded">
                    no drug exist with this id
                </div>
            )}
        </div>
    )
}

export default Drug
