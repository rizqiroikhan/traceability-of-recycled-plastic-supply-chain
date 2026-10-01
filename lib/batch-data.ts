export type BatchStatus = "Collected" | "Processing" | "Ready" | "Delivered";

export type JourneyStage = {
  stage: string;
  location: string;
  date: string;
  completed: boolean;
};

export type Batch = {
  id: string;
  material: "PET" | "HDPE" | "PP";
  source: string;
  weightKg: number;
  status: BatchStatus;
  collectionDate: string;
  currentLocation: string;
  destination: string;
  recycledContentPercent: number;
  journey: JourneyStage[];
};

export const batches: Batch[] = [
  {
    id: "RP-2026-001",
    material: "PET",
    source: "Jakarta Community Collection Hub",
    weightKg: 2450,
    status: "Delivered",
    collectionDate: "2026-01-14",
    currentLocation: "Bandung Bottling Plant",
    destination: "Bandung Bottling Plant",
    recycledContentPercent: 82,
    journey: [
      { stage: "Collected", location: "Jakarta Community Collection Hub", date: "2026-01-14", completed: true },
      { stage: "Sorted", location: "Bekasi Materials Recovery Facility", date: "2026-01-16", completed: true },
      { stage: "Washed & Flaked", location: "Bekasi Materials Recovery Facility", date: "2026-01-19", completed: true },
      { stage: "Pelletized", location: "Karawang Recycling Works", date: "2026-01-23", completed: true },
      { stage: "Delivered", location: "Bandung Bottling Plant", date: "2026-01-27", completed: true },
    ],
  },
  {
    id: "RP-2026-002",
    material: "HDPE",
    source: "Surabaya Retail Take-back Network",
    weightKg: 3180,
    status: "Ready",
    collectionDate: "2026-02-03",
    currentLocation: "Surabaya Polymer Works",
    destination: "Sidoarjo Homecare Factory",
    recycledContentPercent: 76,
    journey: [
      { stage: "Collected", location: "Surabaya Retail Take-back Network", date: "2026-02-03", completed: true },
      { stage: "Sorted", location: "Gresik Sorting Center", date: "2026-02-05", completed: true },
      { stage: "Washed & Flaked", location: "Gresik Sorting Center", date: "2026-02-08", completed: true },
      { stage: "Pelletized", location: "Surabaya Polymer Works", date: "2026-02-14", completed: true },
      { stage: "Delivered", location: "Sidoarjo Homecare Factory", date: "Upcoming", completed: false },
    ],
  },
  {
    id: "RP-2026-003",
    material: "PP",
    source: "Semarang Port Recovery Program",
    weightKg: 1890,
    status: "Processing",
    collectionDate: "2026-02-18",
    currentLocation: "Semarang Sorting Center",
    destination: "Cikarang Packaging Plant",
    recycledContentPercent: 68,
    journey: [
      { stage: "Collected", location: "Semarang Port Recovery Program", date: "2026-02-18", completed: true },
      { stage: "Sorted", location: "Semarang Sorting Center", date: "2026-02-20", completed: true },
      { stage: "Washed & Flaked", location: "Semarang Sorting Center", date: "In progress", completed: false },
      { stage: "Pelletized", location: "Cikarang Polymer Works", date: "Upcoming", completed: false },
      { stage: "Delivered", location: "Cikarang Packaging Plant", date: "Upcoming", completed: false },
    ],
  },
  {
    id: "RP-2026-004",
    material: "PET",
    source: "Bali Hospitality Collection Co-op",
    weightKg: 1275,
    status: "Collected",
    collectionDate: "2026-03-02",
    currentLocation: "Denpasar Consolidation Depot",
    destination: "Tangerang Fiber Mill",
    recycledContentPercent: 71,
    journey: [
      { stage: "Collected", location: "Denpasar Consolidation Depot", date: "2026-03-02", completed: true },
      { stage: "Sorted", location: "Denpasar Consolidation Depot", date: "Upcoming", completed: false },
      { stage: "Washed & Flaked", location: "Tangerang Recycling Works", date: "Upcoming", completed: false },
      { stage: "Pelletized", location: "Tangerang Recycling Works", date: "Upcoming", completed: false },
      { stage: "Delivered", location: "Tangerang Fiber Mill", date: "Upcoming", completed: false },
    ],
  },
  {
    id: "RP-2026-005",
    material: "HDPE",
    source: "Medan Household Plastic Drive",
    weightKg: 2640,
    status: "Delivered",
    collectionDate: "2026-01-26",
    currentLocation: "Medan Consumer Goods Plant",
    destination: "Medan Consumer Goods Plant",
    recycledContentPercent: 88,
    journey: [
      { stage: "Collected", location: "Medan Household Plastic Drive", date: "2026-01-26", completed: true },
      { stage: "Sorted", location: "Deli Serdang Recovery Facility", date: "2026-01-29", completed: true },
      { stage: "Washed & Flaked", location: "Deli Serdang Recovery Facility", date: "2026-02-02", completed: true },
      { stage: "Pelletized", location: "Medan Polymer Works", date: "2026-02-07", completed: true },
      { stage: "Delivered", location: "Medan Consumer Goods Plant", date: "2026-02-11", completed: true },
    ],
  },
  {
    id: "RP-2026-006",
    material: "PP",
    source: "Makassar Fishing Community Network",
    weightKg: 980,
    status: "Processing",
    collectionDate: "2026-03-09",
    currentLocation: "Makassar Coastal Recovery Center",
    destination: "Surabaya Automotive Supplier",
    recycledContentPercent: 64,
    journey: [
      { stage: "Collected", location: "Makassar Coastal Recovery Center", date: "2026-03-09", completed: true },
      { stage: "Sorted", location: "Makassar Coastal Recovery Center", date: "2026-03-11", completed: true },
      { stage: "Washed & Flaked", location: "Makassar Coastal Recovery Center", date: "In progress", completed: false },
      { stage: "Pelletized", location: "Surabaya Polymer Works", date: "Upcoming", completed: false },
      { stage: "Delivered", location: "Surabaya Automotive Supplier", date: "Upcoming", completed: false },
    ],
  },
  {
    id: "RP-2026-007",
    material: "PET",
    source: "Yogyakarta Campus Recycling Alliance",
    weightKg: 1560,
    status: "Ready",
    collectionDate: "2026-02-24",
    currentLocation: "Solo Reprocessing Facility",
    destination: "Yogyakarta Textile Mill",
    recycledContentPercent: 79,
    journey: [
      { stage: "Collected", location: "Yogyakarta Campus Recycling Alliance", date: "2026-02-24", completed: true },
      { stage: "Sorted", location: "Solo Reprocessing Facility", date: "2026-02-26", completed: true },
      { stage: "Washed & Flaked", location: "Solo Reprocessing Facility", date: "2026-03-01", completed: true },
      { stage: "Pelletized", location: "Solo Reprocessing Facility", date: "2026-03-06", completed: true },
      { stage: "Delivered", location: "Yogyakarta Textile Mill", date: "Upcoming", completed: false },
    ],
  },
  {
    id: "RP-2026-008",
    material: "HDPE",
    source: "Bandung Industrial Offcut Exchange",
    weightKg: 2210,
    status: "Collected",
    collectionDate: "2026-03-12",
    currentLocation: "Bandung Collection Yard",
    destination: "Karawang Pipe Manufacturer",
    recycledContentPercent: 73,
    journey: [
      { stage: "Collected", location: "Bandung Collection Yard", date: "2026-03-12", completed: true },
      { stage: "Sorted", location: "Bandung Collection Yard", date: "Upcoming", completed: false },
      { stage: "Washed & Flaked", location: "Karawang Recycling Works", date: "Upcoming", completed: false },
      { stage: "Pelletized", location: "Karawang Recycling Works", date: "Upcoming", completed: false },
      { stage: "Delivered", location: "Karawang Pipe Manufacturer", date: "Upcoming", completed: false },
    ],
  },
];

export function getBatch(id: string) {
  return batches.find((batch) => batch.id === id);
}
