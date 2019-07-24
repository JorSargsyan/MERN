const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");



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
      profileFields.skills = skills.split(",").map(i => i.trim());
   }

   //Build Social Object

   profileFields.social = {};
   if (youtube) profileFields.social.youtube = youtube;
   if (facebook) profileFields.social.facebook = facebook;
   if (instagram) profileFields.social.instagram = instagram;
   if (twitter) profileFields.social.twitter = twitter;
   if (linkedin) profileFields.social.linkedin = linkedin;


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


//@route        DELETE "api/profile"
//@desc         delete profile,user,posts
//@access       private

router.delete("/", authMiddleware, async (req, res) => {
   try {
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



module.exports = router;