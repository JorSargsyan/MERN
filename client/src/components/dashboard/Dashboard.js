import React, { useEffect, Fragment, useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { getCurrentProfile, uploadProfPic } from "../../actions/profile"
import Spinner from "../layout/Spinner"
import { Link } from "react-router-dom"
import DashboardActions from "./DashboardActions"
import Experience from "../dashboard/Experience"
import Education from "../dashboard/Education"
import {deleteAccount, deletePDF} from "../../actions/profile"
import './styles.scss';
import ImageUpload from './ImageUpload';

function Dashboard() {
    const [imageVal, setImageVal] = useState();

    const user = useSelector(state => state.auth.user);
    const profileData = useSelector(state => state.profile);
    const dispatch = useDispatch();
    useEffect(() => {
        if (user && user.avatar) {
            setImageVal(user.avatar);
        }
    },[user])

    useEffect(() => {
        dispatch(getCurrentProfile());
    }, [])


    const handleUploadChange = (newImage) => {
        setImageVal(newImage);
    }

    const handleImageUploadSubmit = () => {
        dispatch(uploadProfPic(imageVal));
    }

    const handleDeleteCV = () => {
        dispatch(deletePDF());
    }

    return profileData.loading === true ? <Spinner /> : <div className="dashboard_admin">
        <h1 className="large text-primary">Dashboard</h1>
        <div className="lead" className="dashboard_lead" style={{alignItems: 'center',justifyContent:'space-between',display: 'flex',width: '50%'}}>
            <ImageUpload 
                imageVal={imageVal}
                handleChange={handleUploadChange}
                handleSubmit={handleImageUploadSubmit}
            />
            <h4>Welcome {user && user.name}</h4>
           
        </div>

        {profileData.profile !== null && profileData.loading === false ?
            <Fragment>
                <DashboardActions />
                {
                 profileData.profile.cv &&    
                    <div>
                        <h2 className="my-2">CV actions</h2>
                        <a href={profileData.profile.cv} target="_blank" className="btn btn-light"><i className="fas fa-file-pdf text-primary"></i></a>
                        <a onClick={handleDeleteCV}  className="btn btn-danger"><i className="fas fa-trash"></i></a>
                    </div>
                }
               
                {profileData.profile.experience.length ? <Experience experience={profileData.profile.experience} /> : null} 
                {profileData.profile.education.length ? <Education education={profileData.profile.education}/> : null}
                
                <div className="my-2">
                    <button onClick={()=>dispatch(deleteAccount())} className="btn btn-danger"><i className="fas fa-user-minus"></i>  Delete my Account</button>
                </div>
            </Fragment> :
            <Fragment>
                <p>You have not created the profile</p>
                <Link className="btn btn-primary mt-1" to="/create-profile">Create It!</Link>
            </Fragment>}
    </div>
}



export default Dashboard;