export interface AiGoalTemplate {
  trigger: string[];
  title: string;
  phases: {
    name: string;
    tasks: string[];
    difficulty: 'easy' | 'medium' | 'hard' | 'epic';
    xp: number;
  }[];
  response: string;
}

export const aiTemplates: AiGoalTemplate[] = [
  {
    trigger: ['robotics', 'club', 'start a club'],
    title: 'Launch a Robotics Club',
    response: "Great choice! Starting a robotics club is an epic-level quest. I've broken it down into 4 manageable phases for you:",
    phases: [
      {
        name: '🔍 Research & Planning',
        tasks: ['Research school club policies', 'Identify potential faculty advisor', 'Draft club mission & goals', 'Create budget estimate'],
        difficulty: 'easy',
        xp: 80,
      },
      {
        name: '📋 Proposal & Approval',
        tasks: ['Write formal club proposal', 'Present to school administration', 'Get faculty advisor on board', 'Secure meeting room'],
        difficulty: 'medium',
        xp: 120,
      },
      {
        name: '📣 Recruitment & Launch',
        tasks: ['Design recruitment poster', 'Present at school assembly', 'Host info session', 'Enroll founding members'],
        difficulty: 'medium',
        xp: 150,
      },
      {
        name: '🚀 Build & Compete',
        tasks: ['Order robotics kit', 'Plan first build project', 'Attend first competition', 'Establish weekly meetings'],
        difficulty: 'epic',
        xp: 250,
      },
    ],
  },
  {
    trigger: ['youtube', 'channel', 'content', 'creator'],
    title: 'Launch a YouTube Channel',
    response: "Awesome! Creating a YouTube channel is a great way to build your personal brand. Here's your quest chain:",
    phases: [
      {
        name: '🎯 Channel Strategy',
        tasks: ['Choose your niche/topic', 'Research top 10 channels in your space', 'Define your unique angle', 'Plan first 10 video ideas'],
        difficulty: 'easy',
        xp: 60,
      },
      {
        name: '🛠️ Setup & Branding',
        tasks: ['Create channel & branding', 'Design logo & banner', 'Set up recording equipment', 'Learn basic video editing'],
        difficulty: 'medium',
        xp: 100,
      },
      {
        name: '🎬 First Content',
        tasks: ['Script your first video', 'Record & edit first video', 'Create thumbnail', 'Publish & share on socials'],
        difficulty: 'medium',
        xp: 120,
      },
      {
        name: '📈 Growth Phase',
        tasks: ['Post consistently (1/week)', 'Engage with comments', 'Collaborate with other creators', 'Analyze data & optimize'],
        difficulty: 'hard',
        xp: 200,
      },
    ],
  },
  {
    trigger: ['college', 'application', 'apply', 'university', 'MIT', 'Stanford', 'Harvard', 'admission'],
    title: 'Ace College Applications',
    response: "College apps can feel overwhelming, but breaking them into phases makes them totally manageable. Let's do this:",
    phases: [
      {
        name: '📊 Research & Shortlist',
        tasks: ['Create spreadsheet of target schools', 'Research admission requirements', 'Identify early action deadlines', 'Attend virtual campus tours'],
        difficulty: 'medium',
        xp: 100,
      },
      {
        name: '✍️ Essays & Materials',
        tasks: ['Brainstorm personal statement topics', 'Write first draft of Common App essay', 'Request recommendation letters', 'Prepare activity list'],
        difficulty: 'hard',
        xp: 200,
      },
      {
        name: '📝 Test Prep',
        tasks: ['Take diagnostic SAT/ACT', 'Study for 30 hours', 'Take 3 practice tests', 'Register for test date'],
        difficulty: 'hard',
        xp: 180,
      },
      {
        name: '🚀 Submit & Follow Up',
        tasks: ['Review all essays', 'Submit early action apps', 'Submit regular decision apps', 'Send thank-you notes to recommenders'],
        difficulty: 'epic',
        xp: 300,
      },
    ],
  },
  {
    trigger: ['app', 'build an app', 'startup', 'business', 'saas', 'product'],
    title: 'Build & Launch Your App',
    response: "Building your own app is one of the most rewarding things you can do as a student. Here's the roadmap:",
    phases: [
      {
        name: '💡 Ideation & Validation',
        tasks: ['Define the problem clearly', 'Interview 10 potential users', 'Research existing solutions', 'Write a 1-page concept brief'],
        difficulty: 'easy',
        xp: 80,
      },
      {
        name: '🎨 Design & Prototype',
        tasks: ['Sketch wireframes for core screens', 'Build interactive prototype', 'Get feedback from 5 people', 'Iterate on design'],
        difficulty: 'medium',
        xp: 140,
      },
      {
        name: '⚙️ Development',
        tasks: ['Set up project & tech stack', 'Build core features (MVP)', 'Test with real users', 'Fix bugs & polish UI'],
        difficulty: 'hard',
        xp: 250,
      },
      {
        name: '🚀 Launch & Grow',
        tasks: ['Deploy to production', 'Create landing page', 'Post on social media', 'Collect user feedback'],
        difficulty: 'epic',
        xp: 300,
      },
    ],
  },
  {
    trigger: ['5k', 'run', 'marathon', 'fitness', 'train'],
    title: 'Train for a 5K Run',
    response: "Running a 5K is an amazing personal goal! Here's a progressive 4-week training plan:",
    phases: [
      {
        name: '🏃 Week 1 — Foundation',
        tasks: ['Get proper running shoes', 'Walk/jog 1 mile 3x this week', 'Stretch before and after', 'Track your time'],
        difficulty: 'easy',
        xp: 60,
      },
      {
        name: '🏃 Week 2 — Build Endurance',
        tasks: ['Jog 1.5 miles 3x this week', 'Add 5 min warmup routine', 'Practice breathing technique', 'Stay hydrated'],
        difficulty: 'easy',
        xp: 80,
      },
      {
        name: '🏃 Week 3 — Push Further',
        tasks: ['Run 2 miles 3x this week', 'Run 1 interval session', 'Rest on recovery days', 'Eat a balanced diet'],
        difficulty: 'medium',
        xp: 100,
      },
      {
        name: '🏃 Week 4 — Race Ready',
        tasks: ['Run full 3.1 miles (5K)', 'Do a timed practice run', 'Plan race day logistics', 'Complete the 5K race!'],
        difficulty: 'hard',
        xp: 150,
      },
    ],
  },
];

