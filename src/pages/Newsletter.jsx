import { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../scripts/firebase';
import './Newsletter.css';

export default function Newsletter() {
  const { isTeacher } = useAuth();
  const [newsletters, setNewsletters] = useState([]);
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'newsletters'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setNewsletters(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })
    return unsubscribe;
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title || !fileUrl) return;

    setPublishing(true);
    try{
      await addDoc(collection(db, 'newsletters'), {
        title,
        date: new Date().toISOString().slice(0, 10),
        fileUrl,
        createdAt: serverTimestamp(),
      });

      setTitle('');
      setFileUrl('');
      e.target.reset();
    } catch (error){
      alert(error.message || 'Could not publish this newsletter.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="page newsletter-page">
      <div className="container">
        <div className="section-title">
          <h1>Newsletter</h1>
        </div>

        {isTeacher && (
          <form className="card newsletter-upload" onSubmit={handlePublish}>
            <h3>Publish a newsletter</h3>
            <div className="form-field">
              <label htmlFor="nl-title">Title</label>
              <input
                id="nl-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Term Newsletter"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="nl-link">OneDrive link to the PDF</label>
              <input
                id="nl-link"
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder='Upload the PDF to OneDrive, then paste share link here with &download=1 at the end'
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={publishing}>
              {publishing ? 'Publishing\u2026' : 'Publish'}
            </button>
          </form>
        )}

        <div className="newsletter-list">
          {newsletters.length === 0 && (
            <p>No newsletters published yet.</p>
          )}
          {newsletters.map((n) => (
            <a
              key={n.id}
              href={n.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card newsletter-item"
            >
              <div>
                <h3>{n.title}</h3>
                <p>{n.date}</p>
              </div>
              <span className="btn btn-secondary">View PDF</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}