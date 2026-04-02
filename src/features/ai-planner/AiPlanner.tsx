import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Target, Zap, Circle } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import useStore from '../../shared/store/useStore';
import { findTemplate, generateGenericPlan } from '../../shared/lib/aiTemplates';

const suggestions = [
  'I want to start a robotics club',
  'Help me launch a YouTube channel',
  'I want to ace my college applications',
  'I want to build and launch an app',
  'Help me train for a 5K run',
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

export default function AiPlanner() {
  const chatMessages = useStore((s) => s.chatMessages);
  const addChatMessage = useStore((s) => s.addChatMessage);
  const addQuest = useStore((s) => s.addQuest);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleSend = async (text?: string) => {
    const message = text || input.trim();
    if (!message) return;

    // Add user message
    addChatMessage({
      id: `msg_${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: Date.now(),
    });
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

    // Find template or generate generic
    const template = findTemplate(message);
    const plan = template || generateGenericPlan(message);

    addChatMessage({
      id: `msg_${Date.now()}_ai`,
      role: 'ai',
      content: plan.response,
      plan: {
        title: plan.title,
        phases: plan.phases,
      },
      timestamp: Date.now(),
    });
    setIsTyping(false);
  };

  const handleAddPlanToQuests = (plan: { title: string; phases: { name: string; tasks: string[]; difficulty: string; xp: number }[] }) => {
    plan.phases.forEach((phase, i) => {
      const quest = {
        id: `q_ai_${Date.now()}_${i}`,
        title: phase.name.replace(/^[^\w]*\s*/, ''),
        description: `Part of: ${plan.title}`,
        difficulty: phase.difficulty as 'easy' | 'medium' | 'hard' | 'epic',
        xpReward: phase.xp,
        category: 'extracurricular' as const,
        subTasks: phase.tasks.map((task, j) => ({
          id: `st_ai_${Date.now()}_${i}_${j}`,
          title: task,
          completed: false,
          xpReward: Math.round(phase.xp / phase.tasks.length),
        })),
        deadline: new Date(Date.now() + (14 + i * 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 0,
        status: 'active' as const,
        createdAt: new Date().toISOString().split('T')[0],
      };
      addQuest(quest);
    });

    addChatMessage({
      id: `msg_${Date.now()}_confirm`,
      role: 'ai',
      content: `✅ Done! I've added ${plan.phases.length} quests to your Quest Board. Head over to the Quests tab to start working on them. Good luck! 🚀`,
      timestamp: Date.now(),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      {/* Messages */}
      <div className="chat-messages">
        {chatMessages.length === 0 && (
          <motion.div
            className="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ flex: 1 }}
          >
            <div className="empty-state-icon">
              <Bot size={36} />
            </div>
            <h3 className="empty-state-title">AI Quest Planner</h3>
            <p className="empty-state-text">
              Tell me your big goal and I'll break it down into manageable quests with actionable sub-tasks. Let's turn your ambition into action.
            </p>
            <div className="chat-suggestions" style={{ justifyContent: 'center', maxWidth: '500px' }}>
              {suggestions.map((s) => (
                <button
                  key={s}
                  className="chat-suggestion-chip"
                  onClick={() => handleSend(s)}
                >
                  <Sparkles size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div className={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
                {msg.content}
              </div>

              {/* Plan Card */}
              {msg.plan && (
                <motion.div
                  className="plan-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{ alignSelf: 'flex-start', maxWidth: '80%' }}
                >
                  <div className="plan-card-title">
                    <Target size={18} />
                    {msg.plan.title}
                  </div>
                  {msg.plan.phases.map((phase, i) => (
                    <div key={i} className="plan-phase">
                      <div className="plan-phase-title">
                        {phase.name}
                        <span style={{ marginLeft: '8px' }}>
                          <span className={`difficulty-badge ${phase.difficulty}`}>{phase.difficulty}</span>
                          <span className="xp-chip" style={{ marginLeft: '6px' }}>
                            <Zap size={10} /> {phase.xp} XP
                          </span>
                        </span>
                      </div>
                      {phase.tasks.map((task, j) => (
                        <div key={j} className="plan-subtask">
                          <Circle size={14} />
                          {task}
                        </div>
                      ))}
                    </div>
                  ))}
                  <button
                    className="btn btn-success btn-lg"
                    style={{ width: '100%', marginTop: 'var(--space-4)' }}
                    onClick={() => handleAddPlanToQuests(msg.plan!)}
                  >
                    <Target size={18} /> Add All to Quest Board
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell me your goal... (e.g., 'I want to start a robotics club')"
            className="chat-input"
            rows={1}
          />
          <button
            className="chat-send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            style={{ opacity: !input.trim() || isTyping ? 0.5 : 1 }}
          >
            <Send size={18} />
          </button>
        </div>
        {chatMessages.length > 0 && (
          <div className="chat-suggestions">
            {suggestions.slice(0, 3).map((s) => (
              <button
                key={s}
                className="chat-suggestion-chip"
                onClick={() => handleSend(s)}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
