const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Calisthenics Coaching & Training Platform API",
    version: "1.0.0",
    description:
      "Enterprise RESTful backend API for the Calisthenics Online Coaching Platform. Supports RBAC, Authentication, Workouts, Exercises, Programs, Student Subscriptions, Payment Processing, Admin Dashboards, and Media Management.",
    contact: {
      name: "Prachi Tailor",
      email: "prachitailor74@gmail.com",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Development Server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token in the format: Bearer <token>",
      },
    },
  },
  paths: {
    "/": {
      get: {
        summary: "API Health Check",
        responses: {
          200: {
            description: "Server is healthy and running",
          },
        },
      },
    },
    "/api/v1/auth/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["fullName", "email", "password"],
                properties: {
                  fullName: { type: "string", example: "John Doe" },
                  email: { type: "string", example: "john@example.com" },
                  phone: { type: "string", example: "+1234567890" },
                  password: { type: "string", example: "Password123" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Validation error or user already exists" },
        },
      },
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Authentication"],
        summary: "Authenticate user and get JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "john@example.com" },
                  password: { type: "string", example: "Password123" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful with JWT token" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/v1/auth/me": {
      get: {
        tags: ["Authentication"],
        summary: "Get current user profile",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Current user profile" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/v1/workouts": {
      get: {
        tags: ["Workouts"],
        summary: "Get all workouts (with search, filtering, and pagination)",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" }, description: "Search by workout name" },
          { name: "category", in: "query", schema: { type: "string" }, description: "Full Body, Upper Body, Lower Body, Core, Mobility, Skills" },
          { name: "difficulty", in: "query", schema: { type: "string" }, description: "Beginner, Intermediate, Advanced" },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: {
          200: { description: "Workouts fetched successfully" },
        },
      },
      post: {
        tags: ["Workouts"],
        summary: "Create a new workout (Admin only)",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["workoutName", "description", "category", "difficulty", "targetMuscle", "duration"],
                properties: {
                  workoutName: { type: "string", example: "Full Body Mastery" },
                  description: { type: "string", example: "High intensity calisthenics routine" },
                  category: { type: "string", example: "Full Body" },
                  difficulty: { type: "string", example: "Intermediate" },
                  targetMuscle: { type: "string", example: "Chest, Back, Core" },
                  duration: { type: "integer", example: 45 },
                  caloriesBurned: { type: "integer", example: 350 },
                  equipment: { type: "array", items: { type: "string" }, example: ["Pull-up bar"] },
                  isPremium: { type: "boolean", example: false },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Workout created successfully" },
          403: { description: "Forbidden - Admin only" },
        },
      },
    },
    "/api/v1/workouts/{id}": {
      get: {
        tags: ["Workouts"],
        summary: "Get workout by ID with populated exercises",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Workout details" },
          404: { description: "Workout not found" },
        },
      },
      put: {
        tags: ["Workouts"],
        summary: "Update workout (Admin only)",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Workout updated successfully" },
        },
      },
      delete: {
        tags: ["Workouts"],
        summary: "Delete workout (Admin only)",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Workout deleted successfully" },
        },
      },
    },
    "/api/v1/workouts/{id}/exercises": {
      get: {
        tags: ["Workout Exercises"],
        summary: "Get all exercises for a workout",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Exercises for this workout" } },
      },
      post: {
        tags: ["Workout Exercises"],
        summary: "Add exercise to workout (Admin only)",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["exerciseId"],
                properties: {
                  exerciseId: { type: "string" },
                  sets: { type: "integer", default: 3 },
                  reps: { type: "integer", default: 10 },
                  duration: { type: "integer", default: 0 },
                  restTime: { type: "integer", default: 60 },
                  order: { type: "integer", default: 1 },
                  notes: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Exercise added to workout" } },
      },
    },
    "/api/v1/exercises": {
      get: {
        tags: ["Exercises"],
        summary: "Get all exercises (with search, filter, pagination)",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "category", in: "query", schema: { type: "string" } },
          { name: "difficulty", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: { 200: { description: "Exercises fetched successfully" } },
      },
      post: {
        tags: ["Exercises"],
        summary: "Create exercise (Admin only)",
        security: [{ BearerAuth: [] }],
        responses: { 201: { description: "Exercise created successfully" } },
      },
    },
    "/api/v1/programs": {
      get: {
        tags: ["Training Programs"],
        summary: "Get all training programs (with search, filter, pagination)",
        responses: { 200: { description: "Programs fetched successfully" } },
      },
      post: {
        tags: ["Training Programs"],
        summary: "Create training program (Admin only)",
        security: [{ BearerAuth: [] }],
        responses: { 201: { description: "Program created successfully" } },
      },
    },
    "/api/v1/programs/{id}/enroll": {
      post: {
        tags: ["Training Programs"],
        summary: "Enroll in training program",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Enrolled successfully" } },
      },
    },
    "/api/v1/student-subscriptions/me": {
      get: {
        tags: ["Student Subscriptions"],
        summary: "Get current user's active subscription status",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "Active subscription details" } },
      },
    },
    "/api/v1/payments/create-order": {
      post: {
        tags: ["Payments"],
        summary: "Create a payment order for subscription plan",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["planId"],
                properties: {
                  planId: { type: "string" },
                  gateway: { type: "string", enum: ["stripe", "razorpay", "paypal", "mock"], default: "stripe" },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Order created successfully" } },
      },
    },
    "/api/v1/payments/verify": {
      post: {
        tags: ["Payments"],
        summary: "Verify payment & automatically activate subscription",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["orderId"],
                properties: {
                  orderId: { type: "string" },
                  paymentId: { type: "string" },
                  signature: { type: "string" },
                },
              },
            },
          },
        },
        responses: { 200: { description: "Payment verified and subscription activated" } },
      },
    },
    "/api/v1/admin/dashboard/overview": {
      get: {
        tags: ["Admin Dashboard"],
        summary: "Get platform statistics and analytics overview",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "Overview stats" } },
      },
    },
    "/api/v1/search": {
      get: {
        tags: ["Universal Search"],
        summary: "Search across workouts, exercises, and training programs",
        parameters: [
          { name: "q", in: "query", required: true, schema: { type: "string" }, description: "Search query" },
          { name: "type", in: "query", schema: { type: "string", enum: ["all", "workouts", "exercises", "programs"], default: "all" } },
        ],
        responses: { 200: { description: "Aggregated search results" } },
      },
    },
  },
};

module.exports = swaggerSpec;
