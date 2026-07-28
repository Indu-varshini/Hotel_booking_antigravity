-- Hotel Revenue & Booking Intelligence Platform Database Schema (SQLite / MySQL Compatible)

DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS cancellations;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS hotels;

-- 1. Hotels Master Table
CREATE TABLE hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    total_rooms INTEGER NOT NULL,
    room_types TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customers Table
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    customer_type TEXT NOT NULL DEFAULT 'Leisure', -- Leisure, Corporate, Solo, Family
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 3. Rooms Table
CREATE TABLE rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hotel_id INTEGER NOT NULL,
    room_number TEXT NOT NULL,
    room_type TEXT NOT NULL, -- Suite, Deluxe, Standard, Executive
    base_price REAL NOT NULL,
    is_available INTEGER DEFAULT 1,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

-- 4. Bookings Fact Table
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_reference TEXT UNIQUE NOT NULL,
    hotel_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    check_in_date TEXT NOT NULL,
    check_out_date TEXT NOT NULL,
    stay_duration INTEGER NOT NULL,
    guests_count INTEGER NOT NULL,
    base_price_per_night REAL NOT NULL,
    surge_multiplier REAL DEFAULT 1.0,
    total_amount REAL NOT NULL,
    booking_status TEXT NOT NULL, -- Confirmed, Pending, Cancelled, Checked-Out
    booking_channel TEXT NOT NULL, -- Direct Website, OTA (Booking.com/Agoda), Corporate, Mobile App
    lead_time_days INTEGER NOT NULL,
    booking_date TEXT NOT NULL,
    is_weekend INTEGER DEFAULT 0,
    is_festival_season INTEGER DEFAULT 0,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 5. Cancellations Analytics Table
CREATE TABLE cancellations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    refund_amount REAL NOT NULL,
    cancellation_reason TEXT NOT NULL, -- High Price, Service Issues, Location Concern, Change of Travel Plans, Better Deal Found
    cancelled_at TEXT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- 6. Customer Feedback & CSAT Table
CREATE TABLE feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    hotel_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    rating REAL NOT NULL, -- 1.0 to 5.0
    review TEXT,
    sentiment TEXT NOT NULL, -- Positive, Neutral, Negative
    created_at TEXT NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Optimization Indexes
CREATE INDEX idx_bookings_hotel ON bookings(hotel_id);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_hotels_city ON hotels(city);
