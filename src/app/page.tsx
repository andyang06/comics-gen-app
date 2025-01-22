"use client";

import { useState } from 'react';

// const heroes = [
//   { id: 1, src: "https://api.dicebear.com/7.x/personas/svg?seed=hero1", alt: "Speedster hero" },
//   { id: 2, src: "https://api.dicebear.com/7.x/personas/svg?seed=hero2", alt: "Warrior hero" },
//   { id: 3, src: "https://api.dicebear.com/7.x/personas/svg?seed=hero3", alt: "Dark hero" },
//   { id: 4, src: "https://api.dicebear.com/7.x/personas/svg?seed=hero4", alt: "Detective hero" },
//   { id: 5, src: "https://api.dicebear.com/7.x/personas/svg?seed=hero5", alt: "Cosmic hero" },
//   { id: 6, src: "https://api.dicebear.com/7.x/personas/svg?seed=hero6", alt: "Young hero" },
//   { id: 7, src: "https://api.dicebear.com/7.x/personas/svg?seed=hero7", alt: "Modern hero" },
//   { id: 8, src: "https://api.dicebear.com/7.x/personas/svg?seed=hero8", alt: "Powerful hero" },
// ];

interface ComicPanel {
  prompt: string;
  caption: string;
}

interface StoryResponse {
  comics: ComicPanel[];
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<ComicPanel[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First, generate the story
      const storyResponse = await fetch('/api/generate_plot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      console.log(storyResponse);
      const storyData: StoryResponse = await storyResponse.json();

      if (!storyResponse.ok) {
        throw new Error('Failed to generate story');
      }

      setStory(storyData.comics);

      // Then, generate images for each panel
      const imagePromises = storyData.comics.map(panel =>
        fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: panel.prompt }),
        }).then(res => res.json())
      );

      const imageResults = await Promise.all(imagePromises);
      const allImages = imageResults.flatMap(result => result.output || []);
      setGeneratedImages(allImages);

    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate comic');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-[#a8d5d5] via-[#c5e1dc] to-[#f0ead2] text-gray-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Cartoon clouds - now with floating animation */}
        <div className="absolute top-10 left-10 w-32 h-16 bg-blue-100 rounded-full animate-float-slow before:content-[''] before:absolute before:top-1/2 before:left-6 before:w-16 before:h-16 before:bg-blue-100 before:rounded-full before:-translate-y-1/2 after:content-[''] after:absolute after:top-1/2 after:right-6 after:w-16 after:h-16 after:bg-blue-100 after:rounded-full after:-translate-y-1/2"></div>
        <div className="absolute top-20 right-20 w-32 h-16 bg-blue-100 rounded-full animate-float-slower before:content-[''] before:absolute before:top-1/2 before:left-6 before:w-16 before:h-16 before:bg-blue-100 before:rounded-full before:-translate-y-1/2 after:content-[''] after:absolute after:top-1/2 after:right-6 after:w-16 after:h-16 after:bg-blue-100 after:rounded-full after:-translate-y-1/2"></div>

        {/* Cartoon stars - now with twinkling animation */}
        <div className="absolute top-40 left-1/4 w-8 h-8 bg-yellow-200 rotate-45 animate-twinkle"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-yellow-200 rotate-45 animate-twinkle-delayed"></div>

        {/* Speech bubbles - now with pulsing animation */}
        <div className="absolute top-1/4 right-10 w-24 h-20 bg-white rounded-2xl animate-pulse-slow before:content-[''] before:absolute before:bottom-0 before:right-4 before:w-6 before:h-6 before:bg-white before:rotate-45"></div>
        <div className="absolute bottom-1/4 left-10 w-24 h-20 bg-white rounded-2xl animate-pulse-slower before:content-[''] before:absolute before:bottom-0 before:left-4 before:w-6 before:h-6 before:bg-white before:rotate-45"></div>

        {/* Squiggly lines - now with wave animation */}
        <div className="absolute left-1/3 bottom-20 w-32 h-1 bg-purple-300 rounded-full transform rotate-12 animate-wave"></div>
        <div className="absolute right-1/3 top-32 w-32 h-1 bg-purple-300 rounded-full transform -rotate-12 animate-wave-delayed"></div>

        {/* Circles - now with spin animation */}
        <div className="absolute left-20 top-1/2 w-16 h-16 rounded-full border-4 border-pink-200 animate-spin-slow"></div>
        <div className="absolute right-32 bottom-40 w-12 h-12 rounded-full border-4 border-green-200 animate-spin-reverse"></div>

        {/* Zigzag */}
        <div className="absolute left-1/2 top-1/3 w-24 h-24 bg-gradient-to-br from-orange-200 to-transparent animate-float-slow"></div>
      </div>

      {/* Content */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-center row-start-1 mb-2 relative">
        AI Comic Generator
      </h1>
      <p className="text-xl sm:text-2xl text-center mb-8 text-gray-600">
        Created by: Andy Yang
      </p>

      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-4xl relative z-10">
        <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your comic story idea..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>

        {error && (
          <div className="w-full p-4 bg-red-100/80 backdrop-blur-sm text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading && (
          <div className="w-full p-4 bg-gray-100/80 backdrop-blur-sm text-gray-700 rounded-lg">
            Generating your comic frames...
          </div>
        )}

        {story.length > 0 && generatedImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {story.map((panel, index) => (
              <div key={index} className="flex flex-col gap-4">
                <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={generatedImages[index]}
                    alt={`Comic panel ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-lg text-center font-medium">{panel.caption}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Enhanced bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-48">
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent_70%)]" />
      </div>
    </div>
  );
}
