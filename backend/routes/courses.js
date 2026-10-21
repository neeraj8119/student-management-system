const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT c.*, t.name AS teacher_name, d.name AS department_name
            FROM courses c
            LEFT JOIN teachers t ON c.teacher_id = t.id
            LEFT JOIN departments d ON c.department_id = d.id
            ORDER BY c.id ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch courses' });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { name, code, teacher_id, department_id } = req.body;
        if (!name || !code) {
            return res.status(400).json({ message: 'Name and code are required' });
        }
        const [result] = await db.query(
            'INSERT INTO courses (name, code, teacher_id, department_id) VALUES (?, ?, ?, ?)',
            [name, code, teacher_id || null, department_id || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Course added successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { name, code, teacher_id, department_id } = req.body;
        const [result] = await db.query(
            'UPDATE courses SET name = ?, code = ?, teacher_id = ?, department_id = ? WHERE id = ?',
            [name, code, teacher_id || null, department_id || null, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({ message: 'Course updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete course' });
    }
});

module.exports = router;