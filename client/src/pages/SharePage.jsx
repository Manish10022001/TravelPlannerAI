import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import {
  MapPin,
  Calendar,
  Clock,
  Plane,
  Hotel,
  Train,
  Utensils,
  Car,
  Star,
  Sparkles,
} from "lucide-react";

const typeIcon = {
  flight: Plane,
  hotel: Hotel,
  transport: Train,
  meal: Utensils,
  activity: Star,
  other: Car,
};
const typeColor = {
  flight: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  hotel: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  transport: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  meal: "bg-green-500/10 text-green-400 border-green-500/20",
  activity: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

import shareHero from "../assets/share-hero.jpg";
const HERO_IMAGE = shareHero;

export default function SharePage() {
  const { token } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/share/${token}`)
      .then(({ data }) => setItinerary(data.itinerary))
      .catch(() =>
        setError("This itinerary is not available or the link has expired")
      )
      .finally(() => setLoading(false));
  }, [token]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="w-8 h-8 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Link not found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/register" className="btn-primary">
            Create your own itinerary
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950">
      {/* public navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl 
        border-b border-white/10 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 
            flex items-center justify-center"
          >
            <Plane className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">
            TripPlanner <span className="text-sky-400">AI</span>
          </span>
        </div>
        <Link to="/register" className="btn-primary text-sm px-4 py-2">
          Plan your own trip →
        </Link>
      </nav>

      {/* hero */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-transparent to-gray-950" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-3xl mx-auto">
          {/* shared badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="px-2.5 py-1 rounded-full bg-sky-500/20 border border-sky-500/30 
              text-sky-400 text-xs font-medium flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              Shared Itinerary
            </span>
            {itinerary.user?.name && (
              <span className="text-gray-400 text-sm">
                by {itinerary.user.name}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white">{itinerary.title}</h1>
        </div>
      </div>

      {/* content */}
      <div className="max-w-3xl mx-auto px-6 py-8 mt-16">
        {/* meta */}
        <div className="flex flex-wrap gap-3 mb-8">
          {itinerary.destination && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <MapPin className="w-4 h-4 text-sky-400" />
              <span className="text-gray-300 text-sm">
                {itinerary.destination}
              </span>
            </div>
          )}
          {itinerary.startDate && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span className="text-gray-300 text-sm">
                {itinerary.startDate} → {itinerary.endDate}
              </span>
            </div>
          )}
        </div>

        {itinerary.summary && (
          <div className="card mb-8">
            <p className="text-gray-300 leading-relaxed">{itinerary.summary}</p>
          </div>
        )}

        {/* days */}
        <div className="space-y-6">
          {itinerary.days?.map((day, dayIndex) => (
            <div key={day.day} className="relative">
              {dayIndex < itinerary.days.length - 1 && (
                <div
                  className="absolute left-5 top-16 bottom-0 w-px bg-gradient-to-b 
                  from-sky-500/30 to-transparent"
                />
              )}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 
                  flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                >
                  {day.day}
                </div>
                <div>
                  <h3 className="font-bold text-white">{day.title}</h3>
                  {day.date && (
                    <p className="text-gray-500 text-sm">{day.date}</p>
                  )}
                </div>
              </div>
              <div className="ml-14 space-y-3">
                {day.activities?.map((act, i) => {
                  const Icon = typeIcon[act.type] || Star;
                  const colorClass = typeColor[act.type] || typeColor.other;
                  return (
                    <div
                      key={i}
                      className={`rounded-xl border p-4 ${colorClass}`}
                    >
                      <div className="flex items-start gap-3">
                        {act.time && (
                          <div className="flex items-center gap-1 text-xs opacity-60 w-14 flex-shrink-0 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {act.time}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="font-semibold text-sm">
                              {act.title}
                            </span>
                          </div>
                          {act.description && (
                            <p className="text-sm opacity-70 mt-1">
                              {act.description}
                            </p>
                          )}
                          {act.location && (
                            <div className="flex items-center gap-1 mt-2 opacity-50">
                              <MapPin className="w-3 h-3" />
                              <span className="text-xs">{act.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA at bottom — converts viewers to signups */}
        <div
          className="mt-12 rounded-2xl bg-gradient-to-r from-sky-500/10 to-indigo-500/10 
          border border-sky-500/20 p-8 text-center"
        >
          <Sparkles className="w-8 h-8 text-sky-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-2">
            Plan your own AI trip
          </h3>
          <p className="text-gray-400 mb-5">
            Upload your travel documents and get a beautiful itinerary in
            seconds — completely free.
          </p>
          <Link to="/register" className="btn-primary px-8 py-3">
            Get started free →
          </Link>
        </div>
      </div>
    </div>
  );
}
