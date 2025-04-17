import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Student.css"; // 👈 import the CSS file

const Student = () => {
  const [userData, setUserData] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };

    fetchUserData();
  }, []);

  const handleStartQuiz = async () => {
    const startTime = Date.now();
    setQuizStartTime(startTime);

    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "student_quiz_data", user.uid), {
        studentId: user.uid,
        quizStartTime: startTime,
        submissionTime: null,
        timeTaken: null,
      });
    }

    navigate("/student/take-quiz");
  };

  const handleSubmitQuiz = async () => {
    const submissionTime = Date.now();
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "student_quiz_data", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert("Quiz start time not found.");
      return;
    }

    const data = docSnap.data();
    const startTime = data.quizStartTime;

    if (!startTime) {
      alert("Start time is missing in the database.");
      return;
    }

    const timeTaken = (submissionTime - startTime) / 1000;

    await updateDoc(docRef, {
      submissionTime,
      timeTaken,
    });

    alert("Quiz submitted!");
    navigate("/student");
  };

  return (
    <div className="student-container">
      <div className="student-card">
        <h2 className="student-title">🎓 Student Dashboard</h2>
        {userData ? (
          <>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Role:</strong> {userData.role || "Not assigned"}</p>
            <div className="student-buttons">
              <button onClick={handleStartQuiz}>Start Quiz</button>
              <button onClick={handleSubmitQuiz}>Submit Quiz</button>
            </div>
          </>
        ) : (
          <p className="student-loading">Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default Student;
