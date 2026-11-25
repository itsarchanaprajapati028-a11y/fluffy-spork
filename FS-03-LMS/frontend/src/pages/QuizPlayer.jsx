import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

export function QuizPlayer() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  useEffect(() => {
    api.get(`/quizzes/${quizId}`).then((r) => setQuiz(r.data.data)).catch(() => {});
  }, [quizId]);
  const submit = async () => {
    const payload = Object.entries(answers).map(([qid, ans]) => ({ questionId: qid, answer: ans }));
    const r = await api.post(`/quizzes/${quizId}/submit`, { answers: payload });
    setResult(r.data.data);
  };
  if (!quiz) return <div className="py-8 text-center text-gray-500">Loading...</div>;
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{quiz.title}</h1>
      {result ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-xl font-bold">Score: {result.percentage}%</h2>
          <p className="text-gray-600 mt-2">{result.passed ? 'Passed!' : 'Not passed'}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {(quiz.questions || []).map((q) => (
            <div key={q._id} className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="font-medium mb-2">{q.question}</p>
              {(q.options || []).map((o) => (
                <label key={o._id} className="block text-sm mb-1">
                  <input type="radio" name={q._id} onChange={() => setAnswers({ ...answers, [q._id]: [o.text] })} className="mr-2" />
                  {o.text}
                </label>
              ))}
            </div>
          ))}
          <button onClick={submit} className="bg-primary-600 text-white px-4 py-2 rounded-lg">Submit Quiz</button>
        </div>
      )}
    </div>
  );
}
export default QuizPlayer;