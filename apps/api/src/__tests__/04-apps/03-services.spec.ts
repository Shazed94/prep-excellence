import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import app from "@/app";
import prisma from "@/infrastructure/database/connection";

describe("Services API", () => {
  let superUserToken: string;
  let newsLetterId: string;
  let guidanceId: string;
  let contactUsId: string;
  let blogCategoryId: string;
  let trustedCompanyId: string;
  let freeSeminarId: string;
  let tutorRequestId: string;
  let essayReviewId: string;

  beforeAll(async () => {
    // Create super user role if not exists
    let superUserRole = await prisma.role.findUnique({
      where: { name: "Super User" },
    });

    if (!superUserRole) {
      superUserRole = await prisma.role.create({
        data: {
          name: "Super User",
          description: "Super Administrator with all permissions",
        },
      });
    }

    // Create or get super user
    const existingUser = await prisma.user.findUnique({
      where: { email: process.env.ADMIN_EMAIL || "info@prepexcellence.com" },
    });

    if (!existingUser) {
      const bcrypt = await import("bcrypt");
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || "admin@1234",
        12
      );

      await prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL || "info@prepexcellence.com",
          password: hashedPassword,
          name: "Admin Test",
          isSuperUser: true,
          isStaff: true,
          isActive: true,
          isVerified: true,
          roleId: superUserRole.id,
        },
      });
    }

    const loginRes = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: process.env.ADMIN_EMAIL || "info@prepexcellence.com",
        password: process.env.ADMIN_PASSWORD || "A7f!Q9mR2@Kp",
      });

    superUserToken = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.newsLetter.deleteMany({
      where: {
        email: { in: ["newsletter@gmail.com", "updated@example.com"] },
      },
    });
    await prisma.guidance.deleteMany({
      where: { email: "guidance@example.com" },
    });
    await prisma.contactUs.deleteMany({
      where: {
        email: {
          in: [
            "contact@example.com",
            "contact2@example.com",
            "contact3@example.com",
          ],
        },
      },
    });
    await prisma.blogComment.deleteMany({});
    await prisma.blog.deleteMany({
      where: { title: { in: ["Test Blog Post", "Updated Blog Post"] } },
    });
    await prisma.blogCategory.deleteMany({
      where: { name: { in: ["Test Category", "Updated Category"] } },
    });
    await prisma.trustedCompanies.deleteMany({
      where: { name: { in: ["Test Company", "Updated Company"] } },
    });
    await prisma.freeSeminar.deleteMany({
      where: { studentEmail: "jane@example.com" },
    });
    await prisma.tutorRequestRegistration.deleteMany({
      where: { email: "parent@example.com" },
    });
    await prisma.collegeEssayReview.deleteMany({
      where: { email: "essayreview@example.com" },
    });
    await prisma.$disconnect();
  });

  // ============================================
  // NEWSLETTER API TESTS
  // ============================================
  describe("Newsletter Management", () => {
    describe("POST /api/v1/newsletter", () => {
      it("should create a newsletter subscription", async () => {
        const res = await request(app)
          .post("/api/v1/newsletter")
          .send({ email: "newsletter@gmail.com" });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe("newsletter@gmail.com");

        newsLetterId = res.body.data.id;
      });

      it("should return 400 if email is missing", async () => {
        const res = await request(app)
          .post("/api/v1/newsletter")
          .send({ email: "" });

        expect(res.status).toBe(400);
      });

      it("should return 400 for invalid email format", async () => {
        const res = await request(app)
          .post("/api/v1/newsletter")
          .send({ email: "invalid-email" });

        expect(res.status).toBe(400);
      });

      it("should update existing subscription with same email", async () => {
        const res = await request(app)
          .post("/api/v1/newsletter")
          .send({ email: "newsletter@gmail.com" });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("updated");
      });
    });

    describe("GET /api/v1/newsletter", () => {
      it("should get all newsletters", async () => {
        const res = await request(app)
          .get("/api/v1/newsletter")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body).toHaveProperty("pagination");
      });

      it("should support pagination query parameters", async () => {
        const res = await request(app)
          .get("/api/v1/newsletter?page=1&limit=10")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.limit).toBe(10);
      });

      it("should require authentication", async () => {
        const res = await request(app).get("/api/v1/newsletter");

        expect(res.status).toBe(401);
      });
    });

    describe("GET /api/v1/newsletter/:id", () => {
      it("should get a newsletter by id", async () => {
        const res = await request(app)
          .get(`/api/v1/newsletter/${newsLetterId}`)
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.email).toBe("newsletter@gmail.com");
      });

      it("should return 400 for invalid newsletter id", async () => {
        const res = await request(app)
          .get("/api/v1/newsletter/nonexistent123")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(400);
      });

      it("should return 404 for non-existent newsletter id", async () => {
        const res = await request(app)
          .get("/api/v1/newsletter/ckx9f2a9b0001l7z8k3q9m2x1")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(404);
      });
    });

    describe("DELETE /api/v1/newsletter/:id", () => {
      it("should delete newsletter successfully", async () => {
        const res = await request(app)
          .delete(`/api/v1/newsletter/${newsLetterId}`)
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toContain("deleted successfully");
      });

      it("should return 404 after deletion", async () => {
        const res = await request(app)
          .get(`/api/v1/newsletter/${newsLetterId}`)
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(404);
      });
    });
  });

  // ============================================
  // GUIDANCE API TESTS
  // ============================================
  describe("College Admissions Guidance", () => {
    describe("POST /api/v1/guidance", () => {
      it("should create a guidance request", async () => {
        const res = await request(app).post("/api/v1/guidance").send({
          firstName: "John",
          lastName: "Doe",
          email: "guidance@example.com",
          phone: "01712345678",
          stateRegion: "Dhaka",
          country: "Bangladesh",
          studentGrade: "12",
          gpa: "4.5",
          takenSATACT: "Yes",
          satActScore: "1500",
          extracurricular: "Debate, Soccer",
          targetColleges: "Harvard, MIT",
          questions: "Need help with essay writing",
          childDescription: "Excellent student with leadership skills",
        });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe("guidance@example.com");

        guidanceId = res.body.data.id;
      });

      it("should fail with missing required fields", async () => {
        const res = await request(app).post("/api/v1/guidance").send({
          firstName: "Jane",
          // missing other required fields
        });

        expect(res.status).toBe(400);
      });

      it("should fail with invalid email", async () => {
        const res = await request(app).post("/api/v1/guidance").send({
          firstName: "John",
          lastName: "Doe",
          email: "invalid-email",
          phone: "01712345678",
          stateRegion: "Dhaka",
          country: "Bangladesh",
        });

        expect(res.status).toBe(400);
      });
    });

    describe("GET /api/v1/guidance", () => {
      it("should get all guidance requests", async () => {
        const res = await request(app)
          .get("/api/v1/guidance")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body).toHaveProperty("pagination");
      });

      it("should support pagination", async () => {
        const res = await request(app)
          .get("/api/v1/guidance?page=1&limit=5")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.limit).toBe(5);
      });

      it("should require authentication", async () => {
        const res = await request(app).get("/api/v1/guidance");

        expect(res.status).toBe(401);
      });
    });

    describe("GET /api/v1/guidance/:id", () => {
      it("should get guidance request by id", async () => {
        const res = await request(app)
          .get(`/api/v1/guidance/${guidanceId}`)
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe("guidance@example.com");
      });

      it("should return 404 for non-existent id", async () => {
        const res = await request(app)
          .get("/api/v1/guidance/ckx9f2a9b0001l7z8k3q9m2x1")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(404);
      });
    });

    describe("PUT /api/v1/guidance/:id", () => {
      it("should update guidance request", async () => {
        const res = await request(app)
          .put(`/api/v1/guidance/${guidanceId}`)
          .set("Authorization", `Bearer ${superUserToken}`)
          .send({
            firstName: "John",
            lastName: "Doe",
            email: "guidance@example.com",
            phone: "01712345678",
            stateRegion: "Dhaka",
            country: "Bangladesh",
            studentGrade: "12",
            gpa: "4.8",
            takenSATACT: "Yes",
            satActScore: "1550",
            extracurricular: "Debate, Soccer, Robotics",
            targetColleges: "MIT, Stanford",
            questions: "Need guidance on application strategy",
            childDescription: "Outstanding student with excellent leadership",
          });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.gpa).toBe("4.8");
        expect(res.body.data.satActScore).toBe("1550");
      });

      it("should return 404 for non-existent id", async () => {
        const res = await request(app)
          .put("/api/v1/guidance/ckx9f2a9b0001l7z8k3q9m2x1")
          .set("Authorization", `Bearer ${superUserToken}`)
          .send({
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            phone: "01712345678",
            stateRegion: "Dhaka",
            country: "Bangladesh",
            studentGrade: "11",
            gpa: "4.0",
            takenSATACT: "No",
            satActScore: "N/A",
            extracurricular: "Sports",
            targetColleges: "Local Universities",
            questions: "General inquiry",
            childDescription: "Good student",
          });

        expect(res.status).toBe(404);
      });

      it("should return 400 for invalid email", async () => {
        const res = await request(app)
          .put(`/api/v1/guidance/${guidanceId}`)
          .set("Authorization", `Bearer ${superUserToken}`)
          .send({
            firstName: "John",
            lastName: "Doe",
            email: "invalid-email",
            phone: "01712345678",
            stateRegion: "Dhaka",
            country: "Bangladesh",
          });

        expect(res.status).toBe(400);
      });

      it("should require authentication", async () => {
        const res = await request(app)
          .put(`/api/v1/guidance/${guidanceId}`)
          .send({
            firstName: "John",
            lastName: "Doe",
            email: "guidance@example.com",
            phone: "01712345678",
            stateRegion: "Dhaka",
            country: "Bangladesh",
          });

        expect(res.status).toBe(401);
      });
    });

    describe("DELETE /api/v1/guidance/:id", () => {
      it("should delete guidance request", async () => {
        const res = await request(app)
          .delete(`/api/v1/guidance/${guidanceId}`)
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });
    });
  });

  // ============================================
  // CONTACT US API TESTS
  // ============================================
  describe("Contact Us", () => {
    describe("POST /api/v1/contact-us", () => {
      it("should create a contact us message", async () => {
        const res = await request(app)
          .post("/api/v1/contact-us")
          .send({
            firstName: "John",
            lastName: "Doe",
            email: "contact@example.com",
            phone: "01712345678",
            state: "Dhaka",
            country: "Bangladesh",
            studentGrade: "12",
            bestTime: "Morning",
            helpWith: ["SAT Prep", "College Admissions"],
            query: "I need help with SAT preparation and college applications",
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe("contact@example.com");
        expect(res.body.data.firstName).toBe("John");
        expect(res.body.data.lastName).toBe("Doe");

        contactUsId = res.body.data.id;
      });

      it("should fail with missing required fields", async () => {
        const res = await request(app).post("/api/v1/contact-us").send({
          firstName: "Jane",
          // missing other required fields
        });

        expect(res.status).toBe(400);
      });

      it("should fail with invalid email", async () => {
        const res = await request(app)
          .post("/api/v1/contact-us")
          .send({
            firstName: "John",
            lastName: "Doe",
            email: "invalid-email",
            phone: "01712345678",
            state: "Dhaka",
            country: "Bangladesh",
            studentGrade: "12",
            bestTime: "Morning",
            helpWith: ["SAT Prep"],
            query: "Test query",
          });

        expect(res.status).toBe(400);
      });

      it("should fail with empty helpWith array", async () => {
        const res = await request(app).post("/api/v1/contact-us").send({
          firstName: "John",
          lastName: "Doe",
          email: "contact2@example.com",
          phone: "01712345678",
          state: "Dhaka",
          country: "Bangladesh",
          studentGrade: "12",
          bestTime: "Morning",
          helpWith: [],
          query: "Test query",
        });

        expect(res.status).toBe(400);
      });

      it("should accept optional 'other' field", async () => {
        const res = await request(app)
          .post("/api/v1/contact-us")
          .send({
            firstName: "Jane",
            lastName: "Smith",
            email: "contact3@example.com",
            phone: "01812345678",
            state: "Chittagong",
            country: "Bangladesh",
            studentGrade: "11",
            bestTime: "Afternoon",
            helpWith: ["Other"],
            other: "Custom help request",
            query: "Need assistance with essay review",
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.other).toBe("Custom help request");

        // Clean up this test record
        await prisma.contactUs.delete({
          where: { id: res.body.data.id },
        });
      });
    });

    describe("GET /api/v1/contact-us", () => {
      it("should get all contact messages", async () => {
        const res = await request(app)
          .get("/api/v1/contact-us")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body).toHaveProperty("pagination");
      });

      it("should support pagination", async () => {
        const res = await request(app)
          .get("/api/v1/contact-us?page=1&limit=5")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        expect(res.body.pagination.page).toBe(1);
        expect(res.body.pagination.limit).toBe(5);
      });

      it("should support search by email", async () => {
        const res = await request(app)
          .get("/api/v1/contact-us?search=contact@example.com")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        if (res.body.data.length > 0) {
          expect(res.body.data[0].email.toLowerCase()).toContain("contact");
        }
      });

      it("should require authentication", async () => {
        const res = await request(app).get("/api/v1/contact-us");

        expect(res.status).toBe(401);
      });
    });

    describe("DELETE /api/v1/contact-us/:id", () => {
      it("should delete contact message", async () => {
        const res = await request(app)
          .delete(`/api/v1/contact-us/${contactUsId}`)
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("deleted successfully");
      });

      it("should return 404 for non-existent id", async () => {
        const res = await request(app)
          .delete("/api/v1/contact-us/ckx9f2a9b0001l7z8k3q9m2x1")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(404);
      });

      it("should return 400 for invalid id format", async () => {
        const res = await request(app)
          .delete("/api/v1/contact-us/invalid-id")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(400);
      });
    });
  });

  // ============================================
  // BLOG CATEGORY API TESTS
  // ============================================
  describe("Blog Category Management", () => {
    describe("POST /api/v1/blog-categories", () => {
      it("should create a blog category", async () => {
        const res = await request(app)
          .post("/api/v1/blog-categories")
          .set("Authorization", `Bearer ${superUserToken}`)
          .send({
            name: "Test Category",
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe("Test Category");
        expect(res.body.data).toHaveProperty("slug");

        blogCategoryId = res.body.data.id;
      });

      it("should return 400 for duplicate category name", async () => {
        const res = await request(app)
          .post("/api/v1/blog-categories")
          .set("Authorization", `Bearer ${superUserToken}`)
          .send({
            name: "Test Category",
          });

        expect(res.status).toBe(400);
      });

      it("should return 400 for missing name", async () => {
        const res = await request(app)
          .post("/api/v1/blog-categories")
          .set("Authorization", `Bearer ${superUserToken}`)
          .send({});

        expect(res.status).toBe(400);
      });
    });

    describe("GET /api/v1/blog-categories", () => {
      it("should get all blog categories", async () => {
        const res = await request(app).get("/api/v1/blog-categories");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      });

      it("should support search query", async () => {
        const res = await request(app).get(
          "/api/v1/blog-categories?search=Test"
        );

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });
    });

    describe("GET /api/v1/blog-categories/:id", () => {
      it("should get category by id", async () => {
        const res = await request(app).get(
          `/api/v1/blog-categories/${blogCategoryId}`
        );

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe("Test Category");
      });

      it("should return 404 for non-existent id", async () => {
        const res = await request(app).get(
          "/api/v1/blog-categories/ckx9f2a9b0001l7z8k3q9m2x1"
        );

        expect(res.status).toBe(404);
      });
    });

    describe("PUT /api/v1/blog-categories/:id", () => {
      it("should update blog category", async () => {
        // Create a fresh category for update test
        const createRes = await request(app)
          .post("/api/v1/blog-categories")
          .set("Authorization", `Bearer ${superUserToken}`)
          .send({
            name: "Category To Update",
          });

        expect(createRes.status).toBe(201);
        expect(createRes.body.data).toHaveProperty("id");

        const tempCategoryId = createRes.body.data.id;

        const res = await request(app)
          .patch(`/api/v1/blog-categories/${tempCategoryId}`)
          .set("Authorization", `Bearer ${superUserToken}`)
          .send({
            name: "Updated Category Name",
          });

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe("Updated Category Name");

        // Clean up
        await request(app)
          .delete(`/api/v1/blog-categories/${tempCategoryId}`)
          .set("Authorization", `Bearer ${superUserToken}`);
      });

      it("should return 404 for non-existent id", async () => {
        const res = await request(app)
          .patch("/api/v1/blog-categories/ckx9f2a9b0001l7z8k3q9m2x1")
          .set("Authorization", `Bearer ${superUserToken}`)
          .send({
            name: "Update",
          });

        expect(res.status).toBe(404);
      });
    });
    // Note: Blog POST requires multipart/form-data with image file
    // Skipping POST tests as they require file upload setup
    // For coverage, we test GET endpoints with existing blogs

    describe("GET /api/v1/blogs", () => {
      it("should get all blogs", async () => {
        const res = await request(app).get("/api/v1/blogs");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
      });

      it("should filter by status", async () => {
        const res = await request(app).get("/api/v1/blogs?status=DRAFT");

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
      });

      it("should filter by category", async () => {
        const res = await request(app).get(
          `/api/v1/blogs?categoryId=${blogCategoryId}`
        );

        expect(res.status).toBe(200);
      });
    });

    describe("GET /api/v1/blogs/:id", () => {
      it("should return 404 for non-existent blog", async () => {
        const res = await request(app).get(
          "/api/v1/blogs/ckx9f2a9b0001l7z8k3q9m2x1"
        );

        expect(res.status).toBe(404);
      });
    });
  });

  // ============================================
  // BLOG COMMENT API TESTS
  // ============================================
  // Note: Blog Comment tests require valid blogId from Blog POST
  // Since Blog POST requires file upload, skipping comment tests

  // ============================================
  // BLOG CATEGORY CLEANUP (After Blog tests)
  // ============================================
  describe("Blog Category Cleanup", () => {
    describe("DELETE /api/v1/blog-categories/:id", () => {
      it("should delete blog category", async () => {
        const res = await request(app)
          .delete(`/api/v1/blog-categories/${blogCategoryId}`)
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
      });

      it("should return 404 for non-existent category", async () => {
        const res = await request(app)
          .delete("/api/v1/blog-categories/ckx9f2a9b0001l7z8k3q9m2x1")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(404);
      });
    });
  });

  // ============================================
  // TRUSTED COMPANIES API TESTS
  // ============================================
  describe("Trusted Companies", () => {
    describe("POST /api/v1/trusted-companies", () => {
      it("should create a trusted company", async () => {
        const res = await request(app)
          .post("/api/v1/trusted-companies")
          .set("Authorization", `Bearer ${superUserToken}`)
          .send({
            name: "Test Company",
            logo: "https://example.com/logo.png",
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe("Test Company");

        trustedCompanyId = res.body.data.id;
      });

      it("should return 400 for duplicate company", async () => {
        const res = await request(app)
          .post("/api/v1/trusted-companies")
          .set("Authorization", `Bearer ${superUserToken}`)
          .send({
            name: "Test Company",
            logo: "https://example.com/logo.png",
          });

        expect(res.status).toBe(400);
      });
    });

    describe("GET /api/v1/trusted-companies", () => {
      it("should get all trusted companies", async () => {
        const res = await request(app)
          .get("/api/v1/trusted-companies")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
    });

    describe("PUT /api/v1/trusted-companies/:id", () => {
      it("should update trusted company", async () => {
        const res = await request(app)
          .put(`/api/v1/trusted-companies/${trustedCompanyId}`)
          .set("Authorization", `Bearer ${superUserToken}`)
          .send({
            name: "Updated Company",
            logo: "https://example.com/new-logo.png",
          });

        expect(res.status).toBe(200);
        expect(res.body.data.name).toBe("Updated Company");
      });
    });

    describe("DELETE /api/v1/trusted-companies/:id", () => {
      it("should delete trusted company", async () => {
        const res = await request(app)
          .delete(`/api/v1/trusted-companies/${trustedCompanyId}`)
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
      });
    });
  });

  // ============================================
  // FREE SEMINAR API TESTS
  // ============================================
  describe("Free Seminar", () => {
    describe("POST /api/v1/free-seminars", () => {
      it("should create a free seminar registration", async () => {
        const res = await request(app).post("/api/v1/free-seminars").send({
          parentName: "John Doe",
          parentPhone: "01712345678",
          parentCity: "Dhaka, 1200",
          studentName: "Jane Doe",
          studentEmail: "jane@example.com",
          studentGrade: "G10",
          studentSchool: "Test High School",
          targetScore: "1500",
          dreamColleges: "MIT, Stanford",
          seminarGoals: "Learn SAT strategies and preparation tips",
          questions: "What materials do I need to bring?",
        });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.studentEmail).toBe("jane@example.com");

        freeSeminarId = res.body.data.id;
      });

      it("should return 400 for invalid grade", async () => {
        const res = await request(app).post("/api/v1/free-seminars").send({
          parentName: "John",
          parentPhone: "01712345678",
          parentCity: "Dhaka",
          studentName: "Jane",
          studentEmail: "test@example.com",
          studentGrade: "InvalidGrade",
          studentSchool: "School",
          targetScore: "1500",
          dreamColleges: "MIT",
          seminarGoals: "Learn",
          questions: "Question",
        });

        expect(res.status).toBe(400);
      });
    });

    describe("GET /api/v1/free-seminars", () => {
      it("should get all seminar registrations", async () => {
        const res = await request(app)
          .get("/api/v1/free-seminars")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });
    });

    describe("DELETE /api/v1/free-seminars/:id", () => {
      it("should delete seminar registration", async () => {
        const res = await request(app)
          .delete(`/api/v1/free-seminars/${freeSeminarId}`)
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
      });
    });
  });

  // ============================================
  // TUTOR REQUEST API TESTS
  // ============================================
  describe("Tutor Request", () => {
    describe("POST /api/v1/tutor-request", () => {
      it("should create a tutor request", async () => {
        const res = await request(app)
          .post("/api/v1/tutor-request")
          .send({
            email: "parent@example.com",
            parentName: "Parent Name",
            phoneNumber: "01712345678",
            address: "123 Main St, Dhaka",
            studentName: "Student Name",
            studentSchool: "Test School",
            studentGrade: "Grade 10",
            studentPhone: "01812345678",
            studentEmail: "student@example.com",
            needHelp: "SAT Math and English preparation",
            studentNeed: "Improve test scores",
            tutorType: ["SAT", "ACT"],
            callbackTime: "Evening 6-8 PM",
            tutoringDays: "Weekends",
            fullName: "Parent Full Name",
            date: "2024-12-27",
            agreeTerms: true,
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe("parent@example.com");

        tutorRequestId = res.body.data.id;
      });

      it("should return 400 for missing required fields", async () => {
        const res = await request(app).post("/api/v1/tutor-request").send({
          email: "test@example.com",
        });

        expect(res.status).toBe(400);
      });

      it("should return 400 if terms not agreed", async () => {
        const res = await request(app)
          .post("/api/v1/tutor-request")
          .send({
            email: "parent2@example.com",
            parentName: "Parent",
            phoneNumber: "01712345678",
            address: "Address",
            studentName: "Student",
            studentSchool: "School",
            studentGrade: "10",
            studentPhone: "01812345678",
            studentEmail: "student2@example.com",
            needHelp: "Help needed",
            studentNeed: "Need",
            tutorType: ["SAT"],
            callbackTime: "Evening",
            tutoringDays: "Weekdays",
            fullName: "Full Name",
            date: "2024-12-27",
            agreeTerms: false,
          });

        expect(res.status).toBe(400);
      });
    });

    describe("GET /api/v1/tutor-request", () => {
      it("should get all tutor requests", async () => {
        const res = await request(app)
          .get("/api/v1/tutor-request")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });

      it("should support search", async () => {
        const res = await request(app)
          .get("/api/v1/tutor-request?search=parent@example.com")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
      });
    });

    describe("DELETE /api/v1/tutor-request/:id", () => {
      it("should delete tutor request", async () => {
        const res = await request(app)
          .delete(`/api/v1/tutor-request/${tutorRequestId}`)
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
      });
    });
  });

  // ============================================
  // COLLEGE ESSAY REVIEW API TESTS
  // ============================================
  describe("College Essay Review", () => {
    describe("POST /api/v1/college-essay-review", () => {
      it("should create an essay review request", async () => {
        const res = await request(app)
          .post("/api/v1/college-essay-review")
          .send({
            studentName: "Essay Student",
            parentName: "Essay Parent",
            email: "essayreview@example.com",
            phone: "01712345678",
            grade: "12",
            studentEmail: "essaystudent@example.com",
            studentSchool: "Test High School",
            address: "123 Main Street, Dhaka",
            collegeTarget: "Harvard University",
            paymentDate: "2024-12-27",
            fullName: "Essay Parent Full Name",
            agreedToTerms: true,
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe("essayreview@example.com");

        essayReviewId = res.body.data.id;
      });

      it("should return 400 for invalid email", async () => {
        const res = await request(app)
          .post("/api/v1/college-essay-review")
          .send({
            email: "invalid-email",
            studentName: "Student",
          });

        expect(res.status).toBe(400);
      });
    });

    describe("GET /api/v1/college-essay-review", () => {
      it("should get all essay reviews", async () => {
        const res = await request(app)
          .get("/api/v1/college-essay-review")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
      });

      it("should support search", async () => {
        const res = await request(app)
          .get("/api/v1/college-essay-review?search=Essay Student")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
      });
    });

    describe("DELETE /api/v1/college-essay-review/:id", () => {
      it("should delete essay review", async () => {
        const res = await request(app)
          .delete(`/api/v1/college-essay-review/${essayReviewId}`)
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(200);
      });

      it("should return 404 for non-existent id", async () => {
        const res = await request(app)
          .delete("/api/v1/college-essay-review/ckx9f2a9b0001l7z8k3q9m2x1")
          .set("Authorization", `Bearer ${superUserToken}`);

        expect(res.status).toBe(404);
      });
    });
  });
});
