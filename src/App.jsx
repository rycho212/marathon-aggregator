import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useEffect, useState } from "react";

export default function App() {
  const [marathons, setMarathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://runsignup.com/rest/races?event_type=R&format=json&limit=20")
      .then(res => res.json())
      .then(data => {
        const simplified = data.races.map((race) => ({
          name: race.name,
          location: `${race.city}, ${race.state}`,
          date: race.event_date || "TBD",
          website: race.registration_url
        }));
        setMarathons(simplified);
        setLoading(false);
      });
  }, []);
  
  // Render your filteredMarathons using this.marathons
}

export default function App() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const filteredMarathons = marathons.filter((marathon) => {
    const nameMatch =
      marathon.name.toLowerCase().includes(search.toLowerCase()) ||
      marathon.location.toLowerCase().includes(search.toLowerCase());

    const marathonDate = new Date(marathon.date);
    const withinStart = !startDate || marathonDate >= startDate;
    const withinEnd = !endDate || marathonDate <= endDate;

    return nameMatch && withinStart && withinEnd;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">US Marathon Finder</h1>
      <div className="max-w-md mx-auto mb-6">
        <input
          className="w-full px-4 py-2 border rounded-md shadow-sm"
          placeholder="Search by city or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-4 mb-6 justify-center">
        <div>
          <label className="block text-sm text-gray-700">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="border px-3 py-1 rounded"
            placeholderText="Select start date"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="border px-3 py-1 rounded"
            placeholderText="Select end date"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMarathons.map((marathon, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2">{marathon.name}</h2>
            <p className="text-gray-600 mb-1">📍 {marathon.location}</p>
            <p className="text-gray-600 mb-2">📅 {new Date(marathon.date).toDateString()}</p>
            <a
              href={marathon.website}
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Website
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
