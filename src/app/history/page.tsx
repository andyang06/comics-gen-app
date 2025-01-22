'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface HistoryItem {
  prompt: string;
  image_url: string;
  created_at?: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('https://sundai-backend-1095860743608.us-east4.run.app/generations');
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Generation History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm">
            <div className="relative aspect-square mb-4">
              <Image
                src={item.image_url}
                alt={item.prompt}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <p className="text-sm text-gray-700">{item.prompt}</p>
            {item.created_at && (
              <p className="text-xs text-gray-500 mt-2">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
      {history.length === 0 && (
        <div className="text-center text-gray-500">
          No generation history found
        </div>
      )}
    </div>
  );
}
