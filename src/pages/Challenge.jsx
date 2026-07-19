import { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDoc, increment, onSnapshot, orderBy, query, limit, serverTimestamp, writeBatch} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../scripts/firebase';
import './Challenge.css';

async function uploadToImgbb(file) {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error('Missing VITE_IMGBB_API_KEY - add it to your .env file.');
  }

  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data?.error?.message || 'Image upload failed.');
  }

  return data.data.url;
}

export default function Challenge() {
  const { currentUser, isTeacher } = useAuth();
  const [challenge, setChallenge] = useState(null);

  const [studentAnswer, setStudentAnswer] = useState('');
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [checkingSubmission, setCheckingSubmission] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [weekLabel, setWeekLabel] = useState('');
  const [questionFile, setQuestionFile] = useState(null);
  const [workingsFile, setWorkingsFile] = useState(null);
  const [answer, setAnswer] = useState('');
  const [publishing, setPublishing] = useState(false);

  useEffect (() => {
    const q = query(collection(db, 'challenges'), orderBy('createdAt', 'desc'), limit(1));
    const unsubscribe = onSnapshot(q, (snap) => {
      setChallenge(snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() })
    });
    return unsubscribe;
  }, []); 

  useEffect (() => {
    let cancelled = false;

    async function checkSubmission(){
      setCheckingSubmission(true);

      if (!challenge || !currentUser){
        if (!cancelled){
          setExistingSubmission(null);
          setCheckingSubmission(false);
        }
        return;
      }

      const subRef = doc(db, 'submissions', `${currentUser.uid}_${challenge.id}`);
      const snap = await getDoc(subRef);
      if (!cancelled){
        setExistingSubmission(snap.exists() ? snap.data() : null);
        setCheckingSubmission(false);
      }
    }

    checkSubmission();

    return () => {
      cancelled = true;
    };
  }, [challenge, currentUser]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!studentAnswer || !challenge || !currentUser) return;

    setSubmitting(true);
    try{
      const correct = studentAnswer.trim().toLowerCase() === challenge.answer.trim().toLowerCase();

      const batch = writeBatch(db);
      const subRef = doc(db, 'submissions', `${currentUser.uid}_${challenge.id}`);
      batch.set(subRef, {
        uid: currentUser.uid,
        challengeId: challenge.id,
        answer: studentAnswer,
        correct,
        createdAt: serverTimestamp(),
      });

      if (correct){
        const userRef = doc(db, 'users', currentUser.uid);
        batch.update(userRef, {points: increment(10)});
      }

      await batch.commit();
      setExistingSubmission({answer: studentAnswer, correct});
    } catch (error) {
      alert(error.message || 'Could not submit your answer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublishChallenge = async (e) => {
    e.preventDefault();
    if (!questionFile || !workingsFile || !answer || !weekLabel) return;

    setPublishing(true);
    try {
      const [questionImage, workingsImage] = await Promise.all([
        uploadToImgbb(questionFile),
        uploadToImgbb(workingsFile),
      ]);

      await addDoc(collection(db, 'challenges'), {
        weekLabel,
        questionImage,
        workingsImage,
        answer,
        createdAt: serverTimestamp(),
      });

      setWeekLabel('');
      setQuestionFile(null);
      setWorkingsFile(null);
      setAnswer('');
      e.target.reset();
    } catch (error){
      alert(error.message || 'Could not publish the challenge.');
    } finally {
      setPublishing(false);
    }
  };

  const revealed = isTeacher || (!checkingSubmission && !!existingSubmission);

  return (
    <div className="page challenge-page">
      <div className="container">
        <div className="section-title">
          <h1>Challenge of the Week</h1>
          {challenge && <span className="tag">{challenge.weekLabel}</span>}
        </div>

        {isTeacher && (
          <form className="card challenge-upload" onSubmit={handlePublishChallenge}>
            <h3>Publish a new challenge</h3>
            <div className="form-field">
              <label htmlFor="week-label">Week label</label>
              <input
                id="week-label"
                type="text"
                value={weekLabel}
                onChange={(e) => setWeekLabel(e.target.value)}
                placeholder="e.g. Week 13"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="question-file">Question image</label>
              <input
                id="question-file"
                type="file"
                accept="image/*"
                onChange={(e) => setQuestionFile(e.target.files[0] ?? null)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="workings-file">Workings / solution image</label>
              <input
                id="workings-file"
                type="file"
                accept="image/*"
                onChange={(e) => setWorkingsFile(e.target.files[0] ?? null)}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="answer">Correct answer</label>
              <input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="e.g. 42"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={publishing}>
              {publishing ? 'Publishing\u2026' : 'Publish challenge'}
            </button>
          </form>
        )}

        {!challenge && (
          <p>No challenge of the week has been published yet.</p>
        )}

        {challenge && (
        <div className="card challenge-question">
          <h3>Question</h3>
          <img src={challenge.questionImage} alt="This week's challenge question" />
        </div>
        )}

        {!isTeacher && !checkingSubmission && !existingSubmission && (
          <form className="card challenge-submit" onSubmit={handleSubmitAnswer}>
            <h3>Submit your answer</h3>
            <div className="form-field">
              <label htmlFor="student-answer">Your answer</label>
              <input
                id="student-answer"
                type="text"
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type your answer"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting\u2026' : 'Submit'}
            </button>
          </form>
        )}

        {challenge && existingSubmission && !isTeacher && (
          <div className={`card challenge-result ${existingSubmission.correct ? 'is-correct' : 'is-incorrect'}`}>
            <h3>{existingSubmission.correct ? 'Correct! \u{1F389}' : 'Not quite!'}</h3>
            <p>The correct answer was: <strong>{challenge.answer}</strong></p>
          </div>
        )}

        {challenge && revealed && (
          <div className="card challenge-workings">
            <h3>Workings & solution</h3>
            <img src={challenge.workingsImage} alt="Workings and solution" />
          </div>
        )}
      </div>
    </div>
  );
}