import sqlite3
import pandas as pd
import numpy as np
import os
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

print("Starting Python Data Cleaning & EDA Pipeline...")

db_path = os.path.join(os.path.dirname(__file__), '../backend/database/hotel_analytics.db')

if not os.path.exists(db_path):
    print(f"Error: Database file not found at {db_path}. Please run python data_science/seed_db.py first.")
    exit(1)

conn = sqlite3.connect(db_path)

# Load data into Pandas DataFrames
df_bookings = pd.read_sql_query("SELECT * FROM bookings", conn)
df_hotels = pd.read_sql_query("SELECT * FROM hotels", conn)
df_rooms = pd.read_sql_query("SELECT * FROM rooms", conn)
df_customers = pd.read_sql_query("SELECT * FROM customers", conn)
df_cancellations = pd.read_sql_query("SELECT * FROM cancellations", conn)
df_feedback = pd.read_sql_query("SELECT * FROM feedback", conn)

print("\n--- Data Cleaning & Validation ---")
print(f"Loaded {len(df_bookings)} booking records.")

# Check for missing values
missing_check = df_bookings.isnull().sum()
print("Missing values per column in bookings:")
print(missing_check[missing_check > 0])

# Feature Engineering
df_bookings['check_in_date'] = pd.to_datetime(df_bookings['check_in_date'])
df_bookings['check_out_date'] = pd.to_datetime(df_bookings['check_out_date'])
df_bookings['booking_date'] = pd.to_datetime(df_bookings['booking_date'])

# Derived Metrics
df_bookings['calculated_stay'] = (df_bookings['check_out_date'] - df_bookings['check_in_date']).dt.days
df_bookings['calculated_lead_time'] = (df_bookings['check_in_date'] - df_bookings['booking_date']).dt.days
df_bookings['effective_nightly_rate'] = df_bookings['total_amount'] / df_bookings['stay_duration']

# Executive Summary Metrics
total_revenue = df_bookings[df_bookings['booking_status'].isin(['Confirmed', 'Checked-Out'])]['total_amount'].sum()
total_bookings = len(df_bookings)
cancellation_rate = (len(df_bookings[df_bookings['booking_status'] == 'Cancelled']) / total_bookings) * 100
avg_stay = df_bookings['stay_duration'].mean()
avg_rating = df_feedback['rating'].mean()

print("\n=======================================================")
print("          EXECUTIVE DATA ANALYTICS SUMMARY             ")
print("=======================================================")
print(f"Total Revenue (Confirmed/Checked-Out) : INR {total_revenue:,.2f}")
print(f"Total Bookings Analyzed                : {total_bookings:,}")
print(f"Overall Cancellation Rate              : {cancellation_rate:.2f}%")
print(f"Average Stay Duration                  : {avg_stay:.2f} nights")
print(f"Customer CSAT Rating                   : {avg_rating:.2f} / 5.0")
print("=======================================================\n")

# Top Cities by Revenue
df_merged = df_bookings.merge(df_hotels, left_on='hotel_id', right_on='id')
city_revenue = df_merged[df_merged['booking_status'].isin(['Confirmed', 'Checked-Out'])].groupby('city')['total_amount'].sum().sort_values(ascending=False)
print("Top 5 Revenue Generating Cities:")
for city, rev in city_revenue.head(5).items():
    pct = (rev / total_revenue) * 100
    print(f" - {city:15s}: INR {rev:12,.2f} ({pct:.1f}% share)")

conn.close()
print("\nData Cleaning & EDA Completed Successfully.")
