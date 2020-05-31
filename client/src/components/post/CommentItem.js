import React from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import Moment from "react-moment"
import { deleteComment } from "../../actions/post"



const CommentItem = ({ deleteComment,profile, auth, comment: { _id, text, name, user, date }, postId }) => {
    const getProfileAvatar = () => {
        if (profile.profiles.length) {
            let prof;
            if (typeof user === 'string') {
                prof = profile.profiles.find(profile => profile.user._id === user);
            } else{
                prof = profile.profiles.find(profile => profile.user._id === user._id);
            }
            return prof.user.avatar;
        }
    }
    return (
        <div className="post comment-item bg-white p-1 my-1 ">
            <div>
                <Link to={`/profile/${user}`}>
                    <img
                        className="round-img list-avatar-xs"
                        src={getProfileAvatar()}
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
                    !auth.loading && user._id === auth.user._id && (
                        <button onClick={e=>deleteComment(postId,_id)} type="button" className="btn btn-danger detete-comment">
                            <i className="fas fa-times"></i>
                        </button>
                    )
                }
            </div>
        </div>
    )
}

CommentItem.propTypes = {
    comment: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    auth: PropTypes.object.isRequired,
    deleteComment: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile,
})

export default connect(mapStateToProps, { deleteComment })(CommentItem) 
