import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { initialNewsletters } from '../data/mockData';
import './Newsletter.css';

export default function Newsletter() {
  const { isTeacher } = useAuth();
  const [newsletters, setNewsletters] = useState(initialNewsletters);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title || !file) return;

    // TODO: replace with a real Firebase Storage upload, e.g.
    // const storageRef = ref(storage, `newsletters/${file.name}`);
    // await uploadBytes(storageRef, file);
    // const fileUrl = await getDownloadURL(storageRef);
    // then write { title, date, fileUrl } to a `newsletters` Firestore collection.
    const fileUrl = URL.createObjectURL(file);

    const newEntry = {
      id: crypto.randomUUID(),
      title,
      date: new Date().toISOString().slice(0, 10),
      fileUrl,
    };

    setNewsletters([newEntry, ...newsletters]);
    setTitle('');
    setFile(null);
    e.target.reset();
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
              <label htmlFor="nl-file">PDF file</label>
              <input
                id="nl-file"
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0] ?? null)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Publish
            </button>
          </form>
        )}

        <div className="newsletter-list">
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