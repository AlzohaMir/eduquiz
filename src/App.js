import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Teacher from './pages/Teacher.js';
import Student from './pages/Student';
import TakeQuiz from "./pages/TakeQuiz";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/student" element={<Student />} />
        <Route path="/student/take-quiz" element={<TakeQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;
