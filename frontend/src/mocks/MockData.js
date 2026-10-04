// mockData.js

export const mockUsers = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan.perez@example.com",
    password: "$2a$10$hashedpassword123",
    phone: "+541123456789",
    role: "PLAYER",
    deletedAt: null,
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-01-10T10:00:00.000Z",
  },
  {
    id: 2,
    name: "Carlos Gómez",
    email: "carlos.owner@example.com",
    password: "$2a$10$hashedpassword456",
    phone: "+541198765432",
    role: "FIELD_OWNER",
    deletedAt: null,
    createdAt: "2026-01-12T12:00:00.000Z",
    updatedAt: "2026-01-12T12:00:00.000Z",
  },
  {
    id: 3,
    name: "Admin Sistema",
    email: "admin@liga.com",
    password: "$2a$10$hashedpassword789",
    phone: "+541111112222",
    role: "ADMIN",
    deletedAt: null,
    createdAt: "2026-01-01T08:00:00.000Z",
    updatedAt: "2026-01-01T08:00:00.000Z",
  },
];

export const mockTeams = [
  {
    id: 1,
    name: "Los Crack F.C.",
    description: "Equipo de fútbol 5 de fin de semana",
    captainId: 1,
    deletedAt: null,
    createdAt: "2026-02-01T15:30:00.000Z",
    updatedAt: "2026-02-01T15:30:00.000Z",
  },
];

export const mockTeamMembers = [
  {
    userId: 1,
    teamId: 1,
  },
];

export const mockFields = [
  {
    id: 1,
    name: "Templo de Cracks",
    address: "Av. Napoleón Uriburu 198",
    latitude: "",
    longitude: "",
    price: 25000,
    imagen:
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=800&h=500&q=80",
    description: "Cancha de fútbol 5 con césped sintético",
    ownerId: "",
    deletedAt: null,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 2,
    name: "Top Game",
    address: "Córdoba 1225",
    latitude: "",
    longitude: "",
    price: 30000,
    imagen:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&h=500&q=80",
    description: "Complejo de canchas de fútbol 5 con césped sintético",
    ownerId: "",
    deletedAt: null,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 3,
    name: "La Francesca Fútbol 5",
    address: "Junín 1363",
    latitude: "",
    longitude: "",
    price: 35000,
    imagen:
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&h=500&q=80",
    description: "Cancha de fútbol 5 para partidos recreativos",
    ownerId: "",
    deletedAt: null,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 4,
    name: "La Recova Fútbol 5",
    address: "Av. Antártida Argentina 854",
    latitude: "",
    longitude: "",
    price: 25000,
    imagen:
      "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&h=500&q=80",
    description: "Complejo de canchas de fútbol 5",
    ownerId: "",
    deletedAt: null,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 5,
    name: "Las Cañitas Fútbol 5/7",
    address: "España 1150",
    latitude: "",
    longitude: "",
    price: 30000,
    imagen:
      "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?auto=format&fit=crop&w=800&h=500&q=80",
    description: "Complejo deportivo con canchas de fútbol 5 y 7",
    ownerId: "",
    deletedAt: null,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 6,
    name: "Kiwi Club",
    address: "Salta 3945",
    latitude: "",
    longitude: "",
    price: 35000,
    imagen:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&h=500&q=80",
    description:
      "Complejo deportivo con cancha de fútbol 5 de césped sintético",
    ownerId: "",
    deletedAt: null,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 7,
    name: "Vital Fútbol 5",
    address: "Carlos Brunelli 46",
    latitude: "",
    longitude: "",
    price: 25000,
    imagen:
      "https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=800&h=500&q=80",
    description: "Cancha de fútbol 5 con césped sintético",
    ownerId: "",
    deletedAt: null,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 8,
    name: "Complejo Costanera Fútbol 5 VAR",
    address: "Costanera de Formosa",
    latitude: "",
    longitude: "",
    price: 30000,
    imagen:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&h=500&q=80",
    description: "Complejo de fútbol 5 ubicado en la zona de la costanera",
    ownerId: "",
    deletedAt: null,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 9,
    name: "Le Club 2",
    address: "España 1900",
    latitude: "",
    longitude: "",
    price: 35000,
    imagen:
      "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=800&h=500&q=80",
    description: "Complejo deportivo para fútbol 5 y fútbol 7",
    ownerId: "",
    deletedAt: null,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 10,
    name: "Fútbol5 García",
    address: "B° Los Inmigrantes Mz34 C35",
    latitude: "",
    longitude: "",
    price: 25000,
    imagen:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&h=500&q=80",
    description: "Cancha de fútbol 5 para partidos recreativos",
    ownerId: "",
    deletedAt: null,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 11,
    name: "Le Club Fútbol YPF",
    address: "Av. Juan B. Cabral 4-98",
    latitude: "",
    longitude: "",
    price: 30000,
    imagen:
      "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=800&h=500&q=80",
    description: "Complejo deportivo con canchas de fútbol 5",
    ownerId: "",
    deletedAt: null,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: 12,
    name: "La Diez",
    address: "Av. Dr. Néstor Kirchner 5265",
    latitude: "",
    longitude: "",
    price: 35000,
    imagen:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&h=500&q=80",
    description:
      "Complejo de fútbol 5 con canchas de césped sintético e iluminación",
    ownerId: "",
    deletedAt: null,
    createdAt: "",
    updatedAt: "",
  },
];

export const mockFieldReservations = [
  {
    id: 1,
    fieldId: 1,
    userId: 1,
    date: "2026-10-05",
    startTime: "19:00:00",
    endTime: "20:00:00",
    status: "CONFIRMED", // 'PENDING' | 'CONFIRMED' | 'CANCELLED'
    deletedAt: null,
    createdAt: "2026-09-28T11:20:00.000Z",
    updatedAt: "2026-09-28T11:20:00.000Z",
  },
];

export const mockMatches = [
  {
    id: 1,
    teamId: 1,
    fieldId: 1, // Puede ser null si aún no se asignó cancha
    date: "2026-10-10",
    startTime: "21:00:00",
    endTime: "22:00:00",
    pricePerPlayer: 1500.0,
    status: "OPEN", // 'OPEN' | 'FULL' | 'FINISHED' | 'CANCELLED'
    deletedAt: null,
    createdAt: "2026-09-30T14:00:00.000Z",
    updatedAt: "2026-09-30T14:00:00.000Z",
  },
];

export const pasos = [
  {
    numero: 1,
    titulo: "Crea tu usuario",
    description: "Crea un usuario para que podamos anotarte en un partido",
  },
  {
    numero: 2,
    titulo: "Busca tu partido",
    description:
      "Busca entre multiples personas el partido que mas se adapte a lo que buscas",
  },
  {
    numero: 3,
    titulo: "Contacta con el organizador",
    description: "Contacta con el organizador y ponete los botines",
  },
];
