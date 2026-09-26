const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/User");
const Workout = require("../src/models/Workout");
const Exercise = require("../src/models/Exercise");
const Program = require("../src/models/Program");
const Subscription = require("../src/models/subscriptionModel");

describe("Calisthenics Platform API Test Suite", () => {
  let authToken = "";
  let adminToken = "";
  let testUserId = "";
  let testWorkoutId = "";
  let testExerciseId = "";
  let testPlanId = "";
  const uniqueSuffix = Date.now();

  beforeAll(async () => {
    // Create an admin user for testing admin endpoints
    const adminEmail = `admin_${uniqueSuffix}@test.com`;
    const adminUser = await User.create({
      fullName: "Admin Test",
      email: adminEmail,
      password: "Password123",
      role: "admin",
    });

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: adminEmail, password: "Password123" });

    adminToken = loginRes.body.token;

    // Create a subscription plan for testing payments and subscriptions
    const plan = await Subscription.create({
      name: `Pro Athlete ${uniqueSuffix}`,
      price: 29.99,
      duration: 30,
      description: "Full access to all calisthenics programs",
      features: ["All Workouts", "Personalized Tracking"],
    });
    testPlanId = plan._id.toString();
  });

  afterAll(async () => {
    // Clean up test records
    await User.deleteMany({ email: new RegExp(`.*${uniqueSuffix}.*`) });
    await Workout.deleteMany({ workoutName: new RegExp(`.*${uniqueSuffix}.*`) });
    await Exercise.deleteMany({ name: new RegExp(`.*${uniqueSuffix}.*`) });
    await Program.deleteMany({ title: new RegExp(`.*${uniqueSuffix}.*`) });
    if (testPlanId) {
      await Subscription.findByIdAndDelete(testPlanId);
    }
  });

  // ===============================
  // 1. Health Check & Root
  // ===============================
  describe("GET / (Health Check)", () => {
    it("should return 200 and running message", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain("Calisthenics Platform Backend is Running");
    });

    it("should return 404 for nonexistent routes", async () => {
      const res = await request(app).get("/api/v1/non-existent-route");
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ===============================
  // 2. Authentication APIs
  // ===============================
  describe("Auth APIs", () => {
    const userEmail = `student_${uniqueSuffix}@test.com`;

    it("should reject registration with invalid email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          fullName: "Test User",
          email: "not-an-email",
          password: "123",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should register a new student user successfully", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          fullName: "Student Tester",
          email: userEmail,
          password: "StrongPassword123!",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("_id");
      testUserId = res.body.data._id;
    });

    it("should log in the newly registered user and return a JWT token", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: userEmail,
          password: "StrongPassword123!",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("token");
      authToken = res.body.token;
    });

    it("should fetch current user profile with valid JWT", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(userEmail);
    });

    it("should reject profile request without token", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.statusCode).toBe(401);
    });
  });

  // ===============================
  // 3. Exercises API (Module 9)
  // ===============================
  describe("Exercise Management (Module 9)", () => {
    it("should create a new exercise as admin", async () => {
      const res = await request(app)
        .post("/api/v1/exercises")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: `Muscle-Up Progression ${uniqueSuffix}`,
          description: "Explosive pull into straight bar dip transition",
          category: "Skills",
          difficulty: "Advanced",
          targetMuscles: ["Lats", "Chest", "Triceps", "Core"],
          mechanics: "Compound",
          progressionLevel: 5,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("_id");
      testExerciseId = res.body.data._id;
    });

    it("should fetch public exercises list with search and pagination", async () => {
      const res = await request(app)
        .get("/api/v1/exercises")
        .query({ search: `Muscle-Up Progression ${uniqueSuffix}`, page: 1, limit: 10 });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(1);
    });
  });

  // ===============================
  // 4. Workouts & Exercise Relationship (Module 8 & 10)
  // ===============================
  describe("Workouts & Exercise Relationship (Modules 8 & 10)", () => {
    it("should create a new workout as admin", async () => {
      const res = await request(app)
        .post("/api/v1/workouts")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          workoutName: `Upper Body Blast ${uniqueSuffix}`,
          description: "High volume pull and push supersets",
          category: "Upper Body",
          difficulty: "Intermediate",
          targetMuscle: "Chest and Back",
          duration: 40,
          caloriesBurned: 300,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("_id");
      testWorkoutId = res.body.data._id;
    });

    it("should add an exercise to workout (Module 10)", async () => {
      const res = await request(app)
        .post(`/api/v1/workouts/${testWorkoutId}/exercises`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          exerciseId: testExerciseId,
          sets: 4,
          reps: 8,
          restTime: 90,
          order: 1,
          notes: "Focus on clean transition over bar",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.exercises.length).toBeGreaterThanOrEqual(1);
    });

    it("should fetch workout exercises", async () => {
      const res = await request(app).get(`/api/v1/workouts/${testWorkoutId}/exercises`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(1);
    });
  });

  // ===============================
  // 5. Training Programs (Module 11)
  // ===============================
  describe("Training Programs (Module 11)", () => {
    let testProgramId = "";

    it("should create a training program as admin", async () => {
      const res = await request(app)
        .post("/api/v1/programs")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: `0 to First Handstand ${uniqueSuffix}`,
          description: "Complete 6-week progressive guide to freestanding handstand",
          level: "Beginner",
          category: "Skills",
          durationWeeks: 6,
          workoutsPerWeek: 3,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      testProgramId = res.body.data._id;
    });

    it("should allow student user to enroll in program", async () => {
      const res = await request(app)
        .post(`/api/v1/programs/${testProgramId}/enroll`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should mark a workout step completed in program", async () => {
      const res = await request(app)
        .post(`/api/v1/programs/${testProgramId}/complete-step`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          weekNumber: 1,
          dayNumber: 1,
          workoutId: testWorkoutId,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ===============================
  // 6. Payments & Student Subscription (Modules 12 & 13)
  // ===============================
  describe("Payments & Student Subscription (Modules 12 & 13)", () => {
    let orderId = "";

    it("should create payment order for subscription plan", async () => {
      const res = await request(app)
        .post("/api/v1/payments/create-order")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          planId: testPlanId,
          gateway: "stripe",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("orderId");
      orderId = res.body.data.orderId;
    });

    it("should verify payment and automatically activate student subscription", async () => {
      const res = await request(app)
        .post("/api/v1/payments/verify")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          orderId,
          paymentId: `PAY_TEST_${uniqueSuffix}`,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.subscription.status).toBe("active");
    });

    it("should retrieve active subscription for student", async () => {
      const res = await request(app)
        .get("/api/v1/student-subscriptions/me")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.hasActiveSubscription).toBe(true);
      expect(res.body.data.status).toBe("active");
    });
  });

  // ===============================
  // 7. Admin Dashboard APIs (Module 22)
  // ===============================
  describe("Admin Dashboard APIs (Module 22)", () => {
    it("should return dashboard overview stats for admin", async () => {
      const res = await request(app)
        .get("/api/v1/admin/dashboard/overview")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("users");
      expect(res.body.data).toHaveProperty("content");
      expect(res.body.data).toHaveProperty("subscriptions");
      expect(res.body.data).toHaveProperty("revenue");
    });

    it("should return users list with pagination for admin", async () => {
      const res = await request(app)
        .get("/api/v1/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .query({ page: 1, limit: 5 });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.users)).toBe(true);
    });

    it("should reject non-admin from admin dashboard", async () => {
      const res = await request(app)
        .get("/api/v1/admin/dashboard/overview")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  // ===============================
  // 8. Universal Search (Module 23)
  // ===============================
  describe("Universal Search (Module 23)", () => {
    it("should search across workouts, exercises, and programs", async () => {
      const res = await request(app)
        .get("/api/v1/search")
        .query({ q: uniqueSuffix.toString(), type: "all" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("workouts");
      expect(res.body.data).toHaveProperty("exercises");
      expect(res.body.data).toHaveProperty("programs");
    });
  });
});
