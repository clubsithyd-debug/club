import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, Code, CreditCard, Info, Terminal, UserPlus, Users } from 'lucide-react';
import styles from './HackathonNav.module.css';

const navItems = [
  { id: '/', icon: ArrowLeft, label: 'Main Site', exact: true },
  { id: '/symbihackathon', icon: Terminal, label: 'Hackathon', exact: true },
  { id: '/symbihackathon/problems', icon: Code, label: 'Problems' },
  { id: '/symbihackathon/schedule', icon: Clock, label: 'Schedule' },
  { id: '/symbihackathon/committee', icon: Users, label: 'Committee' },
  { id: '/symbihackathon/sponsors', icon: UserPlus, label: 'Sponsors' },
  { id: '/symbihackathon/rules', icon: Info, label: 'Rules' },
  { id: '/symbihackathon/payment', icon: CreditCard, label: 'Payment' },
];

export default function HackathonNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className={styles.navShell}>
      <div className={styles.navWidth}>
        <nav className={styles.navBar}>
          {navItems.map((item) => {
            const isActive = item.exact ? currentPath === item.id : currentPath.startsWith(item.id);

            return (
              <Link
                key={item.id}
                to={item.id}
                aria-label={item.label}
                title={item.label}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <item.icon className="h-4 w-4" />
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
