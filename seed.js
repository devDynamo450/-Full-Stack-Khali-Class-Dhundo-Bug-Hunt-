/**
 * seed.js — Populates MongoDB with comprehensive university classroom data
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');

// ─── Block → Canteen Mapping ─────────────────────────────────────────────────
const BLOCKS = [
  {
    name: 'A-Block',
    canteen: 'Fusion Cafe',
    description: 'Main Academic Block',
    floors: [
      { floor: 1, prefix: 'A1', rooms: ['01','02','03','04','05','06','07','08'] },
      { floor: 2, prefix: 'A2', rooms: ['01','02','03','04','05','06','07'] },
      { floor: 3, prefix: 'A3', rooms: ['01','02','03','04','05','06'] },
      { floor: 4, prefix: 'A4', rooms: ['01','02','03','04','05'] },
    ],
  },
  {
    name: 'B-Block',
    canteen: 'Chai Adda',
    description: 'Engineering Wing',
    floors: [
      { floor: 1, prefix: 'B1', rooms: ['01','02','03','04','05','06','07'] },
      { floor: 2, prefix: 'B2', rooms: ['01','02','03','04','05','06'] },
      { floor: 3, prefix: 'B3', rooms: ['01','02','03','04','05'] },
      { floor: 4, prefix: 'B4', rooms: ['01','02','03','04'] },
    ],
  },
  {
    name: 'AI-Block',
    canteen: 'Maggie Point',
    description: 'AI & Data Science Hub',
    floors: [
      { floor: 1, prefix: 'AI1', rooms: ['01','02','03','04','05','06'] },
      { floor: 2, prefix: 'AI2', rooms: ['01','02','03','04','05'] },
      { floor: 3, prefix: 'AI3', rooms: ['01','02','03','04'] },
      { floor: 4, prefix: 'AI4', rooms: ['01','02','03'] },
    ],
  },
  {
    name: 'C-Block',
    canteen: 'Le Broc',
    description: 'Commerce & Management',
    floors: [
      { floor: 1, prefix: 'C1', rooms: ['01','02','03','04','05','06'] },
      { floor: 2, prefix: 'C2', rooms: ['01','02','03','04','05'] },
      { floor: 3, prefix: 'C3', rooms: ['01','02','03','04'] },
    ],
  },
  {
    name: 'D-Block',
    canteen: 'Fusion Cafe',
    description: 'Design & Architecture',
    floors: [
      { floor: 1, prefix: 'D1', rooms: ['01','02','03','04','05'] },
      { floor: 2, prefix: 'D2', rooms: ['01','02','03','04'] },
      { floor: 3, prefix: 'D3', rooms: ['01','02','03'] },
    ],
  },
  {
    name: 'E-Block',
    canteen: 'Chai Adda',
    description: 'Electronics & ECE',
    floors: [
      { floor: 1, prefix: 'E1', rooms: ['01','02','03','04','05','06'] },
      { floor: 2, prefix: 'E2', rooms: ['01','02','03','04','05'] },
      { floor: 3, prefix: 'E3', rooms: ['01','02','03','04'] },
    ],
  },
  {
    name: 'Lab Block',
    canteen: 'Maggie Point',
    description: 'Computer & Science Labs',
    floors: [
      { floor: 1, prefix: 'L1', rooms: ['01','02','03','04','05'] },
      { floor: 2, prefix: 'L2', rooms: ['01','02','03','04'] },
    ],
  },
  {
    name: 'Seminar Hall',
    canteen: 'Le Broc',
    description: 'Conference & Seminar Halls',
    floors: [
      { floor: 1, prefix: 'SH', rooms: ['01','02','03','04','05','06'] },
    ],
  },
];

// Room type & capacity based on block/prefix patterns
function getRoomMeta(blockName, prefix, roomNum) {
  if (blockName === 'Lab Block') return { type: 'Lab', capacity: 30 };
  if (blockName === 'Seminar Hall') return { type: 'Seminar Hall', capacity: 120 };
  if (blockName === 'AI-Block') return { type: 'Studio', capacity: 40 };
  const num = parseInt(roomNum, 10);
  if (num <= 2) return { type: 'Lecture Hall', capacity: 80 };
  if (num <= 5) return { type: 'Classroom', capacity: 60 };
  return { type: 'Tutorial Room', capacity: 30 };
}

// Build all room documents
const seedRooms = [];
BLOCKS.forEach(({ name, canteen, floors }) => {
  floors.forEach(({ floor, prefix, rooms }) => {
    rooms.forEach((num) => {
      const roomNumber = `${prefix}-${num}`;
      const { type, capacity } = getRoomMeta(name, prefix, num);
      seedRooms.push({
        roomNumber,
        block: name,
        isClaimed: false,
        claimedBy: null,
        nearestCanteen: canteen,
        floor,
        type,
        capacity,
      });
    });
  });
});

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Room.deleteMany({});
    console.log('🗑️  Cleared existing rooms');

    const inserted = await Room.insertMany(seedRooms);
    console.log(`\n🌱 Seeded ${inserted.length} rooms across ${BLOCKS.length} blocks\n`);

    const summary = BLOCKS.map(b => {
      const count = seedRooms.filter(r => r.block === b.name).length;
      return `  ${b.name.padEnd(14)} (${b.canteen.padEnd(14)}): ${count} rooms`;
    }).join('\n');
    console.log('📊 Block summary:\n' + summary);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
