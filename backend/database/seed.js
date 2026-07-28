const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'hotel_analytics.db');
const schemaPath = path.join(__dirname, 'schema.sql');

console.log('Initializing Database Seed...');

if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);
const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
db.exec(schemaSql);

// 1. Seed Hotels Data
const CITIES = [
    'Hyderabad', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Goa', 
    'Jaipur', 'Chennai', 'Kolkata', 'Pune', 'Kochi'
];

const HOTEL_TEMPLATES = [
    { name: 'OYO Townhouse Central', multiplier: 0.9, rooms: 50 },
    { name: 'Marriott Executive Suites', multiplier: 1.8, rooms: 80 },
    { name: 'Taj Heritage Resort', multiplier: 2.2, rooms: 100 },
    { name: 'Treebo Trend Residency', multiplier: 0.85, rooms: 40 },
    { name: 'Grand Hyatt Plaza', multiplier: 1.6, rooms: 90 }
];

const insertHotel = db.prepare(`
    INSERT INTO hotels (name, city, address, total_rooms, room_types) 
    VALUES (?, ?, ?, ?, ?)
`);

const hotelsList = [];

CITIES.forEach((city, cityIdx) => {
    // 2 hotels per city
    const h1Name = `${HOTEL_TEMPLATES[cityIdx % HOTEL_TEMPLATES.length].name} ${city}`;
    const h2Name = `OYO Flagship ${city} Prime`;
    
    const h1Id = insertHotel.run(h1Name, city, `${100 + cityIdx * 10} Main Avenue, ${city}`, 60, 'Standard, Deluxe, Executive, Suite').lastInsertRowid;
    const h2Id = insertHotel.run(h2Name, city, `${200 + cityIdx * 10} Station Road, ${city}`, 40, 'Standard, Deluxe').lastInsertRowid;

    hotelsList.push(
        { id: h1Id, name: h1Name, city, rooms: 60 },
        { id: h2Id, name: h2Name, city, rooms: 40 }
    );
});

console.log(`Seeded ${hotelsList.length} Hotels across ${CITIES.length} cities.`);

// 2. Seed Rooms
const ROOM_TYPES = [
    { type: 'Standard', basePrice: 3200, countRatio: 0.4 },
    { type: 'Deluxe', basePrice: 5800, countRatio: 0.35 },
    { type: 'Executive', basePrice: 9500, countRatio: 0.15 },
    { type: 'Suite', basePrice: 16500, countRatio: 0.10 }
];

const insertRoom = db.prepare(`
    INSERT INTO rooms (hotel_id, room_number, room_type, base_price, is_available)
    VALUES (?, ?, ?, ?, 1)
`);

const roomsList = [];

hotelsList.forEach(hotel => {
    let roomNo = 101;
    ROOM_TYPES.forEach(rt => {
        const count = Math.floor(hotel.rooms * rt.countRatio);
        for (let i = 0; i < count; i++) {
            const price = Math.round(rt.basePrice * (hotel.name.includes('Taj') || hotel.name.includes('Marriott') || hotel.name.includes('Hyatt') ? 1.4 : 0.95));
            const roomId = insertRoom.run(hotel.id, `R-${roomNo++}`, rt.type, price).lastInsertRowid;
            roomsList.push({ id: roomId, hotel_id: hotel.id, room_type: rt.type, price, city: hotel.city });
        }
    });
});

console.log(`Seeded ${roomsList.length} Rooms.`);

// 3. Seed Customers (1,500 unique customers)
const FIRST_NAMES = ['Rahul', 'Priya', 'Amit', 'Neha', 'Rohan', 'Ananya', 'Vikram', 'Sneha', 'Sanjay', 'Pooja', 'Karan', 'Kavita', 'Arjun', 'Divya', 'Rajesh', 'Meera', 'Aditya', 'Ritu', 'Deepak', 'Swati'];
const LAST_NAMES = ['Sharma', 'Verma', 'Patel', 'Reddy', 'Rao', 'Singh', 'Gupta', 'Kumar', 'Nair', 'Deshmukh', 'Joshi', 'Chopra', 'Mehta', 'Chatterjee', 'Iyer'];
const CUSTOMER_TYPES = ['Corporate', 'Leisure', 'Solo', 'Family'];
const GENDERS = ['Male', 'Female', 'Non-binary'];

const insertCustomer = db.prepare(`
    INSERT INTO customers (name, age, gender, email, phone, customer_type)
    VALUES (?, ?, ?, ?, ?, ?)
`);

const customersList = [];

