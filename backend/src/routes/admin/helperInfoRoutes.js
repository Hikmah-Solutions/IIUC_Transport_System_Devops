const express = require('express');
const router = express.Router();
const { HelperInfo } = require('../../../models');
const Joi = require('joi');

// Validation schema
const helperInfoSchema = Joi.object({
  name: Joi.string().required(),
  helperID: Joi.string().required(),
  phone: Joi.string().pattern(/^01[0-9]{9}$/).required(), // Phone number must start with 01 and be 11 characters long
  address: Joi.string().required(),
  helperNID: Joi.string().required(),
});

// Create a new helper information
router.post('/', async (req, res) => {
  try {
    const { error } = helperInfoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const helperInfo = await HelperInfo.create(req.body);
    res.status(201).json(helperInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all helper information
router.get('/', async (req, res) => {
  try {
    const helperInfo = await HelperInfo.findAll();
    res.status(200).json(helperInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get helper information by ID
router.get('/:id', async (req, res) => {
  try {
    const helperInfo = await HelperInfo.findByPk(req.params.id);
    if (!helperInfo) {
      return res.status(404).json({ error: 'Helper information not found' });
    }
    res.status(200).json(helperInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update helper information by ID
router.put('/:id', async (req, res) => {
  try {
    const { error } = helperInfoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const helperInfo = await HelperInfo.findByPk(req.params.id);
    if (!helperInfo) {
      return res.status(404).json({ error: 'Helper information not found' });
    }

    await helperInfo.update(req.body);
    res.status(200).json(helperInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete helper information by ID
router.delete('/:id', async (req, res) => {
  try {
    const helperInfo = await HelperInfo.findByPk(req.params.id);
    if (!helperInfo) {
      return res.status(404).json({ error: 'Helper information not found' });
    }
    await helperInfo.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// router.get('/suggestions', async (req, res) => {
//   try {
//     const helperInfo = await HelperInfo.findAll({
//       attributes: ['name', 'phone']
//     });
//     res.status(200).json(helperInfo);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;