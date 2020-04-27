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
        <ul style={{width: 'calc(100% - 260px)', justifyContent: 'space-between'}}>
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
                <li>
                    <Link to="/map">
                        Map
                    </Link>
                </li>
            </div>
            <div style={{display: 'flex' }}>
                <li>
                    <a href="#" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        {" "}
                        <span className="hide-sm">Logout</span>
                    </a>
                </li>
                <li>
                    <Link to="/dashboard">
                        <i className="fas fa-sign-out-alt"></i>
                        Dashboard
                    </Link>
                </li>
            </div>
        </ul>
    );


    const guessLinks = (
        <ul>
            <li><Link to="/profiles">Developers</Link></li>
            <li><Link to="/map">Developer's Map</Link></li>
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