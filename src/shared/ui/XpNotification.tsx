import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

interface XpToast {
  id: number;
  amount: number;
  x: number;
  y: number;
}

let previousXp = -1;

export default function XpNotification() {
  const [toasts, setToasts] = useState<XpToast[]>([]);
  const totalXp = useStore((s) => s.profile.totalXp);

  useEffect(() => {
    if (previousXp === -1) {
      previousXp = totalXp;
      return;
    }

    if (totalXp > previousXp) {
      const gained = totalXp - previousXp;
      const id = Date.now();
      const x = window.innerWidth - 280 + Math.random() * 60;
      const y = 70 + Math.random() * 20;

      setToasts((prev) => [...prev, { id, amount: gained, x, y }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2000);
    }

    previousXp = totalXp;
  }, [totalXp]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: toast.y, x: toast.x, scale: 0.5 }}
            animate={{ opacity: 1, y: toast.y - 40, x: toast.x, scale: 1 }}
            exit={{ opacity: 0, y: toast.y - 100, scale: 0.8 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '100px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(6, 214, 160, 0.9) 100%)',
              color: 'white',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '0.9375rem',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.2)',
              whiteSpace: 'nowrap',
            }}
          >
            <Zap size={16} fill="currentColor" />
            +{toast.amount} XP
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
