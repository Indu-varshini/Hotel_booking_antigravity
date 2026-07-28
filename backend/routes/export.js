const express = require('express');
const router = express.Router();
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const ExcelJS = require('exceljs');

const dbPath = path.join(__dirname, '../database/hotel_analytics.db');

// GET /api/export/csv - Raw CSV Export
router.get('/csv', (req, res) => {
    try {
        const db = new DatabaseSync(dbPath);
        const rows = db.prepare(`
            SELECT 
                b.booking_reference, h.name as hotel_name, h.city, r.room_type,
                cust.name as customer_name, cust.customer_type, b.check_in_date,
                b.check_out_date, b.stay_duration, b.total_amount, b.booking_status
            FROM bookings b
            JOIN hotels h ON b.hotel_id = h.id
            JOIN rooms r ON b.room_id = r.id
            JOIN customers cust ON b.customer_id = cust.id
            LIMIT 2000
        `).all();

        const headers = ['Booking Reference', 'Hotel Name', 'City', 'Room Type', 'Customer Name', 'Customer Type', 'Check-In', 'Check-Out', 'Stay Duration', 'Total Amount (INR)', 'Booking Status'];
        const csvLines = [headers.join(',')];

        rows.forEach(r => {
            csvLines.push([
                r.booking_reference,
                `"${r.hotel_name}"`,
                r.city,
                r.room_type,
                `"${r.customer_name}"`,
                r.customer_type,
                r.check_in_date,
                r.check_out_date,
                r.stay_duration,
                r.total_amount,
                r.booking_status
            ].join(','));
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=Hotel_Revenue_Analytics_Report.csv');
        res.send(csvLines.join('\n'));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/export/excel - Excel (.xlsx) Report Export
router.get('/excel', async (req, res) => {
    try {
        const db = new DatabaseSync(dbPath);
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'AI Hotel Analytics Platform';

        // Sheet 1: Executive Summary
        const sheet1 = workbook.addWorksheet('Executive Summary');
        sheet1.columns = [
            { header: 'Metric Name', key: 'metric', width: 35 },
            { header: 'Value', key: 'val', width: 25 }
        ];

        const summaryRow = db.prepare(`
            SELECT 
                COUNT(*) as total_b,
                SUM(CASE WHEN booking_status IN ('Confirmed', 'Checked-Out') THEN total_amount ELSE 0 END) as total_rev,
                AVG(stay_duration) as avg_stay
            FROM bookings
        `).get();

        sheet1.addRows([
            { metric: 'Total Bookings Analyzed', val: summaryRow.total_b },
            { metric: 'Total Confirmed Revenue (INR)', val: `INR ${Math.round(summaryRow.total_rev).toLocaleString()}` },
            { metric: 'Average Stay Duration (Nights)', val: summaryRow.avg_stay.toFixed(2) },
            { metric: 'Report Generation Timestamp', val: new Date().toISOString() }
        ]);

        // Sheet 2: City Revenue Performance
        const sheet2 = workbook.addWorksheet('City Revenue');
        sheet2.columns = [
            { header: 'City Name', key: 'city', width: 20 },
            { header: 'Total Bookings', key: 'bookings', width: 15 },
            { header: 'Revenue (INR)', key: 'revenue', width: 25 }
        ];

        const cityRows = db.prepare(`
            SELECT h.city, COUNT(b.id) as bookings, SUM(b.total_amount) as revenue
            FROM bookings b JOIN hotels h ON b.hotel_id = h.id
            WHERE b.booking_status IN ('Confirmed', 'Checked-Out')
            GROUP BY h.city ORDER BY revenue DESC
        `).all();

        sheet2.addRows(cityRows.map(r => ({ city: r.city, bookings: r.bookings, revenue: r.revenue })));

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Hotel_Business_Intelligence_Report.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
