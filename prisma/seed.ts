import { PrismaClient, Role, UserStatus, ContentType, SubmissionStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Admin account
  const adminHash = await bcrypt.hash('Admin@123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@borderlesstech.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@borderlesstech.com',
      passwordHash: adminHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  })

  // Sample students
  const studentHash = await bcrypt.hash('Student@123', 12)
  const student1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      passwordHash: studentHash,
      role: Role.STUDENT,
      cohort: 'Cohort 3',
      status: UserStatus.ACTIVE,
    },
  })

  const student2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      passwordHash: studentHash,
      role: Role.STUDENT,
      cohort: 'Cohort 3',
      status: UserStatus.ACTIVE,
    },
  })

  const student3 = await prisma.user.upsert({
    where: { email: 'carol@example.com' },
    update: {},
    create: {
      name: 'Carol Williams',
      email: 'carol@example.com',
      passwordHash: studentHash,
      role: Role.STUDENT,
      cohort: 'Cohort 4',
      status: UserStatus.ACTIVE,
    },
  })

  // Sample courses
  const course1 = await prisma.course.upsert({
    where: { id: 'course-linux-week1' },
    update: {},
    create: {
      id: 'course-linux-week1',
      title: 'DevOps Cohort 3 — Linux Fundamentals',
      description: 'Master the Linux command line, file system navigation, permissions, and shell scripting essentials for DevOps workflows.',
      cohort: 'Cohort 3',
      weekNumber: 1,
      isPublished: true,
    },
  })

  const course2 = await prisma.course.upsert({
    where: { id: 'course-docker-week2' },
    update: {},
    create: {
      id: 'course-docker-week2',
      title: 'DevOps Cohort 3 — Docker & Containers',
      description: 'Learn containerization with Docker: images, containers, volumes, networking, Docker Compose, and container best practices.',
      cohort: 'Cohort 3',
      weekNumber: 2,
      isPublished: true,
    },
  })

  // Content for course 1
  await prisma.content.createMany({
    skipDuplicates: true,
    data: [
      {
        courseId: course1.id,
        title: 'Linux File System Hierarchy',
        type: ContentType.NOTE,
        url: 'https://docs.google.com/document/d/example-linux-notes',
        description: 'Comprehensive notes on the Linux directory structure and file system layout.',
        order: 1,
      },
      {
        courseId: course1.id,
        title: 'Introduction to Linux — Video Lecture',
        type: ContentType.VIDEO,
        url: 'https://www.youtube.com/watch?v=example-linux-intro',
        description: 'Full 2-hour video walkthrough of Linux basics by the instructor.',
        order: 2,
      },
      {
        courseId: course1.id,
        title: 'Shell Scripting Cheat Sheet',
        type: ContentType.RESOURCE,
        url: 'https://docs.google.com/spreadsheets/d/example-cheatsheet',
        description: 'Quick reference guide for common shell scripting patterns.',
        order: 3,
      },
    ],
  })

  // Content for course 2
  await prisma.content.createMany({
    skipDuplicates: true,
    data: [
      {
        courseId: course2.id,
        title: 'Docker Architecture Overview',
        type: ContentType.NOTE,
        url: 'https://www.notion.so/example-docker-notes',
        description: 'Deep dive into Docker architecture, daemons, and container lifecycle.',
        order: 1,
      },
      {
        courseId: course2.id,
        title: 'Docker Hands-On Lab',
        type: ContentType.VIDEO,
        url: 'https://www.youtube.com/watch?v=example-docker-lab',
        description: 'Live coding session: building and running your first Docker container.',
        order: 2,
      },
    ],
  })

  // Assignments
  const assignment1 = await prisma.assignment.upsert({
    where: { id: 'assignment-linux-1' },
    update: {},
    create: {
      id: 'assignment-linux-1',
      courseId: course1.id,
      title: 'Linux Commands Practice',
      description: `Complete the following tasks and submit a report:\n\n1. Create a directory structure: /projects/devops/week1\n2. Write a shell script that monitors disk usage and sends alerts when usage exceeds 80%\n3. Set up cron job to run the script every 5 minutes\n4. Document all commands used with explanations\n\nSubmit a PDF or ZIP file containing your script and documentation.`,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxScore: 100,
    },
  })

  const assignment2 = await prisma.assignment.upsert({
    where: { id: 'assignment-docker-1' },
    update: {},
    create: {
      id: 'assignment-docker-1',
      courseId: course2.id,
      title: 'Dockerize a Node.js Application',
      description: `Build and containerize a simple Node.js web application:\n\n1. Create a simple Express.js app with at least 2 API endpoints\n2. Write a Dockerfile using best practices (multi-stage build)\n3. Create a docker-compose.yml with app + PostgreSQL database\n4. Push the image to Docker Hub\n5. Write a README with setup and run instructions\n\nSubmit a link to your GitHub repository.`,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      maxScore: 100,
    },
  })

  // Sample submission from student1
  await prisma.submission.upsert({
    where: {
      assignmentId_studentId: {
        assignmentId: assignment1.id,
        studentId: student1.id,
      },
    },
    update: {},
    create: {
      assignmentId: assignment1.id,
      studentId: student1.id,
      submissionText: 'I completed all the tasks. The shell script monitors /dev/sda1 disk usage and sends email alerts. Cron job is scheduled with */5 * * * *.',
      status: SubmissionStatus.REVIEWED,
      score: 85,
      feedback: 'Good work! The script is functional. Next time, consider using more robust error handling and testing with different filesystem scenarios.',
    },
  })

  // Announcement
  await prisma.announcement.upsert({
    where: { id: 'announcement-welcome' },
    update: {},
    create: {
      id: 'announcement-welcome',
      title: 'Welcome to Borderless Academy — Cohort 3!',
      body: `We are thrilled to welcome you to Borderless Academy's DevOps program!

This cohort will run for 12 weeks, covering Linux, Docker, Kubernetes, CI/CD, Cloud Infrastructure, and more.

A few important reminders:
• All lecture materials are available in your course dashboard
• Assignments must be submitted before the deadline for full marks
• Office hours are every Wednesday 6-8 PM WAT via Google Meet
• Join our Slack workspace using the invite link sent to your email

Let's build something great together!

— The Borderless Tech Team`,
      authorId: admin.id,
    },
  })

  console.log('✅ Seed completed successfully!')
  console.log(`
  Admin: admin@borderlesstech.com / Admin@123
  Students: alice@example.com / Student@123
            bob@example.com / Student@123
            carol@example.com / Student@123
  `)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
