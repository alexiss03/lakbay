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
- Updated categories from travel types (Hiking, Island Hopping, Cultural, etc.) to event types (Private, Joiner, Meetups, Mystery, Events, Virtual)
- Modified category grid to show event-focused options: Private Events, Joiner Trips, Community Meetups, Mystery Adventures, Festival Events, Virtual Experiences, Day Trips, Weekend Escapes
- Updated tab navigation to use new event categories: Private, Joiner, Meetups, Mystery, Events, Virtual
- Fixed cart validation error by converting price from number to string format for backend compatibility
- Resolved LSP diagnostic issues with proper iteration syntax
- Enhanced e-commerce functionality with complete ShopPage and ProductDetailPage integration
- Integrated Google Maps JavaScript API with markers for authentic Philippine destinations
- Created TrailMap component with satellite imagery for location visualization
- All event data includes authentic pricing, locations, and experiences