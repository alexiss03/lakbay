# Project Overview

This is a full-stack JavaScript application migrated from Figma to a Replit environment, focusing on an event and travel platform. The project aims to provide a comprehensive system for users to discover and book various events and trips, including a unique "Online Quizzes" category and niche events. It also features robust tools for hosts and accommodation managers, and an integrated e-commerce experience for trip essentials. The platform has evolved from a travel-centric model to a broader event and experience platform.

# User Preferences

- (To be updated as user preferences are discovered)

# System Architecture

The application is built as a full-stack JavaScript application with a clear separation of concerns.

**Frontend:**
- **Framework:** React with Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** Radix UI with shadcn/ui for a modern and consistent user interface.
- **State Management:** TanStack Query for efficient server state management.
- **Routing:** Wouter for client-side navigation.
- **UI/UX Decisions:**
    - Consistent navigation headers across the platform (Home, Trips, Chats, Trails, Story, Shop, Corporate).
    - Gold accent coloring (#D4AF37) for branding and key interactive elements (e.g., bookmarked trips, shop buttons).
    - Responsive design with hamburger menus for mobile navigation.
    - Interactive maps (PhilippinesMap, TrailMap) with detailed overlays and user travel history visualization.
    - Timeline-based visualization for user's trips, showing chronological progression.
    - Category-specific tab systems in trip details to provide tailored information (e.g., "Trail" tab for hiking, "Wellness Program" for wellness trips).

**Backend:**
- **Framework:** Express.js
- **Language:** TypeScript
- **Authentication:** Passport.js with session management.
- **Database:** PostgreSQL with Drizzle ORM for type-safe database interactions.

**Key Features & Implementations:**

- **Category System:** Supports various event and trip categories, including Private, Joiner, Meetups, Mystery, Events, Virtual, Online Quizzes, Wellness, and Niche Events.
- **Interactive Quizzes:** Comprehensive quiz system with multiple-choice questions, timers, scoring, and retake functionality.
- **Personalized Recommendations:** AI-powered recommendations for trips with confidence scoring.
- **Host Dashboard:** A dedicated dashboard for hosts to manage trips, bookings, payouts, and communicate with guests. Includes analytics and tour management.
- **Accommodation Dashboard:** Comprehensive management system for various accommodation types, including property, room, booking, and seasonal pricing management.
- **Shop Manager Dashboard:** Full CRUD operations for products, orders, and stock management for the e-commerce section.
- **Audio Generation System:** Text-to-speech, voice recording, and audio analysis capabilities using OpenAI integration for generating tour descriptions, safety instructions, and other trip-specific audio.
- **Interactive Maps:** Integration of Google Maps API for displaying user travel history, interactive trail maps with elevation profiles, and points of interest.
- **Trip Status System:** A 7-level workflow for managing trip statuses (pending_approval, active, ongoing, completed, declined, for_revision, for_reevaluation) with associated metadata.
- **Search Functionality:** Robust search functionality that queries the database and filters results by various criteria, including trip status and category.
- **User Engagement:** Features like trending articles, user achievements, upcoming trips display, and a bookmarked trips section for saved experiences.

# External Dependencies

- **PostgreSQL:** Primary database for storing all application data.
- **Google Maps API:** Used for interactive maps, displaying visited provinces, trail mapping, and location-based features.
- **OpenAI API:** Utilized for text-to-speech and speech-to-text functionalities within the audio generation system.
- **Vite:** Frontend build tool.
- **React:** Frontend library.
- **Express.js:** Backend web application framework.
- **TypeScript:** Programming language for both frontend and backend.
- **TailwindCSS:** Utility-first CSS framework.
- **Radix UI:** Headless UI component library.
- **shadcn/ui:** Reusable UI components built on Radix UI and Tailwind CSS.
- **Drizzle ORM:** TypeScript ORM for PostgreSQL.
- **Passport.js:** Authentication middleware.
- **TanStack Query:** Data fetching and state management library.
- **Wouter:** React router.