const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT t.*, d.name AS department_name
            FROM teachers t
            LEFT JOIN departments d ON t.department_id = d.id
            ORDER BY t.id ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch teachers' });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const { name, email, phone, department_id } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }
        const [result] = await db.query(
            'INSERT INTO teachers (name, email, phone, department_id) VALUES (?, ?, ?, ?)',
            [name, email, phone, department_id || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Teacher added successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const { name, email, phone, department_id } = req.body;
        const [result] = await db.query(
            'UPDATE teachers SET name = ?, email = ?, phone = ?, department_id = ? WHERE id = ?',
            [name, email, phone, department_id || null, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json({ message: 'Teacher updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM teachers WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete teacher' });
    }
});

module.exports = router;