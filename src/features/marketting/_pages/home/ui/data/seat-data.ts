// export type RouteKey =
//   | "রাজশাহী-ঢাকা"
//   | "ঢাকা-চট্টগ্রাম"
//   | "কক্সবাজার-ঢাকা"
//   | "কক্সবাজার-চট্টগ্রাম"
//   | "চট্টগ্রাম-ঢাকা"
//   | "ঢাকা-রাজশাহী";

// export type SeatItem = {
//   seat: number;
//   occupied: boolean;
//   name: string | null;
// };

// export type CoachRaw = {
//   bogi: string;
//   seats: number[];
// };

// export type RouteRaw = {
//   train_no: number | null;
//   route: RouteKey;
//   coaches: CoachRaw[];
// };

// export type BogiSeatMap = Record<string, SeatItem[]>;
// export type RouteSeatMap = Record<RouteKey, BogiSeatMap>;

// const createSeatItems = (seats: number[]): SeatItem[] =>
//   [...new Set(seats)]
//     .sort((a, b) => a - b)
//     .map((seat) => ({
//       seat,
//       occupied: false,
//       name: null,
//     }));

// export const rawRoutes: RouteRaw[] = [
//   {
//     train_no: 48,
//     route: "রাজশাহী-ঢাকা",
//     coaches: [
//       { bogi: "খ", seats: [33, 34, 35, 36] },
//       {
//         bogi: "ঙ",
//         seats: [43, 46, 47, 48, 51, 52, 53, 56, 57, 58, 61, 62, 63, 66, 67, 68],
//       },
//       {
//         bogi: "চ",
//         seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 51, 52, 53, 54, 69, 70],
//       },
//       { bogi: "ছ", seats: [14, 15, 59, 60] },
//       { bogi: "জ", seats: [9, 10, 16, 26, 27, 28, 64, 65] },
//     ],
//   },
//   {
//     train_no: 50,
//     route: "ঢাকা-চট্টগ্রাম",
//     coaches: [
//       { bogi: "গ", seats: [11, 12] },
//       {
//         bogi: "ড",
//         seats: [3, 4, 15, 25, 26, 27, 28, 39, 40, 43, 44, 49, 53, 54, 55, 56],
//       },
//       { bogi: "ঢ", seats: [27, 28] },
//       {
//         bogi: "ত",
//         seats: [13, 14, 25, 26, 27, 28, 39, 40, 41, 42, 43, 44, 49, 50],
//       },
//       {
//         bogi: "থ",
//         seats: [23, 24, 27, 28, 37, 38, 39, 40, 45, 46, 47, 48, 53, 54, 57, 58],
//       },
//     ],
//   },
//   {
//     train_no: 41,
//     route: "কক্সবাজার-ঢাকা",
//     coaches: [
//       { bogi: "ক", seats: [2, 3, 10, 11, 15] },
//       { bogi: "ঞ", seats: [38, 50, 53, 54] },
//       { bogi: "ট", seats: [1, 3, 4, 7, 8, 11, 15, 22, 53] },
//       { bogi: "ঠ", seats: [1, 3, 11, 12, 13, 35, 48, 58, 59] },
//       { bogi: "ড", seats: [60] },
//       { bogi: "ঢ", seats: [3, 4, 9, 10, 11, 14, 15, 16, 31, 42, 49, 52] },
//       { bogi: "ন", seats: [8] },
//     ],
//   },
//   {
//     train_no: null,
//     route: "কক্সবাজার-চট্টগ্রাম",
//     coaches: [{ bogi: "জ", seats: [33, 34, 51, 53] }],
//   },
//   {
//     train_no: null,
//     route: "চট্টগ্রাম-ঢাকা",
//     coaches: [{ bogi: "জ", seats: [40, 50, 55, 56] }],
//   },
//   {
//     train_no: 44,
//     route: "ঢাকা-রাজশাহী",
//     coaches: [
//       {
//         bogi: "ড",
//         seats: [
//           10, 11, 15, 16, 19, 20, 21, 22, 23, 24, 25, 30, 31, 32, 35, 36, 37, 38,
//           39, 41, 45, 46, 50, 51, 52, 53, 54, 55, 57, 58, 59, 62, 63, 64, 67, 68,
//           69, 70, 71, 72, 75, 76, 80, 81,
//         ],
//       },
//     ],
//   },
// ];

// export const seatDataByRoute: RouteSeatMap = rawRoutes.reduce(
//   (acc, routeItem) => {
//     acc[routeItem.route] = routeItem.coaches.reduce((coachAcc, coach) => {
//       coachAcc[coach.bogi] = createSeatItems(coach.seats);
//       return coachAcc;
//     }, {} as BogiSeatMap);

//     return acc;
//   },
//   {} as RouteSeatMap,
// );

// export const routeOptions: RouteKey[] = rawRoutes.map((item) => item.route);

// export const getBogisByRoute = (route: RouteKey): string[] =>
//   Object.keys(seatDataByRoute[route] || {});

// export const getSeatsByRouteAndBogi = (
//   route: RouteKey,
//   bogi: string,
// ): SeatItem[] => seatDataByRoute[route]?.[bogi] ?? [];

// export const getTrainNoByRoute = (route: RouteKey): number | null =>
//   rawRoutes.find((item) => item.route === route)?.train_no ?? null;


export type RouteKey =
  | "রাজশাহী-ঢাকা"
  | "ঢাকা-চট্টগ্রাম"
  | "কক্সবাজার-ঢাকা"
  | "কক্সবাজার-চট্টগ্রাম"
  | "চট্টগ্রাম-ঢাকা"
  | "ঢাকা-রাজশাহী";

export type SeatItem = {
  seat: number;
  occupied: boolean;
  name: string | null;
};

