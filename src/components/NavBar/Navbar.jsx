import { Link } from "react-router-dom"
import Identicon from 'identicon.js'
import { FaHome } from "react-icons/fa"
import { RiAdminLine } from 'react-icons/ri'
import { BsClockHistory } from 'react-icons/bs'



const Navbar = ({ account, admin, balance }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
            <Link class="navbar-brand" to="/">
                <FaHome style={{ fontSize: '30px', marginLeft: '30px', color: "black" }} />
            </Link>
            {admin && (
                <Link class="navbar-brand" to="/admin">
                    <RiAdminLine style={{ fontSize: '30px', marginLeft: '30px', color: "black" }} />
                </Link>
            )}
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                </ul>
            </div>
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto">

                    </ul>
                    <ul className="navbar-nav">
                        {!admin && (
                            <Link className="navbar-brand" to="/myorders">
                                <BsClockHistory style={{ fontSize: '30px', marginLeft: '30px', color: "black" }} />
                            </Link>
                        )}
                        <Link className="navbar-brand bg-light ml-2  text-dark rounded p-2" to="#">
                            {balance ? `${balance} cUSD` : ''} &nbsp;
                            {account ? (
                                <img
                                    className='ml-2'
                                    width='30'
                                    height='30'
                                    src={`data:image/png;base64,${new Identicon(account, 30).toString()}`}
                                    alt="account-identicon"
                                />
                            ) : null}
                        </Link>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
