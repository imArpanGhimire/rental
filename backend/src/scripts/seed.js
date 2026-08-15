require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../model/user.model");
const Rental = require("../model/rental.model");

const IMAGE_POOL = {
  rental: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  ],
  flat: [
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  ],
  hostel: [
    "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
  ],
};

// [lng, lat] — Kathmandu valley neighborhoods
const AREAS = [
  { name: "Chabahil, Kathmandu", coords: [85.3437, 27.7167] },
  { name: "New Baneshwor, Kathmandu", coords: [85.3346, 27.6893] },
  { name: "Koteshwor, Kathmandu", coords: [85.3487, 27.6789] },
  { name: "Kalanki, Kathmandu", coords: [85.2810, 27.6939] },
  { name: "Boudha, Kathmandu", coords: [85.3620, 27.7215] },
  { name: "Patan, Lalitpur", coords: [85.3206, 27.6727] },
  { name: "Balkhu, Kathmandu", coords: [85.2965, 27.6875] },
  { name: "Sinamangal, Kathmandu", coords: [85.3550, 27.6989] },
  { name: "Gongabu, Kathmandu", coords: [85.3178, 27.7345] },
  { name: "Kalimati, Kathmandu", coords: [85.2988, 27.6975] },
  { name: "Maharajgunj, Kathmandu", coords: [85.3315, 27.7386] },
  { name: "Sundhara, Kathmandu", coords: [85.3122, 27.7016] },
  { name: "Thamel, Kathmandu", coords: [85.3095, 27.7154] },
  { name: "Jorpati, Kathmandu", coords: [85.3699, 27.7295] },
  { name: "Swayambhu, Kathmandu", coords: [85.2903, 27.7148] },
  { name: "Dhumbarahi, Kathmandu", coords: [85.3336, 27.7285] },
  { name: "Sanepa, Lalitpur", coords: [85.3053, 27.6842] },
  { name: "Jawalakhel, Lalitpur", coords: [85.3134, 27.6742] },
  { name: "Bhaktapur Durbar Area, Bhaktapur", coords: [85.4298, 27.6710] },
  { name: "Tokha, Kathmandu", coords: [85.3486, 27.7530] },
];

const LISTINGS = [
  { type: "rental", title: "Cozy single room near Chabahil chowk", desc: "Quiet single room on the second floor, close to bus stops and local markets. Ideal for students or a single working professional.", price: 9000 },
  { type: "flat", title: "2BHK flat with balcony in New Baneshwor", desc: "Bright 2-bedroom flat with an open balcony, modular kitchen, and attached bathrooms. Walking distance to City Center.", price: 28000 },
  { type: "hostel", title: "Shared hostel bed near Koteshwor", desc: "Affordable shared hostel accommodation with common kitchen and study area. Popular with college students.", price: 6500 },
  { type: "rental", title: "Furnished room in Kalanki", desc: "Fully furnished room with attached bathroom, close to Kalanki bus park. Water and electricity backup included.", price: 11000 },
  { type: "flat", title: "3BHK family flat in Boudha", desc: "Spacious flat suited for families, near Boudhanath Stupa. Includes parking space and a small terrace garden.", price: 38000 },
  { type: "hostel", title: "Girls hostel in Patan", desc: "Safe and secure hostel for female students, with CCTV, warden supervision, and home-style meals available.", price: 8000 },
  { type: "rental", title: "Budget room near Balkhu bridge", desc: "Simple, budget-friendly room close to Ring Road, good for a bachelor or student on a tight budget.", price: 7500 },
  { type: "flat", title: "Modern 2BHK in Sinamangal", desc: "Close to Tribhuvan International Airport, this flat suits frequent travelers or airline staff. Lift access available.", price: 32000 },
  { type: "rental", title: "Sunny room in Gongabu", desc: "Well-ventilated room near Gongabu Buspark, ideal for those commuting outside the valley frequently.", price: 8500 },
  { type: "hostel", title: "Boys hostel near Kalimati market", desc: "Budget hostel close to Kalimati vegetable market, shared kitchen, common bathroom, wifi included.", price: 7000 },
  { type: "flat", title: "Premium flat in Maharajgunj", desc: "High-end 2BHK apartment near Norvic Hospital, with 24-hour security and dedicated parking.", price: 45000 },
  { type: "rental", title: "Compact room in Sundhara", desc: "Centrally located room near New Road, walking distance to Ratna Park and major offices.", price: 10000 },
  { type: "flat", title: "Tourist-friendly flat in Thamel", desc: "Fully furnished flat in the heart of Thamel, perfect for short and long-term stays near restaurants and shops.", price: 35000 },
  { type: "rental", title: "Family room in Jorpati", desc: "Peaceful residential area away from the city noise, suitable for small families or couples.", price: 9500 },
  { type: "hostel", title: "Co-ed hostel in Swayambhu", desc: "Affordable hostel near Swayambhunath Temple, with mountain views and a rooftop common area.", price: 7500 },
  { type: "flat", title: "1BHK flat in Dhumbarahi", desc: "Compact and modern 1-bedroom flat, great for young professionals working nearby.", price: 22000 },
  { type: "rental", title: "Room with rooftop access in Sanepa", desc: "Room with shared rooftop access and a good view of the Lalitpur skyline, close to cafes and offices.", price: 12000 },
  { type: "flat", title: "Elegant flat in Jawalakhel", desc: "Well-maintained flat near Jawalakhel Zoo, with parking, backup water, and a small garden area.", price: 30000 },
  { type: "hostel", title: "Heritage-area hostel in Bhaktapur", desc: "Budget hostel steps away from Bhaktapur Durbar Square, popular with students and tourists alike.", price: 6800 },
  { type: "rental", title: "Quiet room in Tokha hills", desc: "Peaceful room on the outskirts of the city with fresh air and a garden view, ideal for remote workers.", price: 8000 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  let owner = await User.findOne({ email: "owner.seed@rentora.test" });
  if (!owner) {
    const hash = await bcrypt.hash("password123", 10);
    owner = await User.create({
      name: "Seed Owner",
      email: "owner.seed@rentora.test",
      password: hash,
      role: "owner",
      phone: "9812345678",
    });
    console.log("Created seed owner:", owner.email);
  } else {
    console.log("Using existing seed owner:", owner.email);
  }

  const docs = LISTINGS.map((listing, i) => {
    const area = AREAS[i % AREAS.length];
    return {
      title: listing.title,
      description: listing.desc,
      type: listing.type,
      location: {
        type: "Point",
        coordinates: area.coords,
        address: area.name,
      },
      price: listing.price,
      amenities: ["Wifi", "Parking", "Water supply", "Electricity backup"],
      owner: owner._id,
      images: IMAGE_POOL[listing.type].map((url, imgIdx) => ({
        url,
        // publicId is required by the schema (used later to delete from Cloudinary).
        // Since these are seeded from Unsplash, not real Cloudinary uploads, we
        // synthesize a placeholder ID unique per listing+image instead.
        publicId: `seed/${listing.type}-${i}-${imgIdx}`,
      })),
    };
  });

  await Rental.deleteMany({ owner: owner._id });
  const created = await Rental.insertMany(docs);
  console.log(`Seeded ${created.length} listings.`);

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
