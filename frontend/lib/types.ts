
export type Role = "TOURIST" | "GUIDE" | "ADMIN";
export type Status = "ACTIVE" | "PENDING" | "SUSPENDED";

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  status: Status;
  createdAt: string;
}

export interface AuthResponse {
  token: string | null; // Null si le guide est PENDING
  id: number;
  fullName: string;
  email: string;
  role: Role;
}



export interface Place {
  id: number;
  name: string;
  description: string;
  city: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  status: "PENDING" | "ACTIVE"; // Matches Status enum
  createdAt: string; 
  proposedBy?:{ id: number; fullName: string } ;
}

export interface Activity {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  place: { id: number; name?: string; city?: string };
  guide?: { id: number; user?: { fullName: string } }; 
  status?: "ACTIVE" | "PENDING"; 
  placeId?: number; 
}
export interface Event {
  id: number;
  title: string;
  description: string;
  startDate: string; // LocalDate en Java devient string en TS
  endDate: string;
  location: string;
  status: "PENDING" | "ACTIVE"; // Aligné sur votre Enum Status
  proposedBy?: {
    id: number;
    fullName: string;
  };
}

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface Reservation {
  id: number;
  reservationDate: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  user?: { id: number; fullName: string; email: string };
  activity?: { id: number; title: string; price: number };
  circuit?: { id: number; title: string; price: number };
}


export interface Review {
  id: number;
  rating: number; 
  comment: string;
  createdAt: string;
  user?: {
    id: number;
    fullName: string;
  };
  place?: {
    id: number;
    name: string;
  };
}

export interface Place {
    id: number
    name: string
    description: string
    city: string
    imageUrl?: string
    createdAt: string
}

export interface Event {
    id: number
    title: string
    description: string
    startDate: string
    endDate: string
    location: string
    price: number
    maxParticipants?: number
    organizerId?: number
}

export interface Circuit {
  id: number;
  title: string;
  description: string;
  duration: string;
  price: number;
  status: "PENDING" | "ACTIVE";
  guideId?: number;
}

export interface Artisan {
  id: number;
  name: string;
  speciality: string;
  phone: string;
  city: string;
  status: "PENDING" | "ACTIVE";
  createdAt: string;
}

export type ReportStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface Report {
  id: number;
  reportType: string;
  description: string;
  createdAt: string;
  status: ReportStatus;
  reporter?: any;
}

