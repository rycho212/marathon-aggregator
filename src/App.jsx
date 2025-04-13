import React, { useState } from "react";

const marathons = [
  {
    name: "Boston Marathon",
    location: "Boston, MA",
    date: "2025-04-21",
    website: "https://www.baa.org"
  },
  {
    name: "Chicago Marathon",
    location: "Chicago, IL",
    date: "2025-10-12",
    website: "https://www.chicagomarathon.com"
  },
  {
    name: "New York City Marathon",
    location: "New York, NY",
    date: "2025-11-02",
    website: "https://www.nyrr.org"
  },
  {
    name: "Los Angeles Marathon",
    location: "Los Angeles, CA",
    date: "2025-03-09",
    website: "https://www.lamarathon.com"
  },
  {
    name: "Marine Corps Marathon",
    location: "Washington, D.C.",
    date: "2025-10-26",
    website: "https://www.marinemarathon.com"
  }
];

export default function App() {
  const [search, setSearch] = useState("");

  const filteredMarathons = marathons.filter((marathon) =>
    marathon.name.toLowerCase().includes(search.toLowerCase()) ||
    marathon.location.toLowerCase().includes(search.toLowerCase())
  );

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
