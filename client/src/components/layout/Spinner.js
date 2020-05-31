import React,{Fragment} from 'react'
import spinner from "../../img/spinner.gif"

function Spinner(props) {
    return (
        <Fragment>
            <img style={{
                width:140,
                margin:"auto",
                display:"block",
                position: "absolute",
                top: "calc(50vh - 50px)",
                left: "calc(50vw - 70px)"
                }} 
            src={spinner}></img>
        </Fragment>
    )
}


export default Spinner


