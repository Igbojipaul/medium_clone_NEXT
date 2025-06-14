"use client";

import api from "@/lib/api";
import useSWR from "swr";
import { Tag, TrendingUp, Hash } from "lucide-react";

const fetcher = (url) => api.get(url).then((res) => res.data);

const staticTags = [
  { name: "javascript", count: 1234 },
  { name: "react", count: 987 },
  { name: "nextjs", count: 756 },
  { name: "typescript", count: 654 },
  { name: "webdev", count: 543 },
  { name: "programming", count: 432 },
  { name: "frontend", count: 321 },
  { name: "backend", count: 298 },
  { name: "nodejs", count: 276 },
  { name: "css", count: 234 },
  { name: "python", count: 198 },
  { name: "tutorial", count: 167 },
  { name: "beginners", count: 145 },
  { name: "career", count: 123 },
  { name: "productivity", count: 98 }
];

export default function TagSidebar({ selectedTag, onTagSelect }) {
  const { data, error } = useSWR(`/tags`, fetcher);

  // Use API data if available, otherwise fall back to static data
  const tags = data?.results || staticTags
  const isLoading = !data && !error;

  return (
    <div className="space-y-6">
      {/* Popular Tags Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <TrendingUp size={20} className="text-gray-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Popular Tags</h2>
        </div>
        
        {error && (
          <div className="text-center py-4">
            <p className="text-red-500 text-sm mb-2">Failed to load tags</p>
            <p className="text-gray-500 text-xs">Showing popular tags instead</p>
          </div>
        )}
        
        {isLoading && (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {tags.slice(0, 15).map((tag) => (
            <button
              key={tag.name}
              onClick={() => onTagSelect(tag.name === selectedTag ? "" : tag.name)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 text-left group ${
                tag.name === selectedTag
                  ? "bg-gray-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-2">
                <Hash 
                  size={16} 
                  className={`${
                    tag.name === selectedTag ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                <span className="font-medium">{tag.name}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                tag.name === selectedTag
                  ? "bg-gray-500 text-white"
                  : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
              }`}>
                {tag.count || Math.floor(Math.random() * 1000) + 50}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-200 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Tag size={18} className="text-gray-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Discover More</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Explore topics that interest you and discover new perspectives from our community of writers.
        </p>
        
        {selectedTag && (
          <button
            onClick={() => onTagSelect("")}
            className="w-full bg-white text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Community Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Tags</span>
            <span className="font-semibold text-gray-900">{tags.length}+</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Active Topics</span>
            <span className="font-semibold text-gray-900">
              {tags.reduce((acc, tag) => acc + (tag.count || 100), 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Most Popular</span>
            <span className="font-semibold text-gray-600">#{tags[0]?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}