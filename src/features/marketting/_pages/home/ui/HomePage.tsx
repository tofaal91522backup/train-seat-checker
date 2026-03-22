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
import { onValue, ref, update, set } from "firebase/database";
import { useEffect, useMemo, useState } from "react";
import {
  getBogisByRoute,
  getSeatsByRouteAndBogi,
  getTrainNoByRoute,
  RouteKey,
  routeOptions,
  SeatItem,
} from "./data/seat-data";

type SeatStateMap = Partial<Record<RouteKey, Record<string, any>>>;

const RESET_PASSWORD = "tofaal9152";

const makeEmptySeats = (route: RouteKey, bogi: string) => {
  const seats = getSeatsByRouteAndBogi(route, bogi);

  return Object.fromEntries(
    seats.map((seat) => [seat.seat, { occupied: false, name: null }]),
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
  const [route, setRoute] = useState<RouteKey>(routeOptions[0]);
  const [bogi, setBogi] = useState(getBogisByRoute(routeOptions[0])[0]);
  const [seatsState, setSeatsState] = useState<SeatStateMap>({});
  const [selectedSeat, setSelectedSeat] = useState<SeatItem | null>(null);
  const [name, setName] = useState("");

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [resetRoute, setResetRoute] = useState<RouteKey>(routeOptions[0]);
  const [resetBogi, setResetBogi] = useState(
    getBogisByRoute(routeOptions[0])[0],
  );
  const [resetError, setResetError] = useState("");

  // 🔥 Realtime read
  useEffect(() => {
    const seatRef = ref(db, "seatStates");

    return onValue(seatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setSeatsState(data);
    });
  }, []);

  const bogis = useMemo(() => getBogisByRoute(route), [route]);

  const seats = useMemo(() => {
    const firebaseSeats = seatsState?.[route]?.[bogi];

    if (!firebaseSeats) {
      return getSeatsByRouteAndBogi(route, bogi);
    }

    return Object.entries(firebaseSeats).map(([seat, data]: any) => ({
      seat: Number(seat),
      name: data?.name ?? null,
      occupied: data?.occupied ?? false,
    }));
  }, [route, bogi, seatsState]);

  const resetBogis = useMemo(() => getBogisByRoute(resetRoute), [resetRoute]);
  const trainNo = useMemo(() => getTrainNoByRoute(route), [route]);

  // 🔥 Firebase update
  const updateSeatInFirebase = async (
    seatNo: number,
    payload: { occupied: boolean; name: string | null },
  ) => {
    await update(ref(db), {
      [`seatStates/${route}/${bogi}/${seatNo}`]: payload,
    });
  };

  // 🔥 Click
  const handleSeatClick = async (seat: SeatItem) => {
    if (!seat.name) {
      setSelectedSeat(seat);
      return;
    }

    const confirmRemove = window.confirm(
      `Remove ${seat.name} from seat ${seat.seat}?`,
    );

    if (confirmRemove) {
      await updateSeatInFirebase(seat.seat, {
        occupied: false,
        name: null,
      });
    }
  };

  // 🔥 Add name
  const handleSubmit = async () => {
    if (!selectedSeat || !name.trim()) return;

    await updateSeatInFirebase(selectedSeat.seat, {
      occupied: true,
      name: name.trim(),
    });

    setSelectedSeat(null);
    setName("");
  };

  // 🔥 Reset
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
    <main className="min-h-screen bg-slate-50 pb-32">
      <div className="mx-auto max-w-6xl p-4 space-y-4">
        <div className="bg-white p-4 rounded-xl border flex justify-between">
          <div>
            <h1 className="font-bold">Train Seat Tracker</h1>
            <p>{route}</p>
            <p>Train: {trainNo ?? "N/A"}</p>
          </div>

          <Button
            variant="destructive"
            onClick={() => setResetDialogOpen(true)}
          >
            Reset
          </Button>
        </div>

        {/* Bogi */}
        <div className="bg-white p-4 rounded-xl border flex flex-wrap gap-2">
          {bogis.map((b) => (
            <Button
              key={b}
              variant={b === bogi ? "default" : "outline"}
              onClick={() => setBogi(b)}
            >
              {b}
            </Button>
          ))}
        </div>

        {/* Seats */}
        <div className="grid grid-cols-2 gap-3">
          {seats.map((seat) => (
            <Card
              key={seat.seat}
              onClick={() => handleSeatClick(seat)}
              className={`cursor-pointer ${
                seat.name ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}
            >
              <CardContent className="h-20 flex flex-col justify-center items-center">
                <div>{seat.seat}</div>
                <div>{seat.name ?? "Empty"}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add dialog */}
      <Dialog open={!!selectedSeat} onOpenChange={() => setSelectedSeat(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seat {selectedSeat?.seat}</DialogTitle>
          </DialogHeader>

          <Input value={name} onChange={(e) => setName(e.target.value)} />

          <Button onClick={handleSubmit}>Confirm</Button>
        </DialogContent>
      </Dialog>

      {/* Reset dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Reset</DialogTitle>
          </DialogHeader>

          <Input
            type="password"
            value={resetPassword}
            onChange={(e) => setResetPassword(e.target.value)}
          />

          {resetError && <p className="text-red-500">{resetError}</p>}

          <Button onClick={handleResetSeats}>Reset</Button>
        </DialogContent>
      </Dialog>

      {/* Bottom nav */}

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-2 p-2 sm:grid-cols-6">
          {routeOptions.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoute(r)}
              className={`rounded-xl px-2 py-2 text-center text-[11px] font-medium transition sm:text-xs ${
                route === r
                  ? "bg-primary text-primary-foreground"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              <span className="block sm:hidden">{getShortRouteLabel(r)}</span>
              <span className="hidden sm:block">{r}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
