import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MapPin, 
  BookOpen, 
  UserCheck, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Settings,
  BarChart3,
  Globe,
  Shield
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { AdminTourForm } from '@/components/AdminTourForm';

interface Tour {
  id: string;
  title: string;
  category: string;
  price: string;
  status: 'active' | 'inactive' | 'pending';
  bookings: number;
  revenue: number;
  rating: number;
  createdAt: string;
  host: {
    name: string;
    avatar: string;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'host' | 'admin';
  joinedAt: string;
  totalBookings: number;
  totalSpent: number;
  status: 'active' | 'suspended';
}

interface Article {
  id: string;
  title: string;
  category: string;
  author: string;
  publishedAt: string;
  views: number;
  status: 'published' | 'draft' | 'review';
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/admin/analytics'],
    queryFn: () => apiRequest('GET', '/api/admin/analytics'),
  });

  // Fetch tours data  
  const { data: tours = [], isLoading: toursLoading } = useQuery({
    queryKey: ['/api/admin/tours', { status: selectedFilter, limit: 50 }],
    queryFn: () => apiRequest('GET', `/api/admin/tours?status=${selectedFilter}&limit=50`),
  });

  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Juan Dela Cruz',
      email: 'juan@email.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      role: 'user',
      joinedAt: '2024-01-20',
      totalBookings: 3,
      totalSpent: 45000,
      status: 'active'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@email.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      role: 'host',
      joinedAt: '2023-12-15',
      totalBookings: 0,
      totalSpent: 0,
      status: 'active'
    }
  ]);

  const [articles] = useState<Article[]>([
    {
      id: '1',
      title: 'Top 10 Hidden Beaches in the Philippines',
      category: 'Travel Guide',
      author: 'Lakbay Team',
      publishedAt: '2024-03-01',
      views: 12500,
      status: 'published'
    },
    {
      id: '2',
      title: 'Essential Hiking Gear for Philippine Mountains',
      category: 'Equipment',
      author: 'Adventure Team',
      publishedAt: '2024-02-28',
      views: 8900,
      status: 'published'
    }
  ]);

  const getStatusBadge = (status: string, type: 'tour' | 'user' | 'article') => {
    const statusConfig = {
      tour: {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800'
      },
      user: {
        active: 'bg-green-100 text-green-800',
        suspended: 'bg-red-100 text-red-800'
      },
      article: {
        published: 'bg-green-100 text-green-800',
        draft: 'bg-gray-100 text-gray-800',
        review: 'bg-yellow-100 text-yellow-800'
      }
    };

    return statusConfig[type][status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D4AF37] prada-corner-radius flex items-center justify-center">
                  <Settings className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-light text-gray-900">Admin Dashboard</h1>
                  <p className="text-sm text-gray-600">Manage your Lakbay platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
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
            <TabsTrigger value="tours" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Tours</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="hosts" className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4" />
              <span>Hosts</span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Articles</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {analyticsLoading ? (
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
                      <p className="text-sm text-gray-600 font-light">Total Tours</p>
                      <p className="text-3xl font-light text-gray-900 mt-1">{analytics?.totalTours || 0}</p>
                      <p className="text-sm text-green-600 mt-2">Active: {analytics?.activeTours || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </Card>

                <Card className="prada-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-light">Active Users</p>
                      <p className="text-3xl font-light text-gray-900 mt-1">{analytics?.activeUsers || 0}</p>
                      <p className="text-sm text-gray-600 mt-2">Total: {analytics?.totalUsers || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </Card>

                <Card className="prada-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-light">Monthly Revenue</p>
                      <p className="text-3xl font-light text-gray-900 mt-1">₱{(analytics?.monthlyRevenue || 0).toLocaleString()}</p>
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
                      <p className="text-sm text-gray-600 font-light">Total Bookings</p>
                      <p className="text-3xl font-light text-gray-900 mt-1">{analytics?.totalBookings || 0}</p>
                      <p className="text-sm text-gray-600 mt-2">Monthly: {analytics?.monthlyBookings || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="prada-card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Tours</h3>
                <div className="space-y-4">
                  {tours.map((tour) => (
                    <div key={tour.id} className="flex items-center space-x-4">
                      <img
                        src={tour.host.avatar}
                        alt={tour.host.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{tour.title}</p>
                        <p className="text-sm text-gray-500">{tour.category} • {tour.host.name}</p>
                      </div>
                      <Badge className={getStatusBadge(tour.status, 'tour')}>
                        {tour.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="prada-card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Users</h3>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email} • {user.role}</p>
                      </div>
                      <Badge className={getStatusBadge(user.status, 'user')}>
                        {user.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Tours Management Tab */}
          <TabsContent value="tours">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900">Tours Management</h2>
                <div className="flex items-center space-x-4">
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tours</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <AdminTourForm />
                </div>
              </div>
            </div>

            <Card className="prada-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Host</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tours.map((tour) => (
                      <tr key={tour.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{tour.title}</div>
                          <div className="text-sm text-gray-500">Created {tour.createdAt}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tour.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-8 w-8 rounded-full mr-3" src={tour.host.avatar} alt={tour.host.name} />
                            <div className="text-sm text-gray-900">{tour.host.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tour.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tour.bookings}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{tour.revenue.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusBadge(tour.status, 'tour')}>
                            {tour.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900">Users Management</h2>
                <div className="flex items-center space-x-4">
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Card className="prada-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-10 w-10 rounded-full mr-4" src={user.avatar} alt={user.name} />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.joinedAt}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.totalBookings}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{user.totalSpent.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusBadge(user.status, 'user')}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Hosts Management Tab */}
          <TabsContent value="hosts">
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Host Management</h3>
              <p className="text-gray-600 mb-6">Manage tour hosts, verify credentials, and monitor performance.</p>
              <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black">
                <Plus className="w-4 h-4 mr-2" />
                Add Host
              </Button>
            </div>
          </TabsContent>

          {/* Articles Management Tab */}
          <TabsContent value="articles">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900">Articles Management</h2>
                <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Article
                </Button>
              </div>
            </div>

            <Card className="prada-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Author</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Published</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {articles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.author}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.views.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.publishedAt}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusBadge(article.status, 'article')}>
                            {article.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="prada-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Globe className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-lg font-medium text-gray-900">Platform Settings</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Platform Name</label>
                    <Input defaultValue="Lakbay" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Platform Description</label>
                    <Input defaultValue="Adventure Travel Platform" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contact Email</label>
                    <Input defaultValue="contact@lakbay.ph" className="mt-1" />
                  </div>
                </div>
              </Card>

              <Card className="prada-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Two-Factor Authentication</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">SSL Certificate</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Backup Status</span>
                    <Badge className="bg-green-100 text-green-800">Up to Date</Badge>
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

export default AdminDashboard;