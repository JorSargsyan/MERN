const express = require("express");
const router = express.Router();
const {check,validationResult} = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");


//@route        POST "api/users"
//$desc         register user
//@access       public
router.post("/",[
    check('name','Name is required').not().isEmpty(),
    check("email","Please include a valid email").isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({min:6})
],async (req,res)=>{

    const errors = validationResult(req);
    const {name,email,password} = req.body;
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try{
    //See if the user exists

    let user = await User.findOne({email});

    if(user){
       return res.status(400).json({errors:[{msg:"User already exists."}]})
    }

    //Get users Gravatar

    const avatar = gravatar.url(email,{
        s:"250",
        r:"pg",
        d:"mm"
    })

    user = new User({
        name,email,avatar,password
    });

    //Encrypt a password using Bcrypt

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password,salt);

    await user.save();

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