for (let i = 0; i < 1500; i++) {
    const fn = FIRST_NAMES[i % FIRST_NAMES.length];
    const ln = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const name = `${fn} ${ln}`;
    const age = Math.floor(Math.random() * 42) + 20; // 20 to 62
    const gender = i % 10 === 0 ? 'Non-binary' : (i % 2 === 0 ? 'Male' : 'Female');
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@gmail.com`;
    const phone = `+91 ${9800000000 + i}`;
    const cType = CUSTOMER_TYPES[i % CUSTOMER_TYPES.length];

    const customerId = insertCustomer.run(name, age, gender, email, phone, cType).lastInsertRowid;
    customersList.push({ id: customerId, name, age, gender, cType });
}

console.log(`Seeded ${customersList.length} Customers.`);

// 4. Seed Bookings (10,500 bookings spanning Jan 2024 to June 2026)
const CHANNELS = ['Direct Website', 'OTA (Booking.com/Agoda)', 'Corporate Portal', 'Mobile App'];
const STATUSES = ['Confirmed', 'Checked-Out', 'Cancelled', 'Pending'];
const CANCELLATION_REASONS = [
    'Price too high', 'Change of Travel Plans', 'Found Better Deal', 'Service Concerns', 'Location Concern'
];

const insertBooking = db.prepare(`
    INSERT INTO bookings (
        booking_reference, hotel_id, room_id, customer_id, 
        check_in_date, check_out_date, stay_duration, guests_count, 
        base_price_per_night, surge_multiplier, total_amount, 
        booking_status, booking_channel, lead_time_days, booking_date, 
        is_weekend, is_festival_season
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertCancellation = db.prepare(`
    INSERT INTO cancellations (booking_id, refund_amount, cancellation_reason, cancelled_at)
    VALUES (?, ?, ?, ?)
`);

const insertFeedback = db.prepare(`
    INSERT INTO feedback (booking_id, hotel_id, customer_id, rating, review, sentiment, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const startDate = new Date('2024-01-01');
const endDate = new Date('2026-06-30');
const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

const transaction = db.transaction(() => {
    for (let b = 1; b <= 10800; b++) {
        const randomDays = Math.floor(Math.random() * totalDays);
        const checkIn = new Date(startDate.getTime() + randomDays * 24 * 60 * 60 * 1000);
        
        const stayDuration = Math.floor(Math.random() * 4) + 1; // 1-4 nights
        const checkOut = new Date(checkIn.getTime() + stayDuration * 24 * 60 * 60 * 1000);
        
        const leadTime = Math.floor(Math.random() * 30) + 1;
        const bookingDateObj = new Date(checkIn.getTime() - leadTime * 24 * 60 * 60 * 1000);
        const bookingDateStr = bookingDateObj.toISOString().split('T')[0];
        
        const month = checkIn.getMonth() + 1; // 1-12
        const dayOfWeek = checkIn.getDay(); // 0 is Sun, 6 is Sat
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6) ? 1 : 0;
        
        // Seasonal surge logic (Goa in Dec/Jan, Jaipur in Oct-Feb, Summer in May/Jun)
        const room = roomsList[b % roomsList.length];
        const hotel = hotelsList.find(h => h.id === room.hotel_id);
        const customer = customersList[b % customersList.length];

        let surge = 1.0;
        let isFestival = 0;

        if (hotel.city === 'Goa' && (month === 12 || month === 1)) {
            surge = 1.6;
            isFestival = 1;
        } else if (hotel.city === 'Jaipur' && (month >= 10 || month <= 2)) {
            surge = 1.35;
            isFestival = 1;
        } else if (month === 5 || month === 6) {
            surge = 1.25;
            isFestival = 1;
        } else if (isWeekend) {
            surge = 1.2;
        }

        // Special revenue boost for Hyderabad as highlighted in business questions (Hyderabad 42% revenue share driver)
        if (hotel.city === 'Hyderabad') {
            surge *= 1.3;
        }

        const pricePerNight = Math.round(room.price * surge);
        const totalAmount = pricePerNight * stayDuration;

        // Status distribution: ~58% Checked-out / Confirmed, ~18% Cancelled, ~24% Confirmed/Pending
        let status = 'Checked-Out';
        const randStatus = Math.random();
        if (randStatus < 0.18) {
            status = 'Cancelled';
        } else if (randStatus < 0.35) {
            status = 'Confirmed';
        } else if (randStatus < 0.40) {
            status = 'Pending';
        }

        const channel = CHANNELS[b % CHANNELS.length];
        const guests = Math.floor(Math.random() * 3) + 1;
        const ref = `BK-2024-${String(b).padStart(6, '0')}`;

        const bookingId = insertBooking.run(
            ref, hotel.id, room.id, customer.id,
            checkIn.toISOString().split('T')[0],
            checkOut.toISOString().split('T')[0],
            stayDuration, guests,
            room.price, surge, totalAmount,
            status, channel, leadTime, bookingDateStr,
            isWeekend, isFestival
        ).lastInsertRowid;

        // If cancelled, insert into cancellations table
        if (status === 'Cancelled') {
            const reason = CANCELLATION_REASONS[b % CANCELLATION_REASONS.length];
            const refund = Math.round(totalAmount * (reason === 'Service Concerns' ? 0.9 : 0.7));
            insertCancellation.run(bookingId, refund, reason, bookingDateStr);
        }

        // If checked-out, insert customer feedback
        if (status === 'Checked-Out' && b % 2 === 0) {
            let rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0
            if (hotel.city === 'Goa' && status === 'Cancelled') rating = 2.1;
            let sentiment = rating >= 4.0 ? 'Positive' : (rating >= 3.0 ? 'Neutral' : 'Negative');
            
            const reviews = {
                Positive: ['Excellent stay and polite staff!', 'Loved the clean rooms and fast Wi-Fi.', 'Great location and luxurious ambiance.'],
                Neutral: ['Decent stay for the price.', 'Average breakfast options, clean rooms.', 'Standard experience, nothing special.'],
                Negative: ['Wi-Fi was slow and service delayed.', 'Room AC was noisy, expected better.', 'Price was high for the service provided.']
            };

            const reviewText = reviews[sentiment][b % reviews[sentiment].length];
            insertFeedback.run(bookingId, hotel.id, customer.id, rating, reviewText, sentiment, checkOut.toISOString().split('T')[0]);
        }
    }
});

transaction();
console.log('Seeded 10,800 Bookings, Cancellations, and Feedback records successfully!');

db.close();
console.log('Database Seeding Complete.');