export function findTemplate(input: string): AiGoalTemplate | null {
  const lower = input.toLowerCase();
  return aiTemplates.find(t => t.trigger.some(keyword => lower.includes(keyword))) || null;
}

export function generateGenericPlan(goal: string) {
  return {
    title: goal,
    response: `I love that goal! Here's a structured plan to help you achieve: "${goal}"`,
    phases: [
      {
        name: '🔍 Research & Define',
        tasks: ['Define what success looks like', 'Research how others did it', 'Identify key resources needed', 'Set a realistic timeline'],
        difficulty: 'easy' as const,
        xp: 80,
      },
      {
        name: '📋 Plan & Prepare',
        tasks: ['Break down into weekly milestones', 'Gather tools and materials', 'Find an accountability partner', 'Remove potential blockers'],
        difficulty: 'medium' as const,
        xp: 120,
      },
      {
        name: '⚡ Execute & Iterate',
        tasks: ['Start with the first small action', 'Track daily progress', 'Adjust plan based on learnings', 'Celebrate small wins'],
        difficulty: 'hard' as const,
        xp: 200,
      },
      {
        name: '🏆 Complete & Reflect',
        tasks: ['Final push to completion', 'Document what you learned', 'Share your achievement', 'Set your next goal'],
        difficulty: 'epic' as const,
        xp: 300,
      },
    ],
  };
}
