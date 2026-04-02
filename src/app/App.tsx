import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../shared/layout/Sidebar';
import TopBar from '../shared/layout/TopBar';
import ParticleBackground from '../shared/ui/ParticleBackground';
import XpNotification from '../shared/ui/XpNotification';
import LevelUpModal from '../shared/ui/LevelUpModal';
import QuestCompleteToast from '../shared/ui/QuestCompleteToast';
import Dashboard from '../features/dashboard/Dashboard';
import QuestBoard from '../features/quests/QuestBoard';
import AiPlanner from '../features/ai-planner/AiPlanner';
import Achievements from '../features/achievements/Achievements';
import Profile from '../features/profile/Profile';
import Landing from '../features/landing/Landing';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function AnimatedPage({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ height: '100%' }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="app-layout">
      <ParticleBackground />
      {!isLanding && <Sidebar />}
      <div className="main-area">
        {!isLanding && <TopBar />}
        <main className="page-content" style={{ padding: isLanding ? 0 : undefined, overflow: isLanding ? 'hidden' : undefined }}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
              <Route path="/quests" element={<AnimatedPage><QuestBoard /></AnimatedPage>} />
              <Route path="/planner" element={<AnimatedPage><AiPlanner /></AnimatedPage>} />
              <Route path="/achievements" element={<AnimatedPage><Achievements /></AnimatedPage>} />
              <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Overlays */}
      <XpNotification />
      <LevelUpModal />
      <QuestCompleteToast />
    </div>
  );
}

export default App;
