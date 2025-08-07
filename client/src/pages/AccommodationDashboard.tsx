import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Bed, 
  Users, 
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  Settings,
  BarChart3,
  Plus,
  Edit,
  Eye,
  MapPin,
  Clock,
  MessageCircle,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Home
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AccommodationStats {
  totalProperties: number;
  totalRooms: number;
  occupancyRate: number;
  monthlyRevenue: number;
  averageRating: number;
  activeBookings: number;
  upcomingCheckins: number;
  maintenanceRooms: number;
}

interface Property {
  id: string;
  name: string;
  type: 'hotel' | 'resort' | 'hostel' | 'lodge' | 'guesthouse' | 'villa';
  address: string;
  city: string;
  totalRooms: number;
  occupancyRate: number;
  averageRating: number;
  monthlyRevenue: number;
  status: 'active' | 'inactive' | 'maintenance';
  heroImage?: string;
  createdAt: string;
}

interface RoomType {
  id: string;
  name: string;
  type: string;
  maxOccupancy: number;
  basePrice: number;
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  images?: string[];
}

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  propertyName: string;
  roomTypeName: string;
  checkinDate: string;
  checkoutDate: string;
  nights: number;
  guestCount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  paymentStatus: string;
  confirmationCode?: string;
}

const AccommodationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    type: 'hotel',
    address: '',
    city: '',
    province: '',
    country: 'Philippines',
    totalRooms: '',
    email: '',
    phone: '',
    heroImage: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Current host ID - in a real app, this would come from auth context
  const [currentHostId] = useState("host_1");

  // Fetch accommodation analytics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/accommodation/analytics', currentHostId],
    queryFn: () => apiRequest('GET', `/api/accommodation/analytics/${currentHostId}`),
  });

  // Fetch properties
  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ['/api/accommodation/properties', currentHostId, selectedFilter],
    queryFn: () => apiRequest('GET', `/api/accommodation/properties/${currentHostId}?type=${selectedFilter}&limit=50`),
  });

  // Fetch bookings for active properties
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['/api/accommodation/bookings', currentHostId],
    queryFn: async () => {
      if (!Array.isArray(properties) || properties.length === 0) return [];
      const allBookings = [];
      for (const property of properties) {
        const propertyBookings = await apiRequest('GET', `/api/accommodation/bookings/${property.id}?limit=20`);
        allBookings.push(...propertyBookings);
      }
      return allBookings;
    },
    enabled: Array.isArray(properties) && properties.length > 0,
  });

  // Fetch room types for all properties
  const { data: allRoomTypes = [], isLoading: roomTypesLoading } = useQuery({
    queryKey: ['/api/accommodation/room-types', currentHostId],
    queryFn: async () => {
      if (!Array.isArray(properties) || properties.length === 0) return [];
      const allRoomTypes = [];
      for (const property of properties) {
        const propertyRoomTypes = await apiRequest('GET', `/api/accommodation/properties/${property.id}/room-types`);
        allRoomTypes.push(...propertyRoomTypes.map((rt: any) => ({ ...rt, propertyName: property.name })));
      }
      return allRoomTypes;
    },
    enabled: Array.isArray(properties) && properties.length > 0,
  });

  // Mutations for property management
  const createPropertyMutation = useMutation({
    mutationFn: (propertyData: any) => 
      apiRequest('POST', '/api/accommodation/properties', propertyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accommodation/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/accommodation/analytics'] });
      setShowAddPropertyModal(false);
      setNewProperty({
        name: '',
        type: 'hotel',
        address: '',
        city: '',
        province: '',
        country: 'Philippines',
        totalRooms: '',
        email: '',
        phone: '',
        heroImage: ''
      });
      toast({
        title: "Success",
        description: "Property created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create property",
        variant: "destructive",
      });
    }
  });

  // Handle form submission
  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProperty.name || !newProperty.address || !newProperty.city || !newProperty.totalRooms) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const propertyData = {
      ...newProperty,
      hostId: currentHostId,
      totalRooms: parseInt(newProperty.totalRooms),
      status: 'active'
    };

    createPropertyMutation.mutate(propertyData);
  };

  const updatePropertyMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest('PUT', `/api/accommodation/properties/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accommodation/properties'] });
      toast({
        title: "Success",
        description: "Property updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update property",
        variant: "destructive",
      });
    }
  });

  // Mutation for booking status updates
  const updateBookingMutation = useMutation({
    mutationFn: ({ bookingId, status, paymentStatus, notes }: { 
      bookingId: string; 
      status?: string; 
      paymentStatus?: string; 
      notes?: string 
    }) =>
      apiRequest('PUT', `/api/accommodation/bookings/${bookingId}/status`, {
        status,
        paymentStatus,
        internalNotes: notes
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/accommodation/bookings'] });
      toast({
        title: "Success",
        description: "Booking updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update booking",
        variant: "destructive",
      });
    }
  });

  const getStatusBadge = (status: string, type: 'property' | 'booking' | 'payment') => {
    const statusConfig: Record<string, Record<string, string>> = {
      property: {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        maintenance: 'bg-yellow-100 text-yellow-800'
      },
      booking: {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        checked_in: 'bg-green-100 text-green-800',
        checked_out: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800'
      },
      payment: {
        pending: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
        refunded: 'bg-purple-100 text-purple-800'
      }
    };

    return statusConfig[type][status] || 'bg-gray-100 text-gray-800';
  };

  const getPropertyTypeIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      hotel: Building,
      resort: Home,
      hostel: Users,
      lodge: MapPin,
      guesthouse: Home,
      villa: Building
    };
    return iconMap[type] || Building;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D4AF37] prada-corner-radius flex items-center justify-center">
                  <Building className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-light text-gray-900">Accommodation Dashboard</h1>
                  <p className="text-sm text-gray-600">Manage your hotels, lodges & properties</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Guest Messages
                <Badge className="ml-2 bg-red-100 text-red-800">5</Badge>
              </Button>
              <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black">
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center space-x-2">
              <Building className="w-4 h-4" />
              <span>Properties</span>
            </TabsTrigger>
            <TabsTrigger value="rooms" className="flex items-center space-x-2">
              <Bed className="w-4 h-4" />
              <span>Rooms</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Revenue</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {statsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="prada-card p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="prada-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-light">Total Properties</p>
                      <p className="text-3xl font-light text-gray-900 mt-1">{stats?.totalProperties || 0}</p>
                      <p className="text-sm text-gray-600 mt-2">{stats?.totalRooms || 0} rooms</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </Card>

                <Card className="prada-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-light">Occupancy Rate</p>
                      <p className="text-3xl font-light text-gray-900 mt-1">{stats?.occupancyRate || 0}%</p>
                      <p className="text-sm text-gray-600 mt-2">Current rate</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </Card>

                <Card className="prada-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-light">Monthly Revenue</p>
                      <p className="text-3xl font-light text-gray-900 mt-1">₱{(stats?.monthlyRevenue || 0).toLocaleString()}</p>
                      <p className="text-sm text-gray-600 mt-2">This month</p>
                    </div>
                    <div className="w-12 h-12 bg-[#D4AF37] bg-opacity-20 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                  </div>
                </Card>

                <Card className="prada-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-light">Average Rating</p>
                      <p className="text-3xl font-light text-gray-900 mt-1">{stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}</p>
                      <div className="flex items-center mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">Overall</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="prada-card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings</h3>
                {bookingsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{booking.guestName}</p>
                          <p className="text-sm text-gray-500">{booking.accommodationName || booking.propertyName} • {booking.roomTypeName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{booking.guestCount} guests</p>
                          <p className="text-xs text-gray-500">{booking.nights} nights</p>
                        </div>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No bookings yet</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              <Card className="prada-card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Room Status Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-light text-gray-900">
                      {stats ? Math.max(0, (stats.totalRooms || 0) - Math.round((stats.totalRooms || 0) * (stats.occupancyRate || 0) / 100) - (stats.maintenanceRooms || 0)) : 0}
                    </p>
                    <p className="text-sm text-gray-600">Available</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-light text-gray-900">
                      {stats ? Math.round((stats.totalRooms || 0) * (stats.occupancyRate || 0) / 100) : 0}
                    </p>
                    <p className="text-sm text-gray-600">Occupied</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <AlertCircle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-light text-gray-900">{stats?.maintenanceRooms || 0}</p>
                    <p className="text-sm text-gray-600">Maintenance</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-2xl font-light text-gray-900">{stats?.upcomingCheckins || 0}</p>
                    <p className="text-sm text-gray-600">Check-ins Today</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900">My Properties</h2>
                <div className="flex items-center space-x-4">
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="hotel">Hotels</SelectItem>
                      <SelectItem value="resort">Resorts</SelectItem>
                      <SelectItem value="hostel">Hostels</SelectItem>
                      <SelectItem value="lodge">Lodges</SelectItem>
                      <SelectItem value="guesthouse">Guesthouses</SelectItem>
                      <SelectItem value="villa">Villas</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={showAddPropertyModal} onOpenChange={setShowAddPropertyModal}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Property
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-medium text-gray-900">Add New Property</DialogTitle>
                      </DialogHeader>
                      
                      <form onSubmit={handleAddProperty} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Property Name *</Label>
                            <Input
                              id="name"
                              value={newProperty.name}
                              onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                              placeholder="e.g. Paradise Beach Resort"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="type">Property Type *</Label>
                            <Select value={newProperty.type} onValueChange={(value) => setNewProperty({...newProperty, type: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select property type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hotel">Hotel</SelectItem>
                                <SelectItem value="resort">Resort</SelectItem>
                                <SelectItem value="hostel">Hostel</SelectItem>
                                <SelectItem value="lodge">Lodge</SelectItem>
                                <SelectItem value="guesthouse">Guesthouse</SelectItem>
                                <SelectItem value="villa">Villa</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address *</Label>
                          <Input
                            id="address"
                            value={newProperty.address}
                            onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                            placeholder="e.g. 123 Beach Road, Barangay Centro"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              value={newProperty.city}
                              onChange={(e) => setNewProperty({...newProperty, city: e.target.value})}
                              placeholder="e.g. El Nido"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="province">Province</Label>
                            <Input
                              id="province"
                              value={newProperty.province}
                              onChange={(e) => setNewProperty({...newProperty, province: e.target.value})}
                              placeholder="e.g. Palawan"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="totalRooms">Total Rooms *</Label>
                            <Input
                              id="totalRooms"
                              type="number"
                              min="1"
                              value={newProperty.totalRooms}
                              onChange={(e) => setNewProperty({...newProperty, totalRooms: e.target.value})}
                              placeholder="e.g. 45"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="heroImage">Property Image URL</Label>
                            <Input
                              id="heroImage"
                              type="url"
                              value={newProperty.heroImage}
                              onChange={(e) => setNewProperty({...newProperty, heroImage: e.target.value})}
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Contact Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={newProperty.email}
                              onChange={(e) => setNewProperty({...newProperty, email: e.target.value})}
                              placeholder="reservations@property.com"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Contact Phone</Label>
                            <Input
                              id="phone"
                              value={newProperty.phone}
                              onChange={(e) => setNewProperty({...newProperty, phone: e.target.value})}
                              placeholder="+63 917 123 4567"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end space-x-4 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowAddPropertyModal(false)}
                            disabled={createPropertyMutation.isPending}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="bg-[#D4AF37] hover:bg-[#B8941F] text-black"
                            disabled={createPropertyMutation.isPending}
                          >
                            {createPropertyMutation.isPending ? 'Adding...' : 'Add Property'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {propertiesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="prada-card overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-4"></div>
                      <div className="space-y-2">
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className="h-3 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(properties) && properties.map((property) => {
                  const IconComponent = getPropertyTypeIcon(property.type);
                  return (
                    <Card key={property.id} className="prada-card overflow-hidden">
                      {property.heroImage && (
                        <img 
                          src={property.heroImage} 
                          alt={property.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <IconComponent className="w-5 h-5 text-[#D4AF37]" />
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{property.name}</h3>
                              <p className="text-sm text-gray-600 capitalize">{property.type}</p>
                            </div>
                          </div>
                          <Badge className={getStatusBadge(property.status, 'property')}>
                            {property.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {property.address}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Bed className="w-4 h-4 mr-2" />
                            {property.totalRooms} rooms
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            {property.occupancyRate || 0}% occupancy
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="w-4 h-4 mr-2 text-yellow-500" />
                            {property.averageRating || 0} rating
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="font-medium text-gray-900">₱{(property.monthlyRevenue || 0).toLocaleString()}</span>
                              <span className="text-gray-600 ml-1">this month</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  // Navigate to property detail view
                                  toast({
                                    title: "View Property",
                                    description: `Opening ${property.name} details...`,
                                  });
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  // Open edit property modal
                                  toast({
                                    title: "Edit Property",
                                    description: `Opening ${property.name} for editing...`,
                                  });
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
                {properties.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No properties yet</h3>
                    <p className="text-gray-500 mb-6">Get started by adding your first property</p>
                    <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Property
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms">
            <div className="mb-6">
              <h2 className="text-2xl font-light text-gray-900">Room Types & Inventory</h2>
            </div>

            {roomTypesLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="prada-card p-6">
                    <div className="animate-pulse">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="space-y-2">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="h-3 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {allRoomTypes.map((roomType) => (
                  <Card key={roomType.id} className="prada-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{roomType.name}</h3>
                        <p className="text-sm text-gray-600 capitalize">{roomType.type} Room</p>
                        <p className="text-xs text-gray-500 mt-1">{roomType.propertyName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-[#D4AF37]">₱{Number(roomType.basePrice).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">per night</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Max Occupancy</span>
                        <span className="font-medium">{roomType.maxOccupancy} guests</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Rooms</span>
                        <span className="font-medium">{roomType.totalRooms}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-green-600 font-medium">{roomType.availableRooms || 0} Available</p>
                          <p className="text-gray-600">Ready for booking</p>
                        </div>
                        <div>
                          <p className="text-blue-600 font-medium">{roomType.occupiedRooms || 0} Occupied</p>
                          <p className="text-gray-600">Currently in use</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          toast({
                            title: "Edit Room Type",
                            description: `Opening ${roomType.name} for editing...`,
                          });
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          toast({
                            title: "Manage Rooms",
                            description: `Managing individual rooms for ${roomType.name}...`,
                          });
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                    </div>
                  </Card>
                ))}
                {allRoomTypes.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Bed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No room types configured</h3>
                    <p className="text-gray-500 mb-6">Add room types to your properties to start managing inventory</p>
                    <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Room Type
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="mb-6">
              <h2 className="text-2xl font-light text-gray-900">Booking Management</h2>
            </div>

            <Card className="prada-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Property & Room</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Check-in/out</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookingsLoading ? (
                      [...Array(3)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-8"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="h-8 bg-gray-200 rounded w-24"></div>
                          </td>
                        </tr>
                      ))
                    ) : bookings.length > 0 ? (
                      bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                              <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                              {booking.guestPhone && (
                                <div className="text-sm text-gray-500">{booking.guestPhone}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{booking.accommodationName || booking.propertyName}</div>
                              <div className="text-sm text-gray-500">{booking.roomTypeName}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm text-gray-900">{new Date(booking.checkinDate).toLocaleDateString()}</div>
                              <div className="text-sm text-gray-500">to {new Date(booking.checkoutDate).toLocaleDateString()}</div>
                              <div className="text-sm text-gray-500">{booking.nights} nights</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.guestCount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₱{Number(booking.totalAmount).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={getStatusBadge(booking.status, 'booking')}>
                              {booking.status.replace('_', ' ')}
                            </Badge>
                            <br />
                            <Badge className={`mt-1 ${getStatusBadge(booking.paymentStatus, 'payment')}`}>
                              {booking.paymentStatus}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                toast({
                                  title: "View Booking",
                                  description: `Opening booking details for ${booking.guestName}...`,
                                });
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                toast({
                                  title: "Message Guest",
                                  description: `Opening chat with ${booking.guestName}...`,
                                });
                              }}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Select 
                              value={booking.status} 
                              onValueChange={(value) => {
                                updateBookingMutation.mutate({
                                  bookingId: booking.id,
                                  status: value
                                });
                              }}
                            >
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="checked_in">Checked In</SelectItem>
                                <SelectItem value="checked_out">Checked Out</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                          <p className="text-gray-500">Bookings will appear here once guests make reservations</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <div className="mb-6">
              <h2 className="text-2xl font-light text-gray-900">Revenue & Analytics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="prada-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-light">This Month</p>
                    <p className="text-2xl font-light text-gray-900 mt-1">₱{(stats?.monthlyRevenue || 0).toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-2">+12% from last month</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </Card>

              <Card className="prada-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-light">Average Daily Rate</p>
                    <p className="text-2xl font-light text-gray-900 mt-1">₱5,240</p>
                    <p className="text-sm text-blue-600 mt-2">Across all properties</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </Card>

              <Card className="prada-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-light">RevPAR</p>
                    <p className="text-2xl font-light text-gray-900 mt-1">₱4,087</p>
                    <p className="text-sm text-gray-600 mt-2">Revenue per available room</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </Card>
            </div>

            <Card className="prada-card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Property</h3>
              <div className="space-y-4">
                {propertiesLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div>
                          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))
                ) : Array.isArray(properties) && properties.length > 0 ? (
                  properties.map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                          {property.heroImage ? (
                            <img 
                              src={property.heroImage} 
                              alt={property.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                              <Building className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{property.name}</h4>
                          <p className="text-sm text-gray-600">{property.city} • {property.totalRooms} rooms</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₱{(property.monthlyRevenue || 0).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{property.occupancyRate || 0}% occupancy</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No revenue data available</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="prada-card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Business Name</label>
                    <Input defaultValue="Philippine Hospitality Group" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contact Email</label>
                    <Input defaultValue="contact@phgroup.com" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <Input defaultValue="+63 917 123 4567" className="mt-1" />
                  </div>
                </div>
              </Card>

              <Card className="prada-card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Bank Account</label>
                    <Input defaultValue="**** **** **** 5678" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tax ID</label>
                    <Input defaultValue="123-456-789-000" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Commission Rate</label>
                    <Input defaultValue="12%" disabled className="mt-1" />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccommodationDashboard;