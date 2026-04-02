import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const [goal, setGoal] = useState('');
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  const handleEngage = () => {
    if (!goal.trim()) return;
    setIsActive(true);
    
    // Simulate AI formulation animation duration before redirecting
    setTimeout(() => {
      // In a real implementation, we could setup a Zustand store property
      // with the parsed goal. For now, we transition to the dashboard.
      navigate('/dashboard');
    }, 2500);
  };

  return (
    <div className="landing-container">
      {/* Dynamic 3D Perspective Grid */}
      <div className="grid-overlay"></div>

      {/* Central 3D Artifact Mesh */}
      <div className="core-container">
        <div className={`core-mesh ${isActive ? 'active' : ''}`}>
          <div className="core-ring"></div>
          <div className="core-ring"></div>
          <div className="core-ring"></div>
          <div className="core-ring"></div>
          <div className="core-ring"></div>
          <div className="core-nucleus"></div>
        </div>
      </div>

      {/* Floating Glass HUD Overlay */}
      <motion.div 
        className="hud-overlay"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hud-title">Phase 1: Goal Forge</div>
        
        <div className="hud-input-container">
          <textarea 
            className="hud-input" 
            placeholder="[Input Master Objective Here]&#10;e.g., Target: Initialize Project Startup"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={isActive}
            spellCheck={false}
          />
        </div>

        <button 
          className="engage-btn" 
          onClick={handleEngage}
          disabled={!goal.trim() || isActive}
        >
          {isActive ? 'Initializing Protocol...' : 'Engage AI System'}
        </button>
      </motion.div>
    </div>
  );
};

export default Landing;
