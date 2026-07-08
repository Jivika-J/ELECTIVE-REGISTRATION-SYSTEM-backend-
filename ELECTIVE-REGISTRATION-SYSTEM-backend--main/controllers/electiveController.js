// controllers/electiveController.js
const { electives, enrollments, users } = require('../db');

const checkPrereqs = (student, elective) => {
    return elective.prereqs.every(prereq => student.completedCourses.includes(prereq));
};

const getEnrollmentStats = (electiveId) => {
    const currentEnrollments = enrollments.filter(e => e.electiveId === electiveId && e.status === 'enrolled');
    const deptCounts = {};
    currentEnrollments.forEach(e => {
        const student = users.find(u => u.id === e.studentId);
        deptCounts[student.dept] = (deptCounts[student.dept] || 0) + 1;
    });
    return { total: currentEnrollments.length, deptCounts };
};

exports.enroll = (req, res) => {
    const studentId = req.user.id;
    const { electiveId } = req.body;

    const student = users.find(u => u.id === studentId);
    const elective = electives.find(e => e.id === electiveId);

    if (!elective) return res.status(404).json({ error: "Elective not found." });

    if (new Date() > new Date(elective.deadline)) {
        return res.status(400).json({ error: "Registration deadline has passed." });
    }

    if (!checkPrereqs(student, elective)) {
        return res.status(400).json({ error: "Prerequisites not met for this elective.", required: elective.prereqs });
    }

    const existing = enrollments.find(e => e.studentId === studentId && e.electiveId === electiveId);
    if (existing) {
        return res.status(400).json({ error: `You are already ${existing.status} in this elective.` });
    }

    const stats = getEnrollmentStats(elective.id);
    const deptQuota = elective.deptQuotas[student.dept] || 0;
    const currentDeptCount = stats.deptCounts[student.dept] || 0;

    let status = 'enrolled';
    let message = "Successfully enrolled.";

    if (stats.total >= elective.intake || currentDeptCount >= deptQuota) {
        status = 'waitlisted';
        message = "Elective or department quota full. Added to waitlist.";
    }

    enrollments.push({ studentId, electiveId, status, sessionsAttended: 0 });
    res.status(200).json({ message, status });
};

exports.changeElective = (req, res) => {
    const studentId = req.user.id;
    const { currentElectiveId, newElectiveId } = req.body;

    const currentEnrollment = enrollments.find(e => e.studentId === studentId && e.electiveId === currentElectiveId);
    if (!currentEnrollment) return res.status(400).json({ error: "Not enrolled in current elective." });

    const currentElective = electives.find(e => e.id === currentElectiveId);
    
    if (currentElective.classesStartedAt) {
        const daysSinceStart = (new Date() - new Date(currentElective.classesStartedAt)) / (1000 * 60 * 60 * 24);
        if (daysSinceStart > 7) return res.status(400).json({ error: "Add/Drop window closed." });
    }

    // if (currentEnrollment.sessionsAttended < 2) {
    //     return res.status(400).json({ error: "Must attend 2 sessions before dropping." });
    // }
    
    const newElective = electives.find(e => e.id === newElectiveId);
    if (!newElective) return res.status(404).json({ error: "New elective not found." });

    const student = users.find(u => u.id === studentId);
    if (!checkPrereqs(student, newElective)) return res.status(400).json({ error: "Prerequisites not met." });

    const stats = getEnrollmentStats(newElective.id);
    const deptQuota = newElective.deptQuotas[student.dept] || 0;
    const currentDeptCount = stats.deptCounts[student.dept] || 0;

    if (stats.total >= newElective.intake || currentDeptCount >= deptQuota) {
        return res.status(400).json({ error: "No vacant seats available." });
    }

    const index = enrollments.indexOf(currentEnrollment);
    enrollments.splice(index, 1); 
    enrollments.push({ studentId, electiveId: newElectiveId, status: 'enrolled', sessionsAttended: 0 });

    res.status(200).json({ message: "Successfully changed elective." });
};

exports.getElectives = (req, res) => res.json(electives);
exports.getEnrollments = (req, res) => res.json(enrollments);