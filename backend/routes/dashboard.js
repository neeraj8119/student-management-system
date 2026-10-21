const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const [[students]] = await db.query(
            'SELECT COUNT(*) AS count FROM students'
        );

        const [[teachers]] = await db.query(
            'SELECT COUNT(*) AS count FROM teachers'
        );

        const [[departments]] = await db.query(
            'SELECT COUNT(*) AS count FROM departments'
        );

        const [[courses]] = await db.query(
            'SELECT COUNT(*) AS count FROM courses'
        );

        res.json({
            students: students.count,
            teachers: teachers.count,
            departments: departments.count,
            courses: courses.count
        });

    } catch (error) {
        console.error('Dashboard error:', error);

        res.status(500).json({
            message: 'Failed to fetch dashboard data'
        });
    }
});

module.exports = router;
