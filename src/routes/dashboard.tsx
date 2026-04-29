import { createFileRoute, Link } from "@tanstack/react-router";
import { useEducationalTour } from "../hooks/useToursStore";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { useMemo, useState } from "react";

const DAY_COPY = [
  {
    title: "Arrival & First Impressions",
    description:
      "The opening day sets the tone with a warm introduction, a wide establishing scene, and a first look at the locations that shape the tour.",
  },
  {
    title: "Culture in Motion",
    description:
      "A closer look at the everyday details, textures, and people that make the destination feel alive and memorable.",
  },
  {
    title: "Landscape & Perspective",
    description:
      "This chapter focuses on scale, light, and atmosphere, turning the environment itself into the main character.",
  },
  {
    title: "Moments Worth Framing",
    description:
      "A softer, more personal day centered on portraits, expressions, and the kind of moments that feel immediate and real.",
  },
  {
    title: "Textures, Food, and Detail",
    description:
      "Everyday surfaces, meals, and small visual details become part of the story and give the tour its tactile identity.",
  },
  {
    title: "Connection & Community",
    description:
      "This section brings the focus back to people, showing the relationships and shared experiences that tie the trip together.",
  },
  {
    title: "Closing Scene",
    description:
      "The final day feels reflective and cinematic, wrapping everything into a satisfying final frame.",
  },
] as const;

type TourDay = {
  dayNumber: number;
  title: string;
  description: string;
  image?: string;
};

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { tourData, isLoaded } = useEducationalTour();

  const galleryDays = useMemo<TourDay[]>(
    () =>
      tourData.days.map((day, index) => ({
        dayNumber: day.dayNumber,
        title: DAY_COPY[index]?.title ?? `Day ${day.dayNumber}`,
        description: DAY_COPY[index]?.description ?? "A visual chapter from the tour.",
        image: day.image,
      })),
    [tourData.days]
  );

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3efe7]">
        <p className="text-slate-900">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4efe6] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#f4efe6]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Educational Tour</p>
            <h1 className="text-xl font-semibold md:text-2xl">{tourData.tourTitle || "Tour Gallery"}</h1>
          </div>
          <Button variant="outline" asChild className="rounded-full bg-white/80 shadow-sm">
            <Link to="/">Home</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          <Card className="overflow-hidden border-none bg-[#111827] text-white shadow-2xl shadow-black/10">
            <div className="grid gap-0 lg:grid-cols-[1fr_0.75fr]">
              <div className="relative min-h-[280px] overflow-hidden bg-gradient-to-br from-[#1f2937] via-[#374151] to-[#b45309] p-8 lg:min-h-[420px] lg:p-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.25),transparent_40%)]" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="max-w-xl">
                    <p className="text-xs uppercase tracking-[0.4em] text-white/65">7-Day Learning Journey</p>
                    <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">A visual story built from your own saved images.</h2>
                    <p className="mt-4 max-w-lg text-sm leading-6 text-white/75 md:text-base">
                      Tap any collage to open a larger view with the stored local image and a hardcoded description for that day.
                    </p>
                  </div>

                  <div className="grid gap-3 text-sm text-white/80 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Format</p>
                      <p className="mt-2 font-medium">Collage gallery</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Images</p>
                      <p className="mt-2 font-medium">Stored locally</p>
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/8 p-4 backdrop-blur">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Copy</p>
                      <p className="mt-2 font-medium">Hardcoded descriptions</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-0 bg-[#f8f4ed] text-slate-950 lg:grid-rows-2">
                {galleryDays.slice(0, 2).map((day, index) => (
                  <DayTile key={day.dayNumber} day={day} tall={index === 0} />
                ))}
              </div>
            </div>
          </Card>

          <Card className="border border-black/5 bg-white/75 shadow-lg shadow-black/5 backdrop-blur">
            <CardHeader className="border-b border-black/5 pb-4">
              <CardTitle className="text-2xl">Tour Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <p className="text-sm leading-6 text-slate-600">
                {tourData.tourDescription || "This gallery uses the saved local tour images and static day copy so the page stays public."}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Subject</p>
                  <p className="mt-2 font-semibold">{tourData.subject || "Not set"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Institution</p>
                  <p className="mt-2 font-semibold">{tourData.institution || "Not set"}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                Images remain in local browser storage through the existing tour data. Update them from any edit flow you add later.
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Collection</p>
              <h2 className="mt-2 text-3xl font-semibold">7-day collage</h2>
            </div>
            <p className="max-w-md text-sm text-slate-500">
              Click a card to expand it, view the stored image, and read the hardcoded description for that day.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {galleryDays.map((day) => (
              <DayCard key={day.dayNumber} day={day} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function DayTile({ day, tall = false }: { day: TourDay; tall?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={`group relative block h-full min-h-[190px] overflow-hidden text-left ${tall ? "lg:min-h-[210px]" : ""}`}>
          {day.image ? (
            <img
              src={day.image}
              alt={day.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-between p-5 text-white">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
              <span>Day {day.dayNumber}</span>
              <span>Open</span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold leading-tight">{day.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-white/80">{day.description}</p>
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>Day {day.dayNumber}</DialogTitle>
          <DialogDescription>{day.title}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-black/5 bg-slate-100">
            {day.image ? (
              <img src={day.image} alt={day.title} className="h-[360px] w-full object-cover" />
            ) : (
              <div className="flex h-[360px] items-center justify-center bg-gradient-to-br from-amber-300 to-orange-500 text-6xl font-semibold text-white">
                {day.dayNumber}
              </div>
            )}
          </div>
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Description</p>
            <p className="text-base leading-7 text-slate-700">{day.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DayCard({ day }: { day: TourDay }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer overflow-hidden border border-black/5 bg-white/85 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
          <div className="relative h-64 overflow-hidden bg-slate-100">
            {day.image ? (
              <img
                src={day.image}
                alt={day.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#d97706] via-[#f59e0b] to-[#7c2d12] text-7xl font-semibold text-white">
                {day.dayNumber}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
            <div className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-700 backdrop-blur">
              Day {day.dayNumber}
            </div>
          </div>
          <CardContent className="space-y-3 p-5">
            <h3 className="text-xl font-semibold leading-tight text-slate-950">{day.title}</h3>
            <p className="text-sm leading-6 text-slate-600 line-clamp-3">{day.description}</p>
            <div className="flex items-center justify-between pt-1 text-xs uppercase tracking-[0.25em] text-slate-400">
              <span>Click to open</span>
              <span>Gallery</span>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[760px]">
        <DialogHeader>
          <DialogTitle>Day {day.dayNumber}</DialogTitle>
          <DialogDescription>{day.title}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-black/5 bg-slate-100">
            {day.image ? (
              <img src={day.image} alt={day.title} className="h-[360px] w-full object-cover" />
            ) : (
              <div className="flex h-[360px] items-center justify-center bg-gradient-to-br from-amber-300 to-orange-500 text-6xl font-semibold text-white">
                {day.dayNumber}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Description</p>
            <p className="text-base leading-7 text-slate-700">{day.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
