import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  MessageCircle,
  Plus,
  Edit,
  Eye,
  TrendingUp,
  MapPin,
  Clock,
  Star,
  Settings,
  BarChart3,
  CreditCard,
  Mail,
  Bell,
  UserCheck
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { AdminTourForm } from '@/components/AdminTourForm';

interface HostTrip {
  id: string;
  title: string;
  status: 'active' | 'inactive' | 'pending';
  bookings: number;
  revenue: number;
  rating: number;
  nextDeparture: string;
  category: string;
  price: number;
  maxParticipants: number;
  createdAt: string;
}

interface Booking {
  id: string;
  userName: string;
  userEmail: string;
  tourTitle: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  bookingDate: string;
  travelDate: string;
  participants: number;
}

interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  processedAt?: string;
  period: string;
  trips: number;
}

interface ChatGroup {
  id: string;
  name: string;
  type: 'trip' | 'general';
  participants: number;
  lastMessage: string;
  lastActivity: string;
  unreadCount: number;
}

const HostDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for demonstration - replace with actual API calls
  const [hostStats] = useState({
    totalTrips: 12,
    activeTrips: 8,
    totalBookings: 156,
    monthlyRevenue: 485000,
    averageRating: 4.8,
    totalEarnings: 2340000,
    pendingPayouts: 125000,
    activeChats: 5
  });

  const [trips] = useState<HostTrip[]>([
    {
      id: '1',
      title: 'Palawan Island Hopping Adventure',
      status: 'active',
      bookings: 45,
      revenue: 675000,
      rating: 4.8,
      nextDeparture: '2024-08-15',
      category: 'Private',
      price: 15000,
      maxParticipants: 10,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Mt. Apo Summit Challenge',
      status: 'active',
      bookings: 28,
      revenue: 238000,
      rating: 4.6,
      nextDeparture: '2024-08-20',
      category: 'Joiner',
      price: 8500,
      maxParticipants: 15,
      createdAt: '2024-02-10'
    }
  ]);

  const [bookings] = useState<Booking[]>([
    {
      id: '1',
      userName: 'Juan Dela Cruz',
      userEmail: 'juan@email.com',
      tourTitle: 'Palawan Island Hopping',
      amount: 15000,
      status: 'confirmed',
      bookingDate: '2024-08-01',
      travelDate: '2024-08-15',
      participants: 2
    },
    {
      id: '2',
      userName: 'Maria Santos',
      userEmail: 'maria@email.com',
      tourTitle: 'Mt. Apo Summit Challenge',
      amount: 8500,
      status: 'pending',
      bookingDate: '2024-08-02',
      travelDate: '2024-08-20',
      participants: 1
    }
  ]);

  const [payouts] = useState<Payout[]>([
    {
      id: '1',
      amount: 125000,
      status: 'pending',
      requestedAt: '2024-08-01',
      period: 'July 2024',
      trips: 8
    },
    {
      id: '2',
      amount: 95000,
      status: 'completed',
      requestedAt: '2024-07-01',
      processedAt: '2024-07-05',
      period: 'June 2024',
      trips: 6
    }
  ]);

  const [chatGroups] = useState<ChatGroup[]>([
    {
      id: '1',
      name: 'Palawan Adventure - Aug 15',
      type: 'trip',
      participants: 8,
      lastMessage: 'What time should we meet at the dock?',
      lastActivity: '2 hours ago',
      unreadCount: 3
    },
    {
      id: '2',
      name: 'Mt. Apo Climbers',
      type: 'trip',
      participants: 12,
      lastMessage: 'Weather forecast looks good!',
      lastActivity: '5 hours ago',
      unreadCount: 1
    },
    {
      id: '3',
      name: 'Host Community',
      type: 'general',
      participants: 45,
      lastMessage: 'Tips for rainy season tours?',
      lastActivity: '1 day ago',
      unreadCount: 0
    }
  ]);

  const getStatusBadge = (status: string, type: 'trip' | 'booking' | 'payout') => {
    const statusConfig = {
      trip: {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800'
      },
      booking: {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
      },
      payout: {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800'
      }
    };

    return statusConfig[type][status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Host Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D4AF37] prada-corner-radius flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-light text-gray-900">Host Dashboard</h1>
                  <p className="text-sm text-gray-600">Manage your tours and bookings</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                <Badge className="ml-2 bg-[#D4AF37] text-black">3</Badge>
              </Button>
              <AdminTourForm />
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
            <TabsTrigger value="trips" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>My Trips</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="payouts" className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Payouts</span>
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Chats</span>
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
                    <p className="text-sm text-gray-600 font-light">Active Trips</p>
                    <p className="text-3xl font-light text-gray-900 mt-1">{hostStats.activeTrips}</p>
                    <p className="text-sm text-gray-600 mt-2">of {hostStats.totalTrips} total</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="prada-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-light">Monthly Revenue</p>
                    <p className="text-3xl font-light text-gray-900 mt-1">₱{hostStats.monthlyRevenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600 mt-2">+15% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-[#D4AF37] bg-opacity-20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                </div>
              </Card>

              <Card className="prada-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-light">Total Bookings</p>
                    <p className="text-3xl font-light text-gray-900 mt-1">{hostStats.totalBookings}</p>
                    <p className="text-sm text-gray-600 mt-2">All time</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="prada-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-light">Average Rating</p>
                    <p className="text-3xl font-light text-gray-900 mt-1">{hostStats.averageRating}</p>
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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="prada-card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Bookings</h3>
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking.id} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{booking.userName}</p>
                        <p className="text-sm text-gray-500">{booking.tourTitle} • ₱{booking.amount.toLocaleString()}</p>
                      </div>
                      <Badge className={getStatusBadge(booking.status, 'booking')}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="prada-card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Active Chats</h3>
                <div className="space-y-4">
                  {chatGroups.filter(chat => chat.unreadCount > 0).map((chat) => (
                    <div key={chat.id} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-[#D4AF37] bg-opacity-20 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{chat.name}</p>
                        <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unreadCount > 0 && (
                        <Badge className="bg-red-100 text-red-800">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* My Trips Tab */}
          <TabsContent value="trips">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900">My Trips</h2>
                <div className="flex items-center space-x-4">
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Trips</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <AdminTourForm />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <Card key={trip.id} className="prada-card overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{trip.title}</h3>
                      <Badge className={getStatusBadge(trip.status, 'trip')}>
                        {trip.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        ₱{trip.price.toLocaleString()} per person
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {trip.bookings}/{trip.maxParticipants} booked
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Next: {new Date(trip.nextDeparture).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 mr-2 text-yellow-500" />
                        {trip.rating} rating
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium text-gray-900">₱{trip.revenue.toLocaleString()}</span>
                          <span className="text-gray-600 ml-1">earned</span>
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
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Trip</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Travel Date</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Participants</th>
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
                            <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                            <div className="text-sm text-gray-500">{booking.userEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.tourTitle}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(booking.travelDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.participants}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{booking.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusBadge(booking.status, 'booking')}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Payouts Tab */}
          <TabsContent value="payouts">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900">Payouts</h2>
                <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black">
                  Request Payout
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="prada-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-light">Total Earnings</p>
                    <p className="text-2xl font-light text-gray-900 mt-1">₱{hostStats.totalEarnings.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </Card>

              <Card className="prada-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-light">Pending Payouts</p>
                    <p className="text-2xl font-light text-gray-900 mt-1">₱{hostStats.pendingPayouts.toLocaleString()}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </Card>

              <Card className="prada-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-light">This Month</p>
                    <p className="text-2xl font-light text-gray-900 mt-1">₱{hostStats.monthlyRevenue.toLocaleString()}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </Card>
            </div>

            <Card className="prada-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Trips</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payout.period}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₱{payout.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payout.trips}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(payout.requestedAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusBadge(payout.status, 'payout')}>
                            {payout.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Chats Tab */}
          <TabsContent value="chats">
            <div className="mb-6">
              <h2 className="text-2xl font-light text-gray-900">Chat Management</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card className="prada-card p-4">
                  <h3 className="font-medium mb-4">Chat Groups</h3>
                  <div className="space-y-3">
                    {chatGroups.map((chat) => (
                      <div key={chat.id} className="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#D4AF37] bg-opacity-20 rounded-full flex items-center justify-center">
                              <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{chat.name}</p>
                              <p className="text-xs text-gray-500">{chat.participants} participants</p>
                            </div>
                          </div>
                          {chat.unreadCount > 0 && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-2 truncate">{chat.lastMessage}</p>
                        <p className="text-xs text-gray-400 mt-1">{chat.lastActivity}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="prada-card p-6">
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium">Select a chat to start messaging</p>
                      <p className="text-sm">Communicate with your guests and other hosts</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="prada-card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Host Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Business Name</label>
                    <Input defaultValue="Adventure Philippines Tours" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <Input defaultValue="Professional tour guide with 10+ years experience" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <Input defaultValue="Palawan, Philippines" className="mt-1" />
                  </div>
                </div>
              </Card>

              <Card className="prada-card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payout Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Bank Account</label>
                    <Input defaultValue="**** **** **** 1234" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tax ID</label>
                    <Input defaultValue="123-456-789" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Commission Rate</label>
                    <Input defaultValue="15%" disabled className="mt-1" />
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

export default HostDashboard;