import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
mongoose.connect("mongodb://127.0.0.1:27017", {
  dbName: "Alemeno",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

// Create a Students schema and model
const studentsSchema = new mongoose.Schema({
  username: String,
  password: String,
  token: String,
});

const CoursesSchema = new mongoose.Schema({
  name: String,
  instructor: String,
  description: String,
  enrollmentStatus: String,
  thumbnail: String,
  duration: String,
  schedule: String,
  location: String,
  prerequisites: Array,
  dueDate: String,
  progress: Number,
  syllabus: [
    {
      week: Number,
      topic: String,
      content: String,
    },
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Students",
    },
  ],
});

const Students = mongoose.model("Students", studentsSchema);
const Courses = mongoose.model("CoursesSchema", CoursesSchema);

app.get("/getAllCourses", async (req, res) => {
  try {
    const fetchUser = await Courses.find({})
    res.status(200).json({ fetchUser });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/getloggedinUserEnrolledCourses", async (req, res) => {
  try {
    const enrolledCourses = await Courses.find({ 'students': req?.body?.studentID }).populate('students') // here use logged in user id 
    res.status(200).json({ enrolledCourses });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Sign-up (registration) API endpoint
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await Students.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = jwt.sign({ username: req.body.username }, "your-secret-key");

    const newUser = new Students({
      username,
      password: hashedPassword,
      token,
    });

    await newUser.save();

    const loggedInUser = await Students.findOne({ username: username });

    res.status(201).json({
      message: "Students registered successfully",
      Students: loggedInUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// API to add a student to a course with payload
app.post("/enroll", async (req, res) => {
  try {
    const { courseId, student } = req.body;

    console.log("sadf", req?.body);

    const loggedInStudent = await Students.findOne({ username: student });

    if (!loggedInStudent) {
      return res
        .status(401)
        .json({ message: "Student not found or Password Does not Match" });
    }

    // Enroll the student in the course
    const course = await Courses.findByIdAndUpdate(courseId, {
      $push: { students: loggedInStudent },
    });

    // // Retrieve a list of courses with their associated students
    // const courses = await Courses.find({}).populate('students');

    // Send the response with the list of courses
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Could not enroll student in the course." });
  }
});

app.post("/Courses", async (req, res) => {
  try {
    const {
      name,
      instructor,
      description,
      enrollmentStatus,
      thumbnail,
      duration,
      schedule,
      location,
      prerequisites,
      syllabus,
    } = req?.body;

    // console.log(req.body);

    const courses = new Courses({
      name,
      instructor,
      description,
      enrollmentStatus,
      thumbnail,
      duration,
      schedule,
      location,
      prerequisites,
      syllabus,
    });

    await courses.save();

    res.status(201).json({
      message: "Students registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login API endpoint
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Students.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Students not found or Password Does not Match" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Students not found or Password Does not Match" });
    }

    res
      .status(201)
      .json({ message: "Students registered successfully", Students: user });
  } catch (error) {
    res.status(500).json({ message: "Error authenticating user" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to your API!");
});
