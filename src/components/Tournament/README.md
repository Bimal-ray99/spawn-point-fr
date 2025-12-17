# Tournament Component

A fully featured tournament carousel section optimized for the Spawn Point website.

## Structure

```
Tournament/
├── components/
│   ├── FeaturedTournamentCarousel.jsx  # Main carousel component
│   └── NavButton.jsx                    # Navigation buttons for carousel
├── data/
│   └── tournaments.js                   # Tournament data & helper functions
├── hooks/
│   └── useTournamentFilter.js          # Hook for filtering tournaments
├── index.jsx                            # Main Tournament component
├── Tournament.css                       # Custom styles
└── README.md                           # This file
```

## Usage

### Basic Usage

```jsx
import Tournament from "@/components/Tournament";

export default function HomePage() {
  return (
    <div>
      <Tournament />
    </div>
  );
}
```

### With Custom Tournament Data

```jsx
import Tournament from "@/components/Tournament";

const customTournaments = [
  {
    id: 1,
    slug: "custom-tournament",
    title: "Custom Tournament",
    prize: "$10,000",
    date: "June 1, 2025",
    status: "upcoming",
    registrationOpen: true,
    platforms: ["PC", "Console"],
    imageSrc: "/path/to/image.jpg",
    genre: "Battle Royale",
    description: "Your tournament description",
    featured: true,
  },
  // ... more tournaments
];

export default function HomePage() {
  return (
    <div>
      <Tournament tournaments={customTournaments} />
    </div>
  );
}
```

## Tournament Data Structure

Each tournament object should have:

```typescript
{
  id: number;              // Unique identifier
  enquiryId: string;       // Tournament enquiry ID (e.g., "T-001")
  slug: string;            // URL slug for tournament page
  title: string;           // Tournament title
  prize: string;           // Prize amount (e.g., "$1,000")
  date: string;            // Tournament date
  status: "upcoming" | "current" | "daily" | "weekly";
  registrationOpen: boolean;
  platforms: string[];     // Array of platforms (e.g., ["PC", "Console"])
  imageSrc: string;        // Path to tournament image
  genre: string;           // Tournament genre
  description: string;     // Tournament description
  featured?: boolean;      // Optional - marks as featured tournament
}
```

## Features

- ✅ Swiper carousel with smooth transitions
- ✅ Masked card shapes using SVG mask
- ✅ Animated navigation buttons
- ✅ Integration with existing AnimatedButton component
- ✅ GSAP scroll-triggered background color animation
- ✅ Responsive design for mobile and desktop
- ✅ Scrolling background text effect
- ✅ Featured tournament filtering

## Dependencies

- `swiper` - Carousel functionality
- `gsap` - Animations
- `framer-motion` - Transitions (if needed)
- Next.js Image component
- Existing components:
  - `AnimatedButton`
  - `ShapeDeco`
  - `ScrollingText`

## Customization

### Change Background Image
Edit the background image in `index.jsx`:
```jsx
<Image
  src="/your-custom-background.webp"
  alt=""
  fill
  className="h-full w-full object-cover opacity-20"
/>
```

### Change Mask Shape
Replace the `/mask-1920.svg` file in the public folder with your custom mask.

### Adjust Carousel Settings
Edit the Swiper settings in `FeaturedTournamentCarousel.jsx`:
```jsx
<Swiper
  slidesPerView={1.2}  // Change number of visible slides
  spaceBetween={30}     // Change spacing between slides
  speed={1200}          // Change transition speed
  // ... other settings
/>
```

## Notes

- The component uses local data by default (`sampleTournaments`)
- Backend integration can be added by passing tournament data from your API
- The mask SVG (`/mask-1920.svg`) must exist in the public folder
- Tournament images should be optimized for web use
