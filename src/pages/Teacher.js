import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './Teacher.css'; // for new styling

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [studentQuizData, setStudentQuizData] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    pdfUrl: "",
  });
  const [useDriveLink, setUseDriveLink] = useState(true);
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

  useEffect(() => {
    const fetchQuizzes = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "quizzes"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const quizList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setQuizzes(quizList);
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchStudentQuizData = async () => {
      const q = collection(db, "student_quiz_data");
      const querySnapshot = await getDocs(q);

      const quizDataList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setStudentQuizData(quizDataList);
    };

    fetchStudentQuizData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleCreateQuiz = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, "quizzes"), {
        ...newQuiz,
        userId: user.uid,
      });
      setNewQuiz({ title: "", description: "", pdfUrl: "" });
      alert("Quiz created successfully!");
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz.");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await deleteDoc(doc(db, "quizzes", quizId));
      setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Welcome, Teacher!</h2>
        {userData && (
          <div className="user-info">
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Role:</strong> {userData.role}</p>
          </div>
        )}

        <section className="quiz-section">
          <h3>Create a New Quiz</h3>
          <div className="radio-options">
            <label>
              <input
                type="radio"
                checked={useDriveLink}
                onChange={() => setUseDriveLink(true)}
              />
              Use Google Drive Link
            </label>
            <label>
              <input
                type="radio"
                checked={!useDriveLink}
                onChange={() => setUseDriveLink(false)}
              />
              Upload via Firebase Storage (Not supported)
            </label>
          </div>
          <input
            type="text"
            placeholder="Quiz Title"
            value={newQuiz.title}
            onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={newQuiz.description}
            onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
          />
          {useDriveLink ? (
            <input
              type="text"
              placeholder="Google Drive Link"
              value={newQuiz.pdfUrl}
              onChange={(e) => setNewQuiz({ ...newQuiz, pdfUrl: e.target.value })}
            />
          ) : (
            <input type="file" disabled title="Firebase Storage not enabled" />
          )}
          <button onClick={handleCreateQuiz}>Create Quiz</button>
        </section>

        <section>
          <h3>Your Quizzes</h3>
          {quizzes.length === 0 ? (
            <p>No quizzes created yet.</p>
          ) : (
            <ul className="quiz-list">
              {quizzes.map((quiz) => (
                <li key={quiz.id}>
                  <strong>{quiz.title}</strong><br />
                  {quiz.description}<br />
                  <a href={quiz.pdfUrl} target="_blank" rel="noreferrer">View PDF</a><br />
                  <button onClick={() => handleDeleteQuiz(quiz.id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3>Student Quiz Data</h3>
          {studentQuizData.length === 0 ? (
            <p>No quiz data available.</p>
          ) : (
            <ul className="student-data">
              {studentQuizData.map((data) => (
                <li key={data.id}>
                  <strong>Student ID: {data.studentId}</strong><br />
                  Quiz Started: {new Date(data.quizStartTime).toLocaleString()}<br />
                  Quiz Submitted: {data.submissionTime ? new Date(data.submissionTime).toLocaleString() : "Not submitted yet"}<br />
                  Time Taken: {data.timeTaken ? `${data.timeTaken} seconds` : "N/A"}
                </li>
              ))}
            </ul>
          )}
        </section>

        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
