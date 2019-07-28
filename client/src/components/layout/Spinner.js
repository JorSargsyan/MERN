import React,{Fragment} from 'react'
import spinner from "../../img/spinner.gif"

function Spinner(props) {
    return (
        <Fragment>
            <img style={{width:200,margin:"auto",display:"block"}} src={spinner}></img>
        </Fragment>
    )
}


export default Spinner

