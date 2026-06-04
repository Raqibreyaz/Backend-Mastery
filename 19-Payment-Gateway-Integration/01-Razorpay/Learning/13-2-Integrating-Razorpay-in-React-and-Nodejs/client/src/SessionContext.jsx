import { createContext, useState, useEffect } from 'react';
import api from './api';

export const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const res = await api.get('/me');
      setSession(res.data.session);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchSession(), fetchCourses()]);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession, courses, fetchSession, loading }}>
      {children}
    </SessionContext.Provider>
  );
}
