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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for demonstration
  const [stats] = useState<AccommodationStats>({
    totalProperties: 5,
    totalRooms: 128,
    occupancyRate: 78,
    monthlyRevenue: 1250000,
    averageRating: 4.6,
    activeBookings: 89,
    upcomingCheckins: 12,
    maintenanceRooms: 3
  });

  const [properties] = useState<Property[]>([
    {
      id: '1',
      name: 'Paradise Beach Resort',
      type: 'resort',
      address: 'El Nido, Palawan',
      city: 'El Nido',
      totalRooms: 45,
      occupancyRate: 85,
      averageRating: 4.8,
      monthlyRevenue: 580000,
      status: 'active',
      heroImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=200&fit=crop',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Manila Bay Hotel',
      type: 'hotel',
      address: 'Roxas Boulevard, Manila',
      city: 'Manila',
      totalRooms: 68,
      occupancyRate: 72,
      averageRating: 4.5,
      monthlyRevenue: 480000,
      status: 'active',
      heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop',
      createdAt: '2024-02-10'
    },
    {
      id: '3',
      name: 'Mountain View Lodge',
      type: 'lodge',
      address: 'Baguio City, Benguet',
      city: 'Baguio',
      totalRooms: 15,
      occupancyRate: 68,
      averageRating: 4.4,
      monthlyRevenue: 190000,
      status: 'active',
      heroImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=200&fit=crop',
      createdAt: '2024-03-05'
    }
  ]);

  const [roomTypes] = useState<RoomType[]>([
    {
      id: '1',
      name: 'Ocean View Suite',
      type: 'suite',
      maxOccupancy: 4,
      basePrice: 8500,
      totalRooms: 12,
      availableRooms: 3,
      occupiedRooms: 9
    },
    {
      id: '2',
      name: 'Deluxe King Room',
      type: 'deluxe',
      maxOccupancy: 2,
      basePrice: 5500,
      totalRooms: 20,
      availableRooms: 8,
      occupiedRooms: 12
    },
    {
      id: '3',
      name: 'Standard Twin',
      type: 'twin',
      maxOccupancy: 2,
      basePrice: 3500,
      totalRooms: 15,
      availableRooms: 6,
      occupiedRooms: 9
    }
  ]);

  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      guestName: 'Juan Dela Cruz',
      guestEmail: 'juan@email.com',
      guestPhone: '+63 917 123 4567',
      propertyName: 'Paradise Beach Resort',
      roomTypeName: 'Ocean View Suite',
      checkinDate: '2024-08-15',
      checkoutDate: '2024-08-18',
      nights: 3,
      guestCount: 2,
      totalAmount: 25500,
      status: 'confirmed',
      paymentStatus: 'paid',
      confirmationCode: 'PBR001'
    },
    {
      id: '2',
      guestName: 'Maria Santos',
      guestEmail: 'maria@email.com',
      propertyName: 'Manila Bay Hotel',
      roomTypeName: 'Deluxe King Room',
      checkinDate: '2024-08-20',
      checkoutDate: '2024-08-22',
      nights: 2,
      guestCount: 1,
      totalAmount: 11000,
      status: 'pending',
      paymentStatus: 'pending'
    }
  ]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="prada-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-light">Total Properties</p>
                    <p className="text-3xl font-light text-gray-900 mt-1">{stats.totalProperties}</p>
                    <p className="text-sm text-gray-600 mt-2">{stats.totalRooms} rooms</p>
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
                    <p className="text-3xl font-light text-gray-900 mt-1">{stats.occupancyRate}%</p>
                    <p className="text-sm text-green-600 mt-2">+5% from last month</p>
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
                    <p className="text-3xl font-light text-gray-900 mt-1">₱{stats.monthlyRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-2">+12% from last month</p>
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
                    <p className="text-3xl font-light text-gray-900 mt-1">{stats.averageRating}</p>
                    <div className="flex items-center mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">Excellent</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="prada-card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Check-ins</h3>
                <div className="space-y-4">
                  {bookings.filter(b => b.status === 'confirmed').slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{booking.guestName}</p>
                        <p className="text-sm text-gray-500">{booking.propertyName} • {booking.roomTypeName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{booking.guestCount} guests</p>
                        <p className="text-xs text-gray-500">{booking.nights} nights</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="prada-card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Room Status Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-light text-gray-900">{stats.totalRooms - (stats.totalRooms * stats.occupancyRate / 100) - stats.maintenanceRooms}</p>
                    <p className="text-sm text-gray-600">Available</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-light text-gray-900">{Math.round(stats.totalRooms * stats.occupancyRate / 100)}</p>
                    <p className="text-sm text-gray-600">Occupied</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <AlertCircle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-light text-gray-900">{stats.maintenanceRooms}</p>
                    <p className="text-sm text-gray-600">Maintenance</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-2xl font-light text-gray-900">{stats.upcomingCheckins}</p>
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
                  <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Property
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => {
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
                          {property.occupancyRate}% occupancy
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="w-4 h-4 mr-2 text-yellow-500" />
                          {property.averageRating} rating
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">₱{property.monthlyRevenue.toLocaleString()}</span>
                            <span className="text-gray-600 ml-1">this month</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Rooms Tab */}
          <TabsContent value="rooms">
            <div className="mb-6">
              <h2 className="text-2xl font-light text-gray-900">Room Types & Inventory</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {roomTypes.map((roomType) => (
                <Card key={roomType.id} className="prada-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{roomType.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{roomType.type} Room</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-[#D4AF37]">₱{roomType.basePrice.toLocaleString()}</p>
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
                        <p className="text-green-600 font-medium">{roomType.availableRooms} Available</p>
                        <p className="text-gray-600">Ready for booking</p>
                      </div>
                      <div>
                        <p className="text-blue-600 font-medium">{roomType.occupiedRooms} Occupied</p>
                        <p className="text-gray-600">Currently in use</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
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
                    {bookings.map((booking) => (
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
                            <div className="text-sm font-medium text-gray-900">{booking.propertyName}</div>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₱{booking.totalAmount.toLocaleString()}</td>
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
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
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
                    <p className="text-2xl font-light text-gray-900 mt-1">₱{stats.monthlyRevenue.toLocaleString()}</p>
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
                {properties.map((property) => (
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
                      <p className="font-semibold text-gray-900">₱{property.monthlyRevenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{property.occupancyRate}% occupancy</p>
                    </div>
                  </div>
                ))}
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