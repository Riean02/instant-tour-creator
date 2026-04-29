import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useToursStore } from "../../hooks/useToursStore";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { useState } from "react";

export const Route = createFileRoute("/tours/$tourId/day/$dayNumber")({
  component: DayDetail,
});

function DayDetail() {
  const { tourId, dayNumber } = useParams({ from: "/tours/$tourId/day/$dayNumber" });
  const dayNum = parseInt(dayNumber, 10);
  const { getTour, updateDay, addActivity, updateActivity, deleteActivity } = useToursStore();
  const tour = getTour(tourId);
  const day = tour?.days.find((d) => d.dayNumber === dayNum);
  const [isEditingDay, setIsEditingDay] = useState(false);
  const [dayData, setDayData] = useState(
    day ? { title: day.title, description: day.description, image: day.image || "" } : null
  );
  const [openActivityDialog, setOpenActivityDialog] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [activityForm, setActivityForm] = useState({
    title: "",
    description: "",
    time: "",
    location: "",
    image: "",
  });

  if (!tour || !day) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">Day not found</h2>
          <Link to={`/tours/${tourId}`}>
            <Button className="mt-4">Back to Tour</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveDay = () => {
    if (dayData) {
      updateDay(tourId, dayNum, dayData);
      setIsEditingDay(false);
    }
  };

  const handleAddActivity = () => {
    if (activityForm.title) {
      if (editingActivityId) {
        updateActivity(tourId, dayNum, editingActivityId, activityForm);
        setEditingActivityId(null);
      } else {
        addActivity(tourId, dayNum, activityForm);
      }
      setActivityForm({ title: "", description: "", time: "", location: "", image: "" });
      setOpenActivityDialog(false);
    }
  };

  const openEditActivity = (activityId: string) => {
    const activity = day.activities.find((a) => a.id === activityId);
    if (activity) {
      setActivityForm({
        title: activity.title,
        description: activity.description,
        time: activity.time,
        location: activity.location,
        image: activity.image || "",
      });
      setEditingActivityId(activityId);
      setOpenActivityDialog(true);
    }
  };

  const handleDeleteActivity = (activityId: string) => {
    deleteActivity(tourId, dayNum, activityId);
  };

  const previousDay = dayNum > 1 ? dayNum - 1 : null;
  const nextDay = dayNum < 7 ? dayNum + 1 : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image Section */}
      {!isEditingDay && day.image && (
        <div className="relative h-80 w-full overflow-hidden">
          <img 
            src={day.image} 
            alt={day.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-8 text-white">
              <h1 className="text-5xl font-bold mb-2">Day {dayNum}: {day.title}</h1>
              {day.description && (
                <p className="text-lg opacity-90 max-w-2xl">{day.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`${day.image && !isEditingDay ? 'bg-white' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-b border-slate-200'} sticky top-0 z-40`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to={`/tours/${tourId}`}>
              <Button variant="outline" className="border-slate-300">
                ← Back to Tour
              </Button>
            </Link>
            {!isEditingDay && (
              <Button 
                onClick={() => setIsEditingDay(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
              >
                ✏️ Edit Day
              </Button>
            )}
          </div>

          {isEditingDay && dayData ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="dayTitle" className="text-sm">Day Title</Label>
                <Input
                  id="dayTitle"
                  value={dayData.title}
                  onChange={(e) => setDayData({ ...dayData, title: e.target.value })}
                  placeholder="e.g., Paris - City of Lights"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dayDescription" className="text-sm">Day Description</Label>
                <Textarea
                  id="dayDescription"
                  value={dayData.description}
                  onChange={(e) => setDayData({ ...dayData, description: e.target.value })}
                  placeholder="Describe what you'll do this day..."
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dayImage" className="text-sm">Day Image URL</Label>
                <Input
                  id="dayImage"
                  value={dayData.image}
                  onChange={(e) => setDayData({ ...dayData, image: e.target.value })}
                  placeholder="e.g., https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditingDay(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveDay}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  Save Day
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Day {dayNum}: {day.title}
              </h1>
              {day.description && (
                <p className="text-slate-700 max-w-2xl">{day.description}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Activities Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Activities</h2>
            <p className="text-slate-600 mt-2">Plan your day with activities and timings</p>
          </div>
          <Dialog open={openActivityDialog} onOpenChange={setOpenActivityDialog}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                onClick={() => {
                  setEditingActivityId(null);
                  setActivityForm({ title: "", description: "", time: "", location: "", image: "" });
                }}
              >
                + Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingActivityId ? "Edit Activity" : "Add Activity"}
                </DialogTitle>
                <DialogDescription>
                  {editingActivityId ? "Update the activity details" : "Create a new activity for this day"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="activityTitle">Activity Title</Label>
                  <Input
                    id="activityTitle"
                    value={activityForm.title}
                    onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                    placeholder="e.g., Eiffel Tower Visit"
                  />
                </div>
                <div>
                  <Label htmlFor="activityTime">Time</Label>
                  <Input
                    id="activityTime"
                    value={activityForm.time}
                    onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })}
                    placeholder="e.g., 09:00 AM - 12:00 PM"
                  />
                </div>
                <div>
                  <Label htmlFor="activityLocation">Location</Label>
                  <Input
                    id="activityLocation"
                    value={activityForm.location}
                    onChange={(e) => setActivityForm({ ...activityForm, location: e.target.value })}
                    placeholder="e.g., 5 Avenue Anatole France"
                  />
                </div>
                <div>
                  <Label htmlFor="activityDescription">Description</Label>
                  <Textarea
                    id="activityDescription"
                    value={activityForm.description}
                    onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                    placeholder="Describe the activity..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="activityImage">Activity Image URL</Label>
                  <Input
                    id="activityImage"
                    value={activityForm.image}
                    onChange={(e) => setActivityForm({ ...activityForm, image: e.target.value })}
                    placeholder="e.g., https://example.com/image.jpg"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setOpenActivityDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddActivity}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                  >
                    {editingActivityId ? "Update Activity" : "Add Activity"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {day.activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-8 py-16">
            <div className="mb-4 rounded-full bg-white p-4">
              <svg className="h-10 w-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-slate-900 font-semibold">No activities yet</h3>
            <p className="mt-1 text-sm text-slate-600">Add activities to plan this day</p>
          </div>
        ) : (
          <div className="space-y-4">
            {day.activities.map((activity, index) => (
              <Card key={activity.id} className="border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                {activity.image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-semibold">
                          {index + 1}
                        </div>
                        <CardTitle className="text-lg">{activity.title}</CardTitle>
                      </div>
                      <div className="space-y-1 text-sm text-slate-600">
                        {activity.time && <p className="flex items-center gap-2">⏰ {activity.time}</p>}
                        {activity.location && <p className="flex items-center gap-2">📍 {activity.location}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditActivity(activity.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteActivity(activity.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {activity.description && (
                  <CardContent className="pt-4">
                    <p className="text-slate-700">{activity.description}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between">
          {previousDay ? (
            <Link to={`/tours/${tourId}/day/${previousDay}`}>
              <Button variant="outline">← Previous Day</Button>
            </Link>
          ) : (
            <div />
          )}
          
          <div className="text-sm text-slate-600">
            Day {dayNum} of 7
          </div>

          {nextDay ? (
            <Link to={`/tours/${tourId}/day/${nextDay}`}>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                Next Day →
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}

