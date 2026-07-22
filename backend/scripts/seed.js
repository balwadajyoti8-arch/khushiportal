const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Company = require('../models/Company');
const QuestionReference = require('../models/QuestionReference');
const MCQ = require('../models/MCQ');
const UserQuestionProgress = require('../models/UserQuestionProgress');
const Bookmark = require('../models/Bookmark');
const Note = require('../models/Note');
const MockInterview = require('../models/MockInterview');
const ActivityLog = require('../models/ActivityLog');
const Topic = require('../models/Topic');

dotenv.config();

// Pre-defined Companies
const companiesData = [
  {
    name: 'Google',
    logo: 'FcGoogle',
    description: 'A global technology leader focused on search, cloud computing, advertising, and AI.',
    tags: ['MAANG', 'Search', 'Cloud', 'AI'],
    preparationTips: [
      'Focus heavily on Data Structures & Algorithms, especially Graphs, Trees, and DP.',
      'Practice writing clean, optimal code on whiteboards or plain text editors.',
      'Google values Googleyness and behavioral alignment, be prepared for leadership questions.',
      'Understand time and space complexity constraints inside out.'
    ],
    interviewExperiences: [
      {
        title: 'Software Engineer L3 Interview Experience',
        author: 'Rahul Sharma',
        role: 'SWE L3',
        year: '2025',
        content: 'There were 1 online assessment and 4 technical rounds. The technical rounds focused on Graph traversal (BFS/DFS), Binary Tree optimization, and dynamic programming. 1 round was Googleyness & Leadership. Got the offer!',
        status: 'Offered'
      },
      {
        title: 'Site Reliability Engineer Interview Experience',
        author: 'Priya Patel',
        role: 'SRE-SWE',
        year: '2025',
        content: 'Rounds focused heavily on OS, networking concepts, and coding. Coding questions were medium level LeetCode questions about system architecture. Rejected in the hiring committee round.',
        status: 'Rejected'
      }
    ]
  },
  {
    name: 'Amazon',
    logo: 'FaAmazon',
    description: 'E-commerce giant, cloud computing pioneer, and digital streaming powerhouse.',
    tags: ['MAANG', 'E-Commerce', 'Cloud', 'AWS'],
    preparationTips: [
      'Amazon Leadership Principles (LPs) are extremely critical; align your behavioral answers with them.',
      'Prepare for system design questions, particularly on databases, load balancing, and scalability.',
      'Coding topics: Trees, BFS/DFS, Heaps, HashMaps, and Arrays.',
      'Practice writing production-ready code with clean variables.'
    ],
    interviewExperiences: [
      {
        title: 'SDE-1 Placement Drive',
        author: 'Amit Kumar',
        role: 'SDE 1',
        year: '2026',
        content: 'OA had 2 coding questions. Technical Interview 1 was about trees (Lowest Common Ancestor), and Technical Interview 2 was System Design of a Parking Lot. Behavioral questions based on LPs were asked throughout. Got offered!',
        status: 'Offered'
      }
    ]
  },
  {
    name: 'Microsoft',
    logo: 'FaWindows',
    description: 'A global leader in software, services, devices, and cloud solutions.',
    tags: ['MAANG', 'Software', 'Enterprise', 'Azure'],
    preparationTips: [
      'Focus on Arrays, Strings, Linked Lists, Trees, and System Design.',
      'Microsoft loves low-level details (pointers, memory management, OOP).',
      'Be clear in your thought process; explain your approach before coding.'
    ],
    interviewExperiences: [
      {
        title: 'SDE-2 Offcampus',
        author: 'Sneha Reddy',
        role: 'SDE 2',
        year: '2025',
        content: '3 technical rounds and 1 HM round. Question types: Linked List cycle detection, LRU cache implementation, and building a distributed logger. Clean and optimal solution was expected.',
        status: 'Offered'
      }
    ]
  },
  {
    name: 'Adobe',
    logo: 'SiAdobe',
    description: 'Leader in creative software, digital marketing tools, and document management.',
    tags: ['Product', 'Creative', 'PDF', 'SaaS'],
    preparationTips: [
      'Prepare C++ OOPs concepts, OS, and memory management.',
      'Common topics: Trees, Linked Lists, Stack, and DP.',
      'Aptitude test is usually part of the initial screening.'
    ],
    interviewExperiences: [
      {
        title: 'MTS-1 Campus Placement',
        author: 'Vikram Singh',
        role: 'Member of Tech Staff 1',
        year: '2026',
        content: 'Rounds included Aptitude+Coding OA, and 3 interview rounds. The technical questions were on matrix manipulation, stack design, and deep OS questions (virtual memory, page replacement).',
        status: 'Offered'
      }
    ]
  },
  {
    name: 'Oracle',
    logo: 'SiOracle',
    description: 'Database technology pioneer and enterprise cloud application giant.',
    tags: ['Enterprise', 'Database', 'Cloud', 'Java'],
    preparationTips: [
      'Excellent command over SQL, DBMS, Database normalization, and indexing is a must.',
      'Practice Recursion, Backtracking, and Binary Trees.',
      'OS concepts (deadlocks, threads) are frequently asked.'
    ],
    interviewExperiences: [
      {
        title: 'Member of Technical Staff',
        author: 'Arjun Sen',
        role: 'MTS',
        year: '2025',
        content: 'Standard process. DB queries were detailed, including complex joins and triggers. Coding questions were of moderate difficulty (e.g. Reverse Linked List in groups of K).',
        status: 'Offered'
      }
    ]
  },
  {
    name: 'TCS',
    logo: 'FaBuilding',
    description: 'Global IT services, consulting, and business solutions organization.',
    tags: ['Service', 'Consulting', 'Global'],
    preparationTips: [
      'Prepare Aptitude, Basic C/C++/Java programming, and DBMS.',
      'Know your final year project thoroughly.',
      'Be confident, clear, and possess good communication skills.'
    ],
    interviewExperiences: [
      {
        title: 'TCS Digital Recruitment',
        author: 'Kunal Das',
        role: 'System Engineer (Digital)',
        year: '2026',
        content: 'OA had aptitude, verbal, and coding. Interview had Technical, HR, and MR combined. Asked basic Java OOPs, difference between DBMS and RDBMS, and a simple coding question (find prime numbers).',
        status: 'Offered'
      }
    ]
  },
  {
    name: 'Infosys',
    logo: 'FaBuilding',
    description: 'A global leader in next-generation digital services and consulting.',
    tags: ['Service', 'Consulting', 'IT'],
    preparationTips: [
      'Practice Aptitude, Logical Reasoning, and Pseudocodes.',
      'Learn OOPs, DBMS (SQL queries), and basic Web development (HTML/CSS).',
      'InfyTQ coding standard is medium difficulty.'
    ],
    interviewExperiences: [
      {
        title: 'System Engineer Specialist',
        author: 'Meera Nair',
        role: 'SES',
        year: '2025',
        content: 'Focus on coding. The interview had questions on sorting algorithms, difference between abstract class and interface, and basic database normalization.',
        status: 'Offered'
      }
    ]
  },
  {
    name: 'Wipro',
    logo: 'FaBuilding',
    description: 'Leading global information technology, consulting, and business process services company.',
    tags: ['Service', 'Consulting', 'Tech'],
    preparationTips: [
      'Focus on basic coding questions (Palindrome, Fibonacci, Prime, Matrix sorting).',
      'Prepare OOPs, DBMS, and basic computer networks concepts.',
      'Wipro Elite NTH features moderate difficulty aptitude and coding.'
    ],
    interviewExperiences: [
      {
        title: 'Wipro Elite Candidate',
        author: 'Rajesh V',
        role: 'Project Engineer',
        year: '2025',
        content: 'Aptitude test, basic coding, and 1 combined Tech+HR interview. Very simple questions on string reversal, final year project, and readiness to relocate.',
        status: 'Offered'
      }
    ]
  },
  {
    name: 'Accenture',
    logo: 'SiAccenture',
    description: 'Professional services company providing strategy, consulting, digital, and technology solutions.',
    tags: ['Consulting', 'Service', 'Strategy'],
    preparationTips: [
      'Cognitive and technical assessment contains MS Office, Networks, and Pseudocode questions.',
      'Practice coding on basic strings and arrays.',
      'Behavioral interview is friendly, focus on communication.'
    ],
    interviewExperiences: [
      {
        title: 'Accenture ASE Drive',
        author: 'Nisha Gupta',
        role: 'Associate Software Engineer',
        year: '2026',
        content: 'OA was online, standard cognitive, pseudocode, and coding. Interview focused on final year project, some basic database queries, and soft skills.',
        status: 'Offered'
      }
    ]
  },
  {
    name: 'Capgemini',
    logo: 'FaBuilding',
    description: 'Global leader in partnering with companies to transform and manage their business through technology.',
    tags: ['Service', 'Consulting', 'Enterprise'],
    preparationTips: [
      'Prepare Game-based aptitude, English communication, and pseudo-code rounds.',
      'Coding: Strings, arrays, recursion.',
      'OOPs concept details (overloading vs overriding).'
    ],
    interviewExperiences: [
      {
        title: 'Analyst Offcampus',
        author: 'Pranav M',
        role: 'Software Analyst',
        year: '2025',
        content: 'Rounds: Pseudo-code, English, and game-based aptitude. The interview was brief, focused on basic coding concepts (Factorial, Fibonacci) and project discussion.',
        status: 'Offered'
      }
    ]
  },
  {
    name: 'IBM',
    logo: 'FaBuilding',
    description: 'Multinational technology company known for cloud, cognitive software, and mainframe computing.',
    tags: ['Enterprise', 'Hardware', 'Cloud', 'AI'],
    preparationTips: [
      'Practice IPAT (cognitive capability assessment) if applicable.',
      'Focus on DBMS, Operating Systems, and OOPs.',
      'Practice LeetCode Easy/Medium coding.'
    ],
    interviewExperiences: [
      {
        title: 'Associate System Engineer',
        author: 'Dinesh K',
        role: 'Associate SWE',
        year: '2025',
        content: 'Initial assessment had cognitive games and coding. Interview had 1 Tech and 1 HR. Asked about DBMS concepts, difference between compiler and interpreter, and a coding question on removing duplicates.',
        status: 'Offered'
      }
    ]
  },
  {
    name: 'Cognizant',
    logo: 'FaBuilding',
    description: 'Multinational technology company providing IT, consulting, and business process outsourcing.',
    tags: ['Service', 'Consulting', 'IT'],
    preparationTips: [
      'Focus on basic coding, relational databases, and OOPs.',
      'GenC Next drive requires strong coding in data structures.',
      'Communication and resume walkthrough are important.'
    ],
    interviewExperiences: [
      {
        title: 'GenC Next Interview',
        author: 'Aakash R',
        role: 'Programmer Analyst Trainee',
        year: '2026',
        content: 'Rounds: Coding Assessment + Tech Interview + HR. Asked coding question on sliding window, and SQL query to find second highest salary.',
        status: 'Offered'
      }
    ]
  }
];

