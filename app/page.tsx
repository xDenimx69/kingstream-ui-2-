"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function KingstreamDashboard() {
  const [message, setMessage] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [rdToken, setRdToken] = useState("");

  useEffect(() => {
    fetch("/api")
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  const searchTMDB = async () => {
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=YOUR_TMDB_API_KEY&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.results || []);
  };

  const sendToRealDebrid = async (query) => {
    if (!rdToken) return alert("Paste your Real-Debrid token first.");
    const magnetQuery = encodeURIComponent(`${query} 1080p`);
    const searchRes = await fetch(`https://api.real-debrid.com/rest/1.0/torrents/search/${magnetQuery}`, {
      headers: { Authorization: `Bearer ${rdToken}` },
    });
    const data = await searchRes.json();
    if (data.length === 0) return alert("No torrents found.");
    const addRes = await fetch(`https://api.real-debrid.com/rest/1.0/torrents/addMagnet`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${rdToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `magnet=${data[0].magnet}`
    });
    const added = await addRes.json();
    alert(`Magnet added to Real-Debrid: ${added.id}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🎬 Kingstream Dashboard</h1>
      {message && <p className="mb-4 text-green-400">{message}</p>}

      <div className="mb-4">
        <Input 
          value={rdToken} 
          onChange={e => setRdToken(e.target.value)} 
          placeholder="Paste your Real-Debrid token..."
        />
      </div>

      <div className="flex gap-2 mb-4">
        <Input 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          placeholder="Search for a movie or show..."
          className="w-full"
        />
        <Button onClick={searchTMDB}>Search</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {results.map(item => (
          <Card key={item.id} className="bg-gray-800 border border-gray-700">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">{item.title || item.name}</h2>
              <p className="text-sm text-gray-400 mb-2">{item.media_type}</p>
              <Button onClick={() => sendToRealDebrid(item.title || item.name)}>
                Send to Real-Debrid
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
