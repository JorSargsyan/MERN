const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const authMiddleware = require("../../middleware/auth");

//@route        GET "api/auth"
//@desc         
//@access       public
router.get("/",authMiddleware,async (req,res)=>{
    try{
       const user = await User.findById(req.user.id).select("-password");
       res.json(user);
    }
    catch(err){
        
    }
})

module.exports = router;