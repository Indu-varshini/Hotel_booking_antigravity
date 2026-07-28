-- ====================================================================
-- HOTEL REVENUE & BOOKING INTELLIGENCE PLATFORM - CORE SQL ANALYTICS
-- Answering Management's 10 Core Business Questions
-- ====================================================================

-- Question 1: Which rooms are booked the most?
SELECT 
    r.room_type,
    COUNT(b.id) AS total_bookings,
    SUM(CASE WHEN b.booking_status IN ('Confirmed', 'Checked-Out') THEN 1 ELSE 0 END) AS confirmed_bookings,
    ROUND(SUM(b.total_amount), 2) AS total_revenue,
    ROUND(AVG(b.stay_duration), 2) AS avg_stay_duration
FROM bookings b
JOIN rooms r ON b.room_id = r.id
GROUP BY r.room_type
ORDER BY total_bookings DESC;


-- Question 2: Which cities generate the highest revenue?
SELECT 
    h.city,
    COUNT(DISTINCT h.id) AS total_hotels,
    COUNT(b.id) AS total_bookings,
    ROUND(SUM(b.total_amount), 2) AS total_revenue,
    ROUND(AVG(b.total_amount), 2) AS avg_booking_value,
    ROUND(SUM(b.total_amount) * 100.0 / (SELECT SUM(total_amount) FROM bookings), 2) AS revenue_share_percentage
FROM bookings b
JOIN hotels h ON b.hotel_id = h.id
WHERE b.booking_status IN ('Confirmed', 'Checked-Out')
GROUP BY h.city
ORDER BY total_revenue DESC;


-- Question 3: Which months generate maximum bookings?
SELECT 
    STRFTIME('%Y-%m', b.booking_date) AS booking_month,
    COUNT(b.id) AS total_bookings,
    SUM(CASE WHEN b.booking_status IN ('Confirmed', 'Checked-Out') THEN 1 ELSE 0 END) AS successful_bookings,
    ROUND(SUM(b.total_amount), 2) AS total_revenue
FROM bookings b
GROUP BY booking_month
ORDER BY total_bookings DESC;


-- Question 4: Which room types are profitable?
SELECT 
    r.room_type,
    ROUND(AVG(b.base_price_per_night * b.surge_multiplier), 2) AS average_daily_rate_adr,
    ROUND(SUM(b.total_amount), 2) AS gross_revenue,
    ROUND(SUM(b.total_amount) / SUM(b.stay_duration), 2) AS revenue_per_occupied_night,
    COUNT(b.id) AS total_bookings
FROM bookings b
JOIN rooms r ON b.room_id = r.id
WHERE b.booking_status IN ('Confirmed', 'Checked-Out')
GROUP BY r.room_type
ORDER BY gross_revenue DESC;


-- Question 5: Why are customers cancelling bookings?
SELECT 
    c.cancellation_reason,
    COUNT(c.id) AS cancellation_count,
    ROUND(SUM(b.total_amount), 2) AS total_lost_revenue,
    ROUND(SUM(c.refund_amount), 2) AS total_refunded_amount,
    ROUND(COUNT(c.id) * 100.0 / (SELECT COUNT(*) FROM cancellations), 2) AS percentage_of_total_cancellations
FROM cancellations c
JOIN bookings b ON c.booking_id = b.id
GROUP BY c.cancellation_reason
ORDER BY cancellation_count DESC;


-- Question 6: Which customers are most valuable (RFM Analysis)?
SELECT 
    cust.id AS customer_id,
    cust.name AS customer_name,
    cust.customer_type,
    COUNT(b.id) AS frequency_bookings,
    ROUND(SUM(b.total_amount), 2) AS monetary_spending,
    MAX(b.booking_date) AS last_booking_date,
    ROUND(AVG(b.stay_duration), 2) AS avg_stay
FROM customers cust
JOIN bookings b ON cust.id = b.customer_id
WHERE b.booking_status IN ('Confirmed', 'Checked-Out')
GROUP BY cust.id, cust.name, cust.customer_type
ORDER BY monetary_spending DESC
LIMIT 20;


-- Question 7: What is our occupancy rate?
SELECT 
    h.city,
    h.name AS hotel_name,
    h.total_rooms,
    COUNT(b.id) AS total_reservations,
    SUM(b.stay_duration) AS total_occupied_nights,
    ROUND(CAST(SUM(b.stay_duration) AS REAL) / (h.total_rooms * 365) * 100, 2) AS estimated_occupancy_rate_pct
FROM hotels h
LEFT JOIN bookings b ON h.id = b.hotel_id AND b.booking_status IN ('Confirmed', 'Checked-Out')
GROUP BY h.id, h.name, h.city
ORDER BY estimated_occupancy_rate_pct DESC;


-- Question 8: Which hotels perform poorly?
SELECT 
    h.id AS hotel_id,
    h.name AS hotel_name,
    h.city,
    COUNT(b.id) AS total_bookings,
    SUM(CASE WHEN b.booking_status = 'Cancelled' THEN 1 ELSE 0 END) AS cancellations,
    ROUND(SUM(CASE WHEN b.booking_status = 'Cancelled' THEN 1 ELSE 0 END) * 100.0 / COUNT(b.id), 2) AS cancellation_rate_pct,
    ROUND(AVG(f.rating), 2) AS avg_csat_rating,
    ROUND(SUM(b.total_amount), 2) AS total_revenue
FROM hotels h
LEFT JOIN bookings b ON h.id = b.hotel_id
LEFT JOIN feedback f ON h.id = f.hotel_id
GROUP BY h.id, h.name, h.city
ORDER BY total_revenue ASC
LIMIT 5;


-- Question 9: What pricing strategy should we use (Dynamic Pricing Impact)?
SELECT 
    CASE 
        WHEN b.is_festival_season = 1 THEN 'Festival/Peak Surge'
        WHEN b.is_weekend = 1 THEN 'Weekend Surge'
        ELSE 'Regular Weekday Base'
    END AS pricing_tier,
    COUNT(b.id) AS bookings_count,
    ROUND(AVG(b.surge_multiplier), 2) AS avg_multiplier,
    ROUND(AVG(b.total_amount / b.stay_duration), 2) AS avg_nightly_price,
    ROUND(SUM(b.total_amount), 2) AS revenue_generated
FROM bookings b
WHERE b.booking_status IN ('Confirmed', 'Checked-Out')
GROUP BY pricing_tier
ORDER BY revenue_generated DESC;


-- Question 10: How can we increase profits? (Key Drivers Analysis)
SELECT 
    h.city,
    r.room_type,
    COUNT(b.id) AS demand_volume,
    ROUND(AVG(b.total_amount), 2) AS avg_deal_size,
    ROUND(SUM(b.total_amount), 2) AS total_revenue
FROM bookings b
JOIN hotels h ON b.hotel_id = h.id
JOIN rooms r ON b.room_id = r.id
WHERE b.booking_status IN ('Confirmed', 'Checked-Out')
GROUP BY h.city, r.room_type
ORDER BY total_revenue DESC
LIMIT 10;
