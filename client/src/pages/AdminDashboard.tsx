import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminStatusActions } from '@/components/AdminStatusActions';
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
  Settings,
  BarChart3,
  Globe,
  Shield
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiJsonRequest, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { AdminTourForm } from '@/components/AdminTourForm';
import { Link } from 'wouter';

interface Tour {
  id: string;
  title: string;
  category: string;
  price: string;
  status: 'pending_approval' | 'active' | 'ongoing' | 'completed' | 'declined' | 'for_revision' | 'for_reevaluation';
  bookingsCount: number;
  revenue: string;
  rating: string;
  hostName: string;
  hostAvatar?: string;
  startAt?: string;
  endAt?: string;
  adminNotes?: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'host' | 'admin';
  joinedAt: string;
  totalBookings: number;
  totalSpent: number | string;
  status: 'active' | 'suspended';
}

interface Article {
  id: string;
  title: string;
  category: string;
  author: string;
  publishedAt?: string;
  views: number;
  status: 'published' | 'draft' | 'review';
}

interface Host {
  id: string;
  userId: string;
  businessName?: string;
  location?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
  totalTours: number;
  totalRevenue: string;
}

interface Booking {
  id: string;
  userName: string;
  userEmail: string;
  tourTitle: string;
  amount: string;
  status: string;
  paymentStatus: string;
  participants: number;
  bookingDate: string;
  travelDate?: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    setSelectedFilter('all');
  }, [activeTab]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery<any>({
    queryKey: ['/api/admin/analytics'],
    queryFn: () => apiJsonRequest('GET', '/api/admin/analytics'),
  });

  // Fetch tours data  
  const { data: toursData } = useQuery<Tour[]>({
    queryKey: ['/api/admin/tours', { status: selectedFilter, limit: 50 }],
    queryFn: () => apiJsonRequest('GET', `/api/admin/tours?status=${selectedFilter}&limit=50`),
  });

  const { data: usersData = [] } = useQuery<User[]>({
    queryKey: ['/api/admin/users', { status: selectedFilter, limit: 50 }],
    queryFn: () => apiJsonRequest('GET', `/api/admin/users?status=${selectedFilter}&limit=50`),
  });

  const { data: articlesData = [] } = useQuery<Article[]>({
    queryKey: ['/api/admin/articles', { status: selectedFilter, limit: 50 }],
    queryFn: () => apiJsonRequest('GET', `/api/admin/articles?status=${selectedFilter}&limit=50`),
  });

  const { data: hostsData = [] } = useQuery<Host[]>({
    queryKey: ['/api/admin/hosts', { verified: selectedFilter, limit: 50 }],
    queryFn: () => apiJsonRequest('GET', `/api/admin/hosts?verified=${selectedFilter}&limit=50`),
  });

  const { data: bookingsData = [] } = useQuery<Booking[]>({
    queryKey: ['/api/admin/bookings', { status: selectedFilter, limit: 50 }],
    queryFn: () => apiJsonRequest('GET', `/api/admin/bookings?status=${selectedFilter}&limit=50`),
  });

  const tours: Tour[] = Array.isArray(toursData) ? toursData : [];
  const users: User[] = Array.isArray(usersData) ? usersData : [];
  const articles: Article[] = Array.isArray(articlesData) ? articlesData : [];
  const hosts: Host[] = Array.isArray(hostsData) ? hostsData : [];
  const bookings: Booking[] = Array.isArray(bookingsData) ? bookingsData : [];

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredTours = tours.filter((tour) => {
    if (!normalizedSearch) return true;
    return (
      tour.title.toLowerCase().includes(normalizedSearch) ||
      tour.hostName?.toLowerCase().includes(normalizedSearch) ||
      tour.category?.toLowerCase().includes(normalizedSearch)
    );
  });

  const filteredUsers = users.filter((user) => {
    if (!normalizedSearch) return true;
    return (
      user.name.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch)
    );
  });

  const filteredArticles = articles.filter((article) => {
    if (!normalizedSearch) return true;
    return (
      article.title.toLowerCase().includes(normalizedSearch) ||
      article.author.toLowerCase().includes(normalizedSearch) ||
      article.category.toLowerCase().includes(normalizedSearch)
    );
  });

  const filteredHosts = hosts.filter((host) => {
    if (!normalizedSearch) return true;
    return (
      (host.businessName || '').toLowerCase().includes(normalizedSearch) ||
      (host.location || '').toLowerCase().includes(normalizedSearch) ||
      host.userId.toLowerCase().includes(normalizedSearch)
    );
  });

  const filteredBookings = bookings.filter((booking) => {
    if (!normalizedSearch) return true;
    return (
      booking.tourTitle.toLowerCase().includes(normalizedSearch) ||
      booking.userName.toLowerCase().includes(normalizedSearch) ||
      booking.userEmail.toLowerCase().includes(normalizedSearch) ||
      booking.status.toLowerCase().includes(normalizedSearch)
    );
  });

  const deleteTourMutation = useMutation({
    mutationFn: async (tourId: string) => {
      await apiRequest('DELETE', `/api/admin/tours/${tourId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tours'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/analytics'] });
      toast({
        title: "Tour deleted",
        description: "The tour has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete tour.",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<User> }) => {
      return apiJsonRequest('PUT', `/api/admin/users/${userId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "User updated",
        description: "User status has been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update user.",
        variant: "destructive",
      });
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; role: 'user' | 'host' | 'admin' }) => {
      return apiJsonRequest('POST', '/api/admin/users', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/analytics'] });
      toast({
        title: "User created",
        description: "New user record added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Create failed",
        description: error.message || "Failed to create user.",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiRequest('DELETE', `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/analytics'] });
      toast({
        title: "User deleted",
        description: "User record removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete user.",
        variant: "destructive",
      });
    },
  });

  const createArticleMutation = useMutation({
    mutationFn: async () => {
      const stamp = Date.now();
      return apiJsonRequest('POST', '/api/admin/articles', {
        title: `New Lakbay Article ${stamp}`,
        slug: `new-lakbay-article-${stamp}`,
        content: "Draft content",
        excerpt: "Draft excerpt",
        category: "Travel Guide",
        tags: JSON.stringify(["travel"]),
        author: "Lakbay Team",
        authorId: "admin",
        status: "draft",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/articles'] });
      toast({
        title: "Article created",
        description: "A draft article has been created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Create failed",
        description: error.message || "Failed to create article.",
        variant: "destructive",
      });
    },
  });

  const updateArticleMutation = useMutation({
    mutationFn: async ({ articleId, data }: { articleId: string; data: Partial<Article> }) => {
      return apiJsonRequest('PUT', `/api/admin/articles/${articleId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/articles'] });
      toast({
        title: "Article updated",
        description: "Article changes saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update article.",
        variant: "destructive",
      });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (articleId: string) => {
      await apiRequest('DELETE', `/api/admin/articles/${articleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/articles'] });
      toast({
        title: "Article deleted",
        description: "Article removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete article.",
        variant: "destructive",
      });
    },
  });

  const verifyHostMutation = useMutation({
    mutationFn: async ({ hostId, status }: { hostId: string; status: 'verified' | 'rejected' | 'pending' }) => {
      return apiJsonRequest('PUT', `/api/admin/hosts/${hostId}/verify`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hosts'] });
      toast({
        title: "Host updated",
        description: "Host verification status changed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to verify host.",
        variant: "destructive",
      });
    },
  });

  const createHostMutation = useMutation({
    mutationFn: async (data: { userId: string; businessName?: string; location?: string }) => {
      return apiJsonRequest('POST', '/api/admin/hosts', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hosts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/analytics'] });
      toast({
        title: "Host created",
        description: "Host record added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Create failed",
        description: error.message || "Failed to create host.",
        variant: "destructive",
      });
    },
  });

  const updateHostMutation = useMutation({
    mutationFn: async ({ hostId, data }: { hostId: string; data: Partial<Host> }) => {
      return apiJsonRequest('PUT', `/api/admin/hosts/${hostId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hosts'] });
      toast({
        title: "Host updated",
        description: "Host changes saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update host.",
        variant: "destructive",
      });
    },
  });

  const deleteHostMutation = useMutation({
    mutationFn: async (hostId: string) => {
      await apiRequest('DELETE', `/api/admin/hosts/${hostId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/hosts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/analytics'] });
      toast({
        title: "Host deleted",
        description: "Host record removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete host.",
        variant: "destructive",
      });
    },
  });

  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiJsonRequest('POST', '/api/admin/bookings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bookings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/analytics'] });
      toast({
        title: "Booking created",
        description: "Booking record added.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Create failed",
        description: error.message || "Failed to create booking.",
        variant: "destructive",
      });
    },
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, data }: { bookingId: string; data: Partial<Booking> }) => {
      return apiJsonRequest('PUT', `/api/admin/bookings/${bookingId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bookings'] });
      toast({
        title: "Booking updated",
        description: "Booking changes saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update booking.",
        variant: "destructive",
      });
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      await apiRequest('DELETE', `/api/admin/bookings/${bookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bookings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/analytics'] });
      toast({
        title: "Booking deleted",
        description: "Booking record removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete booking.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string, type: 'tour' | 'user' | 'article' | 'booking') => {
    const statusConfig = {
      tour: {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
        pending_approval: 'bg-yellow-100 text-yellow-800',
        ongoing: 'bg-blue-100 text-blue-800',
        completed: 'bg-gray-100 text-gray-800',
        declined: 'bg-red-100 text-red-800',
        for_revision: 'bg-orange-100 text-orange-800',
        for_reevaluation: 'bg-purple-100 text-purple-800'
      },
      user: {
        active: 'bg-green-100 text-green-800',
        suspended: 'bg-red-100 text-red-800'
      },
      article: {
        published: 'bg-green-100 text-green-800',
        draft: 'bg-gray-100 text-gray-800',
        review: 'bg-yellow-100 text-yellow-800'
      },
      booking: {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        cancelled: 'bg-red-100 text-red-800',
        completed: 'bg-green-100 text-green-800'
      }
    };

    return statusConfig[type][status as keyof typeof statusConfig[typeof type]] || 'bg-gray-100 text-gray-800';
  };

  const handleCreateUser = () => {
    const name = window.prompt('Enter user name');
    if (!name) return;
    const email = window.prompt('Enter user email');
    if (!email) return;
    const roleInput = window.prompt('Enter role (user, host, admin)', 'user') || 'user';
    const role = ['user', 'host', 'admin'].includes(roleInput) ? (roleInput as 'user' | 'host' | 'admin') : 'user';
    createUserMutation.mutate({ name, email, role });
  };

  const handleEditArticle = (article: Article) => {
    const title = window.prompt('Edit article title', article.title);
    if (!title) return;
    const statusInput = window.prompt('Edit article status (draft, review, published)', article.status) || article.status;
    const status = ['draft', 'review', 'published'].includes(statusInput)
      ? (statusInput as 'draft' | 'review' | 'published')
      : article.status;
    updateArticleMutation.mutate({
      articleId: article.id,
      data: {
        title,
        status,
        publishedAt: status === 'published' ? new Date().toISOString() : undefined,
      },
    });
  };

  const handleCreateHost = () => {
    const userId = window.prompt('Enter host userId');
    if (!userId) return;
    const businessName = window.prompt('Enter business name (optional)') || undefined;
    const location = window.prompt('Enter location (optional)') || undefined;
    createHostMutation.mutate({ userId, businessName, location });
  };

  const handleEditHost = (host: Host) => {
    const businessName = window.prompt('Edit business name', host.businessName || '') ?? host.businessName;
    const location = window.prompt('Edit location', host.location || '') ?? host.location;
    updateHostMutation.mutate({
      hostId: host.id,
      data: {
        businessName: businessName || undefined,
        location: location || undefined,
      },
    });
  };

  const handleCreateBooking = () => {
    const tourId = window.prompt('Enter tour ID');
    if (!tourId) return;
    const userId = window.prompt('Enter user ID');
    if (!userId) return;
    const userName = window.prompt('Enter user name');
    if (!userName) return;
    const userEmail = window.prompt('Enter user email');
    if (!userEmail) return;
    const tourTitle = window.prompt('Enter tour title');
    if (!tourTitle) return;
    const amount = window.prompt('Enter amount (e.g. 15000)');
    if (!amount) return;
    createBookingMutation.mutate({
      tourId,
      userId,
      userName,
      userEmail,
      tourTitle,
      amount,
      status: 'pending',
      paymentStatus: 'pending',
      bookingDate: new Date().toISOString(),
      participants: 1,
    });
  };

  return (
    <div className="min-h-screen view-shell">
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
          <TabsList className="grid w-full grid-cols-7 mb-8">
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
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Bookings</span>
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
                      <p className="text-3xl font-light text-gray-900 mt-1">{(analytics as any)?.totalTours || 0}</p>
                      <p className="text-sm text-green-600 mt-2">Active: {(analytics as any)?.activeTours || 0}</p>
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
                      <p className="text-3xl font-light text-gray-900 mt-1">{(analytics as any)?.activeUsers || 0}</p>
                      <p className="text-sm text-gray-600 mt-2">Total: {(analytics as any)?.totalUsers || 0}</p>
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
                      <p className="text-3xl font-light text-gray-900 mt-1">₱{((analytics as any)?.monthlyRevenue || 0).toLocaleString()}</p>
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
                      <p className="text-3xl font-light text-gray-900 mt-1">{(analytics as any)?.totalBookings || 0}</p>
                      <p className="text-sm text-gray-600 mt-2">Monthly: {(analytics as any)?.monthlyBookings || 0}</p>
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
                  {filteredTours.slice(0, 8).map((tour: Tour) => (
                    <div key={tour.id} className="flex items-center space-x-4">
                      <img
                        src={tour.hostAvatar}
                        alt={tour.hostName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{tour.title}</p>
                        <p className="text-sm text-gray-500">{tour.category} • {tour.hostName}</p>
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
                    {filteredTours.map((tour: Tour) => (
                      <tr key={tour.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{tour.title}</div>
                          <div className="text-sm text-gray-500">Created {tour.createdAt}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tour.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-8 w-8 rounded-full mr-3"
                              src={tour.hostAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                              alt={tour.hostName}
                            />
                            <div className="text-sm text-gray-900">{tour.hostName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{tour.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tour.bookingsCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{parseFloat(tour.revenue).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <AdminStatusActions 
                            tour={{
                              id: tour.id,
                              status: tour.status,
                              title: tour.title,
                              adminNotes: tour.adminNotes
                            }}
                            userRole="admin"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Link href={`/trip/${tour.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <AdminTourForm tour={tour} isEdit={true} />
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteTourMutation.mutate(tour.id)}
                            disabled={deleteTourMutation.isPending}
                          >
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
                  <Button
                    className="bg-[#D4AF37] hover:bg-[#B8941F] text-black"
                    onClick={handleCreateUser}
                    disabled={createUserMutation.isPending}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {createUserMutation.isPending ? 'Creating...' : 'Create User'}
                  </Button>
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
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-full mr-4"
                              src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                              alt={user.name}
                            />
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{Number(user.totalSpent || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusBadge(user.status, 'user')}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateUserMutation.mutate({
                                userId: user.id,
                                data: { status: user.status === 'active' ? 'suspended' : 'active' },
                              })
                            }
                            disabled={updateUserMutation.isPending}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (!window.confirm(`Delete user ${user.name}?`)) return;
                              deleteUserMutation.mutate(user.id);
                            }}
                            disabled={deleteUserMutation.isPending}
                          >
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
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900">Hosts Management</h2>
                <Button
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-black"
                  onClick={handleCreateHost}
                  disabled={createHostMutation.isPending}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {createHostMutation.isPending ? 'Creating...' : 'Create Host'}
                </Button>
              </div>
            </div>
            <Card className="prada-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Business</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Tours</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHosts.map((host) => (
                      <tr key={host.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {host.businessName || "Unnamed Host"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{host.location || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{host.totalTours || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{Number(host.totalRevenue || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">{host.verificationStatus}</Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditHost(host)}
                            disabled={updateHostMutation.isPending}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => verifyHostMutation.mutate({ hostId: host.id, status: 'verified' })}
                            disabled={verifyHostMutation.isPending}
                          >
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => verifyHostMutation.mutate({ hostId: host.id, status: 'rejected' })}
                            disabled={verifyHostMutation.isPending}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (!window.confirm(`Delete host ${host.businessName || host.id}?`)) return;
                              deleteHostMutation.mutate(host.id);
                            }}
                            disabled={deleteHostMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filteredHosts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                          No hosts found for the selected filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Articles Management Tab */}
          <TabsContent value="articles">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900">Articles Management</h2>
                <Button
                  className="bg-[#D4AF37] hover:bg-[#B8941F] text-black"
                  onClick={() => createArticleMutation.mutate()}
                  disabled={createArticleMutation.isPending}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {createArticleMutation.isPending ? "Creating..." : "Create Article"}
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
                    {filteredArticles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{article.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.category}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.author}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{article.views.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusBadge(article.status, 'article')}>
                            {article.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditArticle(article)}
                            disabled={updateArticleMutation.isPending}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteArticleMutation.mutate(article.id)}
                            disabled={deleteArticleMutation.isPending}
                          >
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

          {/* Bookings Management Tab */}
          <TabsContent value="bookings">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900">Bookings Management</h2>
                <div className="flex items-center space-x-4">
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Bookings</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    className="bg-[#D4AF37] hover:bg-[#B8941F] text-black"
                    onClick={handleCreateBooking}
                    disabled={createBookingMutation.isPending}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {createBookingMutation.isPending ? 'Creating...' : 'Create Booking'}
                  </Button>
                </div>
              </div>
            </div>

            <Card className="prada-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.tourTitle}</div>
                          <div className="text-sm text-gray-500">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                          <div className="text-sm text-gray-500">{booking.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{Number(booking.amount || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.participants}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusBadge(booking.status, 'booking')}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.paymentStatus}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateBookingMutation.mutate({
                                bookingId: booking.id,
                                data: {
                                  status: booking.status === 'pending' ? 'confirmed' : 'completed',
                                },
                              })
                            }
                            disabled={updateBookingMutation.isPending}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (!window.confirm(`Delete booking ${booking.id}?`)) return;
                              deleteBookingMutation.mutate(booking.id);
                            }}
                            disabled={deleteBookingMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filteredBookings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                          No bookings found for the selected filter.
                        </td>
                      </tr>
                    )}
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
