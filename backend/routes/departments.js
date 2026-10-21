const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get all departments
router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM departments ORDER BY name'
        );

        res.json(rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to fetch departments'
        });
    }
});

// Add department
router.post('/', auth, async (req, res) => {
    try {
        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({
                message: 'Name and code are required'
            });
        }

        const [result] = await db.query(
            'INSERT INTO departments (name, code) VALUES (?, ?)',
            [name, code]
        );

        res.status(201).json({
            message: 'Department created successfully',
            id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message
        });
    }
});

// Update department
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, code } = req.body;

        const [result] = await db.query(
            'UPDATE departments SET name = ?, code = ? WHERE id = ?',
            [name, code, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Department not found'
            });
        }

        res.json({
            message: 'Department updated successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to update department'
        });
    }
});

// Delete department
router.delete('/:id', auth, async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM departments WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Department not found'
            });
        }

        res.json({
            message: 'Department deleted successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Failed to delete department'
        });
    }
});

module.exports = router;
