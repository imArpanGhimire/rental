import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import styles from './RenterDashboard.module.css';

const mockUser = { name: 'Aarav Sharma', email: 'aarav@email.com' };

const mockListings = [
  { id: 1, title: 'Cozy Room in Baneshwor', location: 'Baneshwor, Kathmandu', price: 8500, beds: 1, baths: 1, tag: 'New', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80' },
  { id: 2, title: 'Modern Studio, Thamel', location: 'Thamel, Kathmandu', price: 12000, beds: 1, baths: 1, tag: 'Popular', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80' },
  { id: 3, title: 'Spacious Flat, Lalitpur', location: 'Patan, Lalitpur', price: 15000, beds: 2, baths: 1, tag: null, img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80' },
  { id: 4, title: 'Budget Room, Koteshwor', location: 'Koteshwor, Kathmandu', price: 5500, beds: 1, baths: 1, tag: 'Budget', img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80' },
];

const IconBed   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M2 10V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/><line x1="2" y1="16" x2="22" y2="16"/></svg>;
const IconPin   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconHeart = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;

export default function RenterDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState([]);

  const toggleSave = (id) => {
    setSaved(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className={styles.layout}>
      <Sidebar role="renter" user={mockUser} mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className={styles.main}>
        <TopBar
          title="Find Your Room"
          subtitle={`Good morning, ${mockUser.name.split(' ')[0]} 👋`}
          onMenuClick={() => setMenuOpen(true)}
          user={mockUser}
        />

        <div className={styles.content}>
          {/* Stats */}
          <div className={styles.statsRow}>
            {[
              { label: 'Saved Rooms', value: saved.length },
              { label: 'Viewed Today', value: 12 },
              { label: 'Applications', value: 2 },
              { label: 'Messages', value: 5 },
            ].map(s => (
              <div key={s.label} className={styles.statCard}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Section */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recommended for you</h2>
            <button className={styles.seeAll}>See all</button>
          </div>

          <div className={styles.grid}>
            {mockListings.map(room => (
              <div key={room.id} className={styles.card}>
                <div className={styles.imgWrap}>
                  <img src={room.img} alt={room.title} className={styles.img} />
                  {room.tag && <span className={styles.tag}>{room.tag}</span>}
                  <button
                    className={`${styles.saveBtn} ${saved.includes(room.id) ? styles.saved : ''}`}
                    onClick={() => toggleSave(room.id)}
                    aria-label="Save"
                  >
                    <IconHeart />
                  </button>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={styles.metaPin}><IconPin /> {room.location}</span>
                    <span className={styles.metaBed}><IconBed /> {room.beds} bed</span>
                  </div>
                  <h3 className={styles.cardTitle}>{room.title}</h3>
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>NPR {room.price.toLocaleString()}<span className={styles.mo}>/mo</span></span>
                    <button className={styles.viewBtn}>View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}