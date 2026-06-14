import { useTheme, getTheme } from './ThemeContext';
import { useIsMobile } from '../hooks/use-mobile';

export const CheckboxO = ({ size = 20 }: { size?: number }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: Math.max(3, size * 0.2),
      background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #A855F7 100%)',
      flexShrink: 0,
      boxShadow: '0 0 14px rgba(139, 92, 246, 0.65), inset 0 1px 0 rgba(255,255,255,0.2)',
      verticalAlign: 'middle',
      position: 'relative',
      top: '-1px',
    }}
  >
    <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 10 10" fill="none">
      <path
        d="M1.5 5L4 7.5L8.5 2.5"
        stroke="white"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

interface AvoraLogoProps {
  size?: 'sm' | 'default' | 'lg' | 'hero';
  forceLight?: boolean;
}

export function AvoraLogo({ size = 'default', forceLight }: AvoraLogoProps) {
  const { isDark } = useTheme();
  const dark = forceLight ? false : isDark;
  const t = getTheme(dark);
  const isMobile = useIsMobile();

  const fontSizes = { sm: 15, default: 21, lg: 26, hero: isMobile ? 48 : 96 };
  const checkSizes = { sm: 13, default: 17, lg: 22, hero: isMobile ? 36 : 72 };
  const gaps = { sm: 1, default: 2, lg: 3, hero: isMobile ? 4 : 8 };

  const fs = fontSizes[size];
  const cs = checkSizes[size];
  const gap = gaps[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: gap,
        fontSize: fs,
        fontWeight: 800,
        letterSpacing: '0.12em',
        color: t.text,
        userSelect: 'none',
        lineHeight: 1,
      }}
    >
      AV
      <CheckboxO size={cs} />
      RA
    </span>
  );
}
