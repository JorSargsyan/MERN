import React, { useEffect, Fragment } from 'react'
import { connect } from "react-redux"
import { getCurrentProfile } from "../../actions/profile"
import PropTypes from "prop-types"
import Spinner from "../layout/Spinner"
import { Link } from "react-router-dom"
import DashboardActions from "./DashboardActions"
import Experience from "../dashboard/Experience"
import Education from "../dashboard/Education"
import {deleteAccount} from "../../actions/profile"

function Dashboard({ auth: { user }, getCurrentProfile,deleteAccount, profile: { profile, loading } }) {

    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile])

    return loading === true ? <Spinner /> : <Fragment >
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user"></i>Welcome {user && user.name}
        </p>

        {profile !== null && loading === false ?
            <Fragment>
                <DashboardActions />
                <Experience experience={profile.experience} />
                <Education education={profile.education}/>
                <div className="my-2">
                    <button onClick={()=>deleteAccount()} className="btn btn-danger"><i className="fas fa-user-minus"></i>  Delete my Account</button>
                </div>
                
            </Fragment> :
            <Fragment>
                <p>You have not created the profile</p>
                <Link className="btn btn-primary mt-1" to="/create-profile">Create It!</Link>
            </Fragment>}
    </Fragment>
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount:PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile
})



export default connect(mapStateToProps, { getCurrentProfile,deleteAccount })(Dashboard)