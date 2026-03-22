"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { onValue, ref, set, update } from "firebase/database";
import { useEffect, useMemo, useState } from "react";
import {
  getBogisByRoute,
  getSeatsByRouteAndBogi,
  getTrainNoByRoute,
  RouteKey,
  routeOptions,
  SeatItem,
} from "./data/seat-data";

type FirebaseSeatState = {
  occupied?: boolean;
  name?: string | null;
};

type SeatStateMap = Partial<
  Record<RouteKey, Record<string, Record<string, FirebaseSeatState>>>
>;

const RESET_PASSWORD = "tofaal9152";

const makeEmptySeats = (route: RouteKey, bogi: string) => {
  const seats = getSeatsByRouteAndBogi(route, bogi);

  return Object.fromEntries(
    seats.map((seat) => [String(seat.seat), { occupied: false, name: null }]),
  );
};

const getShortRouteLabel = (route: RouteKey) => {
  switch (route) {
    case "রাজশাহী-ঢাকা":
      return "রাজ-ঢা";
    case "ঢাকা-চট্টগ্রাম":
      return "ঢা-চট";
    case "কক্সবাজার-ঢাকা":
      return "কক্স-ঢা";
    case "কক্সবাজার-চট্টগ্রাম":
      return "কক্স-চট";
    case "চট্টগ্রাম-ঢাকা":
      return "চট-ঢা";
    case "ঢাকা-রাজশাহী":
      return "ঢা-রাজ";
    default:
      return route;
  }
};

