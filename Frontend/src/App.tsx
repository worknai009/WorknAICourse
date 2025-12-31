import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import coursesApi, { type Course } from '../services/api';
import { DataContext } from '../src/context';
import ThemeProvider from '../src/Themeprovider';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CourseDetail from './pages/CourseDetail';
import Courses from './pages/Courses';
import Auth from './pages/Auth';
import RequestCallback from './pages/RequestCallback';
import Footer from './components/Footer';

// AppContent component - handles routing and layout
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/signin' ||
    location.pathname === '/signup' ||
    location.pathname === '/callback';

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/signin" element={<Auth type="signin" />} />
          <Route path="/signup" element={<Auth type="signup" />} />
          <Route path="/callback" element={<RequestCallback />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
};

// Main App component
const App: React.FC = () => {
  // Data state
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses on mount
  useEffect(() => {
    let isMounted = true;

    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await coursesApi.getAllCourses({
          sort: '-createdAt',
          limit: 100,
        });

        if (isMounted) {
          setCourses(data);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch courses';
          setError(errorMessage);
          console.error('Error fetching courses in App:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ThemeProvider>
      <DataContext.Provider value={{ courses, isLoading, error }}>
        <Router>
          <AppContent />
        </Router>
      </DataContext.Provider>
    </ThemeProvider>
  );
};

export default App;