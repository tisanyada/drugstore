import { useState } from "react"
import { create } from 'ipfs-http-client'
import Loader from "components/Loader/Loader"
import Message from 'components/Message/Message'



const AddDrug = ({ admin, account, Contract }) => {
    const IPFSClient = create('https://ipfs.infura.io:5001/api/v0')

    const [batchNumber, setBn] = useState('')
    const [serialNumber, setSn] = useState('')
    const [drugName, setDrugName] = useState('')
    const [file, setFile] = useState(null)
    const [prdDate, setPrdDate] = useState('')
    const [expDate, setExpDate] = useState('')
    const [price, setPrice] = useState('')
    const [loading, setLoading] = useState(null)
    const [notification, setNotification] = useState(null)
    const [validationKey, setValidationKey] = useState('')
    const [directions, setDirections] = useState('')

    const captureFile = (e) => {
        if (!e.target.files[0]) return

        const data = e.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
            setFile(Buffer(reader.result))
        }
        e.preventDefault();
    }

    const addDrug = async (e) => {
        e.preventDefault()
        try {
            if (!file || !drugName || !batchNumber || !serialNumber || !prdDate || !expDate || !validationKey || !directions || !price) return setNotification('need all params')
            setNotification(null)
            setLoading(true)

            const newIpfsFile = await IPFSClient.add(file)
            const _image = `https://ipfs.infura.io/ipfs/${newIpfsFile.path}`
            const _name = drugName.toUpperCase()
            const _bn = batchNumber
            const _sn = serialNumber
            const _prdDate = prdDate
            const _expDate = expDate
            const _validationKey = validationKey
            const _directions = directions

            const newdrug = await Contract.methods.addDrug(_image, _bn, _sn, _name, _prdDate, _expDate, price, _validationKey, _directions)
                .send({ from: account })

            if (newdrug) {
                setLoading(null)
                setNotification(`added new drug ${_name}`)

                setTimeout(() => {
                    setNotification(null)
                    window.location.reload()
                }, 3000)
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            {loading && <Loader />}
            {notification && <Message variant="success">{notification}</Message>}
            {admin && (
                <div className="container p-5 rounded-2 mt-1 mb-4">
                    <div className="row">
                        <div className="col-md-6 ml-auto bg-light shadow p-4">
                            <label htmlFor="add drug" className="badge bg-info">add drug form</label>
                            <div className="form-group m-2">
                                <label htmlFor="serialno" className="badge bg-secondary">drug image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={captureFile}
                                />
                            </div>
                            <div className="form-group m-2">
                                <label htmlFor="serialno" className="badge bg-secondary">drug name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={drugName}
                                    onChange={(e) => setDrugName(e.target.value)}
                                />
                            </div>
                            <div className="form-group m-2">
                                <label htmlFor="batchno" className="badge bg-secondary">batch number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={batchNumber}
                                    onChange={(e) => setBn(e.target.value)}
                                />
                            </div>
                            <div className="form-group m-2">
                                <label htmlFor="serialno" className="badge bg-secondary">serial number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={serialNumber}
                                    onChange={(e) => setSn(e.target.value)}
                                />
                            </div>
                            <div className="form-group m-2">
                                <label htmlFor="serialno" className="badge bg-secondary">price</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="form-group m-2">
                                <label htmlFor="serialno" className="badge bg-secondary">production date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={prdDate}
                                    onChange={(e) => setPrdDate(e.target.value)}
                                />
                            </div>
                            <div className="form-group m-2">
                                <label htmlFor="serialno" className="badge bg-secondary">expiration date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={expDate}
                                    onChange={(e) => setExpDate(e.target.value)}
                                />
                            </div>
                            <div className="form-group m-2">
                                <label htmlFor="serialno" className="badge bg-secondary">validation key</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={validationKey}
                                    onChange={(e) => setValidationKey(e.target.value)}
                                />
                            </div>
                            <div className="form-group m-2">
                                <label htmlFor="serialno" className="badge bg-secondary">directions for use</label>
                                <textarea
                                    cols="30"
                                    rows="10"
                                    className="form-control"
                                    value={directions}
                                    onChange={(e) => setDirections(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <input
                                    type="submit"
                                    value={`Add ${drugName}`}
                                    className="btn btn-primary btn-sm col-12 mb-2"
                                    onClick={addDrug}
                                />
                            </div>
                        </div>
                        <div className="col-md-4 ms-auto text-black-50 alert-success shadow rounded-3" id="add-drug-note" style={{ height: '30%' }}>
                            This sections allows a drug manufacturer to add drug records to the blockchain. Some of this data includes a verification key which can be used in verifiying drug authenticity.
                        </div>
                    </div>
                </div>
            )}
            {!admin && (
                <div className="col-md-6 p-4 mx-auto alert-info mt-5 shadow rounded">
                    sorry, this is an admin area
                </div>
            )}
        </>
    )
}

export default AddDrug
