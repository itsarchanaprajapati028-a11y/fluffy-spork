import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

export function CoursePlayer() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  useEffect(() => {
    api.get(`/courses/${courseId}/lessons/${lessonId}`).then((r) => setLesson(r.data.data)).catch(() => {});
  }, [courseId, lessonId]);
  const complete = async () => {
    await api.put(`/enrollments/${courseId}/progress`, { lessonId, completed: true }).catch(() => {});
  };
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{lesson?.title || 'Lesson'}</h1>
      {lesson?.videoUrl ? (
        <video controls className="w-full rounded-xl bg-black aspect-video" src={lesson.videoUrl} />
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-6 whitespace-pre-wrap">{lesson?.content || 'No content'}</div>
      )}
      <button onClick={complete} className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg">Mark Complete</button>
    </div>
  );
}
export default CoursePlayer;