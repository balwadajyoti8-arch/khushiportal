const MCQ = require('../models/MCQ');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get MCQs for tests based on filters
// @route   GET /api/mcqs
// @access  Private
exports.getMCQs = async (req, res, next) => {
  try {
    const { topic, company, difficulty, limit = 10 } = req.query;

    const query = {};
    if (topic) query.topic = topic;
    if (company) query.companies = { $in: [company] };
    if (difficulty) query.difficulty = difficulty;

    // Fetch random questions to simulate tests
    const mcqs = await MCQ.aggregate([
      { $match: query },
      { $sample: { size: Number(limit) } },
    ]);

    // If aggregation yields empty (e.g., in some mongo setups where aggregate is tricky or empty data),
    // fallback to normal find
    if (!mcqs || mcqs.length === 0) {
      const fallbackList = await MCQ.find(query).limit(Number(limit));
      return res.status(200).json({
        success: true,
        count: fallbackList.length,
        data: fallbackList,
      });
    }

    res.status(200).json({
      success: true,
      count: mcqs.length,
      data: mcqs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit MCQ test answers and evaluate score
// @route   POST /api/mcqs/submit
// @access  Private
exports.submitMCQTest = async (req, res, next) => {
  try {
    const { answers, enableNegativeMarking } = req.body; // answers: [{ mcqId: string, selectedOption: number }]

    if (!answers || !Array.isArray(answers)) {
      res.status(400);
      throw new Error('Please submit an array of answers');
    }

    const evaluation = [];
    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    let score = 0;

    for (const ans of answers) {
      const mcq = await MCQ.findById(ans.mcqId);
      if (!mcq) continue;

      const isCorrect = ans.selectedOption === mcq.correctOption;
      const isUnattempted = ans.selectedOption === -1 || ans.selectedOption === null || ans.selectedOption === undefined;

      if (isUnattempted) {
        unattemptedCount++;
      } else if (isCorrect) {
        correctCount++;
        score += 4; // +4 for correct
      } else {
        wrongCount++;
        score -= enableNegativeMarking ? 1 : 0; // -1 for wrong if negative marking enabled
      }

      evaluation.push({
        mcqId: mcq._id,
        question: mcq.question,
        options: mcq.options,
        correctOption: mcq.correctOption,
        selectedOption: ans.selectedOption,
        explanation: mcq.explanation,
        isCorrect,
        isUnattempted,
      });
    }

    // Log Activity
    await ActivityLog.create({
      userId: req.user.id,
      actionType: 'Took MCQ Test',
      details: `Scored ${score} pts (Correct: ${correctCount}, Wrong: ${wrongCount})`,
    });

    res.status(200).json({
      success: true,
      score,
      correctCount,
      wrongCount,
      unattemptedCount,
      totalQuestions: answers.length,
      evaluation,
    });
  } catch (error) {
    next(error);
  }
};
