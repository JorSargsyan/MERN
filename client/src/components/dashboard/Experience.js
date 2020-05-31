import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import Moment from "react-moment"
import {deleteExperience} from "../../actions/profile"

const Experience = ({ experience,deleteExperience}) => {

    const experiences = experience.map(exp => (
        <div className="outer">
            <div className="inner" key={exp._id}>
                <h4>{exp.title}</h4>
                <h6>in {exp.company}</h6>
                <p>
                <Moment format="YYYY/MM/DD">{exp.from}</Moment> - {
                            exp.to === null ? (" Now") : (<Moment format="YYYY/MM/DD">{exp.to}</Moment>)
                        }
                </p>
            </div>
        
         <button onClick={()=>deleteExperience(exp._id)} className="btn btn-danger"><i className="fas fa-trash"></i> </button>
     </div>
    ));

    return (
        <Fragment>
        <h2 className="my-2">Experience credentials</h2>
        <div className="section-edu-exp"> 
           
            {experiences}
        </div>
        </Fragment>
    )
}

Experience.propTypes = {
    experience:PropTypes.array.isRequired,
    deleteExperience:PropTypes.func.isRequired,
}

export default connect(null,{deleteExperience})(Experience)
