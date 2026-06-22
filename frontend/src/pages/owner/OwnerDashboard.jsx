import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';
import styles from './OwnerDashboard.module.css';

const mockUser = { name: 'Binod Thapa', email: 'binod@email.com' };

const mockListings = [
  { id: 1, title: 'Baneshwor Studio', location: 'Baneshwor, KTM', price: 10000, status: 'Active', views: 84, inquiries: 5 },
  { id: 2, title: 'Thamel 2BHK',      location: 'Thamel, KTM',     price: 18000, status: 'Active', views: 132, inquiries: 11 },
  { id: 3, title: 'Patan Flat',        location: 'Patan, Lalitpur', price: 14000, status: 'Paused', views: 43, inquiries: 2 },
];

const IconPlus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconEye  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconMsg  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;

export default function OwnerDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);

  const totalRevenue = mockListings.filter(l => l.status === 'Active').reduce((s, l) => s + l.price, 0);
  const totalViews   = mockListings.reduce((s, l) => s + l.views, 0);
  const totalInq     = mockListings.reduce((s, l) => s + l.inquiries, 0);

  return (
    <div className={styles.layout}>
      <Sidebar role="owner" user={mockUser} mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className={styles.main}>
        <TopBar
          title="Owner Dashboard"
          subtitle={`Welcome back, ${mockUser.name.split(' ')[0]}`}
          onMenuClick={() => setMenuOpen(true)}
          user={mockUser}
        />

        <div className={styles.content}>
          {/* Stats */}
          <div className={styles.statsRow}>
            {[
              { label: 'Active Listings', value: mockListings.filter(l => l.status === 'Active').length },
              { label: 'Total Views',     value: totalViews },
              { label: 'Inquiries',       value: totalInq },
              { label: 'Monthly Revenue', value: `NPR ${totalRevenue.toLocaleString()}` },
            ].map(s => (
              <div key={s.label} className={styles.statCard}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Listings */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Your Listings</h2>
            <button className={styles.addBtn}><IconPlus /> Add Listing</button>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Price / mo</th>
                  <th>Status</th>
                  <th><IconEye /></th>
                  <th><IconMsg /></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {mockListings.map(l => (
                  <tr key={l.id}>
                    <td>
                      <div className={styles.propName}>{l.title}</div>
                      <div className={styles.propLoc}>{l.location}</div>
                    </td>
                    <td className={styles.price}>NPR {l.price.toLocaleString()}</td>
                    <td>
                      <span className={`${styles.statusChip} ${l.status === 'Active' ? styles.active : styles.paused}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className={styles.num}>{l.views}</td>
                    <td className={styles.num}>{l.inquiries}</td>
                    <td>
                      <button className={styles.editBtn}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Inquiries */}
          <div className={styles.sectionHeader} style={{ marginTop: 32 }}>
            <h2 className={styles.sectionTitle}>Recent Inquiries</h2>
          </div>
          <div className={styles.inquiryList}>
            {[
              { name: 'Priya Magar',   room: 'Thamel 2BHK',   time: '2h ago',  msg: 'Is the room still available?' },
              { name: 'Sujan Rai',     room: 'Baneshwor Studio', time: '5h ago', msg: 'Can I schedule a visit tomorrow?' },
              { name: 'Anita Gurung',  room: 'Patan Flat',    time: '1d ago',  msg: 'What is included in the rent?' },
            ].map((inq, i) => (
              <div key={i} className={styles.inquiryCard}>
                <div className={styles.inqAvatar}>{inq.name.charAt(0)}</div>
                <div className={styles.inqBody}>
                  <div className={styles.inqTop}>
                    <span className={styles.inqName}>{inq.name}</span>
                    <span className={styles.inqTime}>{inq.time}</span>
                  </div>
                  <div className={styles.inqRoom}>{inq.room}</div>
                  <div className={styles.inqMsg}>{inq.msg}</div>
                </div>
                <button className={styles.replyBtn}>Reply</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}