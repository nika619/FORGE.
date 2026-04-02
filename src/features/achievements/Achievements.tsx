import { useState } from 'react';
import { Trophy, Lock, Unlock } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import useStore from '../../shared/store/useStore';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const badgeColors: Record<string, { bg: string; glow: string }> = {
  '🌟': { bg: 'var(--accent-gold-dim)', glow: 'var(--shadow-glow-gold)' },
  '🔥': { bg: 'var(--accent-tertiary-dim)', glow: '0 0 20px rgba(247, 37, 133, 0.3)' },
  '⚡': { bg: 'var(--accent-primary-dim)', glow: 'var(--shadow-glow-purple)' },
  '🎓': { bg: 'var(--accent-blue-dim)', glow: '0 0 20px rgba(59, 130, 246, 0.3)' },
  '🏆': { bg: 'var(--accent-gold-dim)', glow: 'var(--shadow-glow-gold)' },
  '💎': { bg: 'var(--accent-primary-dim)', glow: 'var(--shadow-glow-purple)' },
  '📦': { bg: 'var(--accent-secondary-dim)', glow: 'var(--shadow-glow-green)' },
  '🦉': { bg: 'var(--accent-primary-dim)', glow: 'var(--shadow-glow-purple)' },
  '🎨': { bg: 'var(--accent-tertiary-dim)', glow: '0 0 20px rgba(247, 37, 133, 0.3)' },
  '🔟': { bg: 'var(--accent-blue-dim)', glow: '0 0 20px rgba(59, 130, 246, 0.3)' },
  '💯': { bg: 'var(--accent-secondary-dim)', glow: 'var(--shadow-glow-green)' },
  '🚀': { bg: 'var(--accent-tertiary-dim)', glow: '0 0 20px rgba(247, 37, 133, 0.3)' },
};

export default function Achievements() {
  const achievements = useStore((s) => s.achievements);
  const [filter, setFilter] = useState('all');

  const categories = ['all', ...new Set(achievements.map((a) => a.category))];

  const filtered = achievements.filter((a) => {
    if (filter === 'all') return true;
    return a.category === filter;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <motion.div
      className="page-enter"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
    >
      {/* Header */}
      <motion.div className="section-header" variants={fadeUp}>
        <div>
          <h2 className="section-title">
            <Trophy size={24} /> Achievements
          </h2>
          <p className="section-subtitle">
            {unlockedCount} of {achievements.length} unlocked
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            background: 'var(--accent-gold-dim)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(251, 191, 36, 0.2)',
          }}>
            <Unlock size={14} color="var(--accent-gold)" />
            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--accent-gold)' }}>
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Overall Progress */}
      <motion.div variants={fadeUp} style={{ marginBottom: 'var(--space-8)' }}>
        <div className="progress-bar-track" style={{ height: '8px', borderRadius: 'var(--radius-full)' }}>
          <div
            className="progress-bar-fill fire"
            style={{
              width: `${(unlockedCount / achievements.length) * 100}%`,
              height: '100%',
              animation: 'progressFill 1s var(--ease-out)',
            }}
          />
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div className="filter-tabs" variants={fadeUp}>
        {categories.map((c) => (
          <button
            key={c}
            className={`filter-tab${filter === c ? ' active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Badges Grid */}
      <motion.div
        className="badges-grid"
        variants={{ show: { transition: { staggerChildren: 0.04 } } }}
      >
        {filtered.map((achievement) => {
          const colors = badgeColors[achievement.icon] || { bg: 'var(--glass-bg)', glow: 'none' };

          return (
            <motion.div
              key={achievement.id}
              className={`badge-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
              variants={fadeUp}
              whileHover={achievement.unlocked ? { scale: 1.03 } : {}}
            >
              <div
                className="badge-icon"
                style={{
                  background: achievement.unlocked ? colors.bg : 'rgba(255,255,255,0.03)',
                  boxShadow: achievement.unlocked ? colors.glow : 'none',
                }}
              >
                {achievement.unlocked ? (
                  <span>{achievement.icon}</span>
                ) : (
                  <Lock size={20} color="var(--text-muted)" />
                )}
              </div>
              <span className="badge-name">{achievement.name}</span>
              <span className="badge-desc">{achievement.description}</span>
              {achievement.unlocked && achievement.unlockedAt && (
                <span style={{
                  fontSize: '0.6875rem',
                  color: 'var(--accent-secondary)',
                  fontWeight: 500,
                  marginTop: 'var(--space-1)',
                }}>
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </span>
              )}
              {!achievement.unlocked && (
                <span style={{
                  fontSize: '0.6875rem',
                  color: 'var(--text-muted)',
                  marginTop: 'var(--space-1)',
                }}>
                  {achievement.requirement}
                </span>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
