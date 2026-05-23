import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  MapPin,
  Calendar,
  Clock,
  Share2,
  ArrowLeft,
  Plane,
  Hotel,
  Train,
  Utensils,
  Car,
  Star,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

// map activity type to icon component
const typeIcon = {
  flight: Plane,
  hotel: Hotel,
  transport: Train,
  meal: Utensils,
  activity: Star,
  other: Car,
};

// map activity type to color classes
const typeColor = {
  flight: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  hotel: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  transport: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  meal: "bg-green-500/10 text-green-400 border-green-500/20",
  activity: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

import itineraryHero from "../assets/itinerary-hero.jpg";
const HERO_IMAGE = itineraryHero;

export default function ItineraryPage() {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .get(`/itineraries/${id}`)
      .then(({ data }) => setItinerary(data.itinerary))
      .catch(() => toast.error("Failed to load itinerary"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    try {
      const { data } = await api.post(`/itineraries/${id}/share`);
      setShareUrl(data.shareUrl);
      await navigator.clipboard.writeText(data.shareUrl);
      setCopied(true);
      toast.success("Share link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Failed to generate share link");
    }
  };

  const copyShare = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="w-8 h-8 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );

  if (!itinerary)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <p className="text-gray-500">Itinerary not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950">
      {/* hero banner with destination image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="Trip"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/60 via-transparent to-gray-950" />

        {/* top bar over image */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors 
              bg-black/30 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 
              rounded-xl border border-white/10 text-white/80 hover:text-white transition-colors text-sm"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            {copied ? "Copied!" : "Share Trip"}
          </button>
        </div>

        {/* title over image at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="text-sky-400 text-xs font-medium">
              AI Generated Itinerary
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">{itinerary.title}</h1>
        </div>
      </div>

      {/* content below hero */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* trip meta info */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
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
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
            <Star className="w-4 h-4 text-sky-400" />
            <span className="text-gray-300 text-sm">
              {itinerary.days?.length || 0} days
            </span>
          </div>
        </div>

        {/* share URL bar */}
        {shareUrl && (
          <div
            className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-4 mb-6 
            flex items-center gap-3"
          >
            <Share2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span className="flex-1 text-sky-300 text-sm truncate">
              {shareUrl}
            </span>
            <button
              onClick={copyShare}
              className="text-sky-400 hover:text-sky-300 transition-colors flex-shrink-0"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* summary card */}
        {itinerary.summary && (
          <div className="card mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span className="text-sky-400 text-sm font-medium">
                Trip Summary
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">{itinerary.summary}</p>
          </div>
        )}

        {/* day by day timeline */}
        <div className="space-y-6">
          {itinerary.days?.map((day, dayIndex) => (
            <div key={day.day} className="relative">
              {/* vertical timeline line connecting days */}
              {dayIndex < itinerary.days.length - 1 && (
                <div
                  className="absolute left-5 top-16 bottom-0 w-px bg-gradient-to-b 
                  from-sky-500/30 to-transparent"
                />
              )}

              {/* day header */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 
                  flex items-center justify-center text-white font-bold text-sm flex-shrink-0 
                  shadow-lg shadow-sky-500/30"
                >
                  {day.day}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{day.title}</h3>
                  {day.date && (
                    <p className="text-gray-500 text-sm">{day.date}</p>
                  )}
                </div>
              </div>

              {/* activities for this day */}
              <div className="ml-14 space-y-3">
                {day.activities?.map((act, i) => {
                  const Icon = typeIcon[act.type] || Star;
                  const colorClass = typeColor[act.type] || typeColor.other;
                  return (
                    <div
                      key={i}
                      className={`rounded-xl border p-4 ${colorClass} transition-all 
                      hover:scale-[1.01]`}
                    >
                      <div className="flex items-start gap-3">
                        {/* time */}
                        {act.time && (
                          <div
                            className="flex items-center gap-1 text-xs opacity-60 
                            w-14 flex-shrink-0 mt-0.5"
                          >
                            <Clock className="w-3 h-3" />
                            {act.time}
                          </div>
                        )}
                        <div className="flex-1">
                          {/* activity title with icon */}
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="font-semibold text-sm">
                              {act.title}
                            </span>
                          </div>
                          {act.description && (
                            <p className="text-sm opacity-70 mt-1 leading-relaxed">
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
      </div>
    </div>
  );
}
