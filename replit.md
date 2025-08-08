# Project Overview

This is a full-stack JavaScript application migrated from Figma to Replit environment.

## Architecture
- **Frontend**: React with Vite, TypeScript, TailwindCSS
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with sessions
- **UI Components**: Radix UI with shadcn/ui
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

## Project Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript schemas and types
- `components.json` - shadcn/ui configuration

## Migration Status
- ✅ **COMPLETED**: Successfully migrated from Figma design to functional Replit application
- ✅ Security best practices implemented with proper client/server separation
- ✅ All required packages installed and verified working
- ✅ Express server running on port 5000 with Vite integration
- ✅ React frontend with hot reload functionality confirmed

## User Preferences
- (To be updated as user preferences are discovered)

## Recent Changes
- **August 6, 2025**: Major category transformation from travel-focused to event-focused platform
- Added "Online Quizzes" as seventh category tab with interactive knowledge challenges
- Updated event detail page structure with new tab organization: Event details, Inclusions, Reviews, Things to bring, Reminders, Cancellation
- Modified category grid to include Online Quizzes category with brain icon and quiz count
- Updated tab navigation to include all seven categories: Private, Joiner, Meetups, Mystery, Events, Virtual, Online Quizzes
- Restructured trip detail pages to use event-focused terminology and section organization
- **August 7, 2025**: Implemented trending articles section with Google Maps integration
- Created TrendingArticlesSection.tsx component that displays only for authenticated users
- Implemented PhilippinesMap.tsx with Google Maps API showing colored provinces based on user travel history
- Added travel statistics display, user achievements, and interactive province markers
- Created complete authentication system with useAuth hook and proper session management
- Built comprehensive UI components (Badge, Toast, Toaster) for enhanced user interaction
- Integrated personalized travel recommendations and community features (Join Tala, Lakbay Tales)
- Added secure Google Maps API key handling through server endpoint
- Enhanced user engagement with upcoming trips display and travel history visualization
- **Quiz Interface Implementation**: Replaced standard trip details with interactive quiz interface for Online Quizzes category
- Created comprehensive quiz system with multiple-choice questions, timer functionality, and scoring
- Added Philippines geography and culture quiz with 5 educational questions
- Implemented quiz results screen with pass/fail feedback and retake functionality
- Updated homepage to display FREE quiz cards with difficulty levels and passing scores
- Enhanced AI recommendations modal with 4 personalized trip suggestions and confidence scoring
- **August 7, 2025**: Added WELLNESS category tab to travel platform with mindfulness retreats, spa experiences, and forest therapy
- **August 7, 2025**: Implemented category display badges in trip detail pages showing category type in hero section and booking card
- **August 7, 2025**: Implemented category-specific tab systems with different tab sets per category type:
  * **Default tabs**: Event details, Inclusions, Reviews, Things to bring, Reminders, Cancellation
  * **Hiking category**: Added "Trail" tab with 3D visualization, elevation profiles, trail points, and interactive map
  * **Private category**: Added "VIP Experience" tab with luxury transfers and exclusive access details
  * **Wellness category**: Added "Wellness Program" tab with daily schedule and meditation activities
  * **Mystery category**: Added "Mystery Clues" tab revealing partial destination hints
  * **Virtual category**: Added "Tech Requirements" tab with system specs and platform access info
- **August 7, 2025**: Created comprehensive host dashboard for trip creation, management, payouts, and communication
- Built HostDashboard.tsx with 6 main sections: Overview, My Trips, Bookings, Payouts, Chats, and Settings
- Implemented host-specific backend API system in server/routes/host.ts with analytics, trip management, and payout functionality
- Created real-time chat system with database schemas and API endpoints supporting individual and group chats
- Added chat functionality with proper database relationships (chat_rooms, chat_participants, chat_messages, message_read_receipts)
- Integrated host analytics dashboard with revenue tracking, booking management, and performance metrics
- Built comprehensive tour management system with create/edit functionality and status tracking
- Added host payout management system with earnings tracking and withdrawal requests
- **Accommodation Dashboard Implementation**: Created comprehensive AccommodationDashboard.tsx for hotels, lodges, hostels, and property management
- Built complete accommodation-specific database schema (accommodations, room_types, rooms, accommodation_bookings, accommodation_reviews, seasonal_pricing)
- Implemented accommodation backend API system in server/routes/accommodation.ts with property management, room inventory, booking oversight, and revenue analytics
- Added property management with support for multiple accommodation types (hotel, resort, hostel, lodge, guesthouse, villa)
- Created room type management with availability tracking, occupancy monitoring, and pricing controls
- Integrated booking management system with guest communication, status tracking, and revenue optimization
- Built seasonal pricing system for dynamic rate management and occupancy optimization
- **Shop Manager Dashboard Complete**: Built comprehensive e-commerce management system with full CRUD operations
- Created shop-schema.ts with products, orders, stock movements, and analytics tables supporting complete inventory management
- Implemented advanced product management with multiple image support (up to 20 images per product)
- Added edit functionality for products with pre-populated forms and image management
- Built card/list view toggle for both products and orders with responsive design
- Enhanced image handling with URL validation, error fallbacks, and visual management interface
- Integrated stock management system with movement tracking, low-stock alerts, and bulk operations
- Added order processing with shipping capabilities including tracking numbers and carrier selection
- Created real-time analytics dashboard with revenue tracking, sales metrics, and inventory alerts
- **Shop Integration Removed**: Reverted shop integration from trip detail pages by removing all "Shop" buttons from "Things to bring" section
- Restored simple item lists without shopping integration to previous clean state
- Maintained standalone shop functionality while removing cross-platform integration
- **Content Update**: Removed "ISLAND above PHP 15000 per person" content by modifying default fallback trip from "Private Island Adventure in Palawan" (PHP 15000) to "Palawan Beach Experience" (PHP 12500)
- **Audio Generation System**: Implemented comprehensive audio generation functionality for travel content
  - Created AudioGenerator.tsx component with text-to-speech, voice recording, and audio analysis capabilities
  - Built audio API endpoints in server/routes/audio.ts with OpenAI integration for TTS and speech-to-text
  - Added AudioStudioPage.tsx for professional audio content creation
  - Integrated multiple voice options (Alloy, Echo, Fable, Onyx, Nova, Shimmer) with speed controls
  - Features include: tour description audio, safety instruction recordings, welcome messages, and cultural narrations
  - Added route /audio-studio for dedicated audio creation workspace