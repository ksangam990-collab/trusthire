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

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Employer from '../models/Employer.js';
import JobListing from '../models/JobListing.js';
import FraudReport from '../models/FraudReport.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI is required in environment variables for seeding.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB.');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Employer.deleteMany({}),
      JobListing.deleteMany({}),
      FraudReport.deleteMany({})
    ]);
    console.log('[Seed] Existing records cleared.');

    // 1. Create Users
    const employerUser1 = await User.create({
      name: 'Priya Sharma',
      email: 'recruiter@techcorp.in',
      password: 'Password123!',
      role: 'employer',
      isEmailVerified: true
    });

    const employerUser2 = await User.create({
      name: 'Aditya Mehta',
      email: 'careers@innovatelabs.io',
      password: 'Password123!',
      role: 'employer',
      isEmailVerified: true
    });

    const candidateUser = await User.create({
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      password: 'Password123!',
      role: 'jobseeker',
      isEmailVerified: true
    });

    const adminUser = await User.create({
      name: 'TrustHire Security Ops',
      email: 'admin@trusthire.in',
      password: 'AdminPassword123!',
      role: 'admin',
      isEmailVerified: true
    });

    // 2. Create Employer Profiles
    const employer1 = await Employer.create({
      user: employerUser1._id,
      companyName: 'TechCorp India Pvt Ltd',
      website: 'https://techcorp.in',
      industry: 'Software Development',
      companySize: '51-200',
      description: 'Enterprise cloud and distributed systems consultancy operating across India.',
      location: {
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        address: 'Outer Ring Road, Bellandur'
      },
      verificationStatus: 'verified',
      cin: 'U72900KA2020PTC138765',
      gstin: '29AAACT1234A1Z5',
      verificationDate: new Date(),
      trustScore: 90,
      scoreBreakdown: {
        legalVerification: 30,
        domainVerified: 10,
        companyAge: 10,
        cleanRecordBonus: 10,
        fraudPenalty: 0
      },
      verifiedFraudReports: 0
    });

    const employer2 = await Employer.create({
      user: employerUser2._id,
      companyName: 'Innovate Digital Solutions',
      website: 'https://innovatelabs.io',
      industry: 'Fintech',
      companySize: '11-50',
      description: 'Next-generation payment gateway infrastructure and API tooling.',
      location: {
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        address: 'Bandra Kurla Complex'
      },
      verificationStatus: 'verified',
      cin: 'U74999MH2021PTC362145',
      gstin: '27AABCI9876B1Z2',
      verificationDate: new Date(),
      trustScore: 85,
      scoreBreakdown: {
        legalVerification: 30,
        domainVerified: 10,
        companyAge: 10,
        cleanRecordBonus: 10,
        fraudPenalty: 0
      },
      verifiedFraudReports: 0
    });

    // 3. Create Verified Job Listings
    await JobListing.create([
      {
        employer: employer1._id,
        title: 'Senior Full Stack Engineer (React & Node.js)',
        description: 'We are seeking a seasoned full-stack engineer to build scalable distributed microservices and intuitive web interfaces.',
        responsibilities: [
          'Design resilient REST and WebSocket APIs using Express and Node.js',
          'Build responsive UI applications using React, Tailwind CSS, and Zustand',
          'Optimize database queries and aggregations in MongoDB'
        ],
        requirements: [
          '4+ years of professional full-stack development experience',
          'Strong understanding of asynchronous JavaScript and backend architecture',
          'Hands-on experience with containerization and cloud infrastructure'
        ],
        skills: ['react', 'node.js', 'mongodb', 'tailwind css', 'docker'],
        jobType: 'Full-time',
        workplaceType: 'Remote',
        experienceLevel: 'Senior Level',
        location: {
          city: 'Bengaluru',
          state: 'Karnataka',
          country: 'India'
        },
        salary: {
          min: 1800000,
          max: 2600000,
          currency: 'INR',
          isNegotiable: false
        },
        openings: 2,
        status: 'active',
        trustVerificationStatus: 'verified',
        isFromVerifiedEmployer: true,
        employerTrustScore: 90
      },
      {
        employer: employer2._id,
        title: 'Backend Security Engineer',
        description: 'Join our security infrastructure team to harden payment pipelines and audit API authentication workflows.',
        responsibilities: [
          'Audit and enforce cryptographic integrity across API endpoints',
          'Implement rate-limiting and threat mitigation middleware',
          'Conduct vulnerability assessments on backend microservices'
        ],
        requirements: [
          '3+ years focusing on backend engineering and application security',
          'Deep knowledge of JWT authentication, CORS, and HTTP security headers',
          'Familiarity with Node.js and OWASP Top 10 vulnerabilities'
        ],
        skills: ['node.js', 'security', 'cryptography', 'express', 'redis'],
        jobType: 'Full-time',
        workplaceType: 'Hybrid',
        experienceLevel: 'Mid Level',
        location: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India'
        },
        salary: {
          min: 1500000,
          max: 2200000,
          currency: 'INR',
          isNegotiable: true
        },
        openings: 1,
        status: 'active',
        trustVerificationStatus: 'verified',
        isFromVerifiedEmployer: true,
        employerTrustScore: 85
      }
    ]);

    // 4. Create Public Fraud Intelligence Incident Record
    await FraudReport.create({
      reporter: candidateUser._id,
      isAnonymous: true,
      employer: employer1._id,
      fraudCategory: 'Registration Fee / Security Deposit',
      severity: 'High',
      title: 'Impersonator requesting ₹3,500 background check charge via WhatsApp',
      description: 'An external party claiming to be an HR coordinator from TechCorp reached out via WhatsApp offering an immediate placement conditional on transferring a background check fee to an unverified UPI ID.',
      amountDemanded: 3500,
      evidenceFiles: [],
      status: 'verified',
      adminNotes: 'Confirmed external phishing impersonator using spoofed recruiter logos. Official domain verified clean.',
      resolvedBy: adminUser._id,
      resolvedAt: new Date()
    });

    console.log('[Seed] Database successfully seeded with verified employers, openings, and fraud intelligence data.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
