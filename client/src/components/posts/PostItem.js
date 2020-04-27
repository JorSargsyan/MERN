import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Moment from "react-moment"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { addLike, removeLike, deletePost } from "../../actions/post"
function PostItem({ deletePost,detail = false, addLike, removeLike, post: { _id, text, name, user, likes, comments, date,postPic }, auth, showActions }) {
    return (
        <div className={`post-item-area ${detail && 'post-item-area-detail'}`}>
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
                        {text}
                    </p>
                    <p className="post-date">
                        Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
                    </p>
                    {
                        showActions && (<Fragment>
                            <button onClick={() => addLike(_id)} type="button" className="btn btn-light">
                                <i className="fas fa-thumbs-up"></i>
                                <span>{likes.length > 0 && <span>{" "}{likes.length}</span>}</span>
                            </button>
                            <button type="button" onClick={() => removeLike(_id)} className="btn btn-light">
                                <i className="fas fa-thumbs-down"></i>
                            </button>
                            <Link to={`/post/${_id}`} className="btn btn-primary">
                                Discussion {comments.length > 0 && <span className='comment-count'>{comments.length}</span>}
                            </Link>
                            {
                                !auth.loading && user._id == auth.user._id && (
                                    <button
                                        onClick={e => deletePost(_id)}
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

