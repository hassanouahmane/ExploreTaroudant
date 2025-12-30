
export type Role = "TOURIST" | "GUIDE" | "ADMIN";
export type Status = "ACTIVE" | "PENDING" | "SUSPENDED";

export interface Guide {
  id: number;
  bio: string;
  languages: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  status: Status;
  createdAt: string;
  guide?: Guide; 
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
  imageUrl?: string; // Ajouté pour l'image de l'activité
  place?: { id: number; name: string; city: string }; // Rendu optionnel et typé
  guide?: { id: number; fullName?: string; user?: { fullName: string } }; // Rendu optionnel et typé
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
  reservationDate: string; // Format ISO string venant du backend
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  
  // ICI : On autorise activity OU circuit à être undefined
  activity?: Activity; 
  circuit?: Circuit;
  
  // Info user si besoin
  user?: { id: number; fullName: string };
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

