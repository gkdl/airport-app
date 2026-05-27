import type { Config } from 'tailwindcss';
import { colors, spacing, fontSize } from '@airport-app/tokens';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        congestion: colors.congestion,
        status: colors.status,
      },
      spacing: Object.fromEntries(
        Object.entries(spacing).map(([k, v]) => [k, `${v}px`])
      ),
      fontSize: Object.fromEntries(
        Object.entries(fontSize).map(([k, v]) => [k, `${v}px`])
      ),
    },
  },
  plugins: [],
};

export default config;
