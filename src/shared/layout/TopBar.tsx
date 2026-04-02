import { Flame, Star } from 'lucide-react';
import useStore from '../store/useStore';

export default function TopBar() {
  const profile = useStore((s) => s.profile);
  const xpPercent = Math.round((profile.xp / profile.xpToNextLevel) * 100);

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <h1 className="topbar-title">F.O.R.G.E.</h1>
      </div>
      <div className="topbar-right">
        <div className="topbar-xp">
          <div className="xp-bar-container">
            <div className="xp-bar-label">
              <span>{profile.xp.toLocaleString()} XP</span>
              <span>{profile.xpToNextLevel.toLocaleString()} XP</span>
            </div>
            <div className="xp-bar-track">
              <div
                className="xp-bar-fill"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
        <div className="topbar-level">
          <Star size={14} />
          LVL {profile.level}
        </div>
        <div className="topbar-streak">
          <Flame size={14} />
          {profile.streak} days
        </div>
        <div className="topbar-avatar" title={profile.name}>
          {profile.name.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
