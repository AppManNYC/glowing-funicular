const express = require("express");
const router  = express.Router();
const LostPet = require("../models/lostPet");
const middleware = require("../middleware");

router.get("/", function(req, res){
    LostPet.find({}, function(err, allLostPets){
        if(err){
            console.log(err);
        } else {
            res.render("lostPets/index",{lostPets:allLostPets});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    let nickName = req.body.nickName;
    let image = req.body.image;
    let address = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newLostPet = {nickName: nickName, image: image, address: address, city: city, state: state, zip: zip, description: description, author:author};
    LostPet.create(newLostPet, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/lostPets");
        }
    });
});


router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("lostPets/new");
});

router.get("/:id", function(req, res){
    LostPet.findById(req.params.id).populate("comments").exec(function(err, foundLostPet){
        if(err){
            console.log(err);
        } else {
            console.log(foundLostPet);
            res.render("lostPets/show", {lostPet: foundLostPet});
        }
    });
});


router.get("/:id/edit", middleware.checkLostPetOwnership, function(req, res){
    LostPet.findById(req.params.id, function(err, foundLostPet){
        res.render("lostPets/edit", {lostPet: foundLostPet});
    });
});

router.put("/:id",middleware.checkLostPetOwnership, function(req, res){
    LostPet.findByIdAndUpdate(req.params.id, req.body.lostPet, function(err, updatedLostPet){
        if(err){
            res.redirect("/lostPets");
        } else {
            res.redirect("/lostPets/" + req.params.id);
        }
    });
});

router.delete("/:id",middleware.checkLostPetOwnership, function(req, res){
    LostPet.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/lostPets");
        } else {
            res.redirect("/lostPets");
        }
    });
});

module.exports = router;



