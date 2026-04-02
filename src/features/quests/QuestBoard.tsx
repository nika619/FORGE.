import { useState } from 'react';
import {
  Target,
  Plus,
  Zap,
  CheckCircle2,
  Clock,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Trophy,
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import useStore from '../../shared/store/useStore';
import { categoryColors, categoryLabels } from '../../shared/mock/sampleData';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function QuestBoard() {
  const quests = useStore((s) => s.quests);
  const questFilter = useStore((s) => s.questFilter);
  const setQuestFilter = useStore((s) => s.setQuestFilter);
  const toggleSubTask = useStore((s) => s.toggleSubTask);
  const completeQuest = useStore((s) => s.completeQuest);
  const addQuest = useStore((s) => s.addQuest);
  const [expandedQuest, setExpandedQuest] = useState<string | null>(null);
  const [showNewQuestModal, setShowNewQuestModal] = useState(false);
  const [newQuest, setNewQuest] = useState<{
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'epic';
    category: 'academics' | 'extracurricular' | 'personal' | 'college-prep';
  }>({ title: '', description: '', difficulty: 'medium', category: 'personal' });
  const filters = ['all', 'active', 'completed', 'epic'];

  const filteredQuests = quests.filter((q) => {
    if (questFilter === 'all') return true;
    if (questFilter === 'active') return q.status === 'active';
    if (questFilter === 'completed') return q.status === 'completed';
    if (questFilter === 'epic') return q.difficulty === 'epic';
    return true;
  });

  const handleCreateQuest = () => {
    if (!newQuest.title.trim()) return;
    const quest = {
      id: `q_${Date.now()}`,
      title: newQuest.title,
      description: newQuest.description,
      difficulty: newQuest.difficulty,
      xpReward: newQuest.difficulty === 'easy' ? 150 : newQuest.difficulty === 'medium' ? 250 : newQuest.difficulty === 'hard' ? 400 : 600,
      category: newQuest.category,
      subTasks: [
        { id: `st_${Date.now()}_1`, title: 'Define goals and requirements', completed: false, xpReward: 30 },
        { id: `st_${Date.now()}_2`, title: 'Create action plan', completed: false, xpReward: 30 },
        { id: `st_${Date.now()}_3`, title: 'Execute and track progress', completed: false, xpReward: 50 },
      ],
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      status: 'active' as const,
      createdAt: new Date().toISOString().split('T')[0],
    };
    addQuest(quest);
    setNewQuest({ title: '', description: '', difficulty: 'medium', category: 'personal' });
    setShowNewQuestModal(false);
  };

  return (
    <motion.div className="page-enter" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
      {/* Header */}
      <motion.div className="section-header" variants={fadeUp}>
        <div>
          <h2 className="section-title">
            <Target size={24} /> Quest Board
          </h2>
          <p className="section-subtitle">
            {quests.filter((q) => q.status === 'active').length} active quests ·{' '}
            {quests.filter((q) => q.status === 'completed').length} completed
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewQuestModal(true)}>
          <Plus size={18} /> New Quest
        </button>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div className="filter-tabs" variants={fadeUp}>
        {filters.map((f) => (
          <button
            key={f}
            className={`filter-tab${questFilter === f ? ' active' : ''}`}
            onClick={() => setQuestFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Quest Cards */}
      <motion.div className="quests-grid" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
        <AnimatePresence mode="popLayout">
          {filteredQuests.map((quest) => {
            const completedSubs = quest.subTasks.filter((s) => s.completed).length;
            const isExpanded = expandedQuest === quest.id;
            const allDone = completedSubs === quest.subTasks.length;

            return (
              <motion.div
                key={quest.id}
                className={`quest-card ${quest.difficulty}`}
                variants={fadeUp}
                layout
                onClick={() => setExpandedQuest(isExpanded ? null : quest.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="quest-card-header">
                  <h4 className="quest-card-title">{quest.title}</h4>
                  {isExpanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
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

                {!isExpanded && (
                  <>
                    <p className="quest-card-desc">{quest.description}</p>
                    <div className="quest-card-progress">
                      <div className="progress-bar-track">
                        <div
                          className={`progress-bar-fill ${quest.difficulty === 'epic' ? 'fire' : quest.difficulty === 'hard' ? 'purple' : quest.difficulty === 'medium' ? 'blue' : 'green'}`}
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
                  </>
                )}

                {/* Expanded View */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p className="quest-card-desc">{quest.description}</p>
                      <div style={{ marginBottom: 'var(--space-4)' }}>
                        {quest.subTasks.map((st) => (
                          <div
                            key={st.id}
                            className="subtask-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (quest.status === 'active') toggleSubTask(quest.id, st.id);
                            }}
                            style={{ cursor: quest.status === 'active' ? 'pointer' : 'default' }}
                          >
                            <div className={`subtask-checkbox${st.completed ? ' checked' : ''}`}>
                              {st.completed && <Check size={12} />}
                            </div>
                            <span className={`subtask-text${st.completed ? ' completed' : ''}`}>
                              {st.title}
                            </span>
                            <span className="focus-item-xp">+{st.xpReward} XP</span>
                          </div>
                        ))}
                      </div>
                      <div className="quest-card-progress">
                        <div className="progress-bar-track">
                          <div
                            className={`progress-bar-fill ${quest.difficulty === 'epic' ? 'fire' : quest.difficulty === 'hard' ? 'purple' : quest.difficulty === 'medium' ? 'blue' : 'green'}`}
                            style={{ width: `${quest.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="quest-card-footer" style={{ marginTop: 'var(--space-3)' }}>
                        <span className="quest-card-subtasks">
                          <CheckCircle2 size={12} />
                          {completedSubs}/{quest.subTasks.length} tasks
                        </span>
                        {quest.status === 'active' && allDone && (
                          <button
                            className="btn btn-success"
                            onClick={(e) => {
                              e.stopPropagation();
                              completeQuest(quest.id);
                            }}
                            style={{ fontSize: 'var(--text-xs)' }}
                          >
                            <Trophy size={14} /> Complete Quest
                          </button>
                        )}
                        {quest.status === 'completed' && (
                          <span style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--accent-secondary)',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}>
                            <CheckCircle2 size={14} /> Completed
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* New Quest Modal */}
      <AnimatePresence>
        {showNewQuestModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewQuestModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3 className="modal-title">⚔️ Create New Quest</h3>
                <button className="btn btn-ghost btn-icon" onClick={() => setShowNewQuestModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <div>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)', display: 'block', color: 'var(--text-secondary)' }}>
                    Quest Name
                  </label>
                  <input
                    type="text"
                    value={newQuest.title}
                    onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
                    placeholder="e.g., Build a mobile app"
                    style={{
                      width: '100%',
                      padding: 'var(--space-3) var(--space-4)',
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-base)',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)', display: 'block', color: 'var(--text-secondary)' }}>
                    Description
                  </label>
                  <textarea
                    value={newQuest.description}
                    onChange={(e) => setNewQuest({ ...newQuest, description: e.target.value })}
                    placeholder="What's this quest about?"
                    rows={3}
                    style={{
                      width: '100%',
                      padding: 'var(--space-3) var(--space-4)',
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-base)',
                      resize: 'vertical',
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)', display: 'block', color: 'var(--text-secondary)' }}>
                      Difficulty
                    </label>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      {(['easy', 'medium', 'hard', 'epic'] as const).map((d) => (
                        <button
                          key={d}
                          className={`difficulty-badge ${d}`}
                          style={{
                            cursor: 'pointer',
                            outline: newQuest.difficulty === d ? '2px solid var(--text-primary)' : 'none',
                            outlineOffset: '2px',
                          }}
                          onClick={() => setNewQuest({ ...newQuest, difficulty: d })}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-2)', display: 'block', color: 'var(--text-secondary)' }}>
                      Category
                    </label>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                      {(['academics', 'extracurricular', 'personal', 'college-prep'] as const).map((c) => (
                        <button
                          key={c}
                          className="category-tag"
                          style={{
                            cursor: 'pointer',
                            outline: newQuest.category === c ? '2px solid var(--text-primary)' : 'none',
                            outlineOffset: '2px',
                          }}
                          onClick={() => setNewQuest({ ...newQuest, category: c })}
                        >
                          {c === 'college-prep' ? '🎓' : c === 'academics' ? '📚' : c === 'extracurricular' ? '🎯' : '💪'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowNewQuestModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleCreateQuest}>
                  <Plus size={16} /> Create Quest
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
