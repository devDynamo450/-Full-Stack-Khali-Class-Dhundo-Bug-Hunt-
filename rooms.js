const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

router.get('/', async (req, res) => {
  try {
    const { canteen, block } = req.query;
    const query = { isClaimed: false };
    if (canteen && canteen !== 'All') query.nearestCanteen = canteen;
    if (block && block !== 'All') query.block = block;
    const rooms = await Room.find(query).sort({ block: 1, floor: 1, roomNumber: 1 });
    res.json({ success: true, count: rooms.length, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching rooms.' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await Room.aggregate([
      { $group: { _id: '$block', total: { $sum: 1 }, available: { $sum: { $cond: ['$isClaimed', 0, 1] } }, canteen: { $first: '$nearestCanteen' } } },
      { $sort: { _id: 1 } },
    ]);
    const totalRooms = stats.reduce((s, b) => s + b.total, 0);
    const totalAvailable = stats.reduce((s, b) => s + b.available, 0);
    res.json({ success: true, data: { blocks: stats, totalRooms, totalAvailable } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// TOCTOU-safe atomic claim — emits socket event on success
router.post('/claim', async (req, res) => {
  try {
    const { roomId, claimedBy } = req.body;
    if (!roomId || !claimedBy)
      return res.status(400).json({ success: false, message: 'roomId and claimedBy are required.' });

    const updatedRoom = await Room.findOneAndUpdate(
      { _id: roomId, isClaimed: false },
      { $set: { isClaimed: true, claimedBy } },
      { new: true }
    );

    if (!updatedRoom)
      return res.status(409).json({ success: false, message: 'Room already claimed. Choose another.' });

    // 🔌 Broadcast to ALL connected clients in real-time
    const io = req.app.get('io');
    if (io) {
      io.emit('room:claimed', { roomId: updatedRoom._id, roomNumber: updatedRoom.roomNumber, claimedBy });
    }

    res.json({ success: true, message: 'Room claimed!', data: updatedRoom });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error claiming room.' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const rooms = await Room.find().sort({ block: 1, floor: 1, roomNumber: 1 });
    res.json({ success: true, count: rooms.length, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
