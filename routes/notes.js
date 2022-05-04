const express = require('express')
const Router = express.Router()
const NoteController = require('../controllers/NoteController')

Router.get('/api/notes', NoteController.get_notes)

Router.get('/api/notes/:id', NoteController.get_note)

Router.delete('/api/notes/:id', NoteController.delete_note)

Router.put('/api/notes/:id', NoteController.update_note)

Router.post('/api/notes', NoteController.create_note)

module.exports = Router