import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, Bot, Trophy, User, Zap } from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/quests', icon: Target, label: 'Quests' },
  { to: '/planner', icon: Bot, label: 'AI Planner' },
  { to: '/achievements', icon: Trophy, label: 'Achievements' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Zap />
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}`
            }
            end={item.to === '/dashboard'}
          >
            <item.icon />
            <span className="tooltip">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
