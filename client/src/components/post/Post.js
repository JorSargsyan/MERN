import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from "react-redux"
import Spinner from "../layout/Spinner"
import PostItem from "../posts/PostItem"
import { getPost } from "../../actions/post"
import {Link} from "react-router-dom"
import CommentForm from "./CommentForm"
import CommentItem from "./CommentItem"
import './styles.scss'

function Post({ getPost, post: { post, loading }, match }) {


    useEffect(() => {
        getPost(match.params.id);
    }, [getPost, match.params.id])



    return (
        loading || post === null ? (<Spinner />) : (<Fragment>
            <Link to="/posts" className="btn">Back</Link>
            <PostItem showActions={false} post={post} detail />
            <p className='text-paragraph'>{post.text}</p>
            <CommentForm postId={post._id} />
            <div className="comments">
                {
                    post.comments.map((comment)=>{
                        return  <CommentItem  key={comment._id} comment={comment} postId={post._id} />
                    })
                }
            </div>
           
        </Fragment>)
    )
}

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    post: state.post
})

export default connect(mapStateToProps, { getPost })(Post)

