import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

/**
 * Line-icon set for the game. Every icon is a single-color outline drawn with
 * `currentColor`, so it inherits the color of the button or text it sits in.
 */
const LineIcon: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 18,
  className = '',
  children
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const IconClipboard: React.FC<IconProps> = (p) => (
  <LineIcon {...p}>
    <rect x="5" y="4.5" width="14" height="17" rx="2" />
    <path d="M9 4.5V3.5A1 1 0 0 1 10 2.5H14A1 1 0 0 1 15 3.5V4.5" />
    <rect x="9" y="3.5" width="6" height="3" rx="1" />
    <path d="M8.5 11.5L10 13L12.5 10.5" />
    <path d="M14 12H15.5" />
    <path d="M8.5 17H15.5" />
  </LineIcon>
);

export const IconDossier: React.FC<IconProps> = (p) => (
  <LineIcon {...p}>
    <path d="M3 7.5V18.5A1.5 1.5 0 0 0 4.5 20H19.5A1.5 1.5 0 0 0 21 18.5V9A1.5 1.5 0 0 0 19.5 7.5H11.5L9.5 5H4.5A1.5 1.5 0 0 0 3 6.5Z" />
    <circle cx="9" cy="13.5" r="2" />
    <path d="M6.5 17.5C6.9 16.4 7.8 15.8 9 15.8C10.2 15.8 11.1 16.4 11.5 17.5" />
    <path d="M14 12.5H18M14 15.5H17" />
  </LineIcon>
);

export const IconLupa: React.FC<IconProps> = (p) => (
  <LineIcon {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.3 15.3L21 21" strokeWidth={2.6} />
    <path d="M7.8 8.6C8.4 7.6 9.4 7 10.5 7" />
  </LineIcon>
);

export const IconPhone: React.FC<IconProps> = (p) => (
  <LineIcon {...p}>
    <path d="M3.5 8.5C3.5 6 7.5 4.5 12 4.5C16.5 4.5 20.5 6 20.5 8.5V9.5A1 1 0 0 1 19.5 10.5H17A1 1 0 0 1 16 9.5V8C14.6 7.6 9.4 7.6 8 8V9.5A1 1 0 0 1 7 10.5H4.5A1 1 0 0 1 3.5 9.5Z" />
    <path d="M6.5 12.5H17.5L18.5 20H5.5Z" />
    <path d="M10 15H10.01M12 15H12.01M14 15H14.01M10 17.5H10.01M12 17.5H12.01M14 17.5H14.01" strokeWidth={2.2} />
  </LineIcon>
);

export const IconStamp: React.FC<IconProps> = (p) => (
  <LineIcon {...p}>
    <path d="M9.5 10.5V8.5A2.5 2.5 0 1 1 14.5 8.5V10.5" />
    <path d="M9.5 10.5L8.5 13H15.5L14.5 10.5" />
    <rect x="4.5" y="13" width="15" height="4" rx="1" />
    <path d="M5 20.5H19" />
  </LineIcon>
);

export const IconStampReject: React.FC<IconProps> = (p) => (
  <LineIcon {...p}>
    <path d="M9.5 10.5V8.5A2.5 2.5 0 1 1 14.5 8.5V10.5" />
    <path d="M9.5 10.5L8.5 13H15.5L14.5 10.5" />
    <rect x="4.5" y="13" width="15" height="4" rx="1" />
    <path d="M10 19L14 22.5M14 19L10 22.5" />
  </LineIcon>
);

export const IconBell: React.FC<IconProps> = (p) => (
  <LineIcon {...p}>
    <path d="M12 6.5V4.5M10.5 4.5H13.5" />
    <path d="M4.5 17A7.5 7.5 0 0 1 19.5 17Z" />
    <path d="M3 20H21" />
  </LineIcon>
);

export const IconStarBadge: React.FC<IconProps> = (p) => (
  <LineIcon {...p}>
    <path d="M12 3.5L14.5 8.6L20 9.4L16 13.3L17 18.8L12 16.2L7 18.8L8 13.3L4 9.4L9.5 8.6Z" />
  </LineIcon>
);

export const IconWarningShield: React.FC<IconProps> = (p) => (
  <LineIcon {...p}>
    <path d="M12 3L19.5 6V11.5C19.5 16 16.3 19.6 12 21C7.7 19.6 4.5 16 4.5 11.5V6Z" />
    <path d="M12 8.5V12.5M12 15.5H12.01" strokeWidth={2.2} />
  </LineIcon>
);

export const IconCheckSeal: React.FC<IconProps> = (p) => (
  <LineIcon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 12.2L11 14.7L15.8 9.6" />
  </LineIcon>
);

export const IconDialogue: React.FC<IconProps> = (p) => (
  <LineIcon {...p}>
    <path d="M4.5 5.5H19.5A1.5 1.5 0 0 1 21 7V15A1.5 1.5 0 0 1 19.5 16.5H10L6 20V16.5H4.5A1.5 1.5 0 0 1 3 15V7A1.5 1.5 0 0 1 4.5 5.5Z" />
    <path d="M7.5 10H16.5M7.5 13H13" />
  </LineIcon>
);

export const IconNotebook: React.FC<IconProps> = (p) => (
  <LineIcon {...p}>
    <rect x="5.5" y="4" width="14" height="17.5" rx="1.5" />
    <path d="M3.5 7.5H7M3.5 11H7M3.5 14.5H7M3.5 18H7" />
    <path d="M10 9H16M10 12.5H16M10 16H14" />
  </LineIcon>
);

export const IconBook: React.FC<IconProps> = (p) => (
  <LineIcon {...p}>
    <path d="M12 6.5C10 5 7 4.5 3.5 5V18.5C7 18 10 18.5 12 20C14 18.5 17 18 20.5 18.5V5C17 4.5 14 5 12 6.5Z" />
    <path d="M12 6.5V20" />
  </LineIcon>
);

export const IconBolt: React.FC<IconProps> = (p) => (
  <LineIcon {...p}>
    <path d="M13 2.5L5 13.5H11.5L10.5 21.5L19 10H12.5Z" />
  </LineIcon>
);
