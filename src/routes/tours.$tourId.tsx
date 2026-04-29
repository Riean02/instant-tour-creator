import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useToursStore } from "../../hooks/useToursStore";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useState } from "react";

export const Route = createFileRoute("/tours/$tourId")({
  component: TourDetail,
});

function TourDetail() {
  const { tourId } = useParams({ from: "/tours/$tourId" });
  const navigate = useNavigate();
  const { getTour, updateTour, deleteTour } = useToursStore();
  const tour = getTour(tourId);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(
    tour ? {
      name: tour.name,
      destination: tour.destination,
      description: tour.description,
      image: tour.image || "",
      startDate: tour.startDate,
      endDate: tour.endDate,
    } : null
  );

  if (!tour) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">Tour not found</h2>
          <Link to="/">
            <Button className="mt-4">Back to Tours</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (formData) {
      updateTour(tourId, formData);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this tour?")) {
      deleteTour(tourId);
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image Section */}
      {!isEditing && tour.image && (
        <div className="relative h-80 w-full overflow-hidden">
          <img 
            src={tour.image} 
            alt={tour.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-8 text-white">
              <h1 className="text-5xl font-bold mb-2">{tour.name}</h1>
              <p className="text-xl opacity-90">{tour.destination}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header with gradient */}
      <div className={`${tour.image && !isEditing ? 'bg-white' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-b border-slate-200'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link to="/">
              <Button variant="outline" className="border-slate-300">
                ← Back
              </Button>
            </Link>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Edit Tour
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>

          {!isEditing && tour.image && (
            <div className="flex items-center gap-6 text-sm text-slate-600 mb-0">
              <span className="flex items-center gap-2">
                📅 {new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2">
                🗺️ {tour.days.length} days
              </span>
            </div>
          )}

          {isEditing && formData ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Tour Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="image">Cover Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="e.g., https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">{tour.name}</h1>
              <p className="text-xl text-orange-600 font-medium mb-4">{tour.destination}</p>
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  📅 {new Date(tour.startDate).toLocaleDateString()} - {new Date(tour.endDate).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-2">
                  🗺️ {tour.days.length} days
                </span>
              </div>
              {tour.description && (
                <p className="mt-4 text-slate-700 max-w-2xl">{tour.description}</p>
              )}
            </div>
          )}}
        </div>
      </div>

      {/* Days Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Your 7-Day Itinerary</h2>
          <p className="text-slate-600 mt-2">Click on any day to view and edit activities</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {tour.days.map((day) => (
            <Link
              key={day.dayNumber}
              to={`/tours/${tourId}/day/${day.dayNumber}`}
              className="group"
            >
              <Card className="h-full cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden border border-slate-200">
                <div className="relative h-32 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-5xl font-bold group-hover:from-amber-500 group-hover:to-orange-600 transition-all overflow-hidden">
                  {day.image ? (
                    <img 
                      src={day.image} 
                      alt={`Day ${day.dayNumber}`}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    day.dayNumber
                  )}
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-slate-900 mb-2 line-clamp-1">{day.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                    {day.description || "No description yet"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{day.activities.length} activities</span>
                    <span className="text-orange-600 font-medium">Edit →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
