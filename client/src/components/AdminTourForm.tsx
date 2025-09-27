import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, X } from 'lucide-react';

// Form validation schema
const tourFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  currency: z.string().default("PHP"),
  hostName: z.string().min(1, "Host name is required"),
  hostAvatar: z.string().optional(),
  hostBio: z.string().optional(),
  maxParticipants: z.number().min(1, "Must have at least 1 participant"),
  duration: z.string().optional(),
  location: z.string().optional(),
  heroImage: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(["active", "inactive", "pending"]).default("pending"),
  meetingPlace: z.string().optional(),
  
  // Tab content fields
  inclusions: z.string().optional(),
  thingsToBring: z.string().optional(),
  reminders: z.string().optional(),
  cancellationPolicy: z.string().optional()
});

type TourFormData = z.infer<typeof tourFormSchema>;

interface AdminTourFormProps {
  tour?: any; // Tour data for editing
  isEdit?: boolean;
  onClose?: () => void;
  isOpen?: boolean; // External dialog control
}

export const AdminTourForm = ({ tour, isEdit = false, onClose, isOpen: externalIsOpen }: AdminTourFormProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const handleClose = () => {
    if (externalIsOpen !== undefined) {
      // Externally controlled - call onClose prop
      onClose?.();
    } else {
      // Internally controlled - use internal state
      setInternalIsOpen(false);
    }
  };
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TourFormData>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      title: tour?.title || '',
      description: tour?.description || '',
      category: tour?.category || '',
      price: tour?.price?.toString() || '',
      currency: tour?.currency || 'PHP',
      hostName: tour?.hostName || '',
      hostAvatar: tour?.hostAvatar || '',
      hostBio: tour?.hostBio || '',
      maxParticipants: tour?.maxParticipants || 1,
      duration: tour?.duration || '',
      location: tour?.location || '',
      heroImage: tour?.heroImage || '',
      featured: tour?.featured || false,
      status: tour?.status || 'pending',
      meetingPlace: tour?.meetingPlace || '',
      inclusions: tour?.inclusions?.join('\n') || '',
      thingsToBring: tour?.thingsToBring?.join('\n') || '',
      reminders: tour?.reminders?.join('\n') || '',
      cancellationPolicy: tour?.cancellationPolicy || ''
    }
  });

  const createTourMutation = useMutation({
    mutationFn: async (data: TourFormData) => {
      const url = isEdit ? `/api/admin/tours/${tour.id}` : '/api/admin/tours';
      const method = isEdit ? 'PUT' : 'POST';
      return apiRequest(method, url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tours'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/analytics'] });
      toast({
        title: isEdit ? "Tour Updated" : "Tour Created",
        description: `Tour has been ${isEdit ? 'updated' : 'created'} successfully.`,
      });
      handleClose();
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEdit ? 'update' : 'create'} tour.`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: TourFormData) => {
    // Convert string fields to arrays (split by newlines and filter empty lines)
    const processedData = {
      ...data,
      price: parseFloat(data.price),
      maxParticipants: Number(data.maxParticipants),
      inclusions: data.inclusions ? data.inclusions.split('\n').filter(line => line.trim()) : [],
      thingsToBring: data.thingsToBring ? data.thingsToBring.split('\n').filter(line => line.trim()) : [],
      reminders: data.reminders ? data.reminders.split('\n').filter(line => line.trim()) : [],
      cancellationPolicy: data.cancellationPolicy || ''
    };
    
    createTourMutation.mutate(processedData as any);
  };

  const categories = [
    "Private", "Joiner", "Meetups", "Mystery", "Events", "Virtual", "Online Quizzes"
  ];

  const statuses = [
    { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
    { value: "inactive", label: "Inactive", color: "bg-red-100 text-red-800" },
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      {/* Only show trigger button when not externally controlled */}
      {externalIsOpen === undefined && (
        <DialogTrigger asChild>
          <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black">
            {isEdit ? (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Tour
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Tour
              </>
            )}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {isEdit ? "Edit Tour" : "Create New Tour"}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Tour Title *</Label>
                <Input
                  id="title"
                  {...form.register('title')}
                  placeholder="Amazing Adventure Tour"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.watch('category')}
                  onValueChange={(value) => form.setValue('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <div className="flex">
                  <Select
                    value={form.watch('currency')}
                    onValueChange={(value) => form.setValue('currency', value)}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHP">₱</SelectItem>
                      <SelectItem value="USD">$</SelectItem>
                      <SelectItem value="EUR">€</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="price"
                    {...form.register('price')}
                    placeholder="15000"
                    className="flex-1 ml-2"
                  />
                </div>
                {form.formState.errors.price && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  {...form.register('maxParticipants', { valueAsNumber: true })}
                  placeholder="10"
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  {...form.register('duration')}
                  placeholder="3 Days 2 Nights"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...form.register('location')}
                  placeholder="Palawan, Philippines"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="Describe your amazing tour..."
                rows={3}
              />
            </div>
          </Card>

          {/* Host Information */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Host Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hostName">Host Name *</Label>
                <Input
                  id="hostName"
                  {...form.register('hostName')}
                  placeholder="John Doe"
                />
                {form.formState.errors.hostName && (
                  <p className="text-sm text-red-600 mt-1">{form.formState.errors.hostName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="hostAvatar">Host Avatar URL</Label>
                <Input
                  id="hostAvatar"
                  {...form.register('hostAvatar')}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
          </Card>

          {/* Media & Settings */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Media & Settings</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="heroImage">Hero Image URL</Label>
                <Input
                  id="heroImage"
                  {...form.register('heroImage')}
                  placeholder="https://example.com/hero-image.jpg"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={form.watch('status')}
                    onValueChange={(value) => form.setValue('status', value as any)}
                  >
                    <SelectTrigger className="w-40 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center">
                            <Badge className={status.color}>{status.label}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={form.watch('featured')}
                    onCheckedChange={(checked) => form.setValue('featured', checked)}
                  />
                  <Label htmlFor="featured">Featured Tour</Label>
                </div>
              </div>
            </div>
          </Card>

          {/* Tab Content */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Tab Content</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="inclusions">Inclusions (one per line)</Label>
                <Textarea
                  id="inclusions"
                  {...form.register('inclusions')}
                  placeholder="Professional guide&#10;Transportation&#10;Meals&#10;Equipment"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="thingsToBring">Things to Bring (one per line)</Label>
                <Textarea
                  id="thingsToBring"
                  {...form.register('thingsToBring')}
                  placeholder="Comfortable hiking shoes&#10;Sun protection&#10;Water bottle&#10;Personal medications"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="reminders">Important Reminders (one per line)</Label>
                <Textarea
                  id="reminders"
                  {...form.register('reminders')}
                  placeholder="Arrive 30 minutes early&#10;Weather dependent activity&#10;Age limit applies"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
                <Textarea
                  id="cancellationPolicy"
                  {...form.register('cancellationPolicy')}
                  placeholder="Full refund if cancelled 24 hours in advance. 50% refund if cancelled 12 hours in advance. No refund for no-shows."
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTourMutation.isPending}
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-black"
            >
              {createTourMutation.isPending ? (
                isEdit ? 'Updating...' : 'Creating...'
              ) : (
                isEdit ? 'Update Tour' : 'Create Tour'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};