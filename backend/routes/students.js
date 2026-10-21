const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get all students
router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                s.*,
                d.name AS department_name,
                c.name AS course_name
            FROM students s
            LEFT JOIN departments d ON s.department_id = d.id
            LEFT JOIN courses c ON s.course_id = c.id
            ORDER BY s.id ASC
        `);

        res.json(rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to fetch students'
        });
    }
});

// Add student
router.post('/', auth, async (req, res) => {
    try {
        const {
            student_id,
            name,
            email,
            phone,
            gender,
            date_of_birth,
            department_id,
            course_id,
            address
        } = req.body;

        if (!student_id || !name) {
            return res.status(400).json({ message: 'Student ID and Name are required' });
        }

        const [dupes] = await db.query(
            'SELECT id FROM students WHERE student_id = ?' + (email ? ' OR email = ?' : ''),
            email ? [student_id, email] : [student_id]
        );
        if (dupes.length > 0) {
            return res.status(400).json({ message: 'Student ID or Email already exists' });
        }

        const [result] = await db.query(`
            INSERT INTO students
            (
                student_id,
                name,
                email,
                phone,
                gender,
                date_of_birth,
                department_id,
                course_id,
                address
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            student_id,
            name,
            email,
            phone,
            gender,
            date_of_birth || null,
            department_id || null,
            course_id || null,
            address
        ]);

        res.status(201).json({
            id: result.insertId,
            message: 'Student added successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message
        });
    }
});

// Update student
router.put('/:id', auth, async (req, res) => {
    try {
        const {
            student_id,
            name,
            email,
            phone,
            gender,
            date_of_birth,
            department_id,
            course_id,
            address
        } = req.body;

        if (!student_id || !name) {
            return res.status(400).json({ message: 'Student ID and Name are required' });
        }

        const [dupes] = await db.query(
            'SELECT id FROM students WHERE (student_id = ?' + (email ? ' OR email = ?' : '') + ') AND id != ?',
            email ? [student_id, email, req.params.id] : [student_id, req.params.id]
        );
        if (dupes.length > 0) {
            return res.status(400).json({ message: 'Student ID or Email already exists' });
        }

        const [result] = await db.query(`
            UPDATE students SET
                student_id = ?,
                name = ?,
                email = ?,
                phone = ?,
                gender = ?,
                date_of_birth = ?,
                department_id = ?,
                course_id = ?,
                address = ?
            WHERE id = ?
        `, [
            student_id,
            name,
            email,
            phone,
            gender,
            date_of_birth || null,
            department_id || null,
            course_id || null,
            address,
            req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.json({
            message: 'Student updated successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message
        });
    }
});

// Delete student
router.delete('/:id', auth, async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM students WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        res.json({
            message: 'Student deleted successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to delete student'
        });
    }
});

module.exports = router;