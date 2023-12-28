require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');



const app = express()
const PORT = process.env.PORT || 8000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', false);
const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

const NoteSchemer = {
    id: { type: String, default: () => uuidv4(), required: true },
    Aname: [{
        Name: { type: String, uppercase: true },
        Mname: { type: String, uppercase: true },
        Surname: { type: String, uppercase: true }
    }],
    School: { type: String, uppercase: true },
    Dept: { type: String, uppercase: true },
    State: { type: String, uppercase: true },
    LocalGovt: { type: String, uppercase: true },
    RegNo: { type: String, uppercase: true },
    Bloodgroup: { type: String, uppercase: true },
    Sex: { type: String, uppercase: true },
    PhoneNo: { type: String, uppercase: true, unique: true, required: true },
    EmergencyNo: { type: String, uppercase: true }

}
const Note = mongoose.model("Note", NoteSchemer);

app.use('/public', express.static(__dirname + '/public'));

app.get(["/", "/index.html"], (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", async(req, res) => {

    let newNote = new Note({
        Aname: [{
            Name: req.body.Name,
            Mname: req.body.Mname,
            Surname: req.body.Surname
        }],
        School: req.body.School,
        Dept: req.body.Dept,
        State: req.body.State,
        LocalGovt: req.body.LocalGovt,
        RegNo: req.body.RegNo,
        Bloodgroup: req.body.Bloodgroup,
        Sex: req.body.Sex,
        PhoneNo: req.body.PhoneNo,
        EmergencyNo: req.body.EmergencyNo,
    });

    await newNote.save();
    res.send(`<html><h1>${newNote.id}</h1></html>`)
        //res.json({message: `Post added successfully! Your Post Id is ${newPost.id}`,});
        //res.redirect("/");
})

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
});