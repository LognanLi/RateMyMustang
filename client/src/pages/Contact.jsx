import { useState } from 'react';

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' });
  const [status, setStatus]   = useState(''); // 'sending' | 'sent' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formsubmit.co/ajax/lilogan2008@gmail.com', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name:    form.name,
          email:   form.email,
          message: form.message,
          _subject: `RateMyMustang — message from ${form.name}`,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="contact-page">
      <div className="contact-card">
        <h2><i className="fa-solid fa-envelope" /> Contact</h2>
        <p className="contact-sub">
          Have a question, want to report an issue, or need a teacher added or removed?
          Fill out the form below or email directly at{' '}
          <a href="mailto:lilogan2008@gmail.com">lilogan2008@gmail.com</a>.
        </p>

        {status === 'sent' ? (
          <div className="contact-success">
            <i className="fa-solid fa-circle-check" /> Message sent! I'll get back to you soon.
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            {status === 'error' && (
              <p style={{ color: '#b30000', marginBottom: '0.75rem' }}>
                Something went wrong — please try emailing directly.
              </p>
            )}

            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                placeholder="e.g. John Smith"
                value={form.name}
                required
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label>Your Email</label>
              <input
                type="email"
                placeholder="e.g. you@example.com"
                value={form.email}
                required
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                placeholder="What's on your mind?"
                value={form.message}
                required
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={status === 'sending'}>
              {status === 'sending'
                ? <><i className="fa-solid fa-circle-notch fa-spin" /> Sending…</>
                : <><i className="fa-solid fa-paper-plane" /> Send Message</>}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

