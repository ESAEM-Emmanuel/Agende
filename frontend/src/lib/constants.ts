/** Constantes UI partagées — types RDV, statuts, rôles, couleurs. */

export const TYPE_COLORS: Record<string, { bg: string; border: string; text: string; hex: string }> = {
  REUNION: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-800', hex: '#3b82f6' },
  DEJEUNER: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-800', hex: '#f59e0b' },
  VISITE: { bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-800', hex: '#10b981' },
  VISIO: { bg: 'bg-violet-50', border: 'border-violet-500', text: 'text-violet-800', hex: '#8b5cf6' },
  PERSO: { bg: 'bg-gray-50', border: 'border-gray-400', text: 'text-gray-700', hex: '#9ca3af' },
  AUTRE: { bg: 'bg-pink-50', border: 'border-pink-500', text: 'text-pink-800', hex: '#ec4899' },
};

export const TYPE_LABELS: Record<string, string> = {
  REUNION: 'Réunion',
  DEJEUNER: 'Déjeuner',
  VISITE: 'Visite',
  VISIO: 'Visioconférence',
  PERSO: 'Personnel',
  AUTRE: 'Autre',
};

export const TYPE_LABELS_FULL: Record<string, string> = {
  REUNION: 'Réunion',
  DEJEUNER: "Déjeuner d'affaires",
  VISITE: 'Visite / Déplacement',
  VISIO: 'Visioconférence',
  PERSO: 'Personnel / Bloqué',
  AUTRE: 'Autre',
};

export const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: 'Confirmé',
  PENDING: 'En attente',
  CANCELLED: 'Annulé',
  DONE: 'Terminé',
};

export const STATUS_STYLES: Record<string, { text: string; bg: string; color: string; className: string }> = {
  CONFIRMED: { text: 'Confirmé', bg: '#d1fae5', color: '#065f46', className: 'bg-emerald-100 text-emerald-800' },
  PENDING: { text: 'En attente', bg: '#fef3c7', color: '#92400e', className: 'bg-amber-100 text-amber-800' },
  CANCELLED: { text: 'Annulé', bg: '#fee2e2', color: '#991b1b', className: 'bg-red-100 text-red-800' },
  DONE: { text: 'Terminé', bg: '#dbeafe', color: '#1e40af', className: 'bg-blue-100 text-blue-800' },
};

export const STATUS_OPACITY: Record<string, string> = {
  CANCELLED: 'opacity-40 line-through',
  DONE: 'opacity-70',
};

export const PRIORITY_LABELS: Record<string, string> = {
  HIGH: 'Haute',
  NORMAL: 'Normale',
  LOW: 'Basse',
};

export const ROLE_LABELS: Record<string, string> = {
  DIRECTOR: 'Directeur',
  ASSISTANT: 'Assistant(e)',
  ADMIN: 'Administrateur',
};

export const ROLE_COLORS: Record<string, string> = {
  DIRECTOR: 'bg-emerald-100 text-emerald-800',
  ASSISTANT: 'bg-blue-100 text-blue-800',
  ADMIN: 'bg-purple-100 text-purple-800',
};

/** Hex colors for Recharts */
export const TYPE_HEX: Record<string, string> = Object.fromEntries(
  Object.entries(TYPE_COLORS).map(([k, v]) => [k, v.hex])
);
