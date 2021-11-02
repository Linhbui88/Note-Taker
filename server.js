const express = require('express');
const path = require('path')

const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

const PORT = 3001;
const app = express();


// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static('public/assets'));

// GET Route for notes page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);



//api routes
app.get('/api/notes', (req,res)=>{
 fs.readFile('./db/db.json','utf8',(err,data)=>{
   if(err) throw err
   const notes= JSON.parse(data)
   res.json(notes)
 })

  
})




app.post('/api/notes', (req,res)=>{
 



  if(req.body.title && req.body.text) {
    const newNote ={
      title: req.body.title ,
      text:  req.body.text,
      id: uuidv4()
    }
    console.log(`Saving new note:`, newNote)
    fs.readFile('./db/db.json', 'utf8', (err,data)=>{
      if (err) throw err
      const parseData = JSON.parse(data)
      parseData.push(newNote)

      const noteSave = JSON.stringify(parseData)
      fs.writeFile('./db/db.json', noteSave, err =>{
        if (err) throw err
        res.status(200).send('Note saved')
      })
    })

  }else {
    res.status(400).send('suffient data')
  }
})

app.delete('/api/notes/:id' , (req,res) => {
  console.log(req.params.id)
  fs.readFile('./db/db.json', 'utf8', (err,data)=>{
    if (err) throw err
    const notes= JSON.parse(data)
    const indexToDelete= notes.findIndex(note => {
      return note.id === req.params.id;
   });
   if(indexToDelete === -1){
      return false;
   };
   notes.splice(indexToDelete, 1);

    const notesAfterDeleted = JSON.stringify(notes)
    fs.writeFile('./db/db.json',notesAfterDeleted, err =>{
      if (err) throw err
      res.status(200).send('Note deleted')
    } )
})
})




app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);