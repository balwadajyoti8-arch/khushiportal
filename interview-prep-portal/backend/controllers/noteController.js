const Note = require('../models/Note');

// @desc    Get note for a specific question
// @route   GET /api/notes/question/:questionId
// @access  Private
exports.getNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ userId: req.user.id, questionId: req.params.questionId });
    res.status(200).json({
      success: true,
      data: note || { content: '' },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user notes
// @route   GET /api/notes
// @access  Private
exports.getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).populate('questionId', 'title topic difficulty platform');
    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update a note
// @route   POST /api/notes/question/:questionId
// @access  Private
exports.createOrUpdateNote = async (req, res, next) => {
  try {
    const { content } = req.body;
    const questionId = req.params.questionId;

    let note = await Note.findOne({ userId: req.user.id, questionId });

    if (note) {
      note.content = content;
      await note.save();
    } else {
      note = await Note.create({
        userId: req.user.id,
        questionId,
        content,
      });
    }

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user.id });

    if (!note) {
      res.status(404);
      throw new Error('Note not found');
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
