export interface User {
  id: number
  fullName: string
  email: string
  phone?: string
  role: "TOURIST" | "GUIDE" | "ADMIN"
  status: "ACTIVE" | "SUSPENDED"
  createdAt: string
}

export interface Place {
  id: number
  name: string
  description: string
  city: string
  latitude: number
  longitude: number
  imageUrl?: string
  createdAt: string
}

export interface Activity {
  id: number
  title: string
  description: string
  price: number
  duration: string
  placeId: number
  guideId: number
  place?: Place
  guide?: User
}

export interface Event {
  id: number
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
}

export interface Reservation {
  id: number
  userId: number
  activityId?: number
  circuitId?: number
  reservationDate: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED"
  user?: User
  activity?: Activity
}

export interface Review {
  id: number
  userId: number
  placeId: number
  rating: number
  comment: string
  createdAt: string
  user?: User
  place?: Place
}

export interface AuthResponse {
  token: string
  id: number
  fullName: string
  email: string
  role: string
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

export interface User {
    id: number
    fullName: string
    email: string
    role: 'TOURIST' | 'GUIDE' | 'ADMIN'
    phone?: string
}

export interface AuthResponse {
    id: number
    fullName: string
    email: string
    role: string
    token: string
}