// Mock data for WGU CS courses and reviews

export const mockCourses = [
  {
    id: '1',
    code: 'D684',
    name: 'Introduction to Computer Science',
    credits: 4,
    description:
      'Overview of CS concepts, problem solving, and how software/hardware interact.',
    averageRating: 4.1,
    totalReviews: 62,
    averageDifficulty: 2.6,
    averageTimePerWeek: 8,
    has_project: false, // OA
  },
  {
    id: '2',
    code: 'C955',
    name: 'Applied Probability and Statistics',
    credits: 3,
    description:
      'Core statistics: descriptive stats, probability, regression, and inference for IT use.',
    averageRating: 3.9,
    totalReviews: 140,
    averageDifficulty: 2.9,
    averageTimePerWeek: 9,
    has_project: false, // OA
  },
  {
    id: '3',
    code: 'D278',
    name: 'Scripting and Programming - Foundations',
    credits: 3,
    description:
      'Programming basics and logic with simple scripts and control structures.',
    averageRating: 4.0,
    totalReviews: 120,
    averageDifficulty: 2.8,
    averageTimePerWeek: 9,
    has_project: false, // OA
  },
  {
    id: '4',
    code: 'D426',
    name: 'Data Management - Foundations',
    credits: 3,
    description:
      'Relational concepts, modeling, normalization, and SQL fundamentals.',
    averageRating: 3.8,
    totalReviews: 115,
    averageDifficulty: 3.0,
    averageTimePerWeek: 10,
    has_project: false, // OA
  },
  {
    id: '5',
    code: 'D315',
    name: 'Network and Security - Foundations',
    credits: 3,
    description:
      'Networking models, protocols, and basic security concepts for IT systems.',
    averageRating: 3.7,
    totalReviews: 88,
    averageDifficulty: 2.9,
    averageTimePerWeek: 9,
    has_project: false, // OA
  },
  {
    id: '6',
    code: 'C958',
    name: 'Calculus I',
    credits: 4,
    description:
      'Limits, derivatives, and integrals with applications relevant to computing.',
    averageRating: 3.8,
    totalReviews: 96,
    averageDifficulty: 3.8,
    averageTimePerWeek: 14,
    has_project: false, // OA
  },
  {
    id: '7',
    code: 'D276',
    name: 'Web Development Foundations',
    credits: 3,
    description: 'HTML, CSS, and basic web-building principles.',
    averageRating: 4.0,
    totalReviews: 90,
    averageDifficulty: 2.5,
    averageTimePerWeek: 8,
    has_project: false, // OA
  },
  {
    id: '8',
    code: 'D427',
    name: 'Data Management - Applications',
    credits: 4,
    description:
      'Applied SQL queries, joins, stored routines, and practical data tasks.',
    averageRating: 3.9,
    totalReviews: 110,
    averageDifficulty: 3.2,
    averageTimePerWeek: 11,
    has_project: false, // OA
  },
  {
    id: '9',
    code: 'D197',
    name: 'Version Control',
    credits: 1,
    description:
      'Git essentials: repos, branching, merging, and collaboration workflows.',
    averageRating: 4.3,
    totalReviews: 80,
    averageDifficulty: 1.7,
    averageTimePerWeek: 5,
    has_project: true, // PA-like tasks
  },
  {
    id: '10',
    code: 'D685',
    name: 'Practical Applications of Prompt',
    credits: 2,
    description:
      'Using AI tools effectively: prompting, evaluation, and responsible use.',
    averageRating: 4.2,
    totalReviews: 52,
    averageDifficulty: 1.8,
    averageTimePerWeek: 6,
    has_project: true, // PA
  },
  {
    id: '11',
    code: 'C867',
    name: 'Scripting and Programming - Applications',
    credits: 4,
    description:
      'Applied programming projects that reinforce software construction skills.',
    averageRating: 4.2,
    totalReviews: 150,
    averageDifficulty: 3.2,
    averageTimePerWeek: 12,
    has_project: true, // PA
  },
  {
    id: '12',
    code: 'D459',
    name: 'Introduction to Systems Thinking and Applications',
    credits: 3,
    description:
      'Modeling complex systems, feedback loops, and holistic problem analysis.',
    averageRating: 3.8,
    totalReviews: 60,
    averageDifficulty: 2.6,
    averageTimePerWeek: 8,
    has_project: true, // PA
  },
  {
    id: '13',
    code: 'C959',
    name: 'Discrete Mathematics I',
    credits: 4,
    description: 'Logic, sets, functions, counting, and proofs for computing.',
    averageRating: 3.9,
    totalReviews: 130,
    averageDifficulty: 3.5,
    averageTimePerWeek: 12,
    has_project: false, // OA
  },
  {
    id: '14',
    code: 'D268',
    name: 'Introduction to Communication: Connecting with Others',
    credits: 3,
    description:
      'Professional communication, presentations, and message design.',
    averageRating: 4.1,
    totalReviews: 105,
    averageDifficulty: 2.3,
    averageTimePerWeek: 7,
    has_project: true, // PA
  },
  {
    id: '15',
    code: 'C952',
    name: 'Computer Architecture',
    credits: 3,
    description:
      'Processors, memory, I/O, and performance within modern architectures.',
    averageRating: 3.7,
    totalReviews: 95,
    averageDifficulty: 3.3,
    averageTimePerWeek: 11,
    has_project: false, // OA
  },
  {
    id: '16',
    code: 'C683',
    name: 'Natural Science Lab',
    credits: 2,
    description:
      'Hands-on lab activities and reporting across general science topics.',
    averageRating: 3.9,
    totalReviews: 70,
    averageDifficulty: 2.2,
    averageTimePerWeek: 7,
    has_project: true, // PA (lab reports)
  },
  {
    id: '17',
    code: 'D286',
    name: 'Java Fundamentals',
    credits: 3,
    description: 'Core Java syntax, OOP, and basic application building.',
    averageRating: 4.0,
    totalReviews: 145,
    averageDifficulty: 3.1,
    averageTimePerWeek: 11,
    has_project: true, // PA
  },
  {
    id: '18',
    code: 'C960',
    name: 'Discrete Mathematics II',
    credits: 4,
    description: 'Graphs, trees, recurrence, and complexity foundations.',
    averageRating: 3.8,
    totalReviews: 120,
    averageDifficulty: 3.6,
    averageTimePerWeek: 13,
    has_project: false, // OA
  },
  {
    id: '19',
    code: 'D270',
    name: 'Composition: Successful Self-Expression',
    credits: 3,
    description: 'Academic writing, argumentation, and revision strategies.',
    averageRating: 4.0,
    totalReviews: 84,
    averageDifficulty: 2.2,
    averageTimePerWeek: 7,
    has_project: true, // PA
  },
  {
    id: '20',
    code: 'C963',
    name: 'American Politics and the US Constitution',
    credits: 3,
    description:
      'US political institutions, constitutional principles, and civic processes.',
    averageRating: 3.7,
    totalReviews: 100,
    averageDifficulty: 2.4,
    averageTimePerWeek: 7,
    has_project: false, // OA
  },
  {
    id: '21',
    code: 'D287',
    name: 'Java Frameworks',
    credits: 3,
    description:
      'Building Java apps with frameworks and patterns (e.g., Spring).',
    averageRating: 4.1,
    totalReviews: 118,
    averageDifficulty: 3.3,
    averageTimePerWeek: 13,
    has_project: true, // PA
  },
  {
    id: '22',
    code: 'D281',
    name: 'Linux Foundations',
    credits: 3,
    description:
      'Linux CLI, filesystems, permissions, and basic administration.',
    averageRating: 3.9,
    totalReviews: 90,
    averageDifficulty: 2.7,
    averageTimePerWeek: 9,
    has_project: false, // OA
  },
  {
    id: '23',
    code: 'D430',
    name: 'Fundamentals of Information Security',
    credits: 3,
    description: 'Security principles, threats, controls, and risk basics.',
    averageRating: 3.9,
    totalReviews: 92,
    averageDifficulty: 2.8,
    averageTimePerWeek: 9,
    has_project: false, // OA
  },
  {
    id: '24',
    code: 'D288',
    name: 'Back-End Programming',
    credits: 3,
    description: 'Server-side programming, APIs, and data access patterns.',
    averageRating: 4.2,
    totalReviews: 110,
    averageDifficulty: 3.4,
    averageTimePerWeek: 13,
    has_project: true, // PA
  },
  {
    id: '25',
    code: 'D686',
    name: 'Operating Systems for Computer Scientists',
    credits: 3,
    description:
      'Processes, threads, memory, scheduling, and OS design tradeoffs.',
    averageRating: 3.8,
    totalReviews: 101,
    averageDifficulty: 3.4,
    averageTimePerWeek: 12,
    has_project: false, // OA
  },
  {
    id: '26',
    code: 'D387',
    name: 'Advanced Java',
    credits: 3,
    description: 'Multithreading, deployment, and advanced OOP in Java.',
    averageRating: 4.0,
    totalReviews: 97,
    averageDifficulty: 3.5,
    averageTimePerWeek: 14,
    has_project: true, // PA
  },
  {
    id: '27',
    code: 'D333',
    name: 'Ethics in Technology',
    credits: 3,
    description:
      'Ethical frameworks, policy, and societal impacts of technology.',
    averageRating: 3.6,
    totalReviews: 160,
    averageDifficulty: 2.7,
    averageTimePerWeek: 8,
    has_project: true, // PA (writing)
  },
  {
    id: '28',
    code: 'C949',
    name: 'Data Structures and Algorithms I',
    credits: 4,
    description:
      'Lists, stacks, queues, trees, hashing; big-O and OOP design; implement small apps.',
    averageRating: 4.1,
    totalReviews: 220,
    averageDifficulty: 3.9,
    averageTimePerWeek: 15,
    has_project: false, // OA
  },
  {
    id: '29',
    code: 'D336',
    name: 'Business of IT - Applications',
    credits: 4,
    description: 'ITIL-style service management practices and value delivery.',
    averageRating: 3.8,
    totalReviews: 85,
    averageDifficulty: 2.4,
    averageTimePerWeek: 8,
    has_project: false, // OA
  },
  {
    id: '30',
    code: 'D284',
    name: 'Software Engineering',
    credits: 4,
    description:
      'Software processes, requirements, design, and quality fundamentals.',
    averageRating: 3.9,
    totalReviews: 210,
    averageDifficulty: 3.1,
    averageTimePerWeek: 10,
    has_project: false, // OA (concepts-focused)
  },
  {
    id: '31',
    code: 'C458',
    name: 'Health, Fitness, and Wellness',
    credits: 4,
    description: 'Personal wellness concepts and health literacy.',
    averageRating: 3.7,
    totalReviews: 70,
    averageDifficulty: 2.0,
    averageTimePerWeek: 7,
    has_project: false, // OA
  },
  {
    id: '32',
    code: 'C950',
    name: 'Data Structures and Algorithms II',
    credits: 4,
    description:
      'Graphs, hashing, self-adjusting structures, dynamic programming, NP-completeness.',
    averageRating: 4.0,
    totalReviews: 180,
    averageDifficulty: 4.1,
    averageTimePerWeek: 16,
    has_project: false, // OA
  },
  {
    id: '33',
    code: 'D480',
    name: 'Software Design and Quality Assurance',
    credits: 3,
    description:
      'Design tradeoffs, architectural reasoning, and rigorous QA/verification artifacts.',
    averageRating: 3.7,
    totalReviews: 190,
    averageDifficulty: 3.8,
    averageTimePerWeek: 14,
    has_project: true, // PA
  },
  {
    id: '34',
    code: 'D429',
    name: 'Introduction to AI for Computer Scientists',
    credits: 2,
    description:
      'AI history, terminology, ethics, and high-level reasoning/knowledge concepts.',
    averageRating: 4.1,
    totalReviews: 75,
    averageDifficulty: 2.5,
    averageTimePerWeek: 7,
    has_project: true, // PA
  },
  {
    id: '35',
    code: 'D682',
    name: 'Artificial Intelligence Optimization for Computer Scientists',
    credits: 3,
    description:
      'Implementing and tuning AI approaches; testing and adapting models for scenarios.',
    averageRating: 4.1,
    totalReviews: 68,
    averageDifficulty: 3.2,
    averageTimePerWeek: 11,
    has_project: true, // PA
  },
  {
    id: '36',
    code: 'D683',
    name: 'Advanced AI and ML',
    credits: 3,
    description:
      'Plan and deliver a functional ML/AI product addressing a business problem.',
    averageRating: 4.2,
    totalReviews: 60,
    averageDifficulty: 3.4,
    averageTimePerWeek: 12,
    has_project: true, // PA
  },
  {
    id: '37',
    code: 'D687',
    name: 'Computer Science Project Development with a Team',
    credits: 3,
    description:
      'Team artifacts and executive/technical proposal packaging for a prior project.',
    averageRating: 4.3,
    totalReviews: 72,
    averageDifficulty: 3.0,
    averageTimePerWeek: 12,
    has_project: true, // PA (capstone-style team deliverables)
  },
  ];
  
  export const mockReviews = [
    {
      id: "1",
      courseId: "28",
      userId: "user1",
      userName: "Sarah Johnson",
      userAvatar: "SJ",
      rating: 5,
      difficulty: 4,
      timePerWeek: 15,
      content: "This course was challenging but incredibly rewarding. The algorithm problems really helped solidify my understanding. Make sure you practice every day!",
      tips: "Use LeetCode alongside the course material. The PA can be tough if you don't practice regularly.",
      upvotes: 24,
      downvotes: 2,
      createdAt: "2024-10-15",
    },
    {
      id: "2",
      courseId: "28",
      userId: "user2",
      userName: "Mike Chen",
      userAvatar: "MC",
      rating: 4,
      difficulty: 3,
      timePerWeek: 12,
      content: "Great introduction to DSA. The course material is comprehensive. Finished in about 3 weeks with prior experience.",
      tips: "Review Big O notation thoroughly. It's essential for the exam.",
      upvotes: 18,
      downvotes: 1,
      createdAt: "2024-09-20",
    },
    {
      id: "3",
      courseId: "28",
      userId: "user3",
      userName: "Emily Rodriguez",
      userAvatar: "ER",
      rating: 3,
      difficulty: 4,
      timePerWeek: 20,
      content: "The course is good but I found the pacing to be fast. Make sure you have a solid foundation before starting.",
      tips: "Don't skip the zyBooks activities. They're tedious but helpful.",
      upvotes: 12,
      downvotes: 3,
      createdAt: "2024-08-10",
    },
    {
      id: "4",
      courseId: "2",
      userId: "user4",
      userName: "David Kim",
      userAvatar: "DK",
      rating: 5,
      difficulty: 2,
      timePerWeek: 10,
      content: "Perfect starting course! Very beginner-friendly and the instructor is excellent. Completed in 2 weeks.",
      tips: "Take good notes. The concepts here are foundational for everything else.",
      upvotes: 30,
      downvotes: 0,
      createdAt: "2024-10-01",
    },
    {
      id: "5",
      courseId: "1",
      userId: "user5",
      userName: "Jessica Brown",
      userAvatar: "JB",
      rating: 4,
      difficulty: 3,
      timePerWeek: 15,
      content: "Good overview of CS fundamentals. Some parts felt rushed but overall solid introduction.",
      tips: "Join the Discord study group. Very helpful community!",
      upvotes: 15,
      downvotes: 1,
      createdAt: "2024-09-12",
    },
    {
      id: "6",
      courseId: "11",
      userId: "user6",
      userName: "Alex Turner",
      userAvatar: "AT",
      rating: 4,
      difficulty: 4,
      timePerWeek: 18,
      content: "C++ can be tricky if you're coming from Python. The PA is comprehensive and tests everything.",
      tips: "Master pointers and memory management early. Use debugging tools liberally.",
      upvotes: 22,
      downvotes: 2,
      createdAt: "2024-08-25",
    },
  ];
  
  export const mockResources = [
    {
      id: "1",
      courseId: "28",
      title: "LeetCode Patterns Guide",
      url: "https://leetcode.com/discuss/study-guide",
    },
    {
      id: "2",
      courseId: "28",
      title: "Big O Notation Cheat Sheet",
      url: "https://www.bigocheatsheet.com",
    },
    {
      id: "3",
      courseId: "28",
      title: "Visualgo - Algorithm Visualizations",
      url: "https://visualgo.net",
    },
    {
      id: "4",
      courseId: "1",
      title: "CS50 Lectures",
      url: "https://cs50.harvard.edu",
    },
    {
      id: "5",
      courseId: "11",
      title: "Learn C++ Tutorial",
      url: "https://www.learncpp.com",
    },
  ];
