const express = require("express");
const router = express.Router();


//@route        GET "api/profile"
//@access       public
router.get("/",(req,res)=>{
   return res.send("Profile Route");
})

module.exports = router;