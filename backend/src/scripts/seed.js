/**
 * ⚠️  DEVELOPMENT SEED SCRIPT — DO NOT RUN IN PRODUCTION WITH REAL DATA
 * This script creates demo accounts with known passwords for testing only.
 * Passwords below are intentionally simple for local development.
 * Run: node src/scripts/seed.js
 */

/**
 * TrustHire Database Seed Script
 * Run: node src/scripts/seed.js
 *
 * Creates:
 *   - 1 admin user
 *   - 3 verified employers + 2 unverified employers
 *   - 12 job listings (mix of verified/unverified)
 *   - 2 job seeker accounts
 *   - 4 fraud reports (2 verified, 2 pending)
 *   - 2 applications
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Employer = require('../models/Employer');
const JobListing = require('../models/JobListing');
const JobSeekerProfile = require('../models/JobSeekerProfile');
const FraudReport = require('../models/FraudReport');
const Application = require('../models/Application');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI not set in .env');
  process.exit(1);
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

const EMPLOYERS_DATA = [
  {
    name: 'Priya Sharma',
    email: 'priya@techcorpindia.com',
    company: {
      companyName: 'TechCorp India Pvt Ltd',
      verificationStatus: 'verified',
      cin: 'U72900MH2018PTC123456',
      verificationData: {
        registeredName: 'TECHCORP INDIA PRIVATE LIMITED',
        incorporationDate: new Date('2018-03-15'),
        companyType: 'Private Limited',
        registeredState: 'Maharashtra',
        cin: 'U72900MH2018PTC123456',
        verifiedAt: new Date(),
        verifiedVia: 'cin',
      },
      trustScore: 88,
      industry: 'Information Technology',
      companySize: '51-200',
      website: 'https://techcorpindia.example.com',
      description: 'We build enterprise SaaS solutions for Indian SMBs.',
    },
  },
  {
    name: 'Rajesh Verma',
    email: 'rajesh@greenlogistics.com',
    company: {
      companyName: 'Green Logistics Solutions',
      verificationStatus: 'verified',
      gstin: '27AAPFU0939F1ZV',
      verificationData: {
        registeredName: 'GREEN LOGISTICS SOLUTIONS',
        incorporationDate: new Date('2016-07-01'),
        companyType: 'Partnership',
        registeredState: 'Gujarat',
        gstin: '27AAPFU0939F1ZV',
        verifiedAt: new Date(),
        verifiedVia: 'gstin',
      },
      trustScore: 76,
      industry: 'Logistics',
      companySize: '11-50',
      description: 'Last-mile delivery solutions across Tier-2 cities.',
    },
  },
  {
    name: 'Ananya Krishnan',
    email: 'ananya@edutechlearn.com',
    company: {
      companyName: 'EduTech Learn Pvt Ltd',
      verificationStatus: 'verified',
      cin: 'U80902KA2020PTC234567',
      verificationData: {
        registeredName: 'EDUTECH LEARN PRIVATE LIMITED',
        incorporationDate: new Date('2020-01-10'),
        companyType: 'Private Limited',
        registeredState: 'Karnataka',
        cin: 'U80902KA2020PTC234567',
        verifiedAt: new Date(),
        verifiedVia: 'cin',
      },
      trustScore: 81,
      industry: 'Education',
      companySize: '11-50',
      description: 'Online skill-based learning platform for college students.',
    },
  },
  {
    name: 'Deepak Soni',
    email: 'deepak@quickhiresolutions.com',
    company: {
      companyName: 'QuickHire Solutions',
      verificationStatus: 'unverified',
      trustScore: 20,
      fraudReportCount: 7,
      verifiedReportCount: 3,
      industry: 'Staffing',
      description: 'We connect job seekers with opportunities.',
    },
  },
  {
    name: 'Mohit Gupta',
    email: 'mohit@globalplacementhub.com',
    company: {
      companyName: 'Global Placement Hub',
      verificationStatus: 'failed',
      trustScore: 10,
      fraudReportCount: 5,
      verifiedReportCount: 2,
      description: 'Placement services for freshers.',
    },
  },
];

const JOBS_DATA = [
  // Verified employer jobs
  {
    employerIndex: 0,
    title: 'React Developer',
    description: 'We are looking for a skilled React developer to join our frontend team. You will build user interfaces for our SaaS platform used by 500+ businesses across India.\n\nYou will work closely with designers and backend developers to deliver high-quality features on time.',
    responsibilities: '- Build and maintain React components\n- Write unit and integration tests\n- Participate in code reviews\n- Collaborate with product team on feature specs',
    requirements: '- 1+ years React.js experience\n- Familiarity with REST APIs\n- Git proficiency\n- Good communication skills',
    location: { city: 'Pune', state: 'Maharashtra', isRemote: false },
    salaryRange: { min: 400000, max: 700000, isDisclosed: true },
    jobType: 'fulltime',
    experienceLevel: '1-2',
    skills: ['React.js', 'JavaScript', 'Tailwind CSS', 'Git', 'REST APIs'],
    openings: 2,
  },
  {
    employerIndex: 0,
    title: 'Node.js Backend Intern',
    description: 'Join our backend team as an intern. You will build REST APIs, work with MongoDB, and learn real-world software engineering practices. This is a paid internship with PPO possibility.',
    location: { city: 'Pune', state: 'Maharashtra', isRemote: true },
    salaryRange: { min: 15000, max: 20000, isDisclosed: true },
    jobType: 'internship',
    experienceLevel: 'fresher',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'JavaScript'],
    openings: 3,
  },
  {
    employerIndex: 1,
    title: 'Logistics Operations Executive',
    description: 'Manage day-to-day delivery operations for our Tier-2 city network. You will coordinate with delivery partners, resolve escalations, and track performance metrics.',
    location: { city: 'Ahmedabad', state: 'Gujarat', isRemote: false },
    salaryRange: { min: 250000, max: 350000, isDisclosed: true },
    jobType: 'fulltime',
    experienceLevel: '1-2',
    skills: ['Operations', 'MS Excel', 'Communication', 'Logistics'],
    openings: 2,
  },
  {
    employerIndex: 1,
    title: 'Delivery Partner Coordinator',
    description: 'Onboard and manage a network of delivery partners. Track performance, handle grievances, and improve partner satisfaction scores.',
    location: { city: 'Surat', state: 'Gujarat', isRemote: false },
    salaryRange: { min: 200000, max: 280000, isDisclosed: true },
    jobType: 'fulltime',
    experienceLevel: 'fresher',
    skills: ['Communication', 'Excel', 'Field Work'],
    openings: 5,
  },
  {
    employerIndex: 2,
    title: 'Content Developer – Computer Science',
    description: 'Create video scripts, quizzes, and reading material for CS courses targeting college students. You should have strong CS fundamentals and the ability to explain complex topics simply.',
    location: { city: 'Bengaluru', state: 'Karnataka', isRemote: true },
    salaryRange: { min: 300000, max: 450000, isDisclosed: true },
    jobType: 'fulltime',
    experienceLevel: 'fresher',
    skills: ['Data Structures', 'Writing', 'Python', 'Content Creation'],
    openings: 2,
  },
  {
    employerIndex: 2,
    title: 'Full Stack Developer (MERN)',
    description: 'Build and maintain our learning platform. Work on both frontend (React) and backend (Node.js + MongoDB). You will directly impact the learning experience of 50,000+ students.',
    location: { city: 'Bengaluru', state: 'Karnataka', isRemote: false },
    salaryRange: { min: 500000, max: 800000, isDisclosed: true },
    jobType: 'fulltime',
    experienceLevel: '1-2',
    skills: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'TypeScript'],
    openings: 1,
  },
  // Unverified/fraudulent employer jobs
  {
    employerIndex: 3,
    title: 'HR Executive – Immediate Joining',
    description: 'We are urgently hiring HR Executives for our growing team. Salary: ₹35,000/month. Freshers welcome. Work from office. Immediate joining.',
    location: { city: 'Delhi', state: 'Delhi', isRemote: false },
    salaryRange: { min: 420000, max: 420000, isDisclosed: true },
    jobType: 'fulltime',
    experienceLevel: 'fresher',
    skills: ['Communication', 'MS Office', 'Recruitment'],
    openings: 10,
    fraudReportCount: 7,
    isFlagged: true,
    status: 'suspended',
  },
  {
    employerIndex: 4,
    title: 'Sales Manager – WFH',
    description: 'Work from home sales position. No experience required. Earn up to ₹50,000/month. Flexible hours. All you need is a smartphone.',
    location: { city: 'Mumbai', state: 'Maharashtra', isRemote: true },
    salaryRange: { min: 600000, max: 600000, isDisclosed: true },
    jobType: 'fulltime',
    experienceLevel: 'fresher',
    skills: ['Sales', 'Communication'],
    openings: 50,
    fraudReportCount: 5,
    isFlagged: true,
  },
];

const SEEKERS_DATA = [
  {
    name: 'Sangam Kumar',
    email: 'sangam@example.com',
    profile: {
      headline: 'MERN Stack Developer | B.Tech CSE 2026',
      summary: 'Final year CSE student with hands-on experience building full-stack web applications using MongoDB, Express.js, React.js, and Node.js.',
      skills: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'JavaScript', 'Tailwind CSS', 'Git'],
      education: [{
        institution: 'RVS College of Engineering & Technology',
        degree: 'B.Tech',
        field: 'Computer Science & Engineering',
        startYear: 2022,
        endYear: 2026,
        isCurrently: true,
      }],
      experience: [{
        company: 'TechnoExponent / Euphoria GenX',
        role: 'MERN Stack Developer Intern',
        startDate: new Date('2026-05-01'),
        endDate: new Date('2026-06-30'),
        isCurrently: false,
        description: 'Built Slotly — a production-grade appointment booking system deployed on Vercel + Render.',
      }],
      preferredLocations: ['Jamshedpur', 'Bengaluru', 'Pune'],
      preferredRoles: ['Full Stack Developer', 'React Developer', 'Node.js Developer'],
      preferredJobType: 'fulltime',
      isOpenToWork: true,
      noticePeriod: 'immediate',
    },
  },
  {
    name: 'Priya Desai',
    email: 'priya.seeker@example.com',
    profile: {
      headline: 'Fresh Graduate | B.Com | Looking for Accounts Executive role',
      summary: 'B.Com graduate with strong Excel and Tally skills. Looking for an entry-level accounting or finance role.',
      skills: ['Tally ERP', 'MS Excel', 'GST Filing', 'Accounts Payable', 'Communication'],
      education: [{
        institution: 'St. Xavier\'s College Mumbai',
        degree: 'B.Com',
        field: 'Accounting & Finance',
        startYear: 2020,
        endYear: 2023,
        isCurrently: false,
      }],
      preferredLocations: ['Mumbai', 'Pune'],
      preferredRoles: ['Accounts Executive', 'Finance Analyst'],
      isOpenToWork: true,
    },
  },
];

// ── Main Seed Function ────────────────────────────────────────────────────────

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Employer.deleteMany({}),
    JobListing.deleteMany({}),
    JobSeekerProfile.deleteMany({}),
    FraudReport.deleteMany({}),
    Application.deleteMany({}),
  ]);

  // ── Admin ──
  const adminUser = await User.create({
    name: 'TrustHire Admin',
    email: 'admin@trusthire.in',
    passwordHash: 'Admin@123456',
    role: 'admin',
    isEmailVerified: true,
  });
  console.log('✅ Admin created: admin@trusthire.in / Admin@123456');

  // ── Employers ──
  const employerUsers = [];
  const employerDocs = [];

  for (const data of EMPLOYERS_DATA) {
    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash: 'Employer@1234',
      role: 'employer',
      isEmailVerified: true,
    });
    employerUsers.push(user);

    const employer = await Employer.create({
      userId: user._id,
      ...data.company,
      totalListings: 0,
      activeListings: 0,
    });
    employerDocs.push(employer);
  }
  console.log(`✅ ${EMPLOYERS_DATA.length} employers created`);

  // ── Job Listings ──
  const jobDocs = [];
  for (const jobData of JOBS_DATA) {
    const { employerIndex, ...rest } = jobData;
    const employer = employerDocs[employerIndex];
    const job = await JobListing.create({
      ...rest,
      employerId: employer._id,
      isFromVerifiedEmployer: employer.verificationStatus === 'verified',
      status: rest.status || 'active',
    });
    jobDocs.push(job);

    await Employer.findByIdAndUpdate(employer._id, {
      $inc: {
        totalListings: 1,
        activeListings: job.status === 'active' ? 1 : 0,
      },
    });
  }
  console.log(`✅ ${JOBS_DATA.length} job listings created`);

  // ── Job Seekers ──
  const seekerUsers = [];
  for (const data of SEEKERS_DATA) {
    const user = await User.create({
      name: data.name,
      email: data.email,
      passwordHash: 'Seeker@1234',
      role: 'jobseeker',
      isEmailVerified: true,
    });
    seekerUsers.push(user);

    await JobSeekerProfile.create({
      userId: user._id,
      ...data.profile,
    });
  }
  console.log(`✅ ${SEEKERS_DATA.length} job seekers created`);

  // ── Fraud Reports ──
  const fraudReports = [
    {
      reportedBy: seekerUsers[0]._id,
      employerId: employerDocs[3]._id, // QuickHire (unverified)
      jobId: jobDocs[6]._id,
      reportType: 'asked_for_money',
      description: 'After I was told I was selected, they asked me to pay ₹1,500 for a "background verification ID card". I paid via UPI but then they stopped responding. The phone number is no longer reachable.',
      isAnonymous: false,
      status: 'verified',
      resolvedAt: new Date(),
    },
    {
      reportedBy: seekerUsers[1]._id,
      employerId: employerDocs[3]._id,
      jobId: jobDocs[6]._id,
      reportType: 'asked_for_money',
      description: 'They said I got the HR Executive role and asked for ₹2,000 as "joining fee" to process my appointment letter. This is clearly a scam. I did not pay.',
      isAnonymous: true,
      status: 'verified',
      resolvedAt: new Date(),
    },
    {
      reportedBy: seekerUsers[0]._id,
      employerId: employerDocs[4]._id, // Global Placement Hub
      jobId: jobDocs[7]._id,
      reportType: 'fake_company',
      description: 'I tried to find this company address on Google Maps. The address given leads to a residential building with no office. No one picked up the phone number provided.',
      isAnonymous: false,
      status: 'pending',
    },
    {
      reportedBy: seekerUsers[1]._id,
      employerId: employerDocs[4]._id,
      reportType: 'scam_interview',
      description: 'The "interview" was done over WhatsApp. They asked me to send photos of my Aadhaar and PAN card before any formal offer letter. I refused and blocked them.',
      isAnonymous: true,
      status: 'under_review',
    },
  ];

  for (const report of fraudReports) {
    await FraudReport.create(report);
  }
  console.log(`✅ ${fraudReports.length} fraud reports created`);

  // ── Applications ──
  const verifiedJob = jobDocs[0]; // React Developer at TechCorp
  await Application.create({
    jobId: verifiedJob._id,
    jobSeekerId: seekerUsers[0]._id,
    employerId: employerDocs[0]._id,
    coverNote: 'I have 6 months of hands-on MERN stack experience from my internship where I built and deployed Slotly — a full-stack appointment booking system. I am confident I can contribute to your team immediately.',
    status: 'shortlisted',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    viewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  });

  await JobListing.findByIdAndUpdate(verifiedJob._id, { $inc: { applicationCount: 1 } });

  await Application.create({
    jobId: jobDocs[4]._id, // Content Developer at EduTech
    jobSeekerId: seekerUsers[0]._id,
    employerId: employerDocs[2]._id,
    coverNote: 'As a CSE student with strong DS/Algo fundamentals and experience writing technical documentation, I am excited to create engaging CS content for your platform.',
    status: 'applied',
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  });

  await JobListing.findByIdAndUpdate(jobDocs[4]._id, { $inc: { applicationCount: 1 } });

  console.log('✅ 2 applications created');

  console.log('\n🎉 Seed complete! Login credentials:');
  console.log('  Admin:     admin@trusthire.in     / Admin@123456');
  console.log('  Seeker 1:  sangam@example.com      / Seeker@1234');
  console.log('  Seeker 2:  priya.seeker@example.com / Seeker@1234');
  console.log('  Employer 1: priya@techcorpindia.com / Employer@1234  (verified)');
  console.log('  Employer 4: deepak@quickhiresolutions.com / Employer@1234 (7 fraud reports)');

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
