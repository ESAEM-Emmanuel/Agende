import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const defaults = (size = 20) => ({
  width: size,
  height: size,
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  'aria-hidden': true as const,
});

export function IconMenu({ size = 24, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function IconClose({ size = 24, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function IconSearch({ size = 20, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function IconPlus({ size = 20, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconUsers({ size = 20, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function IconChart({ size = 20, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  );
}

export function IconCalendar({ size = 20, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export function IconLogout({ size = 20, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

export function IconDownload({ size = 20, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
  );
}

export function IconPrint({ size = 20, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

export function IconChevronLeft({ size = 20, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function IconChevronRight({ size = 20, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function IconEye({ size = 20, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconEyeOff({ size = 20, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

export function IconCheck({ size = 20, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function IconAlert({ size = 20, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

export function IconArrowLeft({ size = 20, ...p }: IconProps) {
  return (
    <svg {...defaults(size)} {...p}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
