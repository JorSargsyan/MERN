const express = require("express");
const router = express.Router();


//@route        GET "api/posts"
//@access       public
router.get("/",(req,res)=>{
    return res.send("Posts Route");
})

module.exports = router;