import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  MapPin,
  Calendar,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

import card1 from "../assets/card-1.jpg";
import card2 from "../assets/card-2.jpg";
import card3 from "../assets/card-3.jpg";
import card4 from "../assets/card-4.jpg";
import card5 from "../assets/card-5.jpg";
import card6 from "../assets/card-6.jpg";

const CARD_IMAGES = [card1, card2, card3, card4, card5, card6];
export default function DashboardPage() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    api
      .get("/itineraries")
      .then(({ data }) => setItineraries(data.itineraries))
      .catch(() => toast.error("Failed to load itineraries"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, e) => {
    // stop the card click from firing
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this itinerary?")) return;
    try {
      await api.delete(`/itineraries/${id}`);
      setItineraries((prev) => prev.filter((i) => i._id !== id));
      toast.success("Trip deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading your trips...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      {/* Header with greeting */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-gray-500 text-sm mb-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-3xl font-bold text-white">
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 17
              ? "afternoon"
              : "evening"}
            ,{" "}
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              {user?.name?.split(" ")[0]}
            </span>
          </h1>
          <p className="text-gray-500 mt-1">
            {itineraries.length === 0
              ? "Ready to plan your first adventure?"
              : `You have ${itineraries.length} trip${
                  itineraries.length > 1 ? "s" : ""
                } planned`}
          </p>
        </div>

        <Link
          to="/upload"
          className="btn-primary flex items-center gap-2 px-5 py-3"
        >
          <Plus className="w-4 h-4" />
          New Trip
        </Link>
      </div>

      {/* Stats row — shows at top when there are trips */}
      {itineraries.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Trips", value: itineraries.length, icon: MapPin },
            {
              label: "Destinations",
              value: [
                ...new Set(
                  itineraries.map((i) => i.destination).filter(Boolean)
                ),
              ].length,
              icon: Calendar,
            },
            {
              label: "AI Generated",
              value: itineraries.length,
              icon: Sparkles,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 
                flex items-center justify-center border border-sky-500/20"
              >
                <Icon className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-gray-500 text-sm">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {itineraries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          {/* background glow effect */}
          <div
            className="w-32 h-32 rounded-full bg-sky-500/10 flex items-center justify-center mb-6 
            relative before:absolute before:inset-0 before:rounded-full before:bg-sky-500/5 before:scale-150"
          >
            <MapPin className="w-12 h-12 text-sky-500/50" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No trips yet</h3>
          <p className="text-gray-500 text-center max-w-md mb-8">
            Upload your flight tickets, hotel bookings, or any travel document —
            our AI will instantly build a beautiful day-by-day itinerary for
            you.
          </p>
          <Link
            to="/upload"
            className="btn-primary flex items-center gap-2 px-6 py-3"
          >
            <Sparkles className="w-4 h-4" />
            Create your first trip
          </Link>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-gray-300 mb-4">
            Your Trips
          </h2>
          {/* Trip cards grid — each with a travel photo */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {itineraries.map((trip, index) => (
              <Link
                key={trip._id}
                to={`/itinerary/${trip._id}`}
                className="group rounded-2xl overflow-hidden border border-white/10 
                  hover:border-sky-500/30 transition-all duration-300 hover:shadow-xl 
                  hover:shadow-sky-500/10 hover:-translate-y-1 bg-gray-900"
              >
                {/* card image — cycles through travel photos */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={CARD_IMAGES[index % CARD_IMAGES.length]}
                    alt={trip.destination || "Travel"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />

                  {/* delete button top right */}
                  <button
                    onClick={(e) => handleDelete(trip._id, e)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm 
                      flex items-center justify-center opacity-0 group-hover:opacity-100 
                      transition-all hover:bg-red-500/80 text-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* destination badge on image */}
                  {trip.destination && (
                    <div
                      className="absolute bottom-3 left-3 flex items-center gap-1.5 
                      px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10"
                    >
                      <MapPin className="w-3 h-3 text-sky-400" />
                      <span className="text-white text-xs font-medium">
                        {trip.destination}
                      </span>
                    </div>
                  )}
                </div>

                {/* card content below image */}
                <div className="p-4">
                  <h3
                    className="font-semibold text-white mb-2 line-clamp-1 group-hover:text-sky-400 
                    transition-colors"
                  >
                    {trip.title}
                  </h3>

                  {trip.startDate && (
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {trip.startDate} → {trip.endDate}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    {/* created time */}
                    <div className="flex items-center gap-1 text-gray-600 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(trip.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span
                      className="flex items-center gap-1 text-sky-400 text-xs font-medium 
                      group-hover:gap-2 transition-all"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
