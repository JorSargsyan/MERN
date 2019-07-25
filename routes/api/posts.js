const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const User = require("../../models/User");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");


//@route        POST "api/posts"
//@desc         Create a post
//@access       private
router.post("/", [authMiddleware, [
    check("text", "Text is required").not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: errors.array() })
    }
    try {
        const user = await User.findById(req.user.id).select("-password");

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })
        const post = await newPost.save();
        res.json(post);

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error");
    }
})


//@route        GET "api/posts"
//@desc         Get all posts
//@access       private
router.get("/", authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });

        res.json(posts);

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error");
    }
})


//@route        GET "api/posts/:post_id"
//@desc         Get post by id
//@access       private
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        res.json(post);

    } catch (error) {
        console.error(error.message);
        if (!error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" });
        }
        return res.status(500).send("Internal server error");
    }
})



//@route        DELETE "api/posts/:post_id"
//@desc         Delete post by id
//@access       private
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }

        //check on user

        if(post.user.toString()/*post.user type is objectId(mongoDB)*/ !== req.user.id){
            return res.status(401).json({msg:"User not authorized"});
        }

        await post.remove();
        

        res.json({msg:"Post removed"});

    } catch (error) {
        console.error(error.message);
        if (!error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" });
        }
        return res.status(500).send("Internal server error");
    }
})


//@route        PUT "api/posts/like/:id"
//@desc         Like a post
//@access       private
router.put("/like/:id", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(post.likes.filter(i=>i.user.toString() === req.user.id).length){
            return res.status(400).json({msg:"The post is already liked"});
        }
        //check on user

        post.likes.unshift({
            user:req.user.id
        });

        await post.save();
        res.json(post.likes);

    } catch (error) {
        console.error(error.message);
        if (!error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" });
        }
        return res.status(500).send("Internal server error");
    }
})


//@route        PUT "api/posts/unlike/:id"
//@desc         unlike a post
//@access       private
router.put("/unlike/:id", authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(post.likes.filter(i=>i.user.toString() === req.user.id).length == 0){
            return res.status(400).json({msg:"The post has'nt yet been liked"});
        }
        // get remove index
        const removeIndex = post.likes.map((like)=>{
            return like.user.toString()
        }).indexOf(req.user.id);

        post.likes.splice(removeIndex,1);

        await post.save();

        res.json(post.likes);

    } catch (error) {
        console.error(error.message);
        if (!error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found" });
        }
        return res.status(500).send("Internal server error");
    }
})


//@route        POST "api/posts/comment/:id"
//@desc         Comment a post
//@access       private
router.post("/comment/:id", [authMiddleware,[
    check("text","Text is required").not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }


    try {
        const user = await User.findById(req.user.id).select("-password");
        const post = await Post.findById(req.params.id);

        const newComment = {
            text:req.body.text,
            name : user.name,
            avatar : user.avatar,
            user : req.user.id
        }

        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments);

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error");
    }
})




//@route        DELETE "api/posts/comment/:id"
//@desc         Delete a comment of a post
//@access       private
router.delete("/comment/:id/:comment_id",authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const comment = post.comments.find(comment=>comment.id === req.params.comment_id)
        // make sure comment exists

        if(!comment){
            return res.status(404).json({msg:"Comment not found"});
        }
        //check the user
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg:"User not authorized"});
        }

        const removeIndex = post.comments.map((comment)=>{
            return comment.user.toString()
        }).indexOf(req.user.id);

        post.comments.splice(removeIndex,1);

        await post.save();

        res.json(post.comments);

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal server error");
    }
})



module.exports = router;