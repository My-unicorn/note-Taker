var express = require("express");
var path = require("path");
var fs = require("fs");
const util = require("util");

const encoding = "utf-8";



var app = express();
var PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));


const apiNOTES = "/api/notes";
const apiNotesID = "/api/notes/:id";




app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,"/public/index.html"));
});

app.get("/notes",function(req,res){
    res.sendFile(path.join(__dirname,"/public/notes.html"));
});



app.get(apiNOTES, function(req,res) {

    const allNotes = getDBFile();
    console.log(allNotes);

    return res.json(allNotes);
});




app.post(apiNOTES, function(req,res){

    let newNote = req.body;
    newNote.id = new Date().getTime().toString();
  

    let allNotes = getDBFile();
    allNotes.push(newNote);

    writeToDBFile(allNotes);
    
    res.status(201).send(newNote);
});



app.delete(apiNotesID, function(req,res){

   

    let allNotes = getDBFile();
    let findID = req.params.id;

    let newNoteList = allNotes.filter(note => {
        if(note.id !== findID) return note;
    });
   

    writeToDBFile(newNoteList);

    res.status(200).send("note deleted");
});



function getDBFile(){
    let rawData = fs.readFileSync(path.join(__dirname,"/db/db.json"),"utf8");
    let jsonData = JSON.parse(rawData);

    return jsonData;
}

function writeToDBFile(tempJSON){

    let stringJSON = JSON.stringify(tempJSON,null,2);

    fs.writeFileSync(path.join(__dirname,"/db/db.json"),stringJSON);
}


app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  