const express = require("express");
const router = express.Router();

const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Note");
const { body, validationResult } = require("express-validator");

//ROUTE1 get all notes get request
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//ROUTE2 add new notes post request login required
router.post(
    "/addallnotes",
    fetchuser,
    [
        body("title", "Enter a valid title").isLength({ min: 3 }),
        body("discription", "Descrption must be atleast 5 characters").isLength({
            min: 5
        }),
    ],
    async (req, res) => {
        try {
            const { title, discription, tag } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Notes({
                title,
                discription,
                tag,
                user: req.user.id,
            });
            const savedNote = await note.save();

            res.json(savedNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);
//route 3 updating notes post 
router.put("/updateallnotes/:id", fetchuser, async (req, res) => {
    try {
        const {title,discription,tag} = req.body

        //create newNote object
        const newNote ={}
        if (title){newNote.title = title}
        if (discription){newNote.discription = discription}
        if (tag){newNote.tag = tag}

        // find note to be updated and update it
          // check if the correct user is asking to update the notes
        let note = await Notes.findById(req.params.id)
        if (!note){return res.status(404).send('not found')}

        if (note.user.toString() !== req.user.id){
            return res.status(401).json('Not allowed')
        }
        note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json(note)
        
    }  catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    


});

//route 4 deleteing the note 
router.delete("/deleteallnotes/:id", fetchuser, async (req, res) => {
    try {
        const {title,discription,tag} = req.body

        //create newNote object
        const newNote ={}
        if (title){newNote.title = title}
        if (discription){newNote.discription = discription}
        if (tag){newNote.tag = tag}
    
        // find note to be deleted and deleted it
          // check if the correct user is asking to update the notes
        let note = await Notes.findById(req.params.id)
        if (!note){return res.status(404).send('not found')}
          // check if the correct user is asking to delete the notes
    
        if (note.user.toString() !== req.user.id){
            return res.status(401).json('Not allowed')
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({'success':"notes have been delted" ,note:note})
    
        
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    

});



module.exports = router;
