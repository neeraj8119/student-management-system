const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT f.*, s.student_id AS student_code, s.name AS student_name
            FROM fees f
            LEFT JOIN students s ON f.student_id = s.id
            ORDER BY f.id ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch fees' });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { student_id, total_amount, paid_amount, payment_date } = req.body;
        if (!student_id) {
            return res.status(400).json({ message: 'Student is required' });
        }
        const [result] = await db.query(
            'INSERT INTO fees (student_id, total_amount, paid_amount, payment_date) VALUES (?, ?, ?, ?)',
            [student_id, total_amount || 0, paid_amount || 0, payment_date || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Fee record added successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { student_id, total_amount, paid_amount, payment_date } = req.body;
        const [result] = await db.query(
            'UPDATE fees SET student_id = ?, total_amount = ?, paid_amount = ?, payment_date = ? WHERE id = ?',
            [student_id, total_amount || 0, paid_amount || 0, payment_date || null, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Fee record not found' });
        }
        res.json({ message: 'Fee record updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM fees WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Fee record not found' });
        }
        res.json({ message: 'Fee record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete fee record' });
    }
});

module.exports = router;