import React,{Fragment} from 'react'
import spinner from "../../img/spinner.gif"

function Spinner(props) {
    return (
        <Fragment>
            <img style={{width:200,margin:"auto",display:"block",position: "absolute",top: "calc(40%)",left: "44%"}} src={spinner}></img>
        </Fragment>
    )
}


export default Spinner


