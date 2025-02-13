const express = require('express');
const bcrypt = require('bcrypt');
const {AdminUser} = require('../../../models');
const authMiddleware = require('../../middlewares/authMiddleware');
const router = express.Router();

// Get all users (Only Super Admin)
router.get('/', authMiddleware(['Super Admin']), async (req, res) => {
  try {
    const users = await AdminUser.findAll({
      attributes: ['id', 'name', 'email', 'role', 'employee_position'], // Exclude sensitive fields like password
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update a user (Only Super Admin)
router.put('/:id', authMiddleware(['Super Admin']), async (req, res) => {
  const { name, email, role, employee_position } = req.body;

  try {
    const user = await AdminUser.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.employee_position = employee_position || user.employee_position;

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete a user (Only Super Admin)
router.delete('/:id', authMiddleware(['Super Admin']), async (req, res) => {
  try {
    const user = await AdminUser.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get current user profile (All users)
router.get('/profile', authMiddleware(), async (req, res) => {
  try {
    const user = await AdminUser.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'employee_position'],
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Update current user profile (All users)
router.put('/profile', authMiddleware(), async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await AdminUser.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
      user.password = hashedPassword;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;