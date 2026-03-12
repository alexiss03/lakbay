import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  statusInfo, 
  getAvailableTransitions, 
  validateStatusTransition, 
  type TripStatus, 
  type UserRole 
} from '@shared/status-transitions';
import { CheckCircle, XCircle, Clock, RotateCcw, AlertTriangle, Edit3 } from 'lucide-react';

interface AdminStatusActionsProps {
  tour: {
    id: string;
    status: TripStatus;
    title: string;
    adminNotes?: string;
  };
  userRole: UserRole;
}

export const AdminStatusActions = ({ tour, userRole }: AdminStatusActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TripStatus | null>(null);
  const [adminNotes, setAdminNotes] = useState(tour.adminNotes || '');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get available transitions for current status and role
  const availableTransitions = getAvailableTransitions(tour.status, userRole);

  const statusChangeMutation = useMutation({
    mutationFn: async (data: { status: TripStatus; adminNotes: string }) => {
      return apiRequest('PATCH', `/api/admin/tours/${tour.id}/status`, data);
    },
    onSuccess: () => {
      toast({
        title: "Status updated successfully",
        description: `Trip status changed to ${statusInfo[selectedStatus!].label}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tours'] });
      setIsOpen(false);
      setSelectedStatus(null);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update status",
        description: error.message || "An error occurred while updating the status",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (newStatus: TripStatus) => {
    setSelectedStatus(newStatus);
    
    // Validate the transition
    const validation = validateStatusTransition(tour.status, newStatus, userRole, adminNotes);
    
    if (!validation.isValid) {
      toast({
        title: "Invalid status transition",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    // If validation requires notes, open dialog
    const requiresNotes = ['declined', 'for_revision'];
    if (requiresNotes.includes(newStatus) && !adminNotes.trim()) {
      setIsOpen(true);
      return;
    }

    // Submit the change
    statusChangeMutation.mutate({ status: newStatus, adminNotes });
  };

  const handleSubmitWithNotes = () => {
    if (!selectedStatus) return;
    
    const validation = validateStatusTransition(tour.status, selectedStatus, userRole, adminNotes);
    
    if (!validation.isValid) {
      toast({
        title: "Invalid status transition",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    statusChangeMutation.mutate({ status: selectedStatus, adminNotes });
  };

  // Quick action button icons
  const getStatusIcon = (status: TripStatus) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'declined':
        return <XCircle className="h-4 w-4" />;
      case 'for_revision':
        return <Edit3 className="h-4 w-4" />;
      case 'for_reevaluation':
        return <AlertTriangle className="h-4 w-4" />;
      case 'ongoing':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <RotateCcw className="h-4 w-4" />;
    }
  };

  // Don't show actions if no transitions available
  if (availableTransitions.length === 0) {
    return (
      <div className="flex items-center space-x-2">
        <Badge className={statusInfo[tour.status].color}>
          {statusInfo[tour.status].label}
        </Badge>
        <span className="text-sm text-gray-500">No actions available</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 flex-wrap">
      {/* Current Status */}
      <Badge className={statusInfo[tour.status].color}>
        {statusInfo[tour.status].label}
      </Badge>

      {/* Quick Action Buttons */}
      {availableTransitions.map((status) => (
        <Button
          key={status}
          size="sm"
          variant="outline"
          onClick={() => handleStatusChange(status)}
          disabled={statusChangeMutation.isPending}
          className="flex items-center space-x-1 text-xs"
          data-testid={`button-status-${status}`}
        >
          {getStatusIcon(status)}
          <span>{statusInfo[status].label}</span>
        </Button>
      ))}

      {/* Dialog for status changes requiring notes */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Change Status to {selectedStatus && statusInfo[selectedStatus].label}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Trip: {tour.title}</Label>
              <p className="text-sm text-gray-600">
                Current Status: {statusInfo[tour.status].label}
              </p>
            </div>

            <div>
              <Label htmlFor="adminNotes">Admin Notes *</Label>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Provide reason for status change..."
                rows={4}
                className="mt-1"
                data-testid="textarea-admin-notes"
              />
              <p className="text-xs text-gray-500 mt-1">
                Required for declining or requesting revisions
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedStatus(null);
                }}
                data-testid="button-cancel-status"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitWithNotes}
                disabled={statusChangeMutation.isPending || !adminNotes.trim()}
                data-testid="button-confirm-status"
              >
                {statusChangeMutation.isPending ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
