import { PrismaClient, Priority, JobStatus } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // First, let's clean up existing data
  await prisma.jobRequestComment.deleteMany({});
  await prisma.jobRequest.deleteMany({});

  // Create some test users first (assuming you have a User model)
  const user1 = await prisma.user.upsert({
    where: { email: "galbadrakh0223@gmail.com" },
    update: {},
    create: {
      email: "john.doe@example.com",
      name: "John Doe",
      password: "password123",
      // Add other required fields based on your User model
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "jane.smith@example.com" },
    update: {},
    create: {
      email: "jane.smith@example.com",
      name: "Jane Smith",
      password: "password123",
      // Add other required fields based on your User model
    },
  });

  // Create job requests with varying priorities and statuses
  const jobRequests = await Promise.all([
    // High priority, open maintenance request
    prisma.jobRequest.create({
      data: {
        title: "Emergency Server Maintenance",
        description:
          "Production server requires immediate maintenance due to high CPU usage",
        priority: Priority.HIGH,
        status: JobStatus.OPEN,
        category: "Infrastructure",
        location: "Server Room A",
        assignedTo: user2.id,
        requestedBy: user1.id,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Due in 24 hours
        comments: {
          create: [
            {
              content: "Initial investigation shows possible memory leak",
              userId: user1.id,
            },
            {
              content: "Will begin diagnostic tests immediately",
              userId: user2.id,
            },
          ],
        },
      },
    }),

    // Medium priority, in progress software update
    prisma.jobRequest.create({
      data: {
        title: "Software Update Deployment",
        description:
          "Deploy latest security patches to all development workstations",
        priority: Priority.MEDIUM,
        status: JobStatus.IN_PROGRESS,
        category: "Software",
        location: "Development Department",
        assignedTo: user1.id,
        requestedBy: user2.id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Due in 3 days
        comments: {
          create: [
            {
              content: "Update packages have been tested in staging",
              userId: user2.id,
            },
          ],
        },
      },
    }),

    // Low priority, completed hardware request
    prisma.jobRequest.create({
      data: {
        title: "New Monitor Setup",
        description: 'Install new 27" monitors for the design team',
        priority: Priority.LOW,
        status: JobStatus.COMPLETED,
        category: "Hardware",
        location: "Design Department",
        assignedTo: user1.id,
        requestedBy: user2.id,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Due 2 days ago
        completedAt: new Date(), // Completed now
        comments: {
          create: [
            {
              content: "All monitors have been delivered",
              userId: user2.id,
            },
            {
              content: "Installation completed, all workstations tested",
              userId: user1.id,
            },
          ],
        },
      },
    }),

    // Urgent, cancelled network issue
    prisma.jobRequest.create({
      data: {
        title: "Network Connectivity Issues",
        description:
          "Internet connectivity dropping intermittently in finance department",
        priority: Priority.URGENT,
        status: JobStatus.CANCELLED,
        category: "Network",
        location: "Finance Department",
        assignedTo: user2.id,
        requestedBy: user1.id,
        dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Due yesterday
        comments: {
          create: [
            {
              content: "Issue resolved itself after ISP maintenance",
              userId: user2.id,
            },
          ],
        },
      },
    }),

    // Medium priority, open facility request
    prisma.jobRequest.create({
      data: {
        title: "Conference Room A/V Setup",
        description:
          "Install new projector and sound system in main conference room",
        priority: Priority.MEDIUM,
        status: JobStatus.OPEN,
        category: "Facilities",
        location: "Main Conference Room",
        assignedTo: user1.id,
        requestedBy: user2.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
        comments: {
          create: [
            {
              content: "Equipment has been ordered",
              userId: user2.id,
            },
          ],
        },
      },
    }),
  ]);

  console.log("Seed data created successfully:", {
    users: [user1, user2],
    jobRequests: jobRequests.length,
  });
}

main()
  .catch((e) => {
    console.error("Error while seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
