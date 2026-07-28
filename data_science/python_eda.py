import sqlite3
import pandas as pd
import numpy as np
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("Executing Detailed Exploratory Data Analysis (EDA)...")

db_path = os.path.join(os.path.dirname(__file__), '../backend/database/hotel_analytics.db')
conn = sqlite3.connect(db_path)

df_b = pd.read_sql_query("SELECT * FROM bookings", conn)
df_h = pd.read_sql_query("SELECT * FROM hotels", conn)
df_r = pd.read_sql_query("SELECT * FROM rooms", conn)
df_c = pd.read_sql_query("SELECT * FROM customers", conn)

df = df_b.merge(df_h, left_on='hotel_id', right_on='id', suffixes=('_booking', '_hotel'))
df = df.merge(df_r, left_on='room_id', right_on='id', suffixes=('_hotel', '_room'))
df = df.merge(df_c, left_on='customer_id', right_on='id', suffixes=('_room', '_customer'))

print("\n--- 1. Room Type Performance ---")
room_col = [c for c in df.columns if 'room_type' in c][0]
room_perf = df[df['booking_status'].isin(['Confirmed', 'Checked-Out'])].groupby(room_col).agg(
    Bookings=('id_booking', 'count'),
    Total_Revenue=('total_amount', 'sum'),
    Avg_Stay=('stay_duration', 'mean')
).reset_index()

print(room_perf.to_string(index=False))

print("\n--- 2. Booking Channel Distribution ---")
channel_perf = df.groupby('booking_channel').agg(
    Bookings=('id_booking', 'count'),
    Total_Revenue=('total_amount', 'sum')
).reset_index()

print(channel_perf.to_string(index=False))

print("\n--- 3. Cancellation Reasons Analysis ---")
df_canc = pd.read_sql_query("SELECT * FROM cancellations", conn)
canc_reasons = df_canc.groupby('cancellation_reason').size().reset_index(name='Count')
canc_reasons['Share_%'] = (canc_reasons['Count'] / canc_reasons['Count'].sum()) * 100
print(canc_reasons.sort_values(by='Count', ascending=False).to_string(index=False))

conn.close()
print("\nEDA Completed Successfully.")