export default function HomePage() {
  const initialRoute = routeOptions[0];
  const initialBogi = getBogisByRoute(initialRoute)[0] ?? "";

  const [route, setRoute] = useState<RouteKey>(initialRoute);
  const [bogi, setBogi] = useState<string>(initialBogi);
  const [seatsState, setSeatsState] = useState<SeatStateMap>({});
  const [selectedSeat, setSelectedSeat] = useState<SeatItem | null>(null);
  const [name, setName] = useState("");

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [resetRoute, setResetRoute] = useState<RouteKey>(initialRoute);
  const [resetBogi, setResetBogi] = useState<string>(initialBogi);
  const [resetError, setResetError] = useState("");

  useEffect(() => {
    const seatRef = ref(db, "seatStates");

    return onValue(seatRef, (snapshot) => {
      const data = snapshot.val();
      setSeatsState(data ?? {});
    });
  }, []);

  const bogis = useMemo(() => getBogisByRoute(route), [route]);
  const resetBogis = useMemo(() => getBogisByRoute(resetRoute), [resetRoute]);
  const trainNo = useMemo(() => getTrainNoByRoute(route), [route]);

  const seats = useMemo(() => {
    const baseSeats = getSeatsByRouteAndBogi(route, bogi);
    const firebaseSeats = seatsState?.[route]?.[bogi] ?? {};

    return baseSeats.map((seat) => {
      const liveSeat = firebaseSeats[String(seat.seat)];

      return {
        seat: seat.seat,
        occupied: liveSeat?.occupied ?? false,
        name: liveSeat?.name ?? null,
      };
    });
  }, [route, bogi, seatsState]);

  const bookedCount = seats.filter((seat) => seat.occupied).length;
  const emptyCount = seats.filter((seat) => !seat.occupied).length;

  const handleRouteChange = (nextRoute: RouteKey) => {
    const nextBogis = getBogisByRoute(nextRoute);
    const firstBogi = nextBogis[0] ?? "";

    setRoute(nextRoute);
    setBogi(firstBogi);
    setSelectedSeat(null);
    setName("");
  };

  const handleResetRouteChange = (nextRoute: RouteKey) => {
    const nextBogis = getBogisByRoute(nextRoute);
    const firstBogi = nextBogis[0] ?? "";

    setResetRoute(nextRoute);
    setResetBogi(firstBogi);
  };

  const updateSeatInFirebase = async (
    currentRoute: RouteKey,
    currentBogi: string,
    seatNo: number,
    payload: { occupied: boolean; name: string | null },
  ) => {
    await update(ref(db), {
      [`seatStates/${currentRoute}/${currentBogi}/${seatNo}`]: payload,
    });
  };

  const handleSeatClick = async (seat: SeatItem) => {
    if (!seat.occupied) {
      setSelectedSeat(seat);
      return;
    }

    const confirmRemove = window.confirm(
      `Seat ${seat.seat} থেকে ${seat.name ?? "Passenger"} কে remove করতে চান?`,
    );

    if (confirmRemove) {
      await updateSeatInFirebase(route, bogi, seat.seat, {
        occupied: false,
        name: null,
      });
    }
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!selectedSeat || !trimmedName) return;

    await updateSeatInFirebase(route, bogi, selectedSeat.seat, {
      occupied: true,
      name: trimmedName,
    });

    setSelectedSeat(null);
    setName("");
  };

  const openResetDialog = () => {
    setResetRoute(route);
    setResetBogi(bogi);
    setResetPassword("");
    setResetError("");
    setResetDialogOpen(true);
  };

  const handleResetSeats = async () => {
    if (resetPassword !== RESET_PASSWORD) {
      setResetError("Invalid admin password");
      return;
    }

    const emptySeats = makeEmptySeats(resetRoute, resetBogi);

    await set(ref(db, `seatStates/${resetRoute}/${resetBogi}`), emptySeats);

    setResetDialogOpen(false);
    setResetPassword("");
    setResetError("");
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-36">
      <div className="mx-auto max-w-6xl space-y-4 p-4">
        {/* Header */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-900">
                Train Seat Tracker
              </h1>
              <p className="text-sm text-slate-600">
                Route:{" "}
                <span className="font-semibold text-slate-900">{route}</span>
              </p>

              <p className="text-sm text-slate-600">
                Selected Bogi:{" "}
                <span className="font-semibold text-slate-900">{bogi}</span>
              </p>
            </div>

            <Button
              variant="destructive"
              onClick={openResetDialog}
              className="w-full sm:w-auto"
            >
              Reset Seats (only for admin)
            </Button>
          </div>
        </div>

        {/* Legend + summary */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-slate-900">
            Seat Status Guide
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                সবুজ = খালি সিট
              </div>

              <div className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                লাল = বুকড সিট
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <div className="rounded-full bg-slate-100 px-3 py-2 font-medium text-slate-700">
                মোট সিট: {seats.length}
              </div>
              <div className="rounded-full bg-green-100 px-3 py-2 font-medium text-green-700">
                খালি: {emptyCount}
              </div>
              <div className="rounded-full bg-red-100 px-3 py-2 font-medium text-red-700">
                বুকড: {bookedCount}
              </div>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            খালি সিটে click করলে নাম যোগ হবে। বুকড সিটে click করলে remove করার
            option আসবে।
          </p>
        </div>

        {/* Bogi selector */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-slate-900">
            Bogi Select করুন
          </h2>

          <div className="flex flex-wrap gap-2">
            {bogis.map((b) => (
              <Button
                key={b}
                variant={b === bogi ? "default" : "outline"}
                onClick={() => setBogi(b)}
                className={`min-w-[90px] font-semibold ${
                  b === bogi ? "ring-2 ring-offset-2" : ""
                }`}
              >
                Bogi {b}
              </Button>
            ))}
          </div>
        </div>

        {/* Seat grid */}
        <div>
          <h2 className="mb-3 text-base font-semibold text-slate-900">
            Seat List
          </h2>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {seats.map((seat) => {
              const isOccupied = seat.occupied;

              return (
                <Card
                  key={seat.seat}
                  onClick={() => handleSeatClick(seat)}
                  className={`cursor-pointer border-2 transition hover:scale-[1.02] ${
                    isOccupied
                      ? "border-red-200 bg-red-500 text-white hover:bg-red-600"
                      : "border-green-200 bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  <CardContent className="flex min-h-[110px] flex-col items-center justify-center gap-2 p-4 text-center">
                    <div className="text-lg font-bold">Seat {seat.seat}</div>

                    <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                      {isOccupied ? "Booked" : "Available"}
                    </div>

                    <div className="line-clamp-2 text-sm font-medium">
                      {seat.name ?? "খালি আছে"}
                    </div>

                    <div className="text-xs opacity-90">
                      {isOccupied
                        ? "Click to remove"
                        : "Click to add passenger"}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add passenger dialog */}
      <Dialog
        open={!!selectedSeat}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSeat(null);
            setName("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Seat {selectedSeat?.seat} - Passenger Add করুন
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Passenger name লিখুন"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />

            <Button onClick={handleSubmit} className="w-full">
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset dialog */}
      <Dialog
        open={resetDialogOpen}
        onOpenChange={(open) => {
          setResetDialogOpen(open);
          if (!open) {
            setResetPassword("");
            setResetError("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Reset</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <p className="text-sm text-slate-500">
              যেই route এবং bogi reset করতে চান, সেটা select করুন।
            </p>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Route</p>
              <div className="grid grid-cols-2 gap-2">
                {routeOptions.map((item) => (
                  <Button
                    key={item}
                    type="button"
                    variant={item === resetRoute ? "default" : "outline"}
                    onClick={() => handleResetRouteChange(item)}
                    className="h-auto whitespace-normal px-3 py-2 text-xs"
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Bogi</p>
              <div className="flex flex-wrap gap-2">
                {resetBogis.map((item) => (
                  <Button
                    key={item}
                    type="button"
                    variant={item === resetBogi ? "default" : "outline"}
                    onClick={() => setResetBogi(item)}
                  >
                    Bogi {item}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">
                Admin Password
              </p>
              <Input
                type="password"
                value={resetPassword}
                placeholder="Admin password"
                onChange={(e) => {
                  setResetPassword(e.target.value);
                  if (resetError) setResetError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleResetSeats();
                }}
              />
            </div>

            {resetError ? (
              <p className="text-sm font-medium text-red-500">{resetError}</p>
            ) : null}

            <Button
              variant="destructive"
              onClick={handleResetSeats}
              className="w-full"
            >
              Reset {resetRoute} - {resetBogi}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom route nav */}
      <div className="supports-[backdrop-filter]:bg-white/80 fixed bottom-0 left-0 right-0 z-30 border-t bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl p-2">
          <p className="mb-2 text-center text-xs font-medium text-slate-500">
            Route Select করুন
          </p>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {routeOptions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRouteChange(r)}
                className={`rounded-xl border px-2 py-3 text-center text-[11px] font-semibold transition sm:text-xs ${
                  route === r
                    ? "border-primary bg-primary text-primary-foreground shadow"
                    : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span className="block sm:hidden">{getShortRouteLabel(r)}</span>
                <span className="hidden sm:block">{r}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
