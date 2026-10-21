const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT m.*, s.student_id AS student_code, s.name AS student_name
            FROM marks m
            LEFT JOIN students s ON m.student_id = s.id
            ORDER BY m.id ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch marks' });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { student_id, subject, marks, max_marks } = req.body;
        if (!student_id || !subject) {
            return res.status(400).json({ message: 'Student and subject are required' });
        }
        const [result] = await db.query(
            'INSERT INTO marks (student_id, subject, marks, max_marks) VALUES (?, ?, ?, ?)',
            [student_id, subject, marks || 0, max_marks || 100]
        );
        res.status(201).json({ id: result.insertId, message: 'Marks added successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { student_id, subject, marks, max_marks } = req.body;
        const [result] = await db.query(
            'UPDATE marks SET student_id = ?, subject = ?, marks = ?, max_marks = ? WHERE id = ?',
            [student_id, subject, marks || 0, max_marks || 100, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Marks record not found' });
        }
        res.json({ message: 'Marks updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM marks WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Marks record not found' });
        }
        res.json({ message: 'Marks deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete marks record' });
    }
});

module.exports = router;