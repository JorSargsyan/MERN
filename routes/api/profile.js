const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");
const axios = require('axios');
const multer = require('multer');
var fs = require('fs');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'client/public/pdfUploads')
    },
    filename: function (req, file, cb) {
        let fileExtension = file.originalname.split('.');
        fileExtension = fileExtension[fileExtension.length - 1];
        const fileName = `${file.fieldname}-${Date.now()}.${fileExtension}`;
        file.saveName = fileName;
      cb(null, file.saveName)
    }
  })
   
  var upload = multer({ storage: storage })




router.put("/uploadPDF", [authMiddleware, upload.single('pdf')], async (req, res) => {
   try {
      const file = req.file;
      if (!file) {
          return res.status(400).json({ msg: 'SMT went wrong' })
      }
      let fileExtension = file.originalname.split('.');
      fileExtension = fileExtension[fileExtension.length - 1];
      const fileURL = `/pdfUploads/${file.saveName}`;
      const profile = await Profile.findOne({user:req.user.id});
      profile.cv = fileURL;
      await profile.save();
      res.json(profile);
   }
   catch (err) {
      console.error(err.message);
      return res.json({ msg: "Internal server error" });
   }
})

router.delete("/deletePDF", authMiddleware, async (req, res) => {
   try {
       const profile = await Profile.findOne({user:req.user.id});
       if (!profile) {
           return res.status(404).json({ msg: "Profile not found" });
       }

       await fs.unlink(`client/public/${profile.cv}`,() => true);

       profile.cv = undefined;

       await profile.save();
  
       res.json(profile);

   } catch (error) {
       console.error(error.message);
       if (!error.kind === "ObjectId") {
           return res.status(404).json({ msg: "Profile not found" });
       }
       return res.status(500).send("Internal server error");
   }
})



//@route        GET "api/profile/me"
//@desc         Get current user's profile
//@access       private
router.get("/me", authMiddleware, async (req, res) => {
   try {
      const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

      if (!profile) {
         return res.status(400).json({ msg: "There is no profile for this user" });
      }

      res.json(profile);
   }
   catch (err) {
      console.log(err.message);
      res.status(500).send("Internal Server error");
   }
})


//@route        POST "api/profile"
//@desc         create or update user profile
//@access       private
router.post("/", [authMiddleware, [
   check("status", "status is required").not().isEmpty(),
   check("skills", "Skills is required").not().isEmpty()
]], async (req, res) => {

   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
   }

   const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      instagram,
      twitter,
      linkedin
   } = req.body;

   //Build profile object

   const profileFields = {};
   profileFields.user = req.user.id;

   if (company) profileFields.company = company;
   if (website) profileFields.website = website;
   if (location) profileFields.location = location;
   if (bio) profileFields.bio = bio;
   if (status) profileFields.status = status;
   if (githubusername) profileFields.githubusername = githubusername;
   if (skills) {
      if (typeof skills !== 'object') {
         profileFields.skills = skills.split(",").map(i=>i.trim());
      } else {
         profileFields.skills = skills;
      }
   }

   //Build Social Object

   profileFields.social = {};
   if (youtube) profileFields.social.youtube = youtube;
   if (facebook) profileFields.social.facebook = facebook;
   if (instagram) profileFields.social.instagram = instagram;
   if (twitter) profileFields.social.twitter = twitter;
   if (linkedin) profileFields.social.linkedin = linkedin;


   //build geolocation Data 
   const geoLocationData = await axios.get(`${config.googleGeocodeAPI}?address=${profileFields.location}&key=${config.googleAPIKey}`);
   profileFields.geoLocation = geoLocationData.data.results[0].geometry.location;

   try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
         //update
         profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true });

         return res.json(profile);
      }
      else {
         profile = new Profile(profileFields);

         await profile.save();

         return res.json(profile);
      }

   }
   catch (err) {
      console.log(err.message);
      return res.status(500).send("Internal server error");
   }

})


//@route        GET "api/profile"
//@desc         getAllProfiles profile
//@access       public

router.get("/", async (req, res) => {
   try {
      let profiles = await Profile.find().populate('user', ['name', 'avatar']);
      res.json(profiles);
   }
   catch (err) {
      console.log(err.message);
      res.status(500).send("Internal server error");
   }
})



//@route        GET "api/profile/:userid"
//@desc         getProfileByUserId profile
//@access       public

