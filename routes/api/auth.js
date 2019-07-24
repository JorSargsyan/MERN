const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const authMiddleware = require("../../middleware/auth");
const {check,validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");



//@route        GET "api/auth"
//@desc         Test
//@access       public
router.get("/",authMiddleware,async (req,res)=>{
    try{
       const user = await User.findById(req.user.id).select("-password");
       res.json(user);
    }
    catch(err){
        res.status(500).send("Internal Server Error");
    }
})

//@route        POST "api/auth"
//$desc         Authenticate user & get Token
//@access       public
router.post("/",[
    check("email","Please include a valid email").isEmail(),
    check('password','Password is required').exists()
],async (req,res)=>{

    const errors = validationResult(req);
    const {email,password} = req.body;
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try{
    //See if the user exists or not

    let user = await User.findOne({email});

    if(!user){
       return res.status(400).json({errors:[{msg:"Invalid credentials"}]})
    }

    const isMatch = await bcrypt.compare(password,user.password);    

    if(!isMatch){
        return res.status(400).json({errors:[{msg:"Invalid credentials"}]})
    }

    //return json web token
    const payload = {
        user: {
            id:user.id
        }
    }

    jwt.sign(payload,config.get("jwtSecret"),{
        expiresIn:360000
    },(err,token)=>{
        if(err){
            throw err;
        }
        else{
            res.json({token});
        }
    });

    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Internal Server error");
    }

})


module.exports = router;