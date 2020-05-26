import React, { useState } from 'react'
import { connect } from "react-redux"
import PropTypes from 'prop-types'
import { addPost } from "../../actions/post"
import "./styles.scss";

function PostForm({ addPost }) {
    const [imageVal, setImageVal] = useState();
    const [imageFile, setImageFile] = useState();
    const uploadInputRef = React.createRef();

    const handleInputChange = () => {
        readURL(uploadInputRef.current);
    }

    const handleUploadClick = () => {
        uploadInputRef.current.click();
    }

    const handleDeleteImage = () => {
        setImageVal(null);
    }

    const readURL = (input) => {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                if (input.files[0].size < 500000) {
                    setImageVal(e.target.result);
                    setImageFile(input.files[0]);
                }
                else {
                    alert('Image size must be lower then 500kb.')
                }
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    const [text, setText] = useState("");
    const [title, setTitle] = useState('');

    return (
        <div className="post-form">
            <div className="bg-primary p">
                <h3>Say Something...</h3>
            </div>
            <form className="form my-1" enctype="multipart/form-data" onSubmit={e => {
                e.preventDefault();
                const data = new FormData();
                data.append('text',text);
                data.append('postPic',imageFile);
                data.append('title', title);
                addPost(data);
                setText("")
            }}>
                {
                    imageVal &&
                    <div className="post-img-container">
                        <img src={imageVal} className="post-img" />
                        <button className="post-delete-btn" onClick={handleDeleteImage}><i className="fa fa-trash post-delete-icon"></i></button>
                    </div>
                }
                <input className="title-input" type="text" value={title} placeholder="Title" onChange={e => setTitle(e.target.value)} required />
                <textarea
                    name="text"
                    cols="30"
                    rows="5"
                    placeholder="Create a post"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    required
                ></textarea>
                <input type="button" onClick={handleUploadClick} className="btn btn-dark my-1" value="Upload a pic" />
                <input type="file"
                    accept="image/png, image/jpeg"
                    ref={uploadInputRef}
                    name="postPic"
                    style={{ display: 'none' }}
                    onChange={handleInputChange}
                />

                <input type="submit" className="btn btn-dark my-1" value="Submit" />
            </form>
        </div>
    )
}

PostForm.propTypes = {
    addPost: PropTypes.func.isRequired,
}

export default connect(null, { addPost })(PostForm)

