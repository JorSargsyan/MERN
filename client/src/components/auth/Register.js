import React, { Fragment, useState } from 'react'
import { Link, Redirect } from "react-router-dom"
import { connect } from "react-redux"
import { setAlert } from "../../actions/alert"
import { register } from "../../actions/auth"
import PropTypes from 'prop-types'


const Register = (props) => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    });

    const { name, email, password, password2 } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });


    const onSubmit = async (e) => {
        e.preventDefault();
        if (password != password2) {
            props.setAlert("Passwords do not match", "danger")
        }
        else {
            const newUser = {
                name, email, password
            }
            props.register(newUser);
        }
    }

    //Redirect if logged in
    if (props.isAuthenticated) {
        return <Redirect to="/dashboard"></Redirect>
    }

    return (
        <Fragment>
            <section className="container">
                <h1 className="large text-primary">Sign Up</h1>
                <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
                <form className="form" onSubmit={e => onSubmit(e)}>
                    <div className="form-group">
                        <input type="text" placeholder="Name" value={name} onChange={e => onChange(e)} name="name" required />
                    </div>
                    <div className="form-group">
                        <input type="email" placeholder="Email Address" onChange={e => onChange(e)} name="email" value={email} required />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={e => onChange(e)}
                            required
                            minLength="6"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="password2"
                            value={password2}
                            onChange={e => onChange(e)}
                            required
                            minLength="6"
                        />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Register" />
                </form>
                <p className="my-1">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </section>
        </Fragment>
    )
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { setAlert, register })(Register);