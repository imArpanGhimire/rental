import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.css';

const IconArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);
const IconMail = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);
const IconWarning = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return; }
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1400));
      setSent(true);
      startCooldown();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    startCooldown();
  };

  return (
    <div className={styles.page}>
      <div className={styles.orb1} /><div className={styles.orb2} /><div className={styles.orb3} />

      {/* Left Panel */}
      <div className={styles.panel}>
        <div className={styles.panelGlass}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>N</span>
            <span className={styles.logoText}>NestFind</span>
          </div>
          <div className={styles.panelContent}>
            <h1 className={styles.panelHeading}>Reset your<br />password.</h1>
            <p className={styles.panelSub}>
              We'll send a secure link to your inbox. Follow it to create a new password — takes less than a minute.
            </p>
            <div className={styles.stats}>
              <div className={styles.stat}><span className={styles.statNum}>2,400+</span><span className={styles.statLabel}>Rooms listed</span></div>
              <div className={styles.statDivider} />
              <div className={styles.stat}><span className={styles.statNum}>1,800+</span><span className={styles.statLabel}>Happy renters</span></div>
              <div className={styles.statDivider} />
              <div className={styles.stat}><span className={styles.statNum}>650+</span><span className={styles.statLabel}>Verified owners</span></div>
            </div>
          </div>
          <div className={styles.stepIndicator}>
            <div className={`${styles.step} ${styles.stepActive}`}>
              <span className={styles.stepNum}>1</span>
              <span className={styles.stepLabel}>Verify email</span>
            </div>
            <div className={styles.stepLine} />
            <div className={styles.step}>
              <span className={styles.stepNum}>2</span>
              <span className={styles.stepLabel}>New password</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.formSide}>
        <div className={styles.formWrapper}>
          <div className={styles.formCard}>
            <Link to="/login" className={styles.backToLogin}>
              <IconArrowLeft /> Back to sign in
            </Link>

            {!sent ? (
              <>
                <div className={styles.formHeader}>
                  <h2 className={styles.formTitle}>Forgot password?</h2>
                  <p className={styles.formSub}>Enter your email and we'll send a reset link.</p>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                  {error && (
                    <div className={styles.errorBox} role="alert">
                      <IconWarning /> {error}
                    </div>
                  )}
                  <div className={styles.field}>
                    <label htmlFor="email" className={styles.label}>Email address</label>
                    <input
                      id="email" name="email" type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={styles.input}
                      value={email}
                      onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
                      required
                    />
                  </div>
                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading && <span className={styles.spinner} aria-hidden="true" />}
                    {loading ? 'Sending link…' : 'Send reset link'}
                  </button>
                </form>
                <p className={styles.switchText}>
                  Remember your password?{' '}
                  <Link to="/login" className={styles.switchLink}>Sign in</Link>
                </p>
              </>
            ) : (
              <div className={styles.successBox}>
                <div className={styles.successIcon}><IconCheck /></div>
                <p className={styles.successTitle}>Check your inbox</p>
                <p className={styles.successSub}>
                  We sent a reset link to <strong style={{ color: 'rgba(255,255,255,0.70)', fontWeight: 400 }}>{email}</strong>. It expires in 15 minutes.
                </p>
                <p className={styles.switchText} style={{ marginTop: 0 }}>
                  Didn't get it?{' '}
                  <button className={styles.resendBtn} onClick={handleResend} disabled={resendCooldown > 0 || loading}>
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend email'}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}