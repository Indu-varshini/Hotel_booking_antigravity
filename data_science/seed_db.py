import sqlite3
import os
import random
from datetime import datetime, timedelta

print("Initializing SQLite Database Seed (Purged of OYO references)...")

db_dir = os.path.join(os.path.dirname(__file__), '../backend/database')
os.makedirs(db_dir, exist_ok=True)

db_path = os.path.join(db_dir, 'hotel_analytics.db')
schema_path = os.path.join(db_dir, 'schema.sql')

if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

with open(schema_path, 'r', encoding='utf-8') as f:
    schema_sql = f.read()

cursor.executescript(schema_sql)
print("Schema executed successfully.")

# 1. Seed Hotels (Professional Hotel Chain Names)
CITIES = ['Hyderabad', 'Mumbai', 'Bengaluru', 'Delhi NCR', 'Goa', 'Jaipur', 'Chennai', 'Kolkata', 'Pune', 'Kochi']
HOTEL_TEMPLATES = [
    ('Grand Horizon Plaza', 1.2, 60),
    ('Marriott Executive Suites', 1.8, 80),
    ('Taj Heritage Resort', 2.2, 100),
    ('Treebo Premier Residency', 1.0, 50),
    ('Hyatt Regency Business Bay', 1.7, 90)
]

hotels_list = []
for idx, city in enumerate(CITIES):
    template = HOTEL_TEMPLATES[idx % len(HOTEL_TEMPLATES)]
    name1 = f"{template[0]} {city}"
    name2 = f"Crown Park Resort {city} Central"
    
    cursor.execute("INSERT INTO hotels (name, city, address, total_rooms, room_types) VALUES (?, ?, ?, ?, ?)",
                   (name1, city, f"{100 + idx*10} Main Avenue, {city}", 60, "Standard, Deluxe, Executive, Suite"))
    h1_id = cursor.lastrowid
    
    cursor.execute("INSERT INTO hotels (name, city, address, total_rooms, room_types) VALUES (?, ?, ?, ?, ?)",
                   (name2, city, f"{200 + idx*10} Station Road, {city}", 40, "Standard, Deluxe"))
    h2_id = cursor.lastrowid
    
    hotels_list.append({'id': h1_id, 'name': name1, 'city': city, 'rooms': 60})
    hotels_list.append({'id': h2_id, 'name': name2, 'city': city, 'rooms': 40})

print(f"Seeded {len(hotels_list)} Hotels across {len(CITIES)} cities.")

# 2. Seed Rooms
ROOM_TYPES = [
    ('Standard', 3400, 0.40),
    ('Deluxe', 6200, 0.35),
    ('Executive', 10200, 0.15),
    ('Suite', 17500, 0.10)
]

rooms_list = []
for hotel in hotels_list:
    room_no = 101
    for r_type, base_price, ratio in ROOM_TYPES:
        count = int(hotel['rooms'] * ratio)
        for _ in range(count):
            price = int(base_price * (1.4 if any(k in hotel['name'] for k in ['Taj', 'Marriott', 'Hyatt']) else 1.0))
            cursor.execute("INSERT INTO rooms (hotel_id, room_number, room_type, base_price, is_available) VALUES (?, ?, ?, ?, 1)",
                           (hotel['id'], f"R-{room_no}", r_type, price))
            room_id = cursor.lastrowid
            rooms_list.append({'id': room_id, 'hotel_id': hotel['id'], 'room_type': r_type, 'price': price, 'city': hotel['city']})
            room_no += 1

print(f"Seeded {len(rooms_list)} Rooms.")

# 3. Seed Customers
FIRST_NAMES = ['Rahul', 'Priya', 'Amit', 'Neha', 'Rohan', 'Ananya', 'Vikram', 'Sneha', 'Sanjay', 'Pooja', 'Karan', 'Kavita', 'Arjun', 'Divya', 'Rajesh', 'Meera', 'Aditya', 'Ritu', 'Deepak', 'Swati']
LAST_NAMES = ['Sharma', 'Verma', 'Patel', 'Reddy', 'Rao', 'Singh', 'Gupta', 'Kumar', 'Nair', 'Deshmukh', 'Joshi', 'Chopra', 'Mehta', 'Chatterjee', 'Iyer']
CUSTOMER_TYPES = ['Corporate', 'Leisure', 'Solo', 'Family']

customers_list = []
for i in range(1500):
    fn = FIRST_NAMES[i % len(FIRST_NAMES)]
    ln = LAST_NAMES[(i * 3) % len(LAST_NAMES)]
    name = f"{fn} {ln}"
    age = random.randint(20, 62)
    gender = 'Non-binary' if i % 10 == 0 else ('Male' if i % 2 == 0 else 'Female')
    email = f"{fn.lower()}{i}@gmail.com"
    phone = f"+91 {9800000000 + i}"
    c_type = CUSTOMER_TYPES[i % len(CUSTOMER_TYPES)]
    
    cursor.execute("INSERT INTO customers (name, age, gender, email, phone, customer_type) VALUES (?, ?, ?, ?, ?, ?)",
                   (name, age, gender, email, phone, c_type))
    c_id = cursor.lastrowid
    customers_list.append({'id': c_id, 'name': name, 'age': age, 'gender': gender, 'c_type': c_type})

