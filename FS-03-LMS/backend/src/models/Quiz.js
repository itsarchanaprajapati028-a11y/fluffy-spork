const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    questions: [
      {
        type: { type: String, default: 'mcq' },
        question: { type: String, required: true },
        options: [{ text: String, isCorrect: Boolean }],
        correctAnswer: [{ type: String }],
        points: { type: Number, default: 1 },
        explanation: String,
      },
    ],
    passingScore: { type: Number, default: 70 },
    duration: { type: Number, default: 0 },
    attemptsAllowed: { type: Number, default: 3 },
    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', quizSchema);