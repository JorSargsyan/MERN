import React from 'react'
import PropTypes from 'prop-types'
import { Link } from "react-router-dom"
import "./styles.scss"

function ProfileItem({ profile: {
    user,
    status,
    company,
    location,
    skills
} }) {
    return (
        <Link to={`/profile/${user._id}`} >
            <div className="profile bg-light">
                <img src={user.avatar} className="round-img list-avatar" />
                <div>
                    <h2>{user.name}</h2>
                    <p>{status} {company && <span> at {company}</span>}</p>
                    <p className="my-1">{location && <span>{location}</span>}</p>
                

                </div>
                <ul>
                    {skills.slice(0, 4).map((skill, index) => {
                        return (<li key={index} className="text-primary">
                            <i className="fas fa-check"></i>
                            {skill}</li>)
                    })}
                </ul>
            </div>
        </Link>
    )
}

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired,
}

export default ProfileItem

