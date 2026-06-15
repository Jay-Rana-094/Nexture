const express = require('express');
const router = express.Router();
const FailedEmail = require('../Models/FailedEmail');
const emailService = require('../Services/email');

// GET /api/emails/failed - list recent failed emails
router.get('/failed', async (req, res) => {
  try {
    const items = await FailedEmail.find().sort({ createdAt: -1 }).limit(100);
    res.json(items);
  } catch (err) {
    console.error('Failed to fetch failed emails:', err);
    res.status(500).json({ error: 'Failed to fetch failed emails' });
  }
});

// POST /api/emails/retry/:id - try to resend a failed email manually
router.post('/retry/:id', async (req, res) => {
  try {
    const doc = await FailedEmail.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Failed email not found' });

    try {
      await emailService.sendOrderConfirmation(doc.payload);
      await doc.remove();
      return res.json({ success: true });
    } catch (err) {
      doc.attempts = (doc.attempts || 0) + 1;
      doc.lastError = err && err.message ? err.message : String(err);
      await doc.save();
      return res.status(500).json({ error: 'Retry failed', details: doc.lastError });
    }
  } catch (err) {
    console.error('Retry endpoint error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
