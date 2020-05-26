import React from 'react';
import PostItem from "../posts/PostItem"

export default function ProfileFeed(postsList) {
    console.log(postsList);
    
    return (
        <div>
            {
                postsList && postsList.data.map((post)=>{
                    return <PostItem detail key={post._id} post={post} />
                })
            }
        </div>
    )
}
