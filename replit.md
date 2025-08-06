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
- **August 6, 2025**: Implemented comprehensive trip categories system and Google Maps integration
- Added 8 major trip categories with authentic Philippine travel data
- Replaced custom 3D trail visualization with Google Maps satellite view for hiking trips
- Integrated Google Maps JavaScript API with markers for Trailhead, Camping Sites, Checkpoints, and Summit locations
- Added authentic Mount Pulag trail coordinates and interactive trail path visualization
- Created TrailMap component with satellite imagery and marker-based trail mapping
- Expanded trip database with 10+ different trip types including hiking, island hopping, cultural tours, adventure sports, wellness retreats, culinary tours, wildlife tours, and diving experiences
- Updated homepage with category grid and filtered trip listings
- Added Mount Pulag, Mount Apo, Siargao, Vigan, Bohol Tarsier, Cagayan Whitewater, Tagaytay Wellness, and Iloilo Culinary experiences
- Enhanced user interface with category-specific badges and organized navigation
- All trip data includes authentic destinations, pricing, itineraries, and accommodations
- Removed Trail Conditions and Safety Information sections from trail visualization