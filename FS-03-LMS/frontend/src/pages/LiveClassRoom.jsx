import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';

export function LiveClassRoom() {
  const { liveClassId } = useParams();
  const [liveClass, setLiveClass] = useState(null);
  const [joined, setJoined] = useState(null);
  useEffect(() => {
    api.get(`/live-classes/${liveClassId}`).then((r) => setLiveClass(r.data.data)).catch(() => {});
  }, [liveClassId]);
  const join = async () => {
    const r = await api.post(`/live-classes/${liveClassId}/join`);
    setJoined(r.data.data);
  };
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{liveClass?.title || 'Live Class'}</h1>
      {joined ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p>Meeting ID: {joined.meetingId}</p>
          <a href={joined.meetingUrl} target="_blank" className="text-primary-600">Join Meeting</a>
        </div>
      ) : (
        <button onClick={join} className="bg-primary-600 text-white px-4 py-2 rounded-lg">Join Class</button>
      )}
    </div>
  );
}
export default LiveClassRoom;