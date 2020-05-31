import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import Moment from "react-moment"
import {deleteEducation} from "../../actions/profile"

const Education = ({ education ,deleteEducation }) => {

    const educations = education.map(edu => (
        <div className="outer">
            <div className="inner" key={edu._id}>
                <h4>{edu.school}</h4>
                <h6>{edu.degree}</h6>
                <p>
                <Moment format="YYYY/MM/DD">{edu.from}</Moment> - {
                            edu.to === null ? (" Now") : (<Moment format="YYYY/MM/DD">{edu.to}</Moment>)
                        }
                </p>
            </div>
            <button onClick={()=>deleteEducation(edu._id)} className="btn btn-danger"><i className="fas fa-trash"></i> </button>
        </div>
       
    ));

    return (
        <Fragment>
        <h2 className="my-2">Education credentials</h2>
        <div className="section-edu-exp"> 
            {educations}
        </div>
        </Fragment>
    )
}

Education.propTypes = {
    education:PropTypes.array.isRequired,
    deleteEducation:PropTypes.func.isRequired,
}

export default connect(null,{deleteEducation})(Education)
