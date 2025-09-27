// Status transition logic for trip management system

export type TripStatus = 
  | 'pending_approval' 
  | 'active' 
  | 'ongoing' 
  | 'completed' 
  | 'declined' 
  | 'for_revision' 
  | 'for_reevaluation';

export type UserRole = 'user' | 'host' | 'admin';

export interface TripStatusInfo {
  label: string;
  color: string;
  description: string;
  isSearchable: boolean;
  isBookable: boolean;
}

// Status information with UI and business logic properties
export const statusInfo: Record<TripStatus, TripStatusInfo> = {
  pending_approval: {
    label: 'Pending Approval',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Awaiting admin review and approval',
    isSearchable: false,
    isBookable: false
  },
  active: {
    label: 'Active',
    color: 'bg-green-100 text-green-800',
    description: 'Trip is live and accepting bookings',
    isSearchable: true,
    isBookable: true
  },
  ongoing: {
    label: 'Ongoing',
    color: 'bg-blue-100 text-blue-800',
    description: 'Trip is currently in progress',
    isSearchable: true,
    isBookable: false
  },
  completed: {
    label: 'Completed',
    color: 'bg-gray-100 text-gray-800',
    description: 'Trip has finished successfully',
    isSearchable: true,
    isBookable: false
  },
  declined: {
    label: 'Declined',
    color: 'bg-red-100 text-red-800',
    description: 'Trip was rejected by admin',
    isSearchable: false,
    isBookable: false
  },
  for_revision: {
    label: 'For Revision',
    color: 'bg-orange-100 text-orange-800',
    description: 'Trip needs changes before approval',
    isSearchable: false,
    isBookable: false
  },
  for_reevaluation: {
    label: 'For Re-evaluation',
    color: 'bg-purple-100 text-purple-800',
    description: 'Trip requires additional review',
    isSearchable: false,
    isBookable: false
  }
};

// Allowed status transitions based on current status and user role
export const allowedTransitions: Record<TripStatus, Record<UserRole, TripStatus[]>> = {
  pending_approval: {
    user: [], // Users cannot change status from pending
    host: ['for_reevaluation'], // Host can request re-evaluation
    admin: ['active', 'declined', 'for_revision'] // Admin can approve, decline, or request revision
  },
  active: {
    user: [], // Users cannot change status 
    host: ['for_reevaluation'], // Host can request re-evaluation if needed
    admin: ['ongoing', 'declined', 'for_revision'] // Admin can manage active trips
  },
  ongoing: {
    user: [], // Users cannot change status
    host: [], // Host cannot change ongoing status
    admin: ['completed', 'active'] // Admin can complete or revert to active
  },
  completed: {
    user: [], // Users cannot change completed status
    host: [], // Host cannot change completed status  
    admin: ['for_reevaluation'] // Admin can reopen for evaluation if needed
  },
  declined: {
    user: [], // Users cannot change declined status
    host: [], // Host cannot directly change declined status
    admin: ['for_revision', 'pending_approval'] // Admin can allow revision or re-approval
  },
  for_revision: {
    user: [], // Users cannot change status
    host: ['pending_approval'], // Host can resubmit after revision
    admin: ['active', 'declined', 'pending_approval'] // Admin has full control
  },
  for_reevaluation: {
    user: [], // Users cannot change status
    host: [], // Host cannot change during re-evaluation
    admin: ['active', 'declined', 'for_revision', 'pending_approval'] // Admin has full control
  }
};

// Helper function to check if a status transition is allowed
export function canTransitionStatus(
  currentStatus: TripStatus,
  newStatus: TripStatus,
  userRole: UserRole
): boolean {
  const allowedForRole = allowedTransitions[currentStatus]?.[userRole] || [];
  return allowedForRole.includes(newStatus);
}

// Get all possible transitions for a given status and role
export function getAvailableTransitions(
  currentStatus: TripStatus,
  userRole: UserRole
): TripStatus[] {
  return allowedTransitions[currentStatus]?.[userRole] || [];
}

// Check if a trip should automatically transition based on dates
export function checkAutomaticTransition(
  currentStatus: TripStatus,
  startAt: Date | null,
  endAt: Date | null,
  now: Date = new Date()
): TripStatus | null {
  // Only active trips can automatically transition to ongoing/completed
  if (currentStatus !== 'active') {
    return null;
  }

  if (!startAt || !endAt) {
    return null;
  }

  // If current time is past end date, mark as completed
  if (now >= endAt) {
    return 'completed';
  }

  // If current time is past start date but before end date, mark as ongoing
  if (now >= startAt && now < endAt) {
    return 'ongoing';
  }

  return null;
}

// Validate status transition with business rules
export function validateStatusTransition(
  currentStatus: TripStatus,
  newStatus: TripStatus,
  userRole: UserRole,
  adminNotes?: string
): { isValid: boolean; error?: string } {
  // Check if transition is allowed by role
  if (!canTransitionStatus(currentStatus, newStatus, userRole)) {
    return {
      isValid: false,
      error: `${userRole} is not allowed to change status from ${currentStatus} to ${newStatus}`
    };
  }

  // Admin notes required for certain transitions
  const requiresNotes = ['declined', 'for_revision'];
  if (requiresNotes.includes(newStatus) && userRole === 'admin' && !adminNotes?.trim()) {
    return {
      isValid: false,
      error: `Admin notes are required when changing status to ${newStatus}`
    };
  }

  return { isValid: true };
}

// Get status badge classes for UI
export function getStatusBadgeClass(status: TripStatus): string {
  return statusInfo[status]?.color || 'bg-gray-100 text-gray-800';
}

// Check if trip is visible in search results
export function isSearchable(status: TripStatus): boolean {
  return statusInfo[status]?.isSearchable || false;
}

// Check if trip accepts new bookings
export function isBookable(status: TripStatus): boolean {
  return statusInfo[status]?.isBookable || false;
}