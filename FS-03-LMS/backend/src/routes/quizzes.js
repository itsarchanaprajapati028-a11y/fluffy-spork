const express = require('express');
const Quiz = require('../models/Quiz');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /quizzes/:quizId
router.get('/:quizId', auth, async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
  const obj = quiz.toObject();
  if (req.user.role === 'student') {
    obj.questions = obj.questions.map((q) => ({
      ...q,
      correctAnswer: undefined,
      options: q.options.map((o) => ({ _id: o._id, text: o.text, isCorrect: undefined })),
    }));
  }
  res.json({ success: true, data: obj });
});

// POST /quizzes/:quizId/submit
router.post('/:quizId/submit', auth, async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
  const answers = req.body.answers || [];
  let score = 0;
  let totalPoints = 0;
  quiz.questions.forEach((q) => {
    totalPoints += q.points;
    const ans = answers.find((a) => String(a.questionId) === String(q._id));
    if (ans) {
      const correct = q.correctAnswer || [];
      const given = ans.answer || [];
      if (correct.every((c) => given.map(String).includes(String(c)))) {
        score += q.points;
      }
    }
  });
  const percentage = totalPoints ? Math.round((score / totalPoints) * 100) : 0;
  res.json({
    success: true,
    data: {
      score,
      totalPoints,
      percentage,
      passed: percentage >= quiz.passingScore,
      correctAnswers: quiz.questions.map((q) => ({ questionId: q._id, correctAnswer: q.correctAnswer })),
    },
  });
});

// POST /quizzes (instructor/admin)
router.post('/', auth, authorize('instructor', 'admin'), async (req, res) => {
  const quiz = await Quiz.create(req.body);
  res.status(201).json({ success: true, data: quiz });
});

module.exports = router;