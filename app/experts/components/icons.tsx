import type { ComponentType } from "react";
import {
  Activity,
  Brush,
  CalendarClock,
  CalendarRange,
  CircleDollarSign,
  Dumbbell,
  Eye,
  Fingerprint,
  Flower2,
  Gem,
  Globe,
  HandHeart,
  Heart,
  Languages,
  LayoutGrid,
  Leaf,
  type LucideProps,
  MapPin,
  PenTool,
  Scissors,
  Slice,
  Sparkles,
  Sprout,
  Star,
  Stethoscope,
  Trophy,
  Users,
  Wand2,
  Waves,
  Wifi,
} from "lucide-react";

type IconComponent = ComponentType<LucideProps>;

const ICONS: Record<string, IconComponent> = {
  // Top categories
  therapists: Stethoscope,
  coaches: Trophy,
  trainers: Dumbbell,
  wellness: Leaf,
  health: Heart,
  beauty: Sparkles,
  lifestyle: Sprout,
  more: LayoutGrid,

  // Sub-categories
  makeup: Wand2,
  hair: Scissors,
  nails: Fingerprint,
  lash: Eye,
  brow: PenTool,
  facial: Sparkles,
  waxing: Waves,
  tattoo: PenTool,
  bridal: Gem,
  spa: Flower2,

  // Toolbar filters
  suburbs: MapPin,
  language: Languages,
  nationality: Globe,
  gender: Users,
  price: CircleDollarSign,
  age: CalendarRange,
  online: Wifi,

  // Legacy toolbar keys
  location: MapPin,
  service: HandHeart,
  availability: CalendarClock,
  rating: Star,

  // Featured services
  haircut: Scissors,
  beard: Brush,
  styling: Wand2,
  fade: Slice,
  shave: Activity,
};

const FALLBACK_ICON: IconComponent = LayoutGrid;

export function getIcon(key: string): IconComponent {
  return ICONS[key] ?? FALLBACK_ICON;
}