// Topics Data
const topicsData = [
  { name: 'Arrays', description: 'Array manipulation and algorithms', icon: 'Grid', color: '#8B5CF6', order: 1 },
  { name: 'Strings', description: 'String processing and algorithms', icon: 'Type', color: '#EC4899', order: 2 },
  { name: 'Linked List', description: 'Linked list data structure', icon: 'Link', color: '#10B981', order: 3 },
  { name: 'Stack', description: 'Stack data structure', icon: 'Layers', color: '#F59E0B', order: 4 },
  { name: 'Queue', description: 'Queue data structure', icon: 'List', color: '#3B82F6', order: 5 },
  { name: 'Trees', description: 'Tree data structures', icon: 'TreePine', color: '#059669', order: 6 },
  { name: 'Graphs', description: 'Graph algorithms', icon: 'Network', color: '#6366F1', order: 7 },
  { name: 'DP', description: 'Dynamic Programming', icon: 'Zap', color: '#8B5CF6', order: 8 },
  { name: 'Greedy', description: 'Greedy algorithms', icon: 'Target', color: '#EC4899', order: 9 },
  { name: 'Binary Search', description: 'Binary search algorithms', icon: 'Search', color: '#10B981', order: 10 },
  { name: 'Recursion', description: 'Recursive algorithms', icon: 'RefreshCw', color: '#F59E0B', order: 11 },
  { name: 'Backtracking', description: 'Backtracking algorithms', icon: 'Undo', color: '#3B82F6', order: 12 },
  { name: 'Sorting', description: 'Sorting algorithms', icon: 'ArrowUpDown', color: '#059669', order: 13 },
  { name: 'Searching', description: 'Searching algorithms', icon: 'Search', color: '#6366F1', order: 14 },
  { name: 'Hashing', description: 'Hash tables and hashing', icon: 'Hash', color: '#8B5CF6', order: 15 },
  { name: 'Math', description: 'Mathematical algorithms', icon: 'Calculator', color: '#EC4899', order: 16 },
  { name: 'Bit Manipulation', description: 'Bit manipulation', icon: 'Binary', color: '#10B981', order: 17 },
  { name: 'OOP', description: 'Object Oriented Programming', icon: 'Package', color: '#F59E0B', order: 18 },
  { name: 'DBMS', description: 'Database Management Systems', icon: 'Database', color: '#3B82F6', order: 19 },
  { name: 'OS', description: 'Operating Systems', icon: 'Cpu', color: '#059669', order: 20 },
  { name: 'CN', description: 'Computer Networks', icon: 'Globe', color: '#6366F1', order: 21 },
  { name: 'Aptitude', description: 'Aptitude and reasoning', icon: 'Brain', color: '#8B5CF6', order: 22 },
];

