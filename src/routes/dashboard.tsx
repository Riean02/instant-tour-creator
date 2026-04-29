import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEducationalTour } from "../hooks/useToursStore";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { useState } from "react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const { tourData, isLoaded, isLoggedIn, logout, updateTourInfo } = useEducationalTour();
  const [isEditingTour, setIsEditingTour] = useState(false);
  const [tourInfo, setTourInfo] = useState({
    tourTitle: tourData.tourTitle,
    tourDescription: tourData.tourDescription,
    subject: tourData.subject,
    institution: tourData.institution,
  });

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-slate-900">Loading...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    navigate({ to: "/" });
    return null;
  }

  const handleSaveTourInfo = () => {
    updateTourInfo(tourInfo);
    setIsEditingTour(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Content Dashboard</h1>
              <p className="text-slate-600 mt-1">Edit your 7-day educational tour content</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tour Info Card */}
        <Card className="mb-8 bg-white border border-slate-200">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Tour Information</CardTitle>
              {!isEditingTour && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditingTour(true)}
                >
                  ✏️ Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isEditingTour ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tourTitle">Tour Title</Label>
                  <Input
                    id="tourTitle"
                    value={tourInfo.tourTitle}
                    onChange={(e) => setTourInfo({ ...tourInfo, tourTitle: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject/Topic</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Environmental Science, History, Art"
                    value={tourInfo.subject}
                    onChange={(e) => setTourInfo({ ...tourInfo, subject: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    placeholder="e.g., University Name"
                    value={tourInfo.institution}
                    onChange={(e) => setTourInfo({ ...tourInfo, institution: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="tourDescription">Tour Description</Label>
                  <Textarea
                    id="tourDescription"
                    placeholder="Describe the purpose and overview of your educational tour..."
                    value={tourInfo.tourDescription}
                    onChange={(e) => setTourInfo({ ...tourInfo, tourDescription: e.target.value })}
                    rows={4}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditingTour(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveTourInfo}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{tourData.tourTitle}</h3>
                  <p className="text-slate-600 mt-1">{tourData.tourDescription}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Subject</p>
                    <p className="font-semibold text-slate-900">{tourData.subject || "Not set"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Institution</p>
                    <p className="font-semibold text-slate-900">{tourData.institution || "Not set"}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 7 Days Grid */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">7-Day Content</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tourData.days.map((day) => (
              <DayCard key={day.dayNumber} day={day} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DayCard({ day }: { day: { dayNumber: number; title: string; description: string; image?: string } }) {
  const navigate = useNavigate();
  const { updateDay } = useEducationalTour();
  const [isOpen, setIsOpen] = useState(false);
  const [dayData, setDayData] = useState({
    title: day.title,
    description: day.description,
    image: day.image || "",
  });

  const handleSave = () => {
    updateDay(day.dayNumber, dayData);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden border border-slate-200 bg-white">
          <div className="relative h-40 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden">
            {day.image ? (
              <img
                src={day.image}
                alt={`Day ${day.dayNumber}`}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="text-white text-5xl font-bold opacity-70">{day.dayNumber}</div>
            )}
          </div>
          <CardContent className="pt-4">
            <h3 className="font-semibold text-slate-900 mb-2">{day.title}</h3>
            <p className="text-sm text-slate-600 line-clamp-2">{day.description || "Click to add content"}</p>
            <p className="text-xs text-orange-600 font-medium mt-3">Click to edit →</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Day {day.dayNumber}</DialogTitle>
          <DialogDescription>
            Add your educational content, images, and descriptions for this day
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="dayTitle">Day Title</Label>
            <Input
              id="dayTitle"
              value={dayData.title}
              onChange={(e) => setDayData({ ...dayData, title: e.target.value })}
              placeholder="e.g., Museum Visit & Historical Overview"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="dayDescription">Description & Learning Objectives</Label>
            <Textarea
              id="dayDescription"
              value={dayData.description}
              onChange={(e) => setDayData({ ...dayData, description: e.target.value })}
              placeholder="Describe what students will learn, activities, key points, and observations..."
              rows={6}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="dayImage">Image URL</Label>
            <Input
              id="dayImage"
              value={dayData.image}
              onChange={(e) => setDayData({ ...dayData, image: e.target.value })}
              placeholder="e.g., https://example.com/image.jpg"
              className="mt-1"
            />
            {dayData.image && (
              <div className="mt-3 rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={dayData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              Save Day {day.dayNumber}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
