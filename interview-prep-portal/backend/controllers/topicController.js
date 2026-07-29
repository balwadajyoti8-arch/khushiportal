const Topic = require('../models/Topic');
const QuestionReference = require('../models/QuestionReference');

// @desc    Get all topics
// @route   GET /api/topics
// @access  Public
exports.getTopics = async (req, res, next) => {
  try {
   const topics = await Topic.find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .lean();

    // Get question count for each topic
    const topicsWithCount = await Promise.all(
      topics.map(async (topic) => {
        const questionCount = await QuestionReference.countDocuments({
          topic: topic._id,
          status: 'Active',
        });
        return {
          ...topic,
          questionCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: topicsWithCount.length,
      data: topicsWithCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single topic with questions
// @route   GET /api/topics/:id
// @access  Public
exports.getTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    const questions = await QuestionReference.find({
      topic: req.params.id,
      status: 'Active',
    })
      .populate('topic', 'name color icon')
      .sort({ title: 1 });

    res.status(200).json({
      success: true,
      data: {
        ...topic.toObject(),
        questions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new topic
// @route   POST /api/topics
// @access  Private/Admin
exports.createTopic = async (req, res, next) => {
  try {
    const { name, description, icon, color, order } = req.body;

    // Check if topic already exists
    const existingTopic = await Topic.findOne({ name });
    if (existingTopic) {
      return res.status(400).json({
        success: false,
        message: 'Topic already exists',
      });
    }

    const topic = await Topic.create({
      name,
      description,
      icon: icon || 'Code',
      color: color || '#8B5CF6',
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update topic
// @route   PUT /api/topics/:id
// @access  Private/Admin
exports.updateTopic = async (req, res, next) => {
  try {
    const { name, description, icon, color, order, isActive } = req.body;

    let topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== topic.name) {
      const existingTopic = await Topic.findOne({ name });
      if (existingTopic) {
        return res.status(400).json({
          success: false,
          message: 'Topic name already exists',
        });
      }
    }

    topic = await Topic.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        icon,
        color,
        order,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete topic
// @route   DELETE /api/topics/:id
// @access  Private/Admin
exports.deleteTopic = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    // Check if topic has questions
    const questionCount = await QuestionReference.countDocuments({
      topic: req.params.id,
    });

    if (questionCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete topic with ${questionCount} questions. Please reassign or delete questions first.`,
      });
    }

    await topic.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Topic deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update topic question count (helper function)
// @route   PUT /api/topics/:id/update-count
// @access  Private/Admin
exports.updateTopicCount = async (req, res, next) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    const questionCount = await QuestionReference.countDocuments({
      topic: req.params.id,
      status: 'Active',
    });

    topic.questionCount = questionCount;
    await topic.save();

    res.status(200).json({
      success: true,
      data: topic,
    });
  } catch (error) {
    next(error);
  }
};
