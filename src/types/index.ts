export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  xpReward: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'epic';
  xpReward: number;
  category: 'academics' | 'extracurricular' | 'personal' | 'college-prep';
  subTasks: SubTask[];
  deadline: string;
  progress: number;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: string;
  requirement: string;
}

export interface UserProfile {
  name: string;
  tagline: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  streak: number;
  questsCompleted: number;
  joinedDate: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  plan?: {
    title: string;
    phases: {
      name: string;
      tasks: string[];
      difficulty: string;
      xp: number;
    }[];
  };
  timestamp: number;
}