// Platforms List
const platforms = ['LeetCode', 'GeeksforGeeks', 'HackerRank', 'CodeStudio', 'InterviewBit', 'CodeChef'];
const platformUrls = {
  LeetCode: 'https://leetcode.com/problems/',
  GeeksforGeeks: 'https://practice.geeksforgeeks.org/problems/',
  HackerRank: 'https://www.hackerrank.com/challenges/',
  CodeStudio: 'https://www.naukri.com/code360/problems/',
  InterviewBit: 'https://www.interviewbit.com/problems/',
  CodeChef: 'https://www.codechef.com/problems/'
};

// Seeding 200 coding questions
const generateCodingQuestions = async (topicMap) => {
  const list = [];
  const templates = [
    { title: 'Two Sum', baseSlug: 'two-sum', diff: 'Easy', top: 'Arrays' },
    { title: 'Reverse Linked List', baseSlug: 'reverse-linked-list', diff: 'Easy', top: 'Linked List' },
    { title: 'Valid Parentheses', baseSlug: 'valid-parentheses', diff: 'Easy', top: 'Stack' },
    { title: 'Merge Sorted Array', baseSlug: 'merge-sorted-array', diff: 'Easy', top: 'Arrays' },
    { title: 'Binary Search', baseSlug: 'binary-search', diff: 'Easy', top: 'Binary Search' },
    { title: 'LRU Cache', baseSlug: 'lru-cache', diff: 'Hard', top: 'Linked List' },
    { title: 'Longest Common Subsequence', baseSlug: 'longest-common-subsequence', diff: 'Medium', top: 'DP' },
    { title: '3Sum', baseSlug: '3sum', diff: 'Medium', top: 'Arrays' },
    { title: 'Number of Islands', baseSlug: 'number-of-islands', diff: 'Medium', top: 'Graphs' },
    { title: 'Valid Anagram', baseSlug: 'valid-anagram', diff: 'Easy', top: 'Strings' },
    { title: 'Search in Rotated Sorted Array', baseSlug: 'search-in-rotated-sorted-array', diff: 'Medium', top: 'Binary Search' },
    { title: 'Climbing Stairs', baseSlug: 'climbing-stairs', diff: 'Easy', top: 'DP' },
    { title: 'Fibonacci Number', baseSlug: 'fibonacci-number', diff: 'Easy', top: 'Recursion' },
    { title: 'N-Queens', baseSlug: 'n-queens', diff: 'Hard', top: 'Backtracking' },
    { title: 'Merge Intervals', baseSlug: 'merge-intervals', diff: 'Medium', top: 'Sorting' },
    { title: 'Find Peak Element', baseSlug: 'find-peak-element', diff: 'Medium', top: 'Binary Search' },
    { title: 'Word Search', baseSlug: 'word-search', diff: 'Medium', top: 'Backtracking' },
    { title: 'Implement Stack using Queues', baseSlug: 'implement-stack-using-queues', diff: 'Easy', top: 'Queue' },
    { title: 'Lowest Common Ancestor of a Binary Tree', baseSlug: 'lowest-common-ancestor-of-a-binary-tree', diff: 'Medium', top: 'Trees' },
    { title: 'Serialize and Deserialize Binary Tree', baseSlug: 'serialize-and-deserialize-binary-tree', diff: 'Hard', top: 'Trees' }
  ];

  const topicNames = Object.keys(topicMap);

  // We loop to generate 200 questions
  for (let i = 1; i <= 200; i++) {
    const template = templates[(i - 1) % templates.length];
    const topicName = topicNames[(i - 1) % topicNames.length];
    const topicId = topicMap[topicName];
    
    // Determine difficulty based on topic/index
    let difficulty = 'Medium';
    if (i % 3 === 1) difficulty = 'Easy';
    else if (i % 5 === 0) difficulty = 'Hard';

    const platform = platforms[i % platforms.length];
    const slug = `${template.baseSlug}-${i}`;
    const url = platformUrls[platform] + slug;

    // Distribute among companies
    const numCompanies = (i % 3) + 1; // 1 to 3 companies
    const assignedCompanies = [];
    for (let c = 0; c < numCompanies; c++) {
      const compName = companiesData[(i + c) % companiesData.length].name;
      if (!assignedCompanies.includes(compName)) {
        assignedCompanies.push(compName);
      }
    }

    list.push({
      title: `${template.title} Part ${Math.ceil(i / templates.length)} - Ref ${i}`,
      companies: assignedCompanies,
      topic: topicId,
      difficulty,
      platform,
      externalUrl: url,
      tags: [topicName.toLowerCase(), `standard-ds-${i}`, 'placement-prep'],
      frequentlyAsked: i % 4 === 0 ? 'Yes' : 'No',
      premiumBadge: i % 7 === 0 ? 'Premium' : 'Free',
      status: 'Active'
    });
  }

  return list;
};

