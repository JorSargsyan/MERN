import React, { Fragment } from 'react'
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { logout } from "../../actions/auth"

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
    const handleLogout = () => {
        logout();
    }

    const authLinks = (
        <ul className="navbar_logged" style={{width: 'calc(100% - 260px)', justifyContent: 'space-between'}}>
            <div style={{display: 'flex' }}>
                <li>
                    <Link to="/profiles">
                        Developers
                    </Link>
                </li>
                <li>
                    <Link to="/posts">
                        Posts
                    </Link>
                </li>
            </div>
            <div style={{display: 'flex' }}>
                <li>
                    <Link to="/dashboard">
                        Dashboard
                    </Link>
                </li>
                <li>
                    <a href="#" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt" style={{color : "red"}}></i>
                        {" "}
                        <span className="hide-sm">Logout</span>
                    </a>
                </li>
            </div>
        </ul>
    );


    const guessLinks = (
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>
    );


    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/"><i className="fas fa-code"></i> DevConnector</Link>
            </h1>

            {!loading && (<Fragment>
                {isAuthenticated ? authLinks : guessLinks}
            </Fragment>)}
        </nav>
    )
}

Navbar.propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
})

export default connect(mapStateToProps, { logout })(Navbar)