export type CoachRaw = {
  bogi: string;
  seats: number[];
};

export type RouteRaw = {
  train_no: number | null;
  route: RouteKey;
  coaches: CoachRaw[];
};

export type BogiSeatMap = Record<string, SeatItem[]>;
export type RouteSeatMap = Record<RouteKey, BogiSeatMap>;

export type FirebaseSeatState = {
  occupied?: boolean;
  name?: string | null;
};

export type FirebaseSeatStateMap = Partial<
  Record<RouteKey, Record<string, Record<string, FirebaseSeatState>>>
>;

const createSeatItems = (seats: number[]): SeatItem[] =>
  [...new Set(seats)]
    .sort((a, b) => a - b)
    .map((seat) => ({
      seat,
      occupied: false,
      name: null,
    }));

export const rawRoutes: RouteRaw[] = [
  {
    train_no: 48,
    route: "রাজশাহী-ঢাকা",
    coaches: [
      { bogi: "খ", seats: [33, 34, 35, 36] },
      {
        bogi: "ঙ",
        seats: [43, 46, 47, 48, 51, 52, 53, 56, 57, 58, 61, 62, 63, 66, 67, 68],
      },
      {
        bogi: "চ",
        seats: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 51, 52, 53, 54, 69, 70],
      },
      { bogi: "ছ", seats: [14, 15, 59, 60] },
      { bogi: "জ", seats: [9, 10, 16, 26, 27, 28, 64, 65] },
    ],
  },
  {
    train_no: 50,
    route: "ঢাকা-চট্টগ্রাম",
    coaches: [
      { bogi: "গ", seats: [11, 12] },
      {
        bogi: "ড",
        seats: [3, 4, 15, 25, 26, 27, 28, 39, 40, 43, 44, 49, 53, 54, 55, 56],
      },
      { bogi: "ঢ", seats: [27, 28] },
      {
        bogi: "ত",
        seats: [13, 14, 25, 26, 27, 28, 39, 40, 41, 42, 43, 44, 49, 50],
      },
      {
        bogi: "থ",
        seats: [23, 24, 27, 28, 37, 38, 39, 40, 45, 46, 47, 48, 53, 54, 57, 58],
      },
    ],
  },
  {
    train_no: 41,
    route: "কক্সবাজার-ঢাকা",
    coaches: [
      { bogi: "ক", seats: [2, 3, 10, 11, 15] },
      { bogi: "ঞ", seats: [38, 50, 53, 54] },
      { bogi: "ট", seats: [1, 3, 4, 7, 8, 11, 15, 22, 53] },
      { bogi: "ঠ", seats: [1, 3, 11, 12, 13, 35, 48, 58, 59] },
      { bogi: "ড", seats: [60] },
      { bogi: "ঢ", seats: [3, 4, 9, 10, 11, 14, 15, 16, 31, 42, 49, 52] },
      { bogi: "ন", seats: [8] },
    ],
  },
  {
    train_no: null,
    route: "কক্সবাজার-চট্টগ্রাম",
    coaches: [{ bogi: "জ", seats: [33, 34, 51, 53] }],
  },
  {
    train_no: null,
    route: "চট্টগ্রাম-ঢাকা",
    coaches: [{ bogi: "জ", seats: [40, 50, 55, 56] }],
  },
  {
    train_no: 44,
    route: "ঢাকা-রাজশাহী",
    coaches: [
      {
        bogi: "ড",
        seats: [
          10, 11, 15, 16, 19, 20, 21, 22, 23, 24, 25, 30, 31, 32, 35, 36, 37, 38,
          39, 41, 45, 46, 50, 51, 52, 53, 54, 55, 57, 58, 59, 62, 63, 64, 67, 68,
          69, 70, 71, 72, 75, 76, 80, 81,
        ],
      },
    ],
  },
];

export const seatDataByRoute: RouteSeatMap = rawRoutes.reduce(
  (acc, routeItem) => {
    acc[routeItem.route] = routeItem.coaches.reduce((coachAcc, coach) => {
      coachAcc[coach.bogi] = createSeatItems(coach.seats);
      return coachAcc;
    }, {} as BogiSeatMap);

    return acc;
  },
  {} as RouteSeatMap,
);

export const routeOptions: RouteKey[] = rawRoutes.map((item) => item.route);

export const getBogisByRoute = (route: RouteKey): string[] =>
  Object.keys(seatDataByRoute[route] ?? {});

export const getSeatsByRouteAndBogi = (
  route: RouteKey,
  bogi: string,
): SeatItem[] => seatDataByRoute[route]?.[bogi] ?? [];

export const getTrainNoByRoute = (route: RouteKey): number | null =>
  rawRoutes.find((item) => item.route === route)?.train_no ?? null;

export const mergeSeatStateWithFirebase = (
  route: RouteKey,
  bogi: string,
  firebaseState?: FirebaseSeatStateMap,
): SeatItem[] => {
  const baseSeats = getSeatsByRouteAndBogi(route, bogi);
  const liveSeatMap = firebaseState?.[route]?.[bogi] ?? {};

  return baseSeats.map((seatItem) => {
    const liveSeat = liveSeatMap[String(seatItem.seat)];

    return {
      seat: seatItem.seat,
      occupied: liveSeat?.occupied ?? false,
      name: liveSeat?.name ?? null,
    };
  });
};

export const createEmptySeatStateObject = (route: RouteKey, bogi: string) => {
  const seats = getSeatsByRouteAndBogi(route, bogi);

  return Object.fromEntries(
    seats.map((seat) => [
      String(seat.seat),
      {
        occupied: false,
        name: null,
      },
    ]),
  ) as Record<string, FirebaseSeatState>;
};