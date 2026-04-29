import { createFileRoute } from "@tanstack/react-router";
import { useEducationalTour } from "../hooks/useToursStore";
import { Card, CardContent } from "../components/ui/card";

export const Route = createFileRoute("/tour")({
  component: PublicTour,
});

function PublicTour() {
  const { tourData, isLoaded } = useEducationalTour();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-slate-900">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold">
              🎬
            </div>
            <span className="text-xl font-bold text-slate-900">Educational Tour</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{tourData.tourTitle}</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-4">{tourData.tourDescription}</p>
          <div className="flex justify-center gap-8 mt-8 text-sm">
            {tourData.subject && (
              <div>
                <p className="opacity-75">Subject</p>
                <p className="font-semibold text-lg">{tourData.subject}</p>
              </div>
            )}
            {tourData.institution && (
              <div>
                <p className="opacity-75">Institution</p>
                <p className="font-semibold text-lg">{tourData.institution}</p>
              </div>
            )}
            <div>
              <p className="opacity-75">Duration</p>
              <p className="font-semibold text-lg">7 Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Days Grid */}
      <div className="container mx-auto px-4 py-20">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-2">Daily Itinerary</h2>
          <p className="text-slate-600">Explore each day of the educational tour</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {tourData.days.map((day, index) => (
            <div key={day.dayNumber} className="group">
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-slate-200">
                {day.image && (
                  <div className="relative h-48 overflow-hidden bg-slate-200">
                    <img
                      src={day.image}
                      alt={day.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className={day.image ? "" : "relative h-32 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"}>
                  {!day.image && (
                    <div className="text-white text-5xl font-bold opacity-70">{day.dayNumber}</div>
                  )}
                </div>
                <CardContent className={`${day.image ? "pt-4" : "pt-6"}`}>
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                      Day {day.dayNumber}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2">{day.title}</h3>
                  <p className="text-sm text-slate-600 line-clamp-3">{day.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed View */}
      <div className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Detailed Content</h2>

          <div className="space-y-12 max-w-4xl mx-auto">
            {tourData.days.map((day) => (
              <div key={day.dayNumber} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="border-l-4 border-orange-500 p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-lg">
                      {day.dayNumber}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{day.title}</h3>
                  </div>
                  {day.image && (
                    <div className="mb-6 rounded-lg overflow-hidden max-h-96">
                      <img
                        src={day.image}
                        alt={day.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {day.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-600">
          <p>© 2024 Educational Tour. Created for academic presentation.</p>
        </div>
      </footer>
    </div>
  );
}
