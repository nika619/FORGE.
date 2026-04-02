import {
  User,
  Zap,
  Target,
  Trophy,
  Flame,
  Calendar,
  TrendingUp,
  Star,
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import useStore from '../../shared/store/useStore';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const skillCategories = [
  { name: 'Academics', value: 72, color: 'var(--accent-blue)' },
  { name: 'Leadership', value: 58, color: 'var(--accent-primary)' },
  { name: 'Creative', value: 45, color: 'var(--accent-tertiary)' },
  { name: 'Health & Wellness', value: 65, color: 'var(--accent-secondary)' },
  { name: 'College Prep', value: 80, color: 'var(--accent-gold)' },
];

export default function Profile() {
  const profile = useStore((s) => s.profile);
  const quests = useStore((s) => s.quests);
  const achievements = useStore((s) => s.achievements);

  const xpPercent = Math.round((profile.xp / profile.xpToNextLevel) * 100);
  const unlockedBadges = achievements.filter((a) => a.unlocked);
  const completedQuests = quests.filter((q) => q.status === 'completed');

  const profileStats = [
    { icon: <Zap size={22} />, value: profile.totalXp.toLocaleString(), label: 'Total XP', color: 'purple' },
    { icon: <Target size={22} />, value: profile.questsCompleted.toString(), label: 'Quests Done', color: 'blue' },
    { icon: <Trophy size={22} />, value: unlockedBadges.length.toString(), label: 'Badges Earned', color: 'gold' },
    { icon: <Flame size={22} />, value: `${profile.streak} days`, label: 'Best Streak', color: 'pink' },
  ];

  return (
    <motion.div
      className="page-enter"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
    >
      {/* Profile Header */}
      <motion.div className="profile-header" variants={fadeUp}>
        <div className="profile-avatar-large">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{profile.name}</h2>
          <p className="profile-tagline">{profile.tagline}</p>
          <div className="profile-badges-inline">
            {unlockedBadges.slice(0, 5).map((badge) => (
              <span
                key={badge.id}
                title={badge.name}
                style={{
                  fontSize: '1.25rem',
                  cursor: 'help',
                }}
              >
                {badge.icon}
              </span>
            ))}
            {unlockedBadges.length > 5 && (
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', alignSelf: 'center' }}>
                +{unlockedBadges.length - 5} more
              </span>
            )}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div className="topbar-level" style={{ marginBottom: 'var(--space-3)', display: 'inline-flex' }}>
            <Star size={14} />
            Level {profile.level}
          </div>
          <div className="xp-bar-container" style={{ width: '200px' }}>
            <div className="xp-bar-label">
              <span>{profile.xp.toLocaleString()} XP</span>
              <span>{profile.xpToNextLevel.toLocaleString()} XP</span>
            </div>
            <div className="xp-bar-track">
              <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
            <Calendar size={12} /> Joined {new Date(profile.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div className="profile-stats-grid" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
        {profileStats.map((stat) => (
          <motion.div key={stat.label} className="stats-card" variants={fadeUp}>
            <div className={`stats-card-icon ${stat.color}`}>{stat.icon}</div>
            <div className="stats-card-info">
              <div className="stats-card-value">{stat.value}</div>
              <div className="stats-card-label">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Skill Tree + Recent Completions */}
      <div className="dashboard-grid">
        {/* Skill Tree */}
        <motion.div className="glass-card skill-tree-card" variants={fadeUp}>
          <h3 className="section-title" style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-xl)' }}>
            <TrendingUp size={20} /> Skill Breakdown
          </h3>
          {skillCategories.map((skill) => (
            <div key={skill.name} className="skill-bar">
              <div className="skill-bar-header">
                <span className="skill-bar-name">{skill.name}</span>
                <span className="skill-bar-value">{skill.value}%</span>
              </div>
              <div className="progress-bar-track" style={{ height: '6px' }}>
                <motion.div
                  style={{
                    height: '100%',
                    borderRadius: 'var(--radius-full)',
                    background: skill.color,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.value}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recently Completed */}
        <motion.div className="glass-card" variants={fadeUp} style={{ padding: 'var(--space-6)' }}>
          <h3 className="section-title" style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-xl)' }}>
            <Trophy size={20} /> Quest History
          </h3>
          {completedQuests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
              <Trophy size={32} style={{ marginBottom: 'var(--space-3)', opacity: 0.3 }} />
              <p style={{ fontSize: 'var(--text-sm)' }}>No completed quests yet. Keep pushing!</p>
            </div>
          ) : (
            completedQuests.map((quest) => (
              <div
                key={quest.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-2)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{quest.title}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    {quest.subTasks.length} tasks · {quest.xpReward} XP earned
                  </div>
                </div>
                <span className={`difficulty-badge ${quest.difficulty}`}>{quest.difficulty}</span>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
