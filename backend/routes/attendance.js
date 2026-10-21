const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT a.*, s.student_id AS student_code, s.name AS student_name
            FROM attendance a
            LEFT JOIN students s ON a.student_id = s.id
            ORDER BY a.attendance_date DESC, a.id ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch attendance' });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { student_id, attendance_date, status } = req.body;
        if (!student_id || !attendance_date || !status) {
            return res.status(400).json({ message: 'Student, date and status are required' });
        }
        const [result] = await db.query(
            'INSERT INTO attendance (student_id, attendance_date, status) VALUES (?, ?, ?)',
            [student_id, attendance_date, status]
        );
        res.status(201).json({ id: result.insertId, message: 'Attendance marked successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { student_id, attendance_date, status } = req.body;
        const [result] = await db.query(
            'UPDATE attendance SET student_id = ?, attendance_date = ?, status = ? WHERE id = ?',
            [student_id, attendance_date, status, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.json({ message: 'Attendance updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM attendance WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.json({ message: 'Attendance deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete attendance' });
    }
});

module.exports = router;