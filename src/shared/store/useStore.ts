import { create } from 'zustand';
import type { Quest, Achievement, UserProfile, ChatMessage } from '../../types';
import { sampleQuests, sampleAchievements, initialProfile } from '../mock/sampleData';


interface AppStore {
  // User
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Quests
  quests: Quest[];
  addQuest: (quest: Quest) => void;
  toggleSubTask: (questId: string, subTaskId: string) => void;
  completeQuest: (questId: string) => void;

  // Achievements
  achievements: Achievement[];
  unlockAchievement: (achievementId: string) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;

  // UI State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  questFilter: string;
  setQuestFilter: (filter: string) => void;
  selectedQuest: Quest | null;
  setSelectedQuest: (quest: Quest | null) => void;

  // XP system
  gainXp: (amount: number) => void;
}

const useStore = create<AppStore>((set, get) => ({
  // User
  profile: initialProfile,
  updateProfile: (updates) =>
    set((state) => ({ profile: { ...state.profile, ...updates } })),

  // Quests
  quests: sampleQuests,
  addQuest: (quest) =>
    set((state) => ({ quests: [quest, ...state.quests] })),

  toggleSubTask: (questId, subTaskId) =>
    set((state) => {
      const quests = state.quests.map((q) => {
        if (q.id !== questId) return q;
        const subTasks = q.subTasks.map((st) =>
          st.id === subTaskId ? { ...st, completed: !st.completed } : st
        );
        const completedCount = subTasks.filter((st) => st.completed).length;
        const progress = Math.round((completedCount / subTasks.length) * 100);

        // If a subtask just got completed, gain XP
        const oldSubTask = q.subTasks.find((st) => st.id === subTaskId);
        if (oldSubTask && !oldSubTask.completed) {
          setTimeout(() => get().gainXp(oldSubTask.xpReward), 0);
        }

        return { ...q, subTasks, progress };
      });
      return { quests };
    }),

  completeQuest: (questId) =>
    set((state) => {
      const quests = state.quests.map((q) =>
        q.id === questId
          ? { ...q, status: 'completed' as const, progress: 100, subTasks: q.subTasks.map(st => ({ ...st, completed: true })) }
          : q
      );
      const quest = state.quests.find((q) => q.id === questId);
      if (quest) {
        const remainingXp = quest.subTasks
          .filter((st) => !st.completed)
          .reduce((acc, st) => acc + st.xpReward, 0);
        setTimeout(() => get().gainXp(remainingXp), 0);
        setTimeout(() => {
          set((s) => ({
            profile: {
              ...s.profile,
              questsCompleted: s.profile.questsCompleted + 1,
            },
          }));
        }, 0);
      }
      return { quests };
    }),

  // Achievements
  achievements: sampleAchievements,
  unlockAchievement: (achievementId) =>
    set((state) => ({
      achievements: state.achievements.map((a) =>
        a.id === achievementId
          ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
          : a
      ),
    })),

  // Chat
  chatMessages: [],
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),
  clearChat: () => set({ chatMessages: [] }),

  // UI State
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),
  questFilter: 'all',
  setQuestFilter: (filter) => set({ questFilter: filter }),
  selectedQuest: null,
  setSelectedQuest: (quest) => set({ selectedQuest: quest }),

  // XP system
  gainXp: (amount) =>
    set((state) => {
      let newXp = state.profile.xp + amount;
      let newLevel = state.profile.level;
      let newXpToNext = state.profile.xpToNextLevel;
      const newTotalXp = state.profile.totalXp + amount;

      // Level up logic
      while (newXp >= newXpToNext) {
        newXp -= newXpToNext;
        newLevel += 1;
        newXpToNext = Math.floor(newXpToNext * 1.15); // 15% more XP needed each level
      }

      return {
        profile: {
          ...state.profile,
          xp: newXp,
          level: newLevel,
          xpToNextLevel: newXpToNext,
          totalXp: newTotalXp,
        },
      };
    }),
}));

export default useStore;
