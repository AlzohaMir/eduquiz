import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import "./TakeQuiz.css"; // 👈 Import CSS file

const TakeQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [submittedQuizIds, setSubmittedQuizIds] = useState({});
  const [answerLinks, setAnswerLinks] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const quizSnapshot = await getDocs(collection(db, "quizzes"));
      const quizList = quizSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const submissionQ = query(
        collection(db, "submissions"),
        where("studentId", "==", user.uid)
      );
      const submissionSnapshot = await getDocs(submissionQ);
      const submitted = {};
      submissionSnapshot.docs.forEach(doc => {
        const data = doc.data();
        submitted[data.quizId] = true;
      });

      setQuizzes(quizList);
      setSubmittedQuizIds(submitted);
    };

    fetchData();
  }, []);

  const handleSubmit = async (quizId) => {
    const user = auth.currentUser;
    const answerLink = answerLinks[quizId];

    if (!answerLink) {
      alert("Please enter a Drive link!");
      return;
    }

    try {
      await addDoc(collection(db, "submissions"), {
        quizId,
        studentId: user.uid,
        studentEmail: user.email,
        answerLink,
        submittedAt: new Date(),
      });

      alert("Submitted successfully!");
      setSubmittedQuizIds(prev => ({ ...prev, [quizId]: true }));
      setAnswerLinks(prev => ({ ...prev, [quizId]: "" }));
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Try again.");
    }
  };

  return (
    <div className="takequiz-container">
      <h2 className="takequiz-title">📘 Available Quizzes</h2>
      {quizzes.length === 0 ? (
        <p className="takequiz-empty">No quizzes available right now.</p>
      ) : (
        quizzes.map(quiz => (
          <div className="takequiz-card" key={quiz.id}>
            <h3>{quiz.title}</h3>
            <p>{quiz.description}</p>
            <a href={quiz.pdfUrl} target="_blank" rel="noreferrer">
              📄 View PDF
            </a>

            {submittedQuizIds[quiz.id] ? (
              <p className="takequiz-submitted">✅ Already Submitted</p>
            ) : (
              <>
                <input
                  type="text"
                  className="takequiz-input"
                  placeholder="Paste your Google Drive link here"
                  value={answerLinks[quiz.id] || ""}
                  onChange={(e) =>
                    setAnswerLinks(prev => ({ ...prev, [quiz.id]: e.target.value }))
                  }
                />
                <br />
                <button className="takequiz-button" onClick={() => handleSubmit(quiz.id)}>
                  📤 Submit Answer
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TakeQuiz;
