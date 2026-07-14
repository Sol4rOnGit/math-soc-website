import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { initialChallenge } from '../data/mockData';
import './Challenge.css';

export default function Challenge() {
  const { isTeacher } = useAuth();
  const [challenge, setChallenge] = useState(initialChallenge);

  const [studentAnswer, setStudentAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const [weekLabel, setWeekLabel] = useState('');
  const [questionFile, setQuestionFile] = useState(null);
  const [workingsFile, setWorkingsFile] = useState(null);
  const [answer, setAnswer] = useState('');

  const handleSubmitAnswer = (e) => {
    e.preventDefault();
    if (!studentAnswer) return;

    const correct =
      studentAnswer.trim().toLowerCase() === challenge.answer.trim().toLowerCase();

    // TODO: write the submission to Firestore, e.g. a `submissions` collection
    // keyed by challenge id + user id, then award leaderboard points server-side.
    setIsCorrect(correct);
    setSubmitted(true);
  };

  const handlePublishChallenge = (e) => {
    e.preventDefault();
    if (!questionFile || !workingsFile || !answer || !weekLabel) return;

    // TODO: replace with real Firebase Storage uploads for both images, then
    // write { weekLabel, questionImage, workingsImage, answer } to Firestore.
    const newChallenge = {
      id: crypto.randomUUID(),
      weekLabel,
      questionImage: URL.createObjectURL(questionFile),
      workingsImage: URL.createObjectURL(workingsFile),
      answer,
    };

    setChallenge(newChallenge);
    setWeekLabel('');
    setQuestionFile(null);
    setWorkingsFile(null);
    setAnswer('');
    setSubmitted(false);
    setStudentAnswer('');
    e.target.reset();
  };

  return (
    <div className="page challenge-page">
      <div className="container">
        <div className="section-title">
          <h1>Challenge of the Week</h1>
          <span className="tag">{challenge.weekLabel}</span>
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
            <button type="submit" className="btn btn-primary">
              Publish challenge
            </button>
          </form>
        )}

        <div className="card challenge-question">
          <h3>Question</h3>
          <img src={challenge.questionImage} alt="This week's challenge question" />
        </div>

        {!isTeacher && (
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
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        )}

        {submitted && !isTeacher && (
          <div className={`card challenge-result ${isCorrect ? 'is-correct' : 'is-incorrect'}`}>
            <h3>{isCorrect ? 'Correct! \u{1F389}' : 'Not quite'}</h3>
            <p>The correct answer was: <strong>{challenge.answer}</strong></p>
          </div>
        )}

        {(submitted || isTeacher) && (
          <div className="card challenge-workings">
            <h3>Workings & solution</h3>
            <img src={challenge.workingsImage} alt="Workings and solution" />
          </div>
        )}
      </div>
    </div>
  );
}