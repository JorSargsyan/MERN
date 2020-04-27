import React, { useEffect, Fragment, useState } from 'react'

export default function ImageUpload({imageVal,handleChange,handleSubmit}) {

    const [isEdited,setIsEdited] = useState(false);
    const uploadInputRef = React.createRef();


    const handleUploadClick = () => {
        uploadInputRef.current.click();
    }
    const readURL = (input) => {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
    
            reader.onload = function (e) {
                if (input.files[0].size < 500000) {
                    setIsEdited(true);
                    handleChange(e.target.result);
                }
                else {
                    alert('Image size must be lower then 500kb.')
                }
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    const handleInputChange = () => {
        readURL(uploadInputRef.current);
    }

    const handleInputSubmit = () => {
        setIsEdited(false);
        handleSubmit();
    }

    return (
             <div className="image-upload-section">
                <img 
                    style={{width:70,height: 70}} 
                    src={imageVal} 
                    className="round-img"
                    onClick={handleUploadClick}
                    alt=""
                />
                <input 
                    type="file" 
                    accept="image/png, image/jpeg"
                    ref={uploadInputRef}
                    onChange={handleInputChange}
                />
                {
                    isEdited &&  <i className="fas fa-check submitIcon" style={{fontSize:14}} onClick={handleInputSubmit} ></i>
                }
            </div>
    )
}
