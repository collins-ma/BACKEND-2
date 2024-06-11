const Note=require('../model/Note')
const User=require('../model/User')
const asyncHandler = require('express-async-handler')


const getNotes = asyncHandler(async (req, res) => {
    // Get all notes from MongoDB
    const notes = await Note.find().lean()

    // If no notes 
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }

    // Add username to each note before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE 
    // You could also do this with a for...of loop
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)
})





const createNote = asyncHandler(async (req, res) => {
  const { title, content, user } = req.body;

  // Validate request data
  if (!title || !content || !user) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate note title
  const duplicateNote = await Note.findOne({ title });
  if (duplicateNote) {
    return res.status(409).json({ message: "Duplicate note title" });
  }

  // Create a new note
  const note = new Note({
    title,
    content,
    user, // Assign the note to the user
  });

  const newNote = await note.save();
  if (newNote) {
    res.status(201).json({ message: `Success! New note with title "${title}" and ticket number ${newNote.noteticket} created.` });
  } else {
    res.status(400).json({ message: "Invalid note data received" });
  }
});





const updateNote=asyncHandler(async(req, res)=>{
    const { id, user, title, content  } = req.body;
    if (!id || !user|| !title || !content) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }
    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

    // Allow renaming of the original note 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }
    note.user = user
    note.title = title
    note.content = content
    

    const updatedNote = await note.save()

    res.json(`'${updatedNote.title}' updated`)


   



    
})



const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Note ID required' })
    }

    // Confirm note exists to delete 
    const note = await Note.findById(id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

   const result= await note.deleteOne()

    const reply = `Note '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
}
)
const getNote = async (req, res) => {
    // Check if the note ID is provided in the request parameters
    if (!req?.params?.id) {
        return res.status(400).json({ message: 'Note ID required.' });
    }

    try {
        // Find the note by its ID in the database
        const note = await Note.findById(req.params.id).exec();
        
        // If no note is found, return a 204 status with a message
        if (!note) {
            return res.status(204).json({ message: `No note matches ID ${req.params.id}.` });
        }

        // If the note is found, return it in the response
        res.json(note);
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error('Error fetching note:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};



module.exports={createNote, getNotes, updateNote, getNote, deleteNote}