print(f"Seeded {len(customers_list)} Customers.")

# 4. Seed Bookings (10,800 records)
CHANNELS = ['Direct Website', 'OTA (Booking.com/Agoda)', 'Corporate Portal', 'Mobile App']
CANCELLATION_REASONS = ['Price too high', 'Change of Travel Plans', 'Found Better Deal', 'Service Concerns', 'Location Concern']

start_date = datetime(2024, 1, 1)

for b in range(1, 10801):
    random_days = random.randint(0, 900)
    check_in = start_date + timedelta(days=random_days)
    stay_duration = random.randint(1, 4)
    check_out = check_in + timedelta(days=stay_duration)
    lead_time = random.randint(1, 30)
    booking_date = check_in - timedelta(days=lead_time)
    
    month = check_in.month
    day_of_week = check_in.weekday() # 5 is Sat, 6 is Sun
    is_weekend = 1 if day_of_week in [5, 6] else 0
    
    room = rooms_list[b % len(rooms_list)]
    hotel = next(h for h in hotels_list if h['id'] == room['hotel_id'])
    customer = customers_list[b % len(customers_list)]
    
    surge = 1.0
    is_festival = 0
    
    if hotel['city'] == 'Goa' and month in [12, 1]:
        surge = 1.6
        is_festival = 1
    elif hotel['city'] == 'Jaipur' and (month >= 10 or month <= 2):
        surge = 1.35
        is_festival = 1
    elif month in [5, 6]:
        surge = 1.25
        is_festival = 1
    elif is_weekend:
        surge = 1.2
        
    if hotel['city'] == 'Hyderabad':
        surge *= 1.3
        
    price_per_night = round(room['price'] * surge)
    total_amount = price_per_night * stay_duration
    
    rand_status = random.random()
    if rand_status < 0.18:
        status = 'Cancelled'
    elif rand_status < 0.35:
        status = 'Confirmed'
    elif rand_status < 0.40:
        status = 'Pending'
    else:
        status = 'Checked-Out'
        
    channel = CHANNELS[b % len(CHANNELS)]
    guests = random.randint(1, 3)
    ref = f"BK-2024-{b:06d}"
    
    cursor.execute("""
        INSERT INTO bookings (
            booking_reference, hotel_id, room_id, customer_id, 
            check_in_date, check_out_date, stay_duration, guests_count, 
            base_price_per_night, surge_multiplier, total_amount, 
            booking_status, booking_channel, lead_time_days, booking_date, 
            is_weekend, is_festival_season
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        ref, hotel['id'], room['id'], customer['id'],
        check_in.strftime('%Y-%m-%d'), check_out.strftime('%Y-%m-%d'),
        stay_duration, guests, room['price'], round(surge, 2), total_amount,
        status, channel, lead_time, booking_date.strftime('%Y-%m-%d'),
        is_weekend, is_festival
    ))
    booking_id = cursor.lastrowid
    
    if status == 'Cancelled':
        reason = CANCELLATION_REASONS[b % len(CANCELLATION_REASONS)]
        refund = round(total_amount * (0.9 if reason == 'Service Concerns' else 0.7))
        cursor.execute("INSERT INTO cancellations (booking_id, refund_amount, cancellation_reason, cancelled_at) VALUES (?, ?, ?, ?)",
                       (booking_id, refund, reason, booking_date.strftime('%Y-%m-%d')))
                       
    if status == 'Checked-Out' and b % 2 == 0:
        rating = round(random.uniform(3.2, 5.0), 1)
        sentiment = 'Positive' if rating >= 4.0 else ('Neutral' if rating >= 3.0 else 'Negative')
        reviews = {
            'Positive': ['Exceptional hospitality and pristine room quality.', 'Fast Wi-Fi and fantastic breakfast spread.', 'Top-tier amenities and smooth check-in.'],
            'Neutral': ['Satisfactory stay for a business trip.', 'Decent location, room was clean.', 'Standard experience, responsive front desk.'],
            'Negative': ['Wi-Fi connection was unstable in the room.', 'AC unit was noisy, expected quieter stay.', 'Check-in took longer than anticipated.']
        }
        review_txt = reviews[sentiment][b % len(reviews[sentiment])]
        cursor.execute("INSERT INTO feedback (booking_id, hotel_id, customer_id, rating, review, sentiment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                       (booking_id, hotel['id'], customer['id'], rating, review_txt, sentiment, check_out.strftime('%Y-%m-%d')))

conn.commit()
conn.close()

print("Database Seeding Completed Successfully! 10,800 records created with clean branding.")
