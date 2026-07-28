const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const recommendations = [
        {
            id: 1,
            title: 'Lower Cancellations with Easy Deposit Policies',
            category: 'Cancellation Safety',
            priority: 'Critical',
            impact: 'Save Lost Revenue',
            description: '35% of guests cancel because of strict non-refundable fees. Allow small advance payments and free cancellations up to 48 hours before check-in.',
            action: 'Update hotel website and booking partner cancellation policies.'
        },
        {
            id: 2,
            title: 'Increase Deluxe & Suite Room Availability',
            category: 'Room Inventory',
            priority: 'High',
            impact: '+18% Revenue Boost',
            description: 'Suite and Deluxe rooms make over 3 times more profit per room than standard rooms. Offer more Deluxe rooms during busy holiday months in Goa and Jaipur.',
            action: 'Convert 10% under-used standard rooms into Executive Deluxe suites.'
        },
        {
            id: 3,
            title: 'Use Smart Weekend & Holiday Pricing Rules',
            category: 'Pricing Strategy',
            priority: 'High',
            impact: '+22% Weekend Earnings',
            description: 'Raise room prices by 20-30% on busy Friday and Saturday nights and long holiday weekends when guest demand is highest.',
            action: 'Set automatic weekend surge pricing multipliers for top city hotels.'
        },
        {
            id: 4,
            title: 'Create Special Business Traveler Packages',
            category: 'Business Guests',
            priority: 'High',
            impact: '+25% Repeat Bookings',
            description: 'Business travelers make up 38% of all bookings and rarely cancel. Provide them with free high-speed Wi-Fi, breakfast, and airport pickups.',
            action: 'Partner with local IT companies in Hyderabad and Pune for regular bookings.'
        },
        {
            id: 5,
            title: 'Offer Special Discounts During Off-Season',
            category: 'Pricing Strategy',
            priority: 'Medium',
            impact: '+12% Occupancy Rate',
            description: 'Lower room prices by 15-20% during rainy monsoon months (July-September) to attract guests to business cities like Hyderabad and Bengaluru.',
            action: 'Set up automatic off-season discount rules for rainy months.'
        },
        {
            id: 6,
            title: 'Direct Website Booking Rewards & Discounts',
            category: 'Direct Bookings',
            priority: 'Medium',
            impact: 'Save 15% Travel Site Fee',
            description: 'Offer free breakfast or early check-in for guests booking on the official hotel website to avoid high third-party travel agent commissions.',
            action: 'Add "Best Rate Guarantee" badges and free perks for direct website bookers.'
        },
        {
            id: 7,
            title: 'Upgrade In-Room Wi-Fi & Smart Facilities',
            category: 'Guest Experience',
            priority: 'Medium',
            impact: '+0.4 Rating Increase',
            description: 'Some guest feedback mentions slow Wi-Fi in older hotel locations. Installing fast fiber Wi-Fi directly improves guest satisfaction scores.',
            action: 'Upgrade Wi-Fi internet routers across older hotel properties.'
        },
        {
            id: 8,
            title: 'Customer Loyalty & Repeat Booking Rewards',
            category: 'Guest Retention',
            priority: 'Medium',
            impact: '+18% Repeat Visits',
            description: 'Send direct discount codes and thank-you rewards to guests after their first stay to encourage them to return.',
            action: 'Automate post-checkout thank-you emails with a 10% returning guest discount.'
        }
    ];

    res.json({ recommendations });
});

module.exports = router;
