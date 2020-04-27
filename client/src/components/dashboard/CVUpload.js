import React, {  Fragment, useState } from 'react';

export default function CVUpload({pdfFile,handleChange,handleSubmit}) {
    const [isEdited,setIsEdited] = useState(false);
    const uploadInputRef = React.createRef();

    const handleUploadClick = () => {
        uploadInputRef.current.click();
    }
    
    const readURL = (input) => {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
    
            reader.onload = function (e) {
                if (input.files[0].size < 5000000) {
                    setIsEdited(true);
                    handleChange(input.files[0]);
                    
                }
                else {
                    alert('PDF size must be lower then 500kb.')
                }
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    const handleInputChange = (e) => {
        readURL(uploadInputRef.current);
    }

    const handleInputSubmit = () => {
        setIsEdited(false);
        handleSubmit();
    }

    return (
             <Fragment>
                <a onClick={handleUploadClick} className="btn btn-light"><i className="fas fa-file-pdf text-primary"></i> Upload your CV</a>
                <input 
                    type="file" 
                    accept="application/pdf"
                    ref={uploadInputRef}
                    style={{display: 'none'}}
                    onChange={handleInputChange}
                />
                {
                    isEdited &&  <button className="btn btn-success btn-rounded" onClick={handleInputSubmit}><i className="fas fa-check submitIcon " style={{fontSize:14}}  ></i></button>
                }
            </Fragment>
    )
}
