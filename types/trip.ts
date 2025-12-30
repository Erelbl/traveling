export type TravelStyle = 
  | "honeymoon" 
  | "family" 
  | "post-army" 
  | "urban" 
  | "other";

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  travelersCount: number;
  travelStyle: TravelStyle;
  createdAt: string;
}

export const TRAVEL_STYLE_LABELS: Record<TravelStyle, string> = {
  honeymoon: "ירח דבש",
  family: "טיול משפחתי",
  "post-army": "טיול אחרי צבא",
  urban: "חופשה אורבנית",
  other: "אחר",
};

