require('dotenv').config({path: PORT})
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/Note')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

//routes

app.get('/', (req, res) => {
  res.send(`<h1>App root</h1>`)
})

app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id).then(note => {
    res.json(note)
  })
})

app.delete('/api/notes/:id', (req, res) => {
  Note.findByIdAndDelete(req.params.id).then(() => {
    res.status(200).end()
  })
})

app.post('/api/notes', (req, res) => {
  const body = req.body

  if(body.content === undefined){
    return(
      res
        .status(400)
        .json({
          error: 'Content missing'
        })
    )    
  }

  const note = new Note({
    content: body.content,
    date: new Date(),
    important: body.important || false
  })

  note.save().then((savedNote) => {
    res.json(savedNote)
  })
})

// Heroku address: https://hidden-cove-28467.herokuapp.com/api/notes

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`)
})