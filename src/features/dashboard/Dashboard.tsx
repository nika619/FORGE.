import { useMemo } from 'react';
import {
  Zap,
  Target,
  Flame,
  Trophy,
  CheckCircle2,
  Clock,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import useStore from '../../shared/store/useStore';
import { motivationalQuotes, categoryLabels } from '../../shared/mock/sampleData';

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function Dashboard() {
  const profile = useStore((s) => s.profile);
  const quests = useStore((s) => s.quests);
  const toggleSubTask = useStore((s) => s.toggleSubTask);

  const activeQuests = quests.filter((q) => q.status === 'active');
  const completedQuests = quests.filter((q) => q.status === 'completed');

  const dailyFocus = useMemo(() => {
    // Pick next incomplete subtask from each active quest, prioritize incomplete
    const items: { questId: string; questTitle: string; taskId: string; taskTitle: string; xp: number; completed: boolean }[] = [];
    for (const q of activeQuests) {
      const nextIncomplete = q.subTasks.find((st) => !st.completed);
      if (nextIncomplete && items.length < 5) {
        items.push({
          questId: q.id,
          questTitle: q.title,
          taskId: nextIncomplete.id,
          taskTitle: nextIncomplete.title,
          xp: nextIncomplete.xpReward,
          completed: nextIncomplete.completed,
        });
      }
    }
    return items;
  }, [activeQuests]);

  const quote = useMemo(
    () => motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)],
    []
  );

  const stats = [
    {
      icon: <Zap size={22} />,
      value: profile.totalXp.toLocaleString(),
      label: 'Total XP',
      color: 'purple',
    },
    {
      icon: <Target size={22} />,
      value: activeQuests.length.toString(),
      label: 'Active Quests',
      color: 'blue',
    },
    {
      icon: <Trophy size={22} />,
      value: completedQuests.length.toString(),
      label: 'Completed',
      color: 'green',
    },
    {
      icon: <Flame size={22} />,
      value: `${profile.streak} days`,
      label: 'Current Streak',
      color: 'pink',
    },
  ];

  return (
    <motion.div
      className="page-enter"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      {/* Greeting */}
      <motion.div className="greeting" variants={fadeUp}>
        <h2 className="greeting-text">
          Welcome back, <span>{profile.name}</span> 👋
        </h2>
        <p className="greeting-sub">
          You're on a {profile.streak}-day streak! Keep the momentum going.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div className="stats-grid" variants={staggerContainer}>
        {stats.map((stat) => (
          <motion.div key={stat.label} className="stats-card" variants={fadeUp}>
            <div className={`stats-card-icon ${stat.color}`}>{stat.icon}</div>
            <div className="stats-card-info">
              <div className="stats-card-value">{stat.value}</div>
              <div className="stats-card-label">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Active Quests Column */}
        <motion.div variants={fadeUp}>
          <div className="section-header">
            <div>
              <h3 className="section-title">
                <Target size={22} /> Active Quests
              </h3>
              <p className="section-subtitle">{activeQuests.length} quests in progress</p>
            </div>
          </div>
          <motion.div
            className="quests-grid"
            variants={staggerContainer}
          >
            {activeQuests.slice(0, 4).map((quest) => {
              const completedSubs = quest.subTasks.filter((s) => s.completed).length;
              return (
                <motion.div
                  key={quest.id}
                  className={`quest-card ${quest.difficulty}`}
                  variants={fadeUp}
                >
                  <div className="quest-card-header">
                    <h4 className="quest-card-title">{quest.title}</h4>
                  </div>
                  <div className="quest-card-meta">
                    <span className={`difficulty-badge ${quest.difficulty}`}>
                      {quest.difficulty}
                    </span>
                    <span className="xp-chip">
                      <Zap size={11} /> {quest.xpReward} XP
                    </span>
                    <span className="category-tag">
                      {categoryLabels[quest.category]}
                    </span>
                  </div>
                  <p className="quest-card-desc">{quest.description}</p>
                  <div className="quest-card-progress">
                    <div className="progress-bar-track">
                      <div
                        className={`progress-bar-fill ${
                          quest.difficulty === 'epic'
                            ? 'fire'
                            : quest.difficulty === 'hard'
                            ? 'purple'
                            : quest.difficulty === 'medium'
                            ? 'blue'
                            : 'green'
                        }`}
                        style={{ width: `${quest.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="quest-card-footer">
                    <span className="quest-card-subtasks">
                      <CheckCircle2 size={12} />
                      {completedSubs}/{quest.subTasks.length} tasks
                    </span>
                    <span className="quest-card-footer-text">
                      <Clock size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
                      {quest.deadline}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Right Column — Daily Focus + Quote */}
        <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="glass-card daily-focus">
            <h3 className="daily-focus-title">
              <Target size={18} /> Today's Focus
            </h3>
            {dailyFocus.map((item) => (
              <div
                key={item.taskId}
                className={`focus-item${item.completed ? ' completed' : ''}`}
                onClick={() => toggleSubTask(item.questId, item.taskId)}
              >
                <div className={`focus-checkbox${item.completed ? ' checked' : ''}`}>
                  {item.completed && <Check size={12} />}
                </div>
                <span className="focus-item-text">{item.taskTitle}</span>
                <span className="focus-item-xp">+{item.xp} XP</span>
              </div>
            ))}
          </div>

          <div className="glass-card quote-card">
            <p className="quote-text">{quote.text}</p>
            <p className="quote-author">{quote.author}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
