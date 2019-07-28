import React, { useEffect, Fragment } from 'react'
import { connect } from "react-redux"
import { getCurrentProfile } from "../../actions/profile"
import PropTypes from "prop-types"
import Spinner from "../layout/Spinner"
import { Link } from "react-router-dom"
import DashboardActions from "./DashboardActions"

function Dashboard({ auth: { user }, getCurrentProfile, profile: { profile, loading } }) {

    useEffect(() => {
        getCurrentProfile();
    }, [])

    return profile && loading === null ? <Spinner /> : <Fragment >
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user"></i>Welcome {user && user.name}
        </p>
        
        {profile !== null ?
            <Fragment>  <DashboardActions /></Fragment> :
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
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile
})



export default connect(mapStateToProps, { getCurrentProfile })(Dashboard)