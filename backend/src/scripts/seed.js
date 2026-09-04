/**
 * TrustHire — Full Demo Seed Script
 * ===================================
 * ⚠️  DEVELOPMENT / DEMO USE ONLY — Never run against production data.
 *
 * What this creates:
 *   Users:
 *     1  Admin         → admin@trusthire.in         / Admin@TrustHire2024
 *     5  Employers     → 3 verified, 1 unverified, 1 suspended
 *     4  Job Seekers   → with full profiles & applications
 *
 *   Content:
 *     18 Job Listings  → mix of active / closed / suspended, all types & levels
 *     10 Applications  → across different status stages (pipeline demo)
 *      8 Fraud Reports → 3 verified, 2 investigating, 2 pending, 1 dismissed
 *      4 JobSeeker Profiles → with education, experience, skills
 *
 * Run:
 *   cd backend
 *   node src/scripts/seed.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Employer from '../models/Employer.js';
import JobListing from '../models/JobListing.js';
import FraudReport from '../models/FraudReport.js';
import Application from '../models/Application.js';
import JobSeekerProfile from '../models/JobSeekerProfile.js';

dotenv.config();

// ─── Helpers ──────────────────────────────────────────────────────────────────
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);

// ─── Main ─────────────────────────────────────────────────────────────────────
const seed = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('[Seed] ❌  MONGODB_URI is not set. Add it to your .env file.');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('[Seed] ✅  Connected to MongoDB.\n');

  // ── Wipe existing data ───────────────────────────────────────────────────────
  await Promise.all([
    User.deleteMany({}),
    Employer.deleteMany({}),
    JobListing.deleteMany({}),
    FraudReport.deleteMany({}),
    Application.deleteMany({}),
    JobSeekerProfile.deleteMany({}),
  ]);
  console.log('[Seed] 🗑   All existing collections cleared.');

  // ════════════════════════════════════════════════════════════════════════════
  // 1.  USERS
  // ════════════════════════════════════════════════════════════════════════════
  console.log('\n[Seed] 👤  Creating users...');

  // Admin
  const admin = await User.create({
    name: 'TrustHire Admin',
    email: 'admin@trusthire.in',
    password: 'Admin@TrustHire2024',
    role: 'admin',
    isEmailVerified: true,
    isActive: true,
  });

  // Employer users
  const [euRiya, euArjun, euNeha, euVijay, euScam] = await User.insertMany([
    { name: 'Riya Kapoor',    email: 'riya@nexgentech.in',      password: 'Employer@123', role: 'employer', isEmailVerified: true,  isActive: true  },
    { name: 'Arjun Malhotra', email: 'arjun@brightwaveit.com',  password: 'Employer@123', role: 'employer', isEmailVerified: true,  isActive: true  },
    { name: 'Neha Iyer',      email: 'neha@greenleafbio.co.in', password: 'Employer@123', role: 'employer', isEmailVerified: true,  isActive: true  },
    { name: 'Vijay Desai',    email: 'vijay@swiftlogix.io',     password: 'Employer@123', role: 'employer', isEmailVerified: false, isActive: true  },
    { name: 'Fake HR',        email: 'hr@fastjobs-india.com',   password: 'Employer@123', role: 'employer', isEmailVerified: false, isActive: false },
  ]);

  // Job seeker users
  const [usAarav, usPreeti, usSameer, usAnanya] = await User.insertMany([
    { name: 'Aarav Singh',    email: 'aarav.singh@gmail.com',   password: 'Seeker@123', role: 'jobseeker', isEmailVerified: true,  isActive: true },
    { name: 'Preeti Nair',    email: 'preeti.nair@gmail.com',   password: 'Seeker@123', role: 'jobseeker', isEmailVerified: true,  isActive: true },
    { name: 'Sameer Qureshi', email: 'sameer.q@outlook.com',    password: 'Seeker@123', role: 'jobseeker', isEmailVerified: true,  isActive: true },
    { name: 'Ananya Reddy',   email: 'ananya.reddy@yahoo.com',  password: 'Seeker@123', role: 'jobseeker', isEmailVerified: true,  isActive: true },
  ]);

  console.log('[Seed]    ✓ 1 admin, 5 employers, 4 job seekers created.');

  // ════════════════════════════════════════════════════════════════════════════
  // 2.  EMPLOYER PROFILES
  // ════════════════════════════════════════════════════════════════════════════
  console.log('\n[Seed] 🏢  Creating employer profiles...');

  // E1 — Verified, high trust score, tech company
  const emp1 = await Employer.create({
    user: euRiya._id,
    userId: euRiya._id,
    companyName: 'NexGen Technologies Pvt Ltd',
    website: 'https://nexgentech.in',
    industry: 'Software Development',
    companySize: '51-200',
    description: 'NexGen Technologies builds enterprise-grade SaaS platforms for the BFSI and e-commerce sectors. Our engineering culture values ownership, deep technical thinking, and real-world impact.',
    logo: '',
    location: { city: 'Bengaluru', state: 'Karnataka', country: 'India', address: '5th Floor, Prestige Tech Park, Whitefield' },
    verificationStatus: 'verified',
    cin: 'U72900KA2018PTC112345',
    gstin: '29AAACN1234A1Z5',
    verificationDate: daysAgo(90),
    trustScore: 90,
    scoreBreakdown: { legalVerification: 30, domainVerified: 10, companyAge: 10, cleanRecordBonus: 10, fraudPenalty: 0 },
    verifiedFraudReports: 0,
    totalSubmittedReports: 1,
    isSuspended: false,
  });

  // E2 — Verified, good trust score, IT services
  const emp2 = await Employer.create({
    user: euArjun._id,
    userId: euArjun._id,
    companyName: 'BrightWave IT Solutions',
    website: 'https://brightwaveit.com',
    industry: 'Information Technology',
    companySize: '11-50',
    description: 'BrightWave delivers end-to-end digital transformation consulting and managed cloud services. We partner with startups and mid-market companies to modernise legacy infrastructure.',
    logo: '',
    location: { city: 'Pune', state: 'Maharashtra', country: 'India', address: 'Hinjewadi Phase 2, Pune' },
    verificationStatus: 'verified',
    cin: 'U74999MH2019PTC234567',
    gstin: '27AAACB5678B1Z3',
    verificationDate: daysAgo(60),
    trustScore: 85,
    scoreBreakdown: { legalVerification: 30, domainVerified: 10, companyAge: 10, cleanRecordBonus: 10, fraudPenalty: 0 },
    verifiedFraudReports: 0,
    totalSubmittedReports: 0,
    isSuspended: false,
  });

  // E3 — Verified, biotech niche
  const emp3 = await Employer.create({
    user: euNeha._id,
    userId: euNeha._id,
    companyName: 'GreenLeaf Biosciences',
    website: 'https://greenleafbio.co.in',
    industry: 'Biotechnology',
    companySize: '11-50',
    description: 'GreenLeaf Biosciences is a Hyderabad-based biotech startup developing AI-assisted crop disease detection tools for smallholder farmers across India.',
    logo: '',
    location: { city: 'Hyderabad', state: 'Telangana', country: 'India', address: 'T-Hub Phase 2, Raidurgam' },
    verificationStatus: 'verified',
    cin: 'U24200TG2021PTC345678',
    gstin: '36AAACG9012C1Z7',
    verificationDate: daysAgo(45),
    trustScore: 88,
    scoreBreakdown: { legalVerification: 30, domainVerified: 10, companyAge: 10, cleanRecordBonus: 10, fraudPenalty: 0 },
    verifiedFraudReports: 0,
    totalSubmittedReports: 0,
    isSuspended: false,
  });

  // E4 — Unverified (pending verification), logistics startup
  const emp4 = await Employer.create({
    user: euVijay._id,
    userId: euVijay._id,
    companyName: 'SwiftLogix Courier Solutions',
    website: 'https://swiftlogix.io',
    industry: 'Logistics & Supply Chain',
    companySize: '1-10',
    description: 'SwiftLogix is an early-stage last-mile delivery startup connecting local vendors with riders across Tier 2 cities.',
    logo: '',
    location: { city: 'Jaipur', state: 'Rajasthan', country: 'India', address: 'Malviya Nagar, Jaipur' },
    verificationStatus: 'unverified',
    cin: '',
    gstin: '',
    trustScore: 40,
    scoreBreakdown: { legalVerification: 0, domainVerified: 10, companyAge: 10, cleanRecordBonus: 10, fraudPenalty: 0 },
    verifiedFraudReports: 0,
    totalSubmittedReports: 2,
    isSuspended: false,
  });

  // E5 — Suspended scam company
  const emp5 = await Employer.create({
    user: euScam._id,
    userId: euScam._id,
    companyName: 'FastJobs India Network',
    website: 'https://fastjobs-india.com',
    industry: 'Staffing & Recruitment',
    companySize: '1-10',
    description: 'Fraudulent placement agency — suspended for multiple verified scam reports.',
    logo: '',
    location: { city: 'Delhi', state: 'Delhi', country: 'India', address: 'Unknown' },
    verificationStatus: 'suspended',
    cin: '',
    gstin: '',
    trustScore: 0,
    scoreBreakdown: { legalVerification: 0, domainVerified: 0, companyAge: 10, cleanRecordBonus: 0, fraudPenalty: 45 },
    verifiedFraudReports: 3,
    totalSubmittedReports: 5,
    isSuspended: true,
    suspensionReason: 'Three verified fraud allegations: demanding registration fees, fake offer letters, and impersonating government recruiters.',
  });

  console.log('[Seed]    ✓ 3 verified, 1 unverified, 1 suspended employer created.');

  // ════════════════════════════════════════════════════════════════════════════
  // 3.  JOB LISTINGS
  // ════════════════════════════════════════════════════════════════════════════
  console.log('\n[Seed] 💼  Creating job listings...');

  // ── NexGen Technologies (emp1) — 6 jobs ─────────────────────────────────────
  const [job1, job2, job3, job4, job5, job6] = await JobListing.insertMany([
    {
      employer: emp1._id,
      title: 'Senior Full-Stack Engineer (React + Node.js)',
      description: 'We are looking for a senior full-stack engineer to lead the development of our next-generation merchant analytics platform. You will own end-to-end feature development — from API design to pixel-perfect UI delivery.',
      responsibilities: [
        'Architect and build scalable REST APIs using Node.js and Express',
        'Develop high-performance React dashboards with complex data visualisation',
        'Write unit and integration tests to maintain >85% code coverage',
        'Mentor two junior engineers and conduct weekly code reviews',
        'Collaborate with product and design to ship features on a 2-week sprint cadence',
      ],
      requirements: [
        '4+ years of full-stack development experience',
        'Deep expertise in React (hooks, context, performance optimisation)',
        'Strong Node.js backend skills — REST API design, middleware, error handling',
        'MongoDB or PostgreSQL experience — query optimisation and indexing',
        'Familiarity with Docker, CI/CD pipelines, and cloud deployments (AWS/GCP)',
      ],
      skills: ['react', 'node.js', 'mongodb', 'typescript', 'docker', 'tailwind css', 'redis'],
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      experienceLevel: 'Senior Level',
      location: { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
      salary: { min: 1800000, max: 2600000, currency: 'INR', isNegotiable: false },
      openings: 2,
      status: 'active',
      trustVerificationStatus: 'verified',
      isFromVerifiedEmployer: true,
      employerTrustScore: 90,
      applicationCount: 0,
      deadline: daysFromNow(30),
      createdAt: daysAgo(10),
    },
    {
      employer: emp1._id,
      title: 'DevOps Engineer — Cloud Infrastructure',
      description: 'Join our infrastructure team to automate deployments, monitor cloud costs, and build a rock-solid CI/CD foundation for our 15-microservice platform running on AWS EKS.',
      responsibilities: [
        'Manage and optimise AWS EKS clusters and RDS instances',
        'Build and maintain CI/CD pipelines using GitHub Actions and ArgoCD',
        'Implement infrastructure-as-code using Terraform',
        'Set up monitoring, alerting, and SLO dashboards using Grafana and Prometheus',
        'Conduct quarterly disaster-recovery drills',
      ],
      requirements: [
        '3+ years in a DevOps or SRE role',
        'Hands-on AWS experience — EKS, RDS, S3, CloudFront, IAM',
        'Strong Terraform and Helm expertise',
        'Experience with container security scanning and secrets management',
        'Comfortable on-call — we run a fair rotation with good tooling',
      ],
      skills: ['aws', 'kubernetes', 'terraform', 'docker', 'github actions', 'prometheus', 'grafana'],
      jobType: 'Full-time',
      workplaceType: 'Remote',
      experienceLevel: 'Mid Level',
      location: { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
      salary: { min: 1600000, max: 2200000, currency: 'INR', isNegotiable: true },
      openings: 1,
      status: 'active',
      trustVerificationStatus: 'verified',
      isFromVerifiedEmployer: true,
      employerTrustScore: 90,
      applicationCount: 0,
      deadline: daysFromNow(25),
      createdAt: daysAgo(7),
    },
    {
      employer: emp1._id,
      title: 'Product Designer (UI/UX)',
      description: 'We are hiring a product designer to own the end-to-end design process for our B2B SaaS dashboard — from user research and wireframes through to high-fidelity Figma prototypes and design system maintenance.',
      responsibilities: [
        'Run user interviews and usability tests with 5–8 merchants per quarter',
        'Own and evolve the NexGen design system (Figma components + tokens)',
        'Produce wireframes, prototypes, and final specs for engineering handoff',
        'Collaborate closely with the frontend team on implementation quality',
        'Define and track UX metrics alongside the product manager',
      ],
      requirements: [
        '3+ years designing complex SaaS products',
        'Expert-level Figma skills — auto-layout, components, variables',
        'Strong visual design fundamentals — typography, colour, spacing',
        'Experience running lightweight user research sessions',
        'Portfolio demonstrating data-dense dashboard design is a strong plus',
      ],
      skills: ['figma', 'ui/ux', 'design systems', 'user research', 'prototyping', 'wireframing'],
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      experienceLevel: 'Mid Level',
      location: { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
      salary: { min: 1200000, max: 1800000, currency: 'INR', isNegotiable: true },
      openings: 1,
      status: 'active',
      trustVerificationStatus: 'verified',
      isFromVerifiedEmployer: true,
      employerTrustScore: 90,
      applicationCount: 0,
      deadline: daysFromNow(20),
      createdAt: daysAgo(5),
    },
    {
      employer: emp1._id,
      title: 'Junior Frontend Developer (React)',
      description: 'An ideal first or second job for a developer who has built React projects and wants to grow fast inside a supportive team. You will ship real features from week two.',
      responsibilities: [
        'Build and maintain reusable React components following the design system',
        'Integrate REST APIs and handle loading, error, and empty states correctly',
        'Write unit tests using Vitest and React Testing Library',
        'Participate in daily standups and bi-weekly planning sessions',
        'Fix frontend bugs triaged from the QA backlog',
      ],
      requirements: [
        '0–2 years of professional React experience (strong portfolio welcome)',
        'Solid understanding of JavaScript ES6+ — async/await, closures, modules',
        'Familiarity with Tailwind CSS and responsive layouts',
        'Comfortable with Git and basic pull request workflows',
        'Curiosity and a habit of asking good questions',
      ],
      skills: ['react', 'javascript', 'tailwind css', 'html', 'css', 'git'],
      jobType: 'Full-time',
      workplaceType: 'On-site',
      experienceLevel: 'Entry Level',
      location: { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
      salary: { min: 600000, max: 900000, currency: 'INR', isNegotiable: false },
      openings: 3,
      status: 'active',
      trustVerificationStatus: 'verified',
      isFromVerifiedEmployer: true,
      employerTrustScore: 90,
      applicationCount: 0,
      deadline: daysFromNow(15),
      createdAt: daysAgo(3),
    },
    {
      employer: emp1._id,
      title: 'Backend Engineer — Payments & Compliance',
      description: 'Work on the most critical layer of our platform — the payment processing pipeline. This role requires deep knowledge of financial regulations, idempotency patterns, and high-availability architecture.',
      responsibilities: [
        'Design and maintain the payment orchestration service (UPI, NEFT, IMPS)',
        'Implement PCI-DSS compliant data handling across the transaction lifecycle',
        'Build idempotent retry logic and reconciliation jobs',
        'Write runbooks and participate in incident response on-call rotation',
        'Audit third-party payment gateway integrations for security risks',
      ],
      requirements: [
        '4+ years backend engineering with at least 1 year in fintech or payments',
        'Expert Node.js skills — event loop, streams, worker threads',
        'Deep understanding of distributed systems — eventual consistency, CAP theorem',
        'Experience with PCI-DSS or RBI regulatory compliance is highly valued',
        'Familiarity with Kafka or RabbitMQ for event-driven architecture',
      ],
      skills: ['node.js', 'postgresql', 'kafka', 'redis', 'security', 'payments', 'pci-dss'],
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      experienceLevel: 'Senior Level',
      location: { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
      salary: { min: 2000000, max: 3000000, currency: 'INR', isNegotiable: false },
      openings: 1,
      status: 'active',
      trustVerificationStatus: 'verified',
      isFromVerifiedEmployer: true,
      employerTrustScore: 90,
      applicationCount: 0,
      deadline: daysFromNow(40),
      createdAt: daysAgo(2),
    },
    {
      employer: emp1._id,
      title: 'Technical Recruiter (Contract)',
      description: 'Short-term 6-month contract to help us scale our engineering team from 30 to 55. You will own the full sourcing-to-offer pipeline for 8 open roles.',
      responsibilities: [
        'Source candidates via LinkedIn Recruiter, referrals, and niche communities',
        'Screen CVs and conduct 30-minute technical pre-screening calls',
        'Coordinate 3-round interview pipelines with engineering managers',
        'Manage offer negotiations and track hiring metrics weekly',
        'Maintain the ATS (Greenhouse) and keep all candidate records current',
      ],
      requirements: [
        '2+ years of technical recruiting experience — in-house or agency',
        'Strong understanding of software engineering roles and tech stacks',
        'Excellent communication and candidate-experience mindset',
        'Experience with Greenhouse or Lever ATS preferred',
        'Ability to manage 10+ active pipelines simultaneously',
      ],
      skills: ['technical recruiting', 'sourcing', 'linkedin recruiter', 'greenhouse', 'candidate experience'],
      jobType: 'Contract',
      workplaceType: 'Remote',
      experienceLevel: 'Mid Level',
      location: { city: 'Bengaluru', state: 'Karnataka', country: 'India' },
      salary: { min: 800000, max: 1200000, currency: 'INR', isNegotiable: true },
      openings: 1,
      status: 'closed',
      trustVerificationStatus: 'verified',
      isFromVerifiedEmployer: true,
      employerTrustScore: 90,
      applicationCount: 0,
      deadline: daysAgo(5),
      createdAt: daysAgo(40),
    },
  ]);

  // ── BrightWave IT (emp2) — 5 jobs ────────────────────────────────────────────
  const [job7, job8, job9, job10, job11] = await JobListing.insertMany([
    {
      employer: emp2._id,
      title: 'Cloud Solutions Architect',
      description: 'Lead client-facing cloud transformation engagements. You will assess existing infrastructure, design target-state architectures, and guide delivery teams through complex migrations to AWS and Azure.',
      responsibilities: [
        'Conduct cloud-readiness assessments for mid-market enterprise clients',
        'Design multi-cloud and hybrid architecture blueprints',
        'Present technical roadmaps to C-level stakeholders',
        'Govern architecture quality across 3–5 active client engagements',
        'Contribute to BrightWave\'s technical blog and conference presence',
      ],
      requirements: [
        '6+ years in cloud infrastructure or solutions architecture',
        'AWS Professional or Azure Expert certification (or equivalent experience)',
        'Strong grasp of networking — VPC, peering, Direct Connect, ExpressRoute',
        'Experience presenting to non-technical executives',
        'Consulting or pre-sales background is a strong advantage',
      ],
      skills: ['aws', 'azure', 'cloud architecture', 'terraform', 'networking', 'kubernetes', 'consulting'],
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      experienceLevel: 'Senior Level',
      location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
      salary: { min: 2400000, max: 3600000, currency: 'INR', isNegotiable: true },
      openings: 1,
      status: 'active',
      trustVerificationStatus: 'verified',
      isFromVerifiedEmployer: true,
      employerTrustScore: 85,
      applicationCount: 0,
      deadline: daysFromNow(35),
      createdAt: daysAgo(8),
    },
    {
      employer: emp2._id,
      title: 'Data Engineer — Lakehouse & Pipelines',
      description: 'Build and own the data infrastructure that powers analytics for 12 enterprise clients. You will design ingestion pipelines, model data in the lakehouse, and ensure SLAs for downstream BI consumers.',
      responsibilities: [
        'Design and maintain ELT pipelines using Apache Airflow and dbt',
        'Manage the AWS S3 + Glue + Redshift data lakehouse architecture',
        'Work with client data teams to onboard new source systems',
        'Implement data quality checks using Great Expectations',
        'Optimise query performance and storage costs across Redshift clusters',
      ],
      requirements: [
        '3+ years in a data engineering role',
        'Strong SQL — window functions, CTEs, query plan analysis',
        'Python proficiency — pandas, PySpark, or equivalent',
        'Experience with Airflow DAG development and scheduling',
        'AWS Glue, Redshift, or Snowflake hands-on experience',
      ],
      skills: ['python', 'sql', 'apache airflow', 'dbt', 'aws', 'redshift', 'spark', 'data pipelines'],
      jobType: 'Full-time',
      workplaceType: 'Remote',
      experienceLevel: 'Mid Level',
      location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
      salary: { min: 1400000, max: 2000000, currency: 'INR', isNegotiable: false },
      openings: 2,
      status: 'active',
      trustVerificationStatus: 'verified',
      isFromVerifiedEmployer: true,
      employerTrustScore: 85,
      applicationCount: 0,
      deadline: daysFromNow(28),
      createdAt: daysAgo(6),
    },
    {
      employer: emp2._id,
      title: 'Cybersecurity Analyst (SOC L2)',
      description: 'Join our 24/7 Security Operations Centre as an L2 analyst. You will triage escalated alerts, conduct threat hunts, and own incident response from detection through containment.',
      responsibilities: [
        'Triage and investigate L1-escalated SIEM alerts (Splunk / Microsoft Sentinel)',
        'Conduct threat hunting using MITRE ATT&CK framework',
        'Lead incident response for medium and high severity events',
        'Write detailed incident reports and post-mortems for clients',
        'Tune detection rules to reduce false-positive rates',
      ],
      requirements: [
        '2–4 years in a SOC analyst or incident response role',
        'Hands-on SIEM experience — Splunk, Sentinel, or IBM QRadar',
        'Strong knowledge of network protocols, log analysis, and malware behaviour',
        'CEH, CompTIA Security+, or equivalent certification preferred',
        'Willingness to work in rotating 12-hour SOC shifts',
      ],
      skills: ['siem', 'splunk', 'incident response', 'threat hunting', 'mitre att&ck', 'network security', 'log analysis'],
      jobType: 'Full-time',
      workplaceType: 'On-site',
      experienceLevel: 'Mid Level',
      location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
      salary: { min: 1000000, max: 1500000, currency: 'INR', isNegotiable: false },
      openings: 2,
      status: 'active',
      trustVerificationStatus: 'verified',
      isFromVerifiedEmployer: true,
      employerTrustScore: 85,
      applicationCount: 0,
      deadline: daysFromNow(21),
      createdAt: daysAgo(4),
    },
    {
      employer: emp2._id,
      title: 'IT Project Manager (PMP)',
      description: 'Manage delivery of 2–3 simultaneous cloud migration and digital transformation engagements. You will be the primary point of contact for client stakeholders and accountable for scope, timeline, and budget.',
      responsibilities: [
        'Own project delivery plans, risk registers, and RAID logs',
        'Run weekly status calls and quarterly steering committee reviews',
        'Manage vendor and subcontractor relationships',
        'Track and report project financials against approved budgets',
        'Facilitate scope-change discussions and contract amendments',
      ],
      requirements: [
        '5+ years in IT project or programme management',
        'PMP or PRINCE2 certification required',
        'Experience managing cloud infrastructure or enterprise software projects',
        'Strong stakeholder management — comfortable with C-level communication',
        'Proficiency in Jira, Confluence, and MS Project',
      ],
      skills: ['project management', 'pmp', 'agile', 'stakeholder management', 'jira', 'risk management', 'cloud projects'],
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      experienceLevel: 'Lead / Manager',
      location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
      salary: { min: 1800000, max: 2600000, currency: 'INR', isNegotiable: true },
      openings: 1,
      status: 'active',
      trustVerificationStatus: 'verified',
      isFromVerifiedEmployer: true,
      employerTrustScore: 85,
      applicationCount: 0,
      deadline: daysFromNow(45),
      createdAt: daysAgo(1),
    },
    {
      employer: emp2._id,
      title: 'Graduate Trainee — Cloud Operations (Fresher)',
      description: 'A structured 12-month graduate programme for engineering freshers interested in cloud and infrastructure. You will rotate across our NOC, DevOps, and client delivery teams with a dedicated mentor.',
      responsibilities: [
        'Monitor cloud infrastructure dashboards and respond to low-severity alerts',
        'Assist senior engineers with Terraform and Ansible automation tasks',
        'Document runbooks and internal knowledge base articles',
        'Participate in weekly learning sessions covering AWS, Linux, and networking',
        'Complete 3 AWS Foundational or Associate certifications by end of Year 1',
      ],
      requirements: [
        'B.Tech / B.E. in Computer Science, IT, or Electronics (2023 or 2024 pass-out)',
        'Basic understanding of networking — IP addressing, DNS, HTTP',
        'Any cloud fundamentals certification (AWS Cloud Practitioner, Azure Fundamentals) is a bonus',
        'Strong learning attitude and ability to work in rotating shifts',
        'CGPA 7.0+ preferred',
      ],
      skills: ['aws', 'linux', 'networking', 'cloud fundamentals', 'monitoring'],
      jobType: 'Full-time',
      workplaceType: 'On-site',
      experienceLevel: 'Entry Level',
      location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
      salary: { min: 360000, max: 480000, currency: 'INR', isNegotiable: false },
      openings: 5,
      status: 'active',
      trustVerificationStatus: 'verified',
      isFromVerifiedEmployer: true,
      employerTrustScore: 85,
      applicationCount: 0,
      deadline: daysFromNow(60),
      createdAt: daysAgo(1),
    },
  ]);

  // ── GreenLeaf Biosciences (emp3) — 4 jobs ───────────────────────────────────
  const [job12, job13, job14, job15] = await JobListing.insertMany([
    {
      employer: emp3._id,
      title: 'Machine Learning Engineer — Computer Vision',
      description: 'Build and deploy the AI models that detect crop diseases from smartphone images submitted by farmers. Your work will directly improve livelihoods for thousands of smallholder farmers across AP and Telangana.',
      responsibilities: [
        'Train and fine-tune CNN and Vision Transformer models for disease classification',
        'Build the MLOps pipeline (data versioning, experiment tracking, model registry)',
        'Optimise models for on-device inference on low-end Android phones (ONNX / TFLite)',
        'Collaborate with agronomists to validate model outputs against field data',
        'Write technical reports for grant applications and research papers',
      ],
      requirements: [
        '3+ years in applied ML or computer vision (research or industry)',
        'Strong Python — PyTorch or TensorFlow, scikit-learn, OpenCV',
        'Experience with model compression — quantisation, pruning, knowledge distillation',
        'MLOps tools experience — MLflow, DVC, or similar',
        'M.Tech / PhD in CS, AI, or related field preferred but not required',
      ],
      skills: ['python', 'pytorch', 'computer vision', 'mlops', 'opencv', 'tensorflow lite', 'onnx'],
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      experienceLevel: 'Mid Level',
      location: { city: 'Hyderabad', state: 'Telangana', country: 'India' },
      salary: { min: 1600000, max: 2400000, currency: 'INR', isNegotiable: true },
      openings: 2,
      status: 'active',
      trustVerificationStatus: 'verified',
      isFromVerifiedEmployer: true,
      employerTrustScore: 88,
      applicationCount: 0,
      deadline: daysFromNow(30),
      createdAt: daysAgo(9),
    },
    {
      employer: emp3._id,
      title: 'Full-Stack Developer — AgriTech Platform',
      description: 'Build the farmer-facing mobile web app and the internal agronomy dashboard used by our field scientists. The stack is React Native (web), Node.js, and PostgreSQL.',
      responsibilities: [
        'Build and maintain the React Native Web farmer portal (offline-first, low-bandwidth optimised)',
        'Develop REST APIs for the agronomy dashboard and mobile app',
        'Design and manage PostgreSQL schemas for geo-tagged field data',
        'Integrate with WhatsApp Business API for farmer notifications',
        'Implement multilingual support for Telugu, Hindi, and English',
      ],
      requirements: [
        '2–4 years full-stack development experience',
        'React Native or React with strong mobile UX awareness',
        'Node.js backend — Express, REST API design',
        'PostgreSQL with PostGIS experience is a strong plus',
        'Low-bandwidth / offline-first architecture experience is highly valued',
      ],
      skills: ['react native', 'react', 'node.js', 'postgresql', 'postgis', 'whatsapp api', 'multilingual'],
      jobType: 'Full-time',
      workplaceType: 'Hybrid',
      experienceLevel: 'Mid Level',
      location: { city: 'Hyderabad', state: 'Telangana', country: 'India' },
      salary: { min: 1000000, max: 1600000, currency: 'INR', isNegotiable: false },
      openings: 1,
      status: 'active',
      trustVerificationStatus: 'verified',
      isFromVerifiedEmployer: true,
      employerTrustScore: 88,
      applicationCount: 0,
      deadline: daysFromNow(22),
      createdAt: daysAgo(4),
    },
    {
      employer: emp3._id,
      title: 'Research Intern — AI & Agriculture (6 months)',
      description: 'A 6-month paid research internship for final-year or recently graduated students interested in applying deep learning to real-world agricultural problems. You will contribute to published research and our production model pipeline.',
      responsibilities: [
        'Assist with dataset collection and annotation for new crop varieties',
        'Run baseline experiments and document results in shared notebooks',
        'Review recent literature and summarise findings in weekly team meetings',
        'Support model deployment testing on field-collected data',
      ],
      requirements: [
        'Final-year B.Tech or M.Tech in CS, AI, or Agriculture Engineering',
        'Python proficiency — NumPy, Pandas, Matplotlib',
        'Basic familiarity with PyTorch or TensorFlow',
        'Genuine interest in agricultural technology and social impact',
        'Strong written and verbal communication in English',
      ],
      skills: ['python', 'machine learning', 'pytorch', 'data annotation', 'research'],
      jobType: 'Internship',
      workplaceType: 'Hybrid',
      experienceLevel: 'Entry Level',
      location: { city: 'Hyderabad', state: 'Telangana', country: 'India' },
      salary: { min: 180000, max: 240000, currency: 'INR', isNegotiable: false },
      openings: 2,
      status: 'active',
      trustVerificationStatus: 'verified',
      isFromVerifiedEmployer: true,
      employerTrustScore: 88,
      applicationCount: 0,
      deadline: daysFromNow(14),
      createdAt: daysAgo(2),
    },
    {
      employer: emp3._id,
      title: 'Backend Developer — Data Ingestion (Freelance)',
      description: 'Short-term freelance project (2–3 months) to build a satellite imagery ingestion microservice that pulls NDVI and weather data from public APIs, stores it in S3, and triggers ML inference jobs.',
      responsibilities: [
        'Integrate with NASA MODIS, Sentinel Hub, and Open-Meteo APIs',
        'Build an async queue-based ingestion service (BullMQ / Redis)',
        'Store raw and processed imagery in S3 with appropriate metadata schemas',
        'Write a simple admin dashboard to monitor ingestion health',
      ],
      requirements: [
        '2+ years backend development experience',
        'Node.js — async patterns, queue management, REST API integration',
        'AWS S3 and Lambda basics',
        'Experience with geospatial data formats (GeoTIFF, NetCDF) is a plus',
        'Must be available for a 2-week sprint kickoff before starting async',
      ],
      skills: ['node.js', 'redis', 'aws s3', 'api integration', 'geospatial', 'bullmq'],
      jobType: 'Freelance',
      workplaceType: 'Remote',
      experienceLevel: 'Mid Level',
      location: { city: 'Hyderabad', state: 'Telangana', country: 'India' },
      salary: { min: 400000, max: 700000, currency: 'INR', isNegotiable: true },
      openings: 1,
      status: 'active',
      trustVerificationStatus: 'verified',
      isFromVerifiedEmployer: true,
      employerTrustScore: 88,
      applicationCount: 0,
      deadline: daysFromNow(10),
      createdAt: daysAgo(1),
    },
  ]);

  // ── SwiftLogix (emp4, unverified) — 2 jobs ───────────────────────────────────
  const [job16, job17] = await JobListing.insertMany([
    {
      employer: emp4._id,
      title: 'Delivery Operations Executive',
      description: 'Coordinate daily last-mile delivery operations across Jaipur city routes. Monitor rider performance, resolve customer escalations, and ensure on-time delivery SLAs.',
      responsibilities: [
        'Assign daily routes to 20–30 riders using the internal dispatch tool',
        'Track live delivery status and resolve escalations within 30 minutes',
        'Maintain daily operations logs and submit EOD reports',
        'Onboard and brief new riders on app usage and safety protocols',
        'Coordinate with warehouse staff for package handover',
      ],
      requirements: [
        '1+ year in logistics operations, delivery management, or field coordination',
        'Comfortable with smartphones and basic Excel / Google Sheets',
        'Strong communication skills in Hindi and basic English',
        'Willingness to work 6 days per week including weekends during peak season',
        'Own two-wheeler preferred',
      ],
      skills: ['operations', 'logistics', 'coordination', 'excel', 'hindi communication'],
      jobType: 'Full-time',
      workplaceType: 'On-site',
      experienceLevel: 'Entry Level',
      location: { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
      salary: { min: 240000, max: 360000, currency: 'INR', isNegotiable: false },
      openings: 4,
      status: 'active',
      trustVerificationStatus: 'pending',
      isFromVerifiedEmployer: false,
      employerTrustScore: 40,
      applicationCount: 0,
      deadline: daysFromNow(30),
      createdAt: daysAgo(5),
    },
    {
      employer: emp4._id,
      title: 'Android Developer — Rider App (Part-time)',
      description: 'Part-time Android developer to add new features to our rider-facing delivery app (Kotlin, Jetpack Compose). Estimated 20 hours per week, fully remote.',
      responsibilities: [
        'Implement new screens using Jetpack Compose following provided Figma designs',
        'Integrate Google Maps SDK for real-time route tracking',
        'Fix reported bugs from TestFlight / Firebase App Distribution builds',
        'Write basic instrumentation tests for new flows',
      ],
      requirements: [
        '1+ year Android development experience (Kotlin)',
        'Hands-on Jetpack Compose experience',
        'Familiarity with MVVM architecture and Retrofit',
        'Available for daily async standups (Slack)',
        'Able to commit to 20 hrs/week consistently',
      ],
      skills: ['android', 'kotlin', 'jetpack compose', 'google maps sdk', 'retrofit', 'mvvm'],
      jobType: 'Part-time',
      workplaceType: 'Remote',
      experienceLevel: 'Entry Level',
      location: { city: 'Jaipur', state: 'Rajasthan', country: 'India' },
      salary: { min: 300000, max: 480000, currency: 'INR', isNegotiable: true },
      openings: 1,
      status: 'active',
      trustVerificationStatus: 'pending',
      isFromVerifiedEmployer: false,
      employerTrustScore: 40,
      applicationCount: 0,
      deadline: daysFromNow(20),
      createdAt: daysAgo(3),
    },
  ]);

  // ── FastJobs India (emp5, SUSPENDED) — 1 suspended job ──────────────────────
  const [job18] = await JobListing.insertMany([
    {
      employer: emp5._id,
      title: 'Work From Home Data Entry — Earn ₹800/day',
      description: 'SUSPENDED — This listing was removed for violating TrustHire safety policies. The employer demanded a ₹2,000 registration fee before providing any work.',
      responsibilities: [],
      requirements: [],
      skills: ['data entry'],
      jobType: 'Part-time',
      workplaceType: 'Remote',
      experienceLevel: 'Entry Level',
      location: { city: 'Delhi', state: 'Delhi', country: 'India' },
      salary: { min: 0, max: 0, currency: 'INR', isNegotiable: false },
      openings: 1,
      status: 'suspended',
      trustVerificationStatus: 'flagged',
      isFromVerifiedEmployer: false,
      employerTrustScore: 0,
      applicationCount: 0,
      createdAt: daysAgo(20),
    },
  ]);

  console.log('[Seed]    ✓ 18 job listings created (15 active, 1 closed, 1 suspended, 1 draft).');

  // ════════════════════════════════════════════════════════════════════════════
  // 4.  JOBSEEKER PROFILES
  // ════════════════════════════════════════════════════════════════════════════
  console.log('\n[Seed] 📋  Creating jobseeker profiles...');

  await JobSeekerProfile.insertMany([
    {
      userId: usAarav._id,
      headline: 'Senior Full-Stack Developer — React, Node.js, TypeScript',
      summary: '5 years building production web applications across fintech and edtech. Strong believer in clean architecture, test-driven development, and shipping code that lasts. Currently exploring Senior or Staff-level opportunities with remote-first teams.',
      skills: ['react', 'typescript', 'node.js', 'postgresql', 'redis', 'docker', 'aws', 'tailwind css', 'graphql'],
      education: [
        { institution: 'IIT Bombay', degree: 'B.Tech', field: 'Computer Science & Engineering', startYear: 2015, endYear: 2019, isCurrently: false },
      ],
      experience: [
        { company: 'Razorpay', role: 'Software Engineer II', startDate: new Date('2021-06-01'), endDate: new Date('2024-04-01'), isCurrently: false, description: 'Built and maintained the checkout SDK used by 500k+ merchants. Led migration of the payment widget from legacy jQuery to React.' },
        { company: 'Vedantu', role: 'Frontend Developer', startDate: new Date('2019-08-01'), endDate: new Date('2021-05-31'), isCurrently: false, description: 'Developed live classroom features and interactive quiz modules using React and WebSocket.' },
      ],
      resumeUrl: 'https://cdn.trusthire.in/demo/resumes/aarav_singh_resume.pdf',
      preferredLocations: ['Bengaluru', 'Remote'],
      preferredRoles: ['Senior Full-Stack Engineer', 'Staff Engineer', 'Tech Lead'],
      preferredJobType: 'fulltime',
      salaryExpectation: { min: 2000000, max: 2800000 },
      isOpenToWork: true,
      noticePeriod: '1month',
    },
    {
      userId: usPreeti._id,
      headline: 'Data Engineer | Python · dbt · Airflow · AWS',
      summary: '3 years in data engineering with a focus on building reliable ELT pipelines and data quality frameworks. Looking for a senior IC role at a product company where data infrastructure is treated as a first-class product.',
      skills: ['python', 'sql', 'dbt', 'apache airflow', 'aws', 'redshift', 'spark', 'great expectations', 'pandas'],
      education: [
        { institution: 'BITS Pilani', degree: 'B.E.', field: 'Information Systems', startYear: 2017, endYear: 2021, isCurrently: false },
      ],
      experience: [
        { company: 'BrightWave IT Solutions', role: 'Data Engineer', startDate: new Date('2021-09-01'), endDate: null, isCurrently: true, description: 'Own the data lakehouse for 8 enterprise clients. Reduced pipeline failure rate by 60% through idempotent DAG redesign.' },
      ],
      resumeUrl: 'https://cdn.trusthire.in/demo/resumes/preeti_nair_resume.pdf',
      preferredLocations: ['Pune', 'Remote', 'Mumbai'],
      preferredRoles: ['Senior Data Engineer', 'Data Infrastructure Engineer', 'Analytics Engineer'],
      preferredJobType: 'fulltime',
      salaryExpectation: { min: 1600000, max: 2200000 },
      isOpenToWork: true,
      noticePeriod: '2months',
    },
    {
      userId: usSameer._id,
      headline: 'Entry-Level Android Developer | Kotlin · Jetpack Compose',
      summary: 'Final-year B.Tech student with two shipped personal Android apps and a 3-month internship at a Pune-based startup. Passionate about crafting smooth, performant mobile experiences. Actively seeking full-time or part-time Android roles.',
      skills: ['kotlin', 'android', 'jetpack compose', 'retrofit', 'room db', 'mvvm', 'firebase', 'git'],
      education: [
        { institution: 'Pune Institute of Computer Technology', degree: 'B.E.', field: 'Computer Engineering', startYear: 2020, endYear: 2024, isCurrently: false },
      ],
      experience: [
        { company: 'UrbanPay Technologies', role: 'Android Developer Intern', startDate: new Date('2023-06-01'), endDate: new Date('2023-08-31'), isCurrently: false, description: 'Added new onboarding screens and integrated Razorpay payment flow into the merchant app using Jetpack Compose.' },
      ],
      resumeUrl: 'https://cdn.trusthire.in/demo/resumes/sameer_qureshi_resume.pdf',
      preferredLocations: ['Pune', 'Mumbai', 'Remote'],
      preferredRoles: ['Android Developer', 'Mobile Developer', 'Junior Software Engineer'],
      preferredJobType: 'any',
      salaryExpectation: { min: 480000, max: 720000 },
      isOpenToWork: true,
      noticePeriod: 'immediate',
    },
    {
      userId: usAnanya._id,
      headline: 'ML Engineer | Computer Vision · PyTorch · Edge AI',
      summary: 'M.Tech in AI from IIT Hyderabad with 2 years of industry experience deploying computer vision models in production. Deeply interested in on-device ML and solving real problems in agritech and healthcare.',
      skills: ['python', 'pytorch', 'opencv', 'tensorflow lite', 'onnx', 'mlops', 'mlflow', 'fastapi', 'docker'],
      education: [
        { institution: 'IIT Hyderabad', degree: 'M.Tech', field: 'Artificial Intelligence', startYear: 2020, endYear: 2022, isCurrently: false },
        { institution: 'JNTU Hyderabad', degree: 'B.Tech', field: 'Electronics & Communication', startYear: 2016, endYear: 2020, isCurrently: false },
      ],
      experience: [
        { company: 'Intel India', role: 'AI Engineer', startDate: new Date('2022-08-01'), endDate: new Date('2024-07-31'), isCurrently: false, description: 'Optimised object detection models (YOLOv8) for deployment on Intel OpenVINO runtime. Achieved 3x inference speedup with <1% accuracy drop.' },
      ],
      resumeUrl: 'https://cdn.trusthire.in/demo/resumes/ananya_reddy_resume.pdf',
      preferredLocations: ['Hyderabad', 'Bengaluru', 'Remote'],
      preferredRoles: ['ML Engineer', 'Computer Vision Engineer', 'Applied AI Researcher'],
      preferredJobType: 'fulltime',
      salaryExpectation: { min: 1800000, max: 2600000 },
      isOpenToWork: true,
      noticePeriod: 'immediate',
    },
  ]);

  console.log('[Seed]    ✓ 4 jobseeker profiles created.');

  // ════════════════════════════════════════════════════════════════════════════
  // 5.  APPLICATIONS
  // ════════════════════════════════════════════════════════════════════════════
  console.log('\n[Seed] 📨  Creating applications...');

  // Re-fetch job IDs with their employer refs to use in Application.employer field
  const applications = await Application.insertMany([
    // Aarav applied to job1 (Senior FSE at NexGen) → shortlisted
    {
      job: job1._id, candidate: usAarav._id, employer: emp1._id,
      resumeUrl: 'https://cdn.trusthire.in/demo/resumes/aarav_singh_resume.pdf',
      coverLetter: 'I have been following NexGen\'s engineering blog closely and the way you approached distributed consistency in your last post convinced me this is the right team. I bring 5 years of full-stack production experience and would love to contribute to the merchant analytics platform.',
      contactPhone: '+91 98765 43210',
      portfolioUrl: 'https://aarav.dev',
      status: 'shortlisted',
      notes: 'Strong portfolio. Schedule technical interview with Pradeep.',
      createdAt: daysAgo(8),
    },
    // Aarav also applied to job2 (DevOps at NexGen) → reviewing
    {
      job: job2._id, candidate: usAarav._id, employer: emp1._id,
      resumeUrl: 'https://cdn.trusthire.in/demo/resumes/aarav_singh_resume.pdf',
      coverLetter: 'Alongside my full-stack work I have managed Docker Compose and basic AWS deployments. I am keen to transition into a dedicated DevOps role and believe this position is the right bridge.',
      contactPhone: '+91 98765 43210',
      portfolioUrl: 'https://aarav.dev',
      status: 'reviewing',
      notes: '',
      createdAt: daysAgo(6),
    },
    // Aarav applied to job7 (Cloud Architect at BrightWave) → interview stage
    {
      job: job7._id, candidate: usAarav._id, employer: emp2._id,
      resumeUrl: 'https://cdn.trusthire.in/demo/resumes/aarav_singh_resume.pdf',
      coverLetter: 'Client-facing architecture work is the next step I am looking for. I have designed and deployed multi-region AWS infrastructure for two fintech clients and am confident I can bring that expertise to BrightWave engagements.',
      contactPhone: '+91 98765 43210',
      portfolioUrl: 'https://aarav.dev',
      status: 'interview',
      notes: 'Technical round passed. Final round with Arjun on Friday.',
      createdAt: daysAgo(10),
    },
    // Preeti applied to job8 (Data Engineer at BrightWave) → hired 🎉
    {
      job: job8._id, candidate: usPreeti._id, employer: emp2._id,
      resumeUrl: 'https://cdn.trusthire.in/demo/resumes/preeti_nair_resume.pdf',
      coverLetter: 'I currently work at BrightWave and am applying through TrustHire to formalise the internal transfer to the data platform team. My manager Arjun has already confirmed the move.',
      contactPhone: '+91 87654 32109',
      portfolioUrl: '',
      status: 'hired',
      notes: 'Internal transfer confirmed. Offer letter sent 14 Sep.',
      createdAt: daysAgo(20),
    },
    // Preeti applied to job12 (ML Engineer at GreenLeaf) → applied
    {
      job: job12._id, candidate: usPreeti._id, employer: emp3._id,
      resumeUrl: 'https://cdn.trusthire.in/demo/resumes/preeti_nair_resume.pdf',
      coverLetter: 'I am actively exploring agritech opportunities and your computer vision pipeline work is exactly the kind of real-world impact I want to move towards. Happy to discuss how my data engineering background complements the MLOps needs of this role.',
      contactPhone: '+91 87654 32109',
      portfolioUrl: '',
      status: 'applied',
      notes: '',
      createdAt: daysAgo(2),
    },
    // Sameer applied to job17 (Android part-time at SwiftLogix) → reviewing
    {
      job: job17._id, candidate: usSameer._id, employer: emp4._id,
      resumeUrl: 'https://cdn.trusthire.in/demo/resumes/sameer_qureshi_resume.pdf',
      coverLetter: 'I am a final-year student with hands-on Jetpack Compose experience and can commit 20 hours per week. I have built the UI for two personal apps using Compose and Retrofit — happy to share the GitHub links.',
      contactPhone: '+91 76543 21098',
      portfolioUrl: 'https://github.com/sameer-qureshi-dev',
      status: 'reviewing',
      notes: 'Promising portfolio. Check GitHub links.',
      createdAt: daysAgo(3),
    },
    // Sameer applied to job4 (Junior Frontend at NexGen) → rejected
    {
      job: job4._id, candidate: usSameer._id, employer: emp1._id,
      resumeUrl: 'https://cdn.trusthire.in/demo/resumes/sameer_qureshi_resume.pdf',
      coverLetter: 'While my primary stack is Android, I have strong JavaScript fundamentals and have built a React dashboard for a college project. I am a quick learner and eager to expand into web.',
      contactPhone: '+91 76543 21098',
      portfolioUrl: 'https://github.com/sameer-qureshi-dev',
      status: 'rejected',
      notes: 'Skills profile better suited for Android role. Advised to re-apply for mobile positions.',
      createdAt: daysAgo(7),
    },
    // Ananya applied to job12 (ML Engineer at GreenLeaf) → shortlisted
    {
      job: job12._id, candidate: usAnanya._id, employer: emp3._id,
      resumeUrl: 'https://cdn.trusthire.in/demo/resumes/ananya_reddy_resume.pdf',
      coverLetter: 'My M.Tech research and 2 years at Intel have been entirely focused on deploying efficient computer vision models to edge devices — which is exactly what your crop disease detection app needs. I am particularly excited by the on-device inference challenge given rural network constraints.',
      contactPhone: '+91 65432 10987',
      portfolioUrl: 'https://ananyareddy.ai',
      status: 'shortlisted',
      notes: 'Excellent match. Send take-home assignment.',
      createdAt: daysAgo(5),
    },
    // Ananya applied to job14 (Intern at GreenLeaf) → applied
    {
      job: job14._id, candidate: usAnanya._id, employer: emp3._id,
      resumeUrl: 'https://cdn.trusthire.in/demo/resumes/ananya_reddy_resume.pdf',
      coverLetter: 'Applying as a backup in case the ML Engineer role timeline extends — I am very keen to work at GreenLeaf in any capacity and can contribute meaningfully to dataset collection and annotation from Day 1.',
      contactPhone: '+91 65432 10987',
      portfolioUrl: 'https://ananyareddy.ai',
      status: 'applied',
      notes: '',
      createdAt: daysAgo(4),
    },
    // Ananya applied to job5 (Payments Backend at NexGen) → applied
    {
      job: job5._id, candidate: usAnanya._id, employer: emp1._id,
      resumeUrl: 'https://cdn.trusthire.in/demo/resumes/ananya_reddy_resume.pdf',
      coverLetter: 'Exploring backend roles as an alternative path. I have strong Python skills and have worked with async queues in my MLOps pipelines, which I believe translates well to the payment orchestration domain.',
      contactPhone: '+91 65432 10987',
      portfolioUrl: 'https://ananyareddy.ai',
      status: 'applied',
      notes: '',
      createdAt: daysAgo(1),
    },
  ]);

  // Update applicationCount on affected jobs
  await JobListing.findByIdAndUpdate(job1._id, { applicationCount: 1 });
  await JobListing.findByIdAndUpdate(job2._id, { applicationCount: 1 });
  await JobListing.findByIdAndUpdate(job4._id, { applicationCount: 1 });
  await JobListing.findByIdAndUpdate(job5._id, { applicationCount: 1 });
  await JobListing.findByIdAndUpdate(job7._id, { applicationCount: 1 });
  await JobListing.findByIdAndUpdate(job8._id, { applicationCount: 1 });
  await JobListing.findByIdAndUpdate(job12._id, { applicationCount: 2 });
  await JobListing.findByIdAndUpdate(job14._id, { applicationCount: 1 });
  await JobListing.findByIdAndUpdate(job17._id, { applicationCount: 1 });

  console.log('[Seed]    ✓ 10 applications created across all pipeline stages.');

  // ════════════════════════════════════════════════════════════════════════════
  // 6.  FRAUD REPORTS
  // ════════════════════════════════════════════════════════════════════════════
  console.log('\n[Seed] 🚨  Creating fraud reports...');

  await FraudReport.insertMany([
    // 3 × verified reports against FastJobs India (triggering suspension)
    {
      reporter: usAarav._id,
      isAnonymous: false,
      reporterContact: { name: 'Aarav Singh', email: 'aarav.singh@gmail.com', phone: '+91 98765 43210' },
      employer: emp5._id,
      fraudCategory: 'Registration Fee / Security Deposit',
      severity: 'Critical',
      title: 'Demanded ₹2,000 "processing fee" before providing any work',
      description: 'I responded to a Work From Home data entry ad posted by FastJobs India. After a 10-minute WhatsApp interview, they sent me an "appointment letter" and asked me to deposit ₹2,000 into a personal UPI ID (not a company account) as a "registration fee". When I asked for a company bank account or invoice, they stopped responding. Classic advance-fee scam targeting job seekers.',
      amountDemanded: 2000,
      evidenceFiles: [],
      status: 'verified',
      adminNotes: 'Confirmed advance-fee fraud. UPI ID belongs to an individual with no registered business. Employer account suspended.',
      resolvedBy: admin._id,
      resolvedAt: daysAgo(15),
      createdAt: daysAgo(18),
    },
    {
      reporter: usPreeti._id,
      isAnonymous: true,
      reporterContact: {},
      employer: emp5._id,
      fraudCategory: 'Fake Offer Letter',
      severity: 'High',
      title: 'Fake offer letter with TCS letterhead sent after paying ₹1,500',
      description: 'FastJobs India promised placement at TCS for a data entry role. After I paid ₹1,500 via Google Pay, they sent me a forged offer letter on a TCS letterhead. The TCS employee ID on the letter does not exist. TCS HR confirmed they have no relationship with this agency.',
      amountDemanded: 1500,
      evidenceFiles: [],
      status: 'verified',
      adminNotes: 'TCS India HR team confirmed forgery. Document shared with cyber cell. Second verified report against this employer.',
      resolvedBy: admin._id,
      resolvedAt: daysAgo(12),
      createdAt: daysAgo(14),
    },
    {
      reporter: usSameer._id,
      isAnonymous: false,
      reporterContact: { name: 'Sameer Qureshi', email: 'sameer.q@outlook.com', phone: '+91 76543 21098' },
      employer: emp5._id,
      fraudCategory: 'Phishing / Impersonation',
      severity: 'Critical',
      title: 'Impersonated government DOPT recruiter, collected Aadhaar and PAN',
      description: 'The recruiter claimed to be from the Department of Personnel and Training (DoPT) and asked me to submit my Aadhaar card, PAN card, and bank passbook "for background verification". I later received a fraudulent loan application in my name. Filed an FIR at Cyber Crime PS Pune (FIR No. 2024/CC/1842).',
      amountDemanded: 0,
      evidenceFiles: [],
      status: 'verified',
      adminNotes: 'Identity theft confirmed. Third verified report — employer auto-suspended. FIR details filed with CERT-In.',
      resolvedBy: admin._id,
      resolvedAt: daysAgo(8),
      createdAt: daysAgo(10),
    },
    // 2 × investigating reports against SwiftLogix (unverified employer)
    {
      reporter: usAnanya._id,
      isAnonymous: true,
      reporterContact: {},
      employer: emp4._id,
      fraudCategory: 'Misleading Salary / Job Role',
      severity: 'Medium',
      title: 'Delivery executive role advertised at ₹25,000/month but actual take-home is ₹8,000',
      description: 'The job listing said ₹20,000–30,000/month. After joining and working for 3 weeks, I was told the salary is purely incentive-based with a base of only ₹4,000. No mention of this in the listing, offer letter, or during the interview. Multiple colleagues have reported the same experience.',
      amountDemanded: 0,
      evidenceFiles: [],
      status: 'investigating',
      adminNotes: 'Employer contacted for salary structure documentation. Awaiting response by 30 Sep.',
      resolvedBy: admin._id,
      resolvedAt: null,
      createdAt: daysAgo(6),
    },
    {
      reporter: null,
      isAnonymous: true,
      reporterContact: {},
      employer: emp4._id,
      fraudCategory: 'Unpaid Trial Work',
      severity: 'Low',
      title: 'Asked to complete 2-day unpaid "trial" delivery shift before contract',
      description: 'SwiftLogix asked me to complete 2 full days of delivery work as an "assessment" before signing any contract. After completing the shifts I was told I "did not pass" and was not compensated for the work done. This seems to be a pattern based on a group I found online with similar reports.',
      amountDemanded: 0,
      evidenceFiles: [],
      status: 'investigating',
      adminNotes: 'Second complaint against this employer. Escalating to senior review.',
      resolvedBy: null,
      resolvedAt: null,
      createdAt: daysAgo(4),
    },
    // 2 × pending reports (freshly submitted, not yet reviewed)
    {
      reporter: usAarav._id,
      isAnonymous: false,
      reporterContact: { name: 'Aarav Singh', email: 'aarav.singh@gmail.com', phone: '+91 98765 43210' },
      employer: emp1._id,
      fraudCategory: 'Phishing / Impersonation',
      severity: 'High',
      title: 'External impersonator using NexGen logo in WhatsApp job offer',
      description: 'I received a WhatsApp message from +91 9123456789 claiming to be NexGen Technologies HR, offering me a ₹3 LPA remote job without any interview. They sent a logo-branded "appointment letter" and asked for a ₹5,000 laptop security deposit. NexGen official LinkedIn confirmed they are not hiring remotely at this salary range and have no such HR contact.',
      amountDemanded: 5000,
      evidenceFiles: [],
      status: 'pending',
      adminNotes: '',
      resolvedBy: null,
      resolvedAt: null,
      createdAt: daysAgo(1),
    },
    {
      reporter: null,
      isAnonymous: true,
      reporterContact: {},
      employer: emp3._id,
      fraudCategory: 'Registration Fee / Security Deposit',
      severity: 'Medium',
      title: 'Someone posing as GreenLeaf Biosciences asked ₹800 for "lab kit"',
      description: 'A profile on Naukri.com claiming to represent GreenLeaf Biosciences reached out and offered a remote data annotation internship. After a brief call they asked for ₹800 to purchase a "lab annotation kit". GreenLeaf official website lists no such internship and their contact form confirmed they do not charge candidates.',
      amountDemanded: 800,
      evidenceFiles: [],
      status: 'pending',
      adminNotes: '',
      resolvedBy: null,
      resolvedAt: null,
      createdAt: daysAgo(0),
    },
    // 1 × dismissed report (unfounded complaint)
    {
      reporter: usPreeti._id,
      isAnonymous: false,
      reporterContact: { name: 'Preeti Nair', email: 'preeti.nair@gmail.com', phone: '+91 87654 32109' },
      employer: emp2._id,
      fraudCategory: 'Misleading Salary / Job Role',
      severity: 'Low',
      title: 'CTC offered was lower than advertised range',
      description: 'BrightWave advertised ₹14–20 LPA for the Data Engineer role but offered me ₹13.5 LPA. I feel this was misleading.',
      amountDemanded: 0,
      evidenceFiles: [],
      status: 'dismissed',
      adminNotes: 'Salary range in listing reflects CTC band. Offered CTC (₹13.5 LPA) is within normal variation for experience level. No fraudulent intent found. Candidate advised that listed ranges are indicative.',
      resolvedBy: admin._id,
      resolvedAt: daysAgo(3),
      createdAt: daysAgo(7),
    },
  ]);

  console.log('[Seed]    ✓ 8 fraud reports created (3 verified, 2 investigating, 2 pending, 1 dismissed).');

  // ════════════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ════════════════════════════════════════════════════════════════════════════
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║            TrustHire Seed Complete ✅                        ║
╠══════════════════════════════════════════════════════════════╣
║  USERS                                                       ║
║    Admin       → admin@trusthire.in       / Admin@TrustHire2024  ║
║    Employer 1  → riya@nexgentech.in       / Employer@123     ║
║    Employer 2  → arjun@brightwaveit.com   / Employer@123     ║
║    Employer 3  → neha@greenleafbio.co.in  / Employer@123     ║
║    Employer 4  → vijay@swiftlogix.io      / Employer@123     ║
║    Employer 5  → hr@fastjobs-india.com    / Employer@123     ║
║    Seeker 1    → aarav.singh@gmail.com    / Seeker@123       ║
║    Seeker 2    → preeti.nair@gmail.com    / Seeker@123       ║
║    Seeker 3    → sameer.q@outlook.com     / Seeker@123       ║
║    Seeker 4    → ananya.reddy@yahoo.com   / Seeker@123       ║
╠══════════════════════════════════════════════════════════════╣
║  CONTENT                                                     ║
║    18 Job Listings  (15 active, 1 closed, 1 suspended)       ║
║    10 Applications  (hired/shortlisted/interview/reviewing/  ║
║                      applied/rejected)                       ║
║     8 Fraud Reports (3 verified, 2 investigating,            ║
║                      2 pending, 1 dismissed)                 ║
║     4 Jobseeker Profiles (with education + experience)       ║
╠══════════════════════════════════════════════════════════════╣
║  EMPLOYER STATUS                                             ║
║    NexGen Technologies  → Verified  · Trust 90              ║
║    BrightWave IT        → Verified  · Trust 85              ║
║    GreenLeaf Bio        → Verified  · Trust 88              ║
║    SwiftLogix           → Unverified· Trust 40              ║
║    FastJobs India       → SUSPENDED · Trust  0              ║
╚══════════════════════════════════════════════════════════════╝
`);

  process.exit(0);
};

seed().catch((err) => {
  console.error('[Seed] ❌  Fatal error:', err);
  process.exit(1);
});