router.get("/user/:user_id", async (req, res) => {
   try {
      let profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

      if (!profile) {
         return res.status(400).json({ msg: "Profile not found" });
      }
      else {
         res.json(profile);
      }
   }
   catch (err) {
      console.log(err.message);
      res.status(500).send("Internal server error");
   }
})

//@route        GET "api/profile/:userid"
//@desc         getProfilePosts
//@access       public

router.get('/getProfilePosts/:user_id', async (req, res) => {
   try {
      let posts = await Post.find({ user: req.params.user_id }).populate('user', ['name', 'avatar']);

      if (!posts) {
         return res.status(400).json({ msg: "Profile not found" });
      }
      else {
         res.json(posts);
      }
   }
   catch (err) {
      console.log(err.message);
      res.status(500).send("Internal server error");
   }
});


//@route        DELETE "api/profile"
//@desc         delete profile,user,posts
//@access       private

router.delete("/", authMiddleware, async (req, res) => {
   try {

      //remove posts
      await Post.deleteMany({user:req.user.id});

      //remove profile
      await Profile.findOneAndRemove({ user: req.user.id });
      //remove user
      await User.findOneAndRemove({ _id: req.user.id });
      res.json({ msg: "User removed" });
   }
   catch (err) {
      console.error(err.message);
      return res.json({ msg: "Internal server error" });
   }
})


//@route        PUT "api/profile/experience"
//@desc         add profile experience
//@access       private

router.put("/experience", [authMiddleware, [
   check("title", "Title is required").not().isEmpty(),
   check("company", "Company is required").not().isEmpty(),
   check("from", "Fromdate is required").not().isEmpty()
]], async (req, res) => {

   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
   }

   const { title, company, location, from, to, current, description } = req.body;

   const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
   };
   try {
      const profile = await Profile.findOne({user:req.user.id});
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);

   }
   catch (err) {
      console.error(err.message);
      return res.json({ msg: "Internal server error" });
   }
})


//@route        DELETE "api/profile/experience/:exp_id"
//@desc         delete profile experience
//@access       private

router.delete("/experience/:exp_id", authMiddleware, async (req, res) => {
   try {
      //remove experience
      const profile = await Profile.findOne({user:req.user.id});

      const removeIndex = profile.experience.map(i=>{
         return i.id;
      }).indexOf(req.params.exp_id);

      profile.experience.splice(removeIndex,1);

      await profile.save();

      res.json(profile);
   }
   catch (err) {
      console.error(err.message);
      return res.json({ msg: "Internal server error" });
   }
})



//@route        PUT "api/profile/education"
//@desc         add profile education
//@access       private

router.put("/education", [authMiddleware, [
   check("school", "School is required").not().isEmpty(),
   check("from", "Fromdate is required").not().isEmpty()
]], async (req, res) => {

   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
   }

   const { school, degree, fieldofstudy, from, to, current, description } = req.body;

   const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
   };
   try {
      const profile = await Profile.findOne({user:req.user.id});
      profile.education.unshift(newEducation);
      await profile.save();
      res.json(profile);

   }
   catch (err) {
      console.error(err.message);
      return res.json({ msg: "Internal server error" });
   }
})


//@route        DELETE "api/profile/education/:edu_id"
//@desc         delete profile education
//@access       private

router.delete("/education/:edu_id", authMiddleware, async (req, res) => {
   try {
      //remove education
      const profile = await Profile.findOne({user:req.user.id});

      const removeIndex = profile.education.map(i=>{
         return i.id;
      }).indexOf(req.params.exp_id);

      profile.education.splice(removeIndex,1);

      await profile.save();

      res.json(profile);
   }
   catch (err) {
      console.error(err.message);
      return res.json({ msg: "Internal server error" });
   }
})



//@route        GET "api/profile/github/:username"
//@desc         get user repos from github
//@access       public

router.get("/github/:username", async (req, res) => {
   try {
      const options = {
         uri:`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&
         client_id=${config.get("githubClientId")}&client_secret=${config.get("githubSecret")}`,
         method:"GET",
         headers:{"user-agent":"node.js"}
      };

      request(options,(error,response,body)=>{
         if(error){
            console.error(error);
         }

         if(response.statusCode !== 200){
           return res.status(404).json({msg:"No Github profile found"});
         }

         res.json(JSON.parse(body));
      })
   }
   catch (err) {
      console.error(err.message);
      return res.json({ msg: "Internal server error" });
   }
})



module.exports = router;