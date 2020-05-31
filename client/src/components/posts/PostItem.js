import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Moment from "react-moment"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { addLike, removeLike, deletePost } from "../../actions/post"
function PostItem({ deletePost,detail = false, addLike, removeLike, post: { _id, text, name, user,title, likes, comments, date,postPic }, auth, showActions }) {
    const layout = (
        <div className={`post-item-area post-item-area-detail`}>
           {comments.length > 0 && <span className='comment-count'>{comments.length}</span>}
            <div className="post-img-area">
                <img className="post-image" src={`${postPic}`} alt="postPic"/>
            </div>
            <div className="post bg-white p-1">
                <div>
                    <Link to={`/profile/${user._id}`}>
                        <img
                            className="round-img list-avatar-xs"
                            src={user.avatar}
                            alt=""
                        />
                        <h4>{name}</h4>
                    </Link>
                </div>
                <div>
                    <p className="my-1">
                        {title}
                    </p>
                    <p className="post-date">
                        Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
                    </p>
                    {
                        showActions && _id && (<Fragment>
                            <button onClick={(e) => {
                                e.preventDefault();
                                addLike(_id)
                            }} type="button" className="btn btn-light">
                                <i className="fas fa-thumbs-up"></i>
                                <span>{likes.length > 0 && <span>{" "}{likes.length}</span>}</span>
                            </button>
                            <button type="button" onClick={(e) => {
                                e.preventDefault();
                                removeLike(_id)
                            }} className="btn btn-light">
                                <i className="fas fa-thumbs-down"></i>
                            </button>
                            {
                                !auth.loading && auth.user && user._id == auth.user._id && (
                                    <button
                                        onClick={e => {
                                            e.preventDefault();
                                            deletePost(_id)
                                        }}
                                        type="button"
                                        className="btn btn-danger"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                )
                            }

                        </Fragment>)
                    }



                </div>
            </div>
        </div>
    )

    return  ( 
        <Link to={`/post/${_id}`} style={{width: "100%"}} >
            {layout}
        </Link>
    );
}

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    removeLike: PropTypes.func.isRequired,
    deletePost: PropTypes.func.isRequired,
    showActions:PropTypes.bool.isRequired,
}


PostItem.defaultProps = {
    showActions :true
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(PostItem)