// Seeding 500 MCQs
const generateMCQs = () => {
  const list = [];
  const mcqTemplates = [
    {
      question: 'What is the time complexity of searching an element in a balanced Binary Search Tree?',
      options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
      correctOption: 2,
      topic: 'Trees',
      explanation: 'In a balanced Binary Search Tree, the height is log n. Searching visits one node at each level, so the complexity is O(log n).'
    },
    {
      question: 'Which of the following data structures works on the LIFO principle?',
      options: ['Queue', 'Stack', 'Linked List', 'Array'],
      correctOption: 1,
      topic: 'Stack',
      explanation: 'Stack works on Last In First Out (LIFO) principle.'
    },
    {
      question: 'What is a foreign key in DBMS?',
      options: [
        'A key used to identify a unique row in a table',
        'A field in one table that uniquely identifies a row of another table',
        'A key used to encrypt the database',
        'None of the above'
      ],
      correctOption: 1,
      topic: 'DBMS',
      explanation: 'A foreign key is a column or group of columns in a relational database table that provides a link between data in two tables.'
    },
    {
      question: 'Which of the following is NOT an OOP concept in Java?',
      options: ['Inheritance', 'Encapsulation', 'Compilation', 'Polymorphism'],
      correctOption: 2,
      topic: 'OOP',
      explanation: 'OOP concepts are Inheritance, Encapsulation, Polymorphism, and Abstraction. Compilation is a build process.'
    },
    {
      question: 'What is virtual memory in Operating Systems?',
      options: [
        'Extremely large main memory',
        'Extremely large secondary memory',
        'An illusion of extremely large main memory',
        'A type of RAM'
      ],
      correctOption: 2,
      topic: 'OS',
      explanation: 'Virtual memory is a memory management capability of an OS that uses hardware and software to allow a computer to compensate for physical memory shortages by temporarily transferring data from random access memory (RAM) to disk storage.'
    },
    {
      question: 'Which OSI layer is responsible for routing packets?',
      options: ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'],
      correctOption: 2,
      topic: 'CN',
      explanation: 'The Network Layer is responsible for packet forwarding including routing through intermediate routers.'
    },
    {
      question: 'If a work can be completed by 10 men in 15 days, in how many days can 15 men complete the same work?',
      options: ['10 days', '12 days', '8 days', '15 days'],
      correctOption: 0,
      topic: 'Aptitude',
      explanation: 'Total work = 10 * 15 = 150 man-days. Days for 15 men = 150 / 15 = 10 days.'
    }
  ];

  // We loop to generate 500 MCQs
  for (let i = 1; i <= 500; i++) {
    const template = mcqTemplates[(i - 1) % mcqTemplates.length];
    const topic = topics[(i - 1) % topics.length];
    
    // Difficulty
    let difficulty = 'Medium';
    if (i % 3 === 1) difficulty = 'Easy';
    else if (i % 4 === 0) difficulty = 'Hard';

    // Distribute among companies
    const numCompanies = (i % 2) + 1; // 1 or 2 companies
    const assignedCompanies = [];
    for (let c = 0; c < numCompanies; c++) {
      assignedCompanies.push(companiesData[(i + c) % companiesData.length].name);
    }

    list.push({
      question: `${template.question} (Q-Variant ${i})`,
      options: template.options,
      correctOption: template.correctOption,
      topic,
      companies: assignedCompanies,
      difficulty,
      explanation: `${template.explanation} (This is reference explanation for variant ${i})`
    });
  }

  return list;
};

