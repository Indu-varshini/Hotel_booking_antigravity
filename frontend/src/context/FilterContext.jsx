import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const FilterContext = createContext();

const API_BASE = 'http://localhost:5000/api';

export const FilterProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'dark');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.body.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.body.classList.remove('light');
    }
  }, [theme]);
  
  const [filters, setFilters] = useState({
    city: 'all',
    hotel: 'all',
    room_type: 'all',
    month: 'all',
    year: 'all',
    season: 'all',
    customer_type: 'all',
    booking_status: 'all'
  });

  const [filterOptions, setFilterOptions] = useState({
    cities: [],
    hotels: [],
    roomTypes: [],
    customerTypes: [],
    bookingStatuses: [],
    years: [],
    months: [],
    seasons: []
  });

  const [loadingFilters, setLoadingFilters] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get(`${API_BASE}/analytics/filters-data`);
        setFilterOptions(res.data);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      } finally {
        setLoadingFilters(false);
      }
    };
    fetchOptions();
  }, []);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      city: 'all',
      hotel: 'all',
      room_type: 'all',
      month: 'all',
      year: 'all',
      season: 'all',
      customer_type: 'all',
      booking_status: 'all'
    });
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <FilterContext.Provider value={{ 
      filters, updateFilter, resetFilters, filterOptions, loadingFilters, 
      theme, toggleTheme, searchQuery, setSearchQuery 
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => useContext(FilterContext);
