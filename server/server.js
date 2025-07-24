import "dotenv/config";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import pg from "pg";

const app = express();
app.use(express.json());

// Enable CORS
app.use(cors());

// PostgreSQL Connection
const pool = new pg.Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "postgres",
  password: process.env.PGPASSWORD || "password", // from your SQL comment
  port: process.env.PGPORT || 5432,

  ssl: {
    rejectUnauthorized: false, // Accept self-signed AWS certs
  },
});

// Test PostgreSQL connection
pool.connect((err, client, done) => {
  if (err) {
    console.error("PostgreSQL Connection Error:", err);
    process.exit(1);
  } else {
    console.log("PostgreSQL Connected");
    done();
  }
});

// User Endpoints
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    
    // Check if email exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find student by email
    const result = await pool.query(
      "SELECT * FROM students WHERE email = $1",
      [email]
    );
    
    const student = result.rows[0];
    
    if (!student || !(await bcrypt.compare(password, student.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: student.student_id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, expiresIn: 3600, message: "Login successful." });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Admin Login Route
app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find admin by email in the users table
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    
    const admin = result.rows[0];
    
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // Generate JWT token with admin flag
    const token = jwt.sign(
      { 
        userId: admin.user_id, 
        isAdmin: true 
      }, 
      process.env.JWT_SECRET || "your_jwt_secret_key", // Fallback if not in env
      { expiresIn: "1h" }
    );

    res.status(200).json({ 
      token, 
      expiresIn: 3600, 
      message: "Admin login successful."
    });
  } catch (err) {
    console.error("Admin Login Error:", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Faculty Login Route
app.post("/faculty/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find faculty by email
    const result = await pool.query(
      "SELECT * FROM faculty WHERE email = $1",
      [email]
    );
    
    const faculty = result.rows[0];
    
    if (!faculty || !(await bcrypt.compare(password, faculty.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token with faculty flag
    const token = jwt.sign(
      { 
        userId: faculty.faculty_id,
        isFaculty: true 
      }, 
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "1h" }
    );

    res.status(200).json({ 
      token, 
      expiresIn: 3600, 
      message: "Faculty login successful."
    });
  } catch (err) {
    console.error("Faculty Login Error:", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
});

// Middleware for Protected Routes
const authMiddleware = (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    // Check if the authorization header exists and has the correct format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid Authorization header');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Extract the token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log('No token found');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    
    // Add the user info to the request object
    req.user = {
      userId: decoded.userId,
      isFaculty: decoded.isFaculty || false,
      isAdmin: decoded.isAdmin || false
    };
    
    console.log('Auth successful:', req.user); // Add this for debugging
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Admin-only middleware
const adminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Protected Route
app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT student_id, name, email, enrollment_date, status FROM students WHERE student_id = $1", 
      [req.user.userId]
    );
    
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Modify the Add Student Route
app.post("/add-student", async (req, res) => {
  try {
    const { name, rollNumber, email, department, password, phone, address, dateOfBirth } = req.body;

    // Validate required fields
    if (!name || !rollNumber || !email || department === undefined || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the student already exists
    const existingStudent = await pool.query(
      "SELECT * FROM students WHERE email = $1",
      [email]
    );
    
    if (existingStudent.rows.length > 0) {
      return res.status(400).json({ message: "Student with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new student with additional fields
    await pool.query(
      `INSERT INTO students (
        name, 
        roll_number, 
        email, 
        department_id, 
        password, 
        status, 
        enrollment_date,
        phone,
        address,
        date_of_birth
      ) 
      VALUES (
        $1, $2, $3, 
        (SELECT department_id FROM departments WHERE department_code = $4), 
        $5, 'Active', CURRENT_DATE, $6, $7, $8
      )`,
      [name, rollNumber, email, department, hashedPassword, phone, address, dateOfBirth || null]
    );

    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    console.error("Error adding student:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Fetch all students
app.get("/students", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.student_id, s.name, s.roll_number, s.email, s.phone,s.date_of_birth,
       d.department_name AS department 
       FROM students s 
       LEFT JOIN departments d ON s.department_id = d.department_id 
       ORDER BY s.name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

// Example protected admin route
app.get("/admin/dashboard", adminMiddleware, async (req, res) => {
  // Admin only content
  res.json({ message: "Welcome to admin dashboard" });
});

// Delete Student endpoint
app.delete("/students/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if student exists
    const student = await pool.query(
      "SELECT * FROM students WHERE student_id = $1",
      [id]
    );
    
    if (student.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Delete the student
    await pool.query(
      "DELETE FROM students WHERE student_id = $1",
      [id]
    );
    
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Failed to delete student" });
  }
});

// Update the Student update endpoint
app.put("/students/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rollNumber, email, department, password, phone, address, dateOfBirth } = req.body;
    
    // Check if student exists
    const student = await pool.query(
      "SELECT * FROM students WHERE student_id = $1",
      [id]
    );
    
    if (student.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Prepare update query parts
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (name) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    
    if (rollNumber) {
      updates.push(`roll_number = $${paramCount}`);
      values.push(rollNumber);
      paramCount++;
    }
    
    if (email) {
      // Check if email already exists for another student
      const emailCheck = await pool.query(
        "SELECT * FROM students WHERE email = $1 AND student_id != $2",
        [email, id]
      );
      
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: "Email is already in use by another student" });
      }
      
      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }
    
    if (department) {
      updates.push(`department_id = (SELECT department_id FROM departments WHERE department_code = $${paramCount})`);
      values.push(department);
      paramCount++;
    }
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = $${paramCount}`);
      values.push(hashedPassword);
      paramCount++;
    }
    
    // Add new field updates
    if (phone !== undefined) {
      updates.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }
    
    if (address !== undefined) {
      updates.push(`address = $${paramCount}`);
      values.push(address);
      paramCount++;
    }
    
    if (dateOfBirth !== undefined) {
      updates.push(`date_of_birth = $${paramCount}`);
      values.push(dateOfBirth || null);
      paramCount++;
    }
    
    // Add student_id to values array
    values.push(id);
    
    // Execute update if there are fields to update
    if (updates.length > 0) {
      const updateQuery = `
        UPDATE students 
        SET ${updates.join(", ")} 
        WHERE student_id = $${paramCount}
        RETURNING student_id, name, roll_number, email, phone, address,
        TO_CHAR(date_of_birth, 'YYYY-MM-DD') as date_of_birth
      `;
      
      const result = await pool.query(updateQuery, values);
      res.json({ 
        message: "Student updated successfully",
        student: result.rows[0]
      });
    } else {
      res.status(400).json({ message: "No fields to update" });
    }
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Failed to update student" });
  }
});

// Update the get single student endpoint to include new fields
app.get("/students/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      `SELECT s.student_id, s.name, s.roll_number, s.email, 
        s.phone, s.address, TO_CHAR(s.date_of_birth, 'YYYY-MM-DD') as date_of_birth,
        d.department_code AS department
       FROM students s
       LEFT JOIN departments d ON s.department_id = d.department_id
       WHERE s.student_id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Failed to fetch student details" });
  }
});

// Student Profile Update endpoint
app.put("/student/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, address, dateOfBirth } = req.body;
    const studentId = req.user.userId;
    
    // Check if student exists
    const student = await pool.query(
      "SELECT * FROM students WHERE student_id = $1",
      [studentId]
    );
    
    if (student.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Update the student profile
    const result = await pool.query(
      `UPDATE students 
       SET name = $1, email = $2, phone = $3, address = $4, date_of_birth = $5
       WHERE student_id = $6
       RETURNING student_id, name, email, phone, address, 
       TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth`,
      [name, email, phone, address, dateOfBirth, studentId]
    );

    res.json({ 
      message: "Student profile updated successfully",
      student: result.rows[0]
    });
  } catch (err) {
    console.error("Error updating student profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add this route to your existing server.js file

// Get Student Profile endpoint
app.get("/student/profile", authMiddleware, async (req, res) => {
  try {
    const studentId = req.user.userId;
    
    const result = await pool.query(
      `SELECT s.student_id, s.name, s.roll_number, s.email, s.phone, s.address, 
       TO_CHAR(s.date_of_birth, 'YYYY-MM-DD') as date_of_birth,
       d.department_name AS department
       FROM students s
       LEFT JOIN departments d ON s.department_id = d.department_id
       WHERE s.student_id = $1`,
      [studentId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    res.json({ 
      student: result.rows[0]
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Failed to fetch student profile" });
  }
});

// Add a Faculty Profile endpoint
app.get("/faculty/profile", authMiddleware, async (req, res) => {
  try {
    const facultyId = req.user.userId;
    
    const result = await pool.query(
      `SELECT f.faculty_id, f.name, f.email, f.phone, f.position, f.specialization,
       d.department_name AS department
       FROM faculty f
       LEFT JOIN departments d ON f.department_id = d.department_id
       WHERE f.faculty_id = $1`,
      [facultyId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching faculty profile:", error);
    res.status(500).json({ message: "Failed to fetch faculty profile" });
  }
});

// Add these routes to your server.js file

// Get the courses taught by a faculty
app.get("/faculty/courses", authMiddleware, async (req, res) => {
  try {
    console.log('Faculty courses endpoint called');
    
    if (!req.user.isFaculty) {
      console.log('Access denied: not a faculty member');
      return res.status(403).json({ message: "Access denied. Faculty only." });
    }
    
    const facultyId = req.user.userId;
    console.log('Finding courses for faculty ID:', facultyId);

    // Use the FacultyCourse table to find courses taught by this faculty
    const result = await pool.query(
      `SELECT c.course_id, c.course_code, c.course_name, c.description
       FROM Courses c
       JOIN FacultyCourse fc ON c.course_id = fc.course_id
       WHERE fc.faculty_id = $1
       ORDER BY c.course_name`,
      [facultyId]
    );

    console.log(`Found ${result.rows.length} courses for faculty ID ${facultyId}`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching faculty courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

// Get students enrolled in a course
app.get("/faculty/course/:courseId/students", authMiddleware, async (req, res) => {
  try {
    if (!req.user.isFaculty) {
      return res.status(403).json({ message: "Access denied. Faculty only." });
    }

    const { courseId } = req.params;

    // Using a student-course relationship to find enrolled students
    // Adjust this query based on your actual schema
    const result = await pool.query(
      `SELECT s.student_id, s.name, s.roll_number
       FROM Students s
       WHERE s.department_id = (
         SELECT department_id 
         FROM Faculty 
         WHERE faculty_id = $1
       )
       AND s.status = 'Active'
       ORDER BY s.roll_number`,
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching students for course:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});

// Mark attendance route
app.post("/faculty/mark-attendance", authMiddleware, async (req, res) => {
  const client = await pool.connect();
  
  try {
    if (!req.user.isFaculty) {
      return res.status(403).json({ message: "Access denied. Faculty only." });
    }

    const { courseId, date, attendance } = req.body;
    const facultyId = req.user.userId;

    if (!courseId || !date || !attendance || !Array.isArray(attendance)) {
      return res.status(400).json({ message: "Invalid attendance data" });
    }

    // Start a transaction
    await client.query('BEGIN');

    // Create an attendance log entry
    const logResult = await client.query(
      `INSERT INTO AttendanceLog (date, course_id, faculty_id)
       VALUES ($1, $2, $3)
       RETURNING attendance_log_id`,
      [date, courseId, facultyId]
    );
    
    const attendanceLogId = logResult.rows[0].attendance_log_id;

    // Process each student's attendance
    for (const entry of attendance) {
      const { studentId, isPresent } = entry;

      // Update the aggregate attendance record
      await client.query(
        `INSERT INTO Attendance (student_id, course_id, total_hours, present_hours)
         VALUES ($1, $2, 1, $3)
         ON CONFLICT (student_id, course_id) 
         DO UPDATE SET 
           total_hours = Attendance.total_hours + 1,
           present_hours = Attendance.present_hours + $3`,
        [studentId, courseId, isPresent ? 1 : 0]
      );

      // If student is absent, record it in the AbsentLog
      if (!isPresent) {
        await client.query(
          `INSERT INTO AbsentLog (student_id, course_id, attendance_log_id, date)
           VALUES ($1, $2, $3, $4)`,
          [studentId, courseId, attendanceLogId, date]
        );
      }
    }

    // Commit the transaction
    await client.query('COMMIT');

    res.json({ message: "Attendance marked successfully", attendanceLogId });
  } catch (error) {
    // Rollback the transaction on error
    await client.query('ROLLBACK');
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Failed to mark attendance" });
  } finally {
    client.release();
  }
});

// Get student attendance data
app.get("/student/attendance", authMiddleware, async (req, res) => {
  try {
    const studentId = req.user.userId;
    
    // Get all course attendance records for this student
    const result = await pool.query(
      `SELECT c.course_name, c.course_code, a.total_hours, a.present_hours,
        CASE 
          WHEN a.total_hours > 0 
          THEN ROUND((a.present_hours::numeric / a.total_hours) * 100, 2)
          ELSE 0 
        END AS percentage
       FROM Attendance a
       JOIN Courses c ON a.course_id = c.course_id
       WHERE a.student_id = $1`,
      [studentId]
    );
    
    // Calculate overall attendance
    const overallResult = await pool.query(
      `SELECT 
        SUM(total_hours) as total,
        SUM(present_hours) as present
       FROM Attendance
       WHERE student_id = $1`,
      [studentId]
    );
    
    const overall = overallResult.rows[0];
    const overallPercentage = overall.total > 0 
      ? Math.round((overall.present / overall.total) * 100) 
      : 0;
    
    res.json({
      courses: result.rows,
      overall: {
        total: parseInt(overall.total) || 0,
        present: parseInt(overall.present) || 0,
        percentage: overallPercentage
      }
    });
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ message: "Failed to fetch attendance data" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
