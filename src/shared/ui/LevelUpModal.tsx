import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';
import useStore from '../store/useStore';

let previousLevel = -1;

export default function LevelUpModal() {
  const [showModal, setShowModal] = useState(false);
  const [level, setLevel] = useState(0);
  const level_ = useStore((s) => s.profile.level);
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previousLevel === -1) {
      previousLevel = level_;
      return;
    }

    if (level_ > previousLevel) {
      setLevel(level_);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 4000);
    }

    previousLevel = level_;
  }, [level_]);

  // Generate confetti pieces
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#8b5cf6', '#06d6a0', '#f72585', '#fbbf24', '#3b82f6', '#22d3ee'][Math.floor(Math.random() * 6)],
    delay: Math.random() * 0.5,
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
  }));

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(12px)',
            zIndex: 10000,
          }}
          onClick={() => setShowModal(false)}
        >
          {/* Confetti */}
          <div ref={confettiRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
            {confettiPieces.map((piece) => (
              <motion.div
                key={piece.id}
                initial={{
                  x: `${piece.x}vw`,
                  y: '-5vh',
                  rotate: 0,
                  opacity: 1,
                }}
                animate={{
                  y: '105vh',
                  rotate: piece.rotation + 720,
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: piece.delay,
                  ease: 'linear',
                }}
                style={{
                  position: 'absolute',
                  width: piece.size,
                  height: piece.size * 0.6,
                  background: piece.color,
                  borderRadius: '1px',
                }}
              />
            ))}
          </div>

          {/* Level Up Card */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(20, 15, 50, 0.95) 0%, rgba(30, 20, 60, 0.95) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '28px',
              padding: '48px 56px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 0 80px rgba(139, 92, 246, 0.2), 0 0 160px rgba(139, 92, 246, 0.1)',
            }}
          >
            {/* Glow orb behind */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }} />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 10 }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <Sparkles size={24} color="#fbbf24" style={{ margin: '0 auto 12px' }} />
              <p style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#fbbf24',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '8px',
              }}>
                Level Up!
              </p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: 'spring', damping: 8 }}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #8b5cf6, #06d6a0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '16px auto',
                  boxShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'white',
                }}>
                  {level}
                </span>
              </motion.div>
              <h2 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.75rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}>
                You reached Level {level}!
              </h2>
              <p style={{
                fontSize: '0.9375rem',
                color: 'var(--text-secondary)',
                maxWidth: '300px',
                margin: '0 auto',
              }}>
                Keep crushing your quests to unlock new achievements and level up even further.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(false)}
                style={{
                  marginTop: '24px',
                  padding: '12px 32px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #8b5cf6, #06d6a0)',
                  color: 'white',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
                }}
              >
                <Star size={16} /> Keep Going
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
