import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

/* ── SVG Icons ── */
const IconHome = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);
const IconKey = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7.5" cy="15.5" r="5.5"/>
    <path d="M21 2l-9.6 9.6M15.5 7.5l3 3"/>
  </svg>
);
const IconWarning = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('renter');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleStep1 = e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.password || !form.confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      navigate(role === 'owner' ? '/owner/dashboard' : '/renter/browse');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      {/* Left Panel */}
      <div className={styles.panel}>
        <div className={styles.panelGlass}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>N</span>
            <span className={styles.logoText}>NestFind</span>
          </div>

          <div className={styles.panelContent}>
            <h1 className={styles.panelHeading}>
              Your next home<br />is one step away.
            </h1>
            <p className={styles.panelSub}>
              Browse verified rooms and connect directly with owners — no middlemen, no hidden fees.
            </p>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>2,400+</span>
                <span className={styles.statLabel}>Rooms listed</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>1,800+</span>
                <span className={styles.statLabel}>Happy renters</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statNum}>650+</span>
                <span className={styles.statLabel}>Verified owners</span>
              </div>
            </div>
          </div>

          <div className={styles.stepIndicator}>
            <div className={`${styles.step} ${step === 1 ? styles.stepActive : styles.stepDone}`}>
              <span className={styles.stepNum}>1</span>
              <span className={styles.stepLabel}>Your details</span>
            </div>
            <div className={styles.stepLine} />
            <div className={`${styles.step} ${step === 2 ? styles.stepActive : ''}`}>
              <span className={styles.stepNum}>2</span>
              <span className={styles.stepLabel}>Set password</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className={styles.formSide}>
        <div className={styles.formWrapper}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Create your account</h2>
              <p className={styles.formSub}>
                Step {step} of 2 — {step === 1 ? 'Tell us about yourself' : 'Secure your account'}
              </p>
            </div>

            {/* Role Toggle (step 1 only) */}
            {step === 1 && (
              <div className={styles.roleToggle} role="group" aria-label="Select your role">
                <button
                  type="button"
                  className={`${styles.roleBtn} ${role === 'renter' ? styles.roleActive : ''}`}
                  onClick={() => setRole('renter')}
                >
                  <IconHome />
                  I'm a Renter
                </button>
                <button
                  type="button"
                  className={`${styles.roleBtn} ${role === 'owner' ? styles.roleActive : ''}`}
                  onClick={() => setRole('owner')}
                >
                  <IconKey />
                  I'm an Owner
                </button>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleStep1} noValidate>
                {error && (
                  <div className={styles.errorBox} role="alert">
                    <IconWarning /> {error}
                  </div>
                )}
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.label}>Full name</label>
                  <input id="name" name="name" type="text" placeholder="Ram Bahadur Thapa"
                    className={styles.input} value={form.name} onChange={handleChange} required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>Email address</label>
                  <input id="email" name="email" type="email" placeholder="you@example.com"
                    className={styles.input} value={form.email} onChange={handleChange} required />
                </div>
                <div className={styles.field}>
                  <label htmlFor="phone" className={styles.label}>Phone number</label>
                  <input id="phone" name="phone" type="tel" placeholder="98XXXXXXXX"
                    className={styles.input} value={form.phone} onChange={handleChange} required />
                </div>
                <button type="submit" className={styles.submitBtn}>
                  Continue →
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {error && (
                  <div className={styles.errorBox} role="alert">
                    <IconWarning /> {error}
                  </div>
                )}
                <div className={styles.field}>
                  <label htmlFor="password" className={styles.label}>Password</label>
                  <div className={styles.inputWrap}>
                    <input id="password" name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      className={styles.input} value={form.password} onChange={handleChange} required />
                    <button type="button" className={styles.eyeBtn}
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <IconEyeOff /> : <IconEye />}
                    </button>
                  </div>
                </div>
                <div className={styles.field}>
                  <label htmlFor="confirm" className={styles.label}>Confirm password</label>
                  <input id="confirm" name="confirm"
                    type="password" placeholder="Re-enter your password"
                    className={styles.input} value={form.confirm} onChange={handleChange} required />
                </div>
                <div className={styles.stepActions}>
                  <button type="button" className={styles.backBtn} onClick={() => { setStep(1); setError(''); }}>
                    ← Back
                  </button>
                  <button type="submit" className={styles.submitBtn} disabled={loading} style={{ flex: 1 }}>
                    {loading && <span className={styles.spinner} aria-hidden="true" />}
                    {loading ? 'Creating account…' : 'Create account'}
                  </button>
                </div>
              </form>
            )}

            <p className={styles.switchText}>
              Already have an account?{' '}
              <Link to="/login" className={styles.switchLink}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}