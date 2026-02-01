import type { Project } from '@/types/project';

export const projects: Project[] = [
  {
    id: 'ems',
    title: 'Employee Management System',
    type: 'Full-stack Web Application',
    description:
      'Production-ready employee management system with authentication, role-based access, attendance, leave management, and analytics dashboard.',
    longDescription:
      'A production-ready employee management system built with ASP.NET Core featuring dual authentication (Cookie + JWT), role-based access control, attendance tracking, leave workflows, and a real-time analytics dashboard. The system is fully dockerized with multi-arch images published to Docker Hub.',
    techStack: [
      'ASP.NET Core',
      'C#',
      'Entity Framework Core',
      'PostgreSQL',
      'ASP.NET Identity',
      'JWT',
      'Docker',
      'Tailwind CSS',
      'Postman',
    ],
    githubUrl: 'https://github.com/sumdahl/ems',
    imageUrl: '/images/projects/ems.png',
    featured: true,
    features: [
      'Dual authentication (Cookie-based Web UI + JWT API)',
      'Role-based access control (Admin, Manager, Employee)',
      'Attendance check-in/check-out with work-hour calculation',
      'Leave request and approval workflow',
      'Real-time analytics dashboard',
      'EF Core migrations and database seeding',
      'Dockerized with multi-arch (AMD64/ARM64) images',
    ],
    challenges: [
      'Designing secure dual authentication flows',
      'Implementing fine-grained RBAC across the system',
      'Accurate attendance and work-hour calculations',
    ],
    date: '2026-01-12',
  },

  {
    id: 'subscription-tracker',
    title: 'Subscription Tracker API',
    type: 'RESTful Backend API',
    description:
      'Secure REST API for managing and tracking user subscriptions across multiple services.',
    longDescription:
      'A secure and scalable RESTful API that allows users to manage and track subscriptions with proper authentication, authorization, validation, and error handling. Fully tested and documented using Postman.',
    techStack: ['Node.js', 'JavaScript', 'MongoDB', 'JWT', 'Postman'],
    githubUrl: 'https://github.com/sumdahl/subscription-tracker',
    featured: false,
    features: [
      'CRUD operations with validation',
      'Authentication and authorization for user-specific data',
      'Centralized error handling',
      'API testing and documentation with Postman',
    ],
    date: '2024-02-01',
  },

  {
    id: 'saramsa',
    title: 'Saramsa — AI PDF Summarizer',
    type: 'Full-stack AI Application',
    description:
      'AI-powered platform to upload PDFs and generate concise summaries using custom prompts.',
    longDescription:
      'A full-stack AI application that enables users to upload PDF documents, extract text, and generate concise AI-powered summaries using custom prompt engineering. Deployed and maintained on Vercel.',
    techStack: [
      'Next.js',
      'NeonDB',
      'LangChain',
      'Gemini API',
      'UploadThing',
    ],
    githubUrl: 'https://github.com/sumdahl/saramsa-chat-with-pdf',
    liveUrl: 'https://saramsa.vercel.app',
    imageUrl: '/images/projects/saramsa.png',
    featured: true,
    features: [
      'Secure PDF upload and storage',
      'Text extraction and chunking from PDFs',
      'AI-generated summaries using custom prompts',
      'Production deployment on Vercel',
    ],
    challenges: [
      'Efficient PDF text extraction and chunking',
      'Optimizing prompt design for high-quality summaries',
    ],
    date: '2025-03-01',
  },

  {
    id: 'x-clone',
    title: 'Twitter (X) Clone',
    type: 'Frontend Application',
    description:
      'Responsive UI clone of Twitter (X) optimized for all screen sizes.',
    longDescription:
      'A pixel-perfect, responsive frontend clone of Twitter (X) built with reusable components and modern layout techniques.',
    techStack: ['React', 'Next.js', 'Tailwind CSS'],
    githubUrl: 'https://github.com/sumdahl/x-clone',
    featured: false,
    features: [
      'Reusable UI components',
      'Fully responsive layouts',
      'Clean and scalable component structure',
    ],
    date: '2025-02-28',
  },

  {
    id: 'oodie-clone',
    title: 'Oodie E-Commerce Clone',
    type: 'Frontend UI Clone',
    description:
      'Clean and modern clone of Oodie’s product listing interface.',
    longDescription:
      'A fully responsive e-commerce UI clone focused on clean design, component-driven architecture, and modern frontend best practices.',
    techStack: [
      'React',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'shadcn/ui',
    ],
    githubUrl: 'https://github.com/sumdahl/oodie.git',
    featured: false,
    features: [
      'Fully responsive product listing layout',
      'Component-driven UI architecture',
      'Modern styling with shadcn/ui',
    ],
    date: '2025-01-15',
  },
];
