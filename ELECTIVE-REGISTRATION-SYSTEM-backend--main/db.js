// db.js
const rawStudentData = require('./students.json');

// Magically attach the required fields to your clean JSON data
const studentData = rawStudentData.map(student => ({
    ...student,
    role: "student",
    completedCourses: student.completedCourses || []
}));

// Create your admin user
const adminUser = { id: 999, name: "Admin_1", role: "admin", dept: "Admin", cgpa: null, completedCourses: [] };

// Combine them into one master users array
const users = [...studentData, adminUser];

// Electives Data
const electives = [
    {
        id: 101,
        name: "Machine Learning",
        intake: 2,
        deptQuotas: { CSE: 1, Mechanical: 1, ECE: 1 },
        prereqs: ["Data Structures", "Probability"],
        deadline: new Date(Date.now() + 86400000),
        classesStartedAt: null 
    },
    {
        id: 102,
        name: "RTOS",
        intake: 60,
        deptQuotas: { CSE: 30, ECE: 30 },
        prereqs: ["Operating Systems"],
        deadline: new Date(Date.now() - 86400000),
        classesStartedAt: new Date(Date.now() - 3 * 86400000)
    }
];

const enrollments = [];

module.exports = { users, electives, enrollments };