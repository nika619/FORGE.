import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';

let previousCompletedCount = -1;

export default function QuestCompleteToast() {
  const [show, setShow] = useState(false);
  const [questName, setQuestName] = useState('');
  const quests = useStore((s) => s.quests);
  const completedCount = quests.filter((q) => q.status === 'completed').length;

  useEffect(() => {
    if (previousCompletedCount === -1) {
      previousCompletedCount = completedCount;
      return;
    }

    if (completedCount > previousCompletedCount) {
      const lastCompleted = quests.find(
        (q) => q.status === 'completed' && q.progress === 100
      );
      setQuestName(lastCompleted?.title || 'Quest');
      setShow(true);
      setTimeout(() => setShow(false), 3500);
    }

    previousCompletedCount = completedCount;
  }, [completedCount, quests]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          style={{
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 28px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(6, 214, 160, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
            border: '1px solid rgba(6, 214, 160, 0.3)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 40px rgba(6, 214, 160, 0.2), 0 0 80px rgba(6, 214, 160, 0.1)',
          }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #06d6a0, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Trophy size={22} color="white" />
          </motion.div>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '0.9375rem',
              color: '#06d6a0',
              marginBottom: '2px',
            }}>
              <Sparkles size={14} /> Quest Complete!
            </div>
            <div style={{
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
            }}>
              "{questName}" has been completed
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
