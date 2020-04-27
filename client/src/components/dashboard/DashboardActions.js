import React ,{Fragment, useState} from 'react'
import PropTypes from 'prop-types'
import { Link } from "react-router-dom";
import CVUpload from './CVUpload';
import {useDispatch, useSelector} from 'react-redux';
import {uploadPDF} from '../../actions/profile';

function DashboardActions(props) {
    const [pdfFile, setPdfFile] = useState();
    const dispatch = useDispatch();
    
    const handlePDFSubmit = () => {
        const data = new FormData();
        data.append('pdf',pdfFile);
        dispatch(uploadPDF(data));
    }

    const handlePDFChange = (newFile) => {
        setPdfFile(newFile);
    }

    return (
        <Fragment>
            <div className="dash-buttons">
                <Link to="/edit-profile" className="btn btn-light"><i className="fas fa-user-circle text-primary"></i> Edit Profile</Link>
                <Link to="/add-experience" className="btn btn-light"><i className="fab fa-black-tie text-primary"></i> Add Experience</Link>
                <Link to="/add-education" className="btn btn-light"><i className="fas fa-graduation-cap text-primary"></i> Add Education</Link>
                <CVUpload 
                    pdfFile={pdfFile}
                    handleChange={handlePDFChange}
                    handleSubmit={handlePDFSubmit}
                />
            </div>
        </Fragment>
    )
}


export default DashboardActions

