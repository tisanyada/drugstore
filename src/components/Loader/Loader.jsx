import { Spinner } from "react-bootstrap"


const Loader = ({ variant }) => {
    return (
        <Spinner
            animation='border'
            role='status'
            style={{
                width: '60px',
                height: '60px',
                margin: 'auto',
                display: 'block'
            }}
            className={variant}
        >
        </Spinner>
    )
}

Loader.defaultProps = {
    variant: '0px'
}


export default Loader