const runSeed = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/interview-portal');
    console.log(`Database connected for seeding: ${conn.connection.host}`);

    // Clean current databases
    console.log('Clearing existing collections...');
    await User.deleteMany();
    await Company.deleteMany();
    await QuestionReference.deleteMany();
    await MCQ.deleteMany();
    await UserQuestionProgress.deleteMany();
    await Bookmark.deleteMany();
    await Note.deleteMany();
    await MockInterview.deleteMany();
    await ActivityLog.deleteMany();
    console.log('Collections cleared.');

    // Seed Users
    console.log('Seeding users...');
    
    // Admin User
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@interviewportal.com',
      password: 'adminpassword', // Will be hashed via User.pre('save')
      role: 'admin',
      college: 'National Institute of Technology',
      branch: 'Computer Science',
      year: 'Final Year',
      skills: ['React', 'Node.js', 'System Design', 'MongoDB'],
      targetCompany: 'Google',
      achievements: ['Gold Medalist', 'Top Rated Coder']
    });
    await adminUser.save();

    // Student User
    const studentUser = new User({
      name: 'John Doe',
      email: 'student@interviewportal.com',
      password: 'studentpassword',
      role: 'student',
      college: 'Indian Institute of Technology',
      branch: 'Information Technology',
      year: 'Pre-Final Year',
      skills: ['C++', 'Java', 'Python', 'SQL'],
      targetCompany: 'Microsoft',
      achievements: ['Hackathon Winner 2025', 'Codeforces Specialist'],
      streak: {
        current: 5,
        longest: 12,
        lastSolvedDate: new Date()
      }
    });
    await studentUser.save();
    console.log('Users seeded.');

    // Seed Companies
    console.log('Seeding companies...');
    await Company.insertMany(companiesData);
    console.log('Companies seeded.');

    // Seed Topics
    console.log('Seeding topics...');
    const createdTopics = await Topic.insertMany(topicsData);
    const topicMap = {};
    createdTopics.forEach(topic => {
      topicMap[topic.name] = topic._id;
    });
    console.log('Topics seeded.');

    // Seed Question References
    console.log('Generating & seeding 200 coding questions...');
    const codingQuestions = await generateCodingQuestions(topicMap);
    await QuestionReference.insertMany(codingQuestions);
    console.log('Coding questions seeded.');

    // Seed MCQs
    console.log('Generating & seeding 500 MCQs...');
    const mcqs = generateMCQs();
    await MCQ.insertMany(mcqs);
    console.log('MCQs seeded.');

    // Add some sample mock interviews for the student
    console.log('Seeding initial mock interviews...');
    await MockInterview.create([
      {
        userId: studentUser._id,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days in future
        time: '14:00',
        type: 'Technical',
        status: 'Scheduled'
      },
      {
        userId: studentUser._id,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days in past
        time: '11:00',
        type: 'HR',
        status: 'Completed',
        feedback: 'Excellent communication skills and behavioral answers. Technical knowledge is sound.',
        score: 9
      }
    ]);
    console.log('Mock interviews seeded.');

    // Seed initial progress for student
    console.log('Seeding student progress...');
    const sampleQuestions = await QuestionReference.find().limit(15);
    
    // Solved questions
    for (let s = 0; s < 10; s++) {
      await UserQuestionProgress.create({
        userId: studentUser._id,
        questionId: sampleQuestions[s]._id,
        status: 'Solved',
        solvedAt: new Date(Date.now() - s * 24 * 60 * 60 * 1000), // Spans over last 10 days
        isBookmarked: s % 3 === 0,
        isFavorite: s % 4 === 0,
        revisionRequired: s % 5 === 0
      });

      if (s % 3 === 0) {
        await Bookmark.create({
          userId: studentUser._id,
          itemType: 'Question',
          questionId: sampleQuestions[s]._id
        });
      }
    }

    // In progress
    for (let p = 10; p < 15; p++) {
      await UserQuestionProgress.create({
        userId: studentUser._id,
        questionId: sampleQuestions[p]._id,
        status: 'In Progress'
      });
    }

    // Create activity logs for student
    console.log('Seeding activity logs...');
    await ActivityLog.create([
      {
        userId: studentUser._id,
        actionType: 'Solved Question',
        details: 'Solved: "Two Sum Part 1" (Easy)'
      },
      {
        userId: studentUser._id,
        actionType: 'Took MCQ Test',
        details: 'Scored 36 pts on Aptitude MCQ Test'
      },
      {
        userId: studentUser._id,
        actionType: 'Scheduled Interview',
        details: 'Scheduled Technical Interview'
      }
    ]);
    console.log('Activity logs seeded.');

    console.log('Database Seeding Completed Successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

runSeed();
