import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Search, MoreVertical, Phone, Video, Users, MapPin } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'host' | 'other';
  senderName: string;
  timestamp: Date;
  avatar?: string;
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  avatar?: string;
  isOnline: boolean;
  type: 'host' | 'group';
  tripTitle?: string;
  location?: string;
  participants?: number;
}

export const ChatPage = (): JSX.Element => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  const currentUserId = user?.id || 'guest_user';
  const currentUserName = user?.firstName || user?.username || 'You';

  const mockChats: Chat[] = [
    {
      id: '1',
      name: 'Sarah Chen - Host',
      lastMessage: 'The itinerary for tomorrow has been updated. Check the new meeting point!',
      lastMessageTime: new Date(Date.now() - 300000), // 5 minutes ago
      unreadCount: 2,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&crop=face',
      isOnline: true,
      type: 'host',
      tripTitle: 'Palawan Island Hopping',
      location: 'El Nido, Palawan'
    },
    {
      id: '2',
      name: 'Bohol Adventure Group',
      lastMessage: 'Mark: Can\'t wait to see the chocolate hills tomorrow! 🍫',
      lastMessageTime: new Date(Date.now() - 900000), // 15 minutes ago
      unreadCount: 5,
      isOnline: true,
      type: 'group',
      tripTitle: 'Bohol Countryside Tour',
      location: 'Bohol, Philippines',
      participants: 8
    },
    {
      id: '3',
      name: 'Miguel Santos - Host',
      lastMessage: 'Weather looks perfect for hiking. Bring your cameras!',
      lastMessageTime: new Date(Date.now() - 3600000), // 1 hour ago
      unreadCount: 0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isOnline: false,
      type: 'host',
      tripTitle: 'Mount Pulag Sunrise Trek',
      location: 'Benguet, Philippines'
    },
    {
      id: '4',
      name: 'Siargao Surf Squad',
      lastMessage: 'Lisa: The waves are incredible today! Perfect for beginners 🏄‍♀️',
      lastMessageTime: new Date(Date.now() - 7200000), // 2 hours ago
      unreadCount: 1,
      isOnline: true,
      type: 'group',
      tripTitle: 'Siargao Surf Camp',
      location: 'Siargao, Philippines',
      participants: 12
    }
  ];

  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      text: 'Hi everyone! Welcome to our Palawan adventure group. I\'m Sarah, your host for this amazing island hopping experience!',
      sender: 'host',
      senderName: 'Sarah Chen',
      timestamp: new Date(Date.now() - 86400000) // 1 day ago
    },
    {
      id: '2',
      text: 'Thank you Sarah! So excited for this trip. When do we meet tomorrow?',
      sender: 'user',
      senderName: 'You',
      timestamp: new Date(Date.now() - 86000000)
    },
    {
      id: '3',
      text: 'Meeting point is at the El Nido port at 8:00 AM sharp. Don\'t forget to bring sunscreen and your swimming gear!',
      sender: 'host',
      senderName: 'Sarah Chen',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '4',
      text: 'The itinerary for tomorrow has been updated. Check the new meeting point!',
      sender: 'host',
      senderName: 'Sarah Chen',
      timestamp: new Date(Date.now() - 300000)
    }
  ];

  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(mockMessages);

  const { data: chatRooms = [] } = useQuery<any[]>({
    queryKey: ['/api/chat/rooms', currentUserId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/chat/rooms/${currentUserId}`);
      return response.json();
    },
  });

  const backendChats: Chat[] = chatRooms.map((room: any) => ({
    id: room.id,
    name: room.name || 'Chat',
    lastMessage: room.lastMessageContent || 'No messages yet',
    lastMessageTime: room.lastMessageAt ? new Date(room.lastMessageAt) : new Date(),
    unreadCount: Number(room.unreadCount || 0),
    avatar: room.avatar || undefined,
    isOnline: true,
    type: room.type === 'direct' ? 'host' : 'group',
    tripTitle: room.name,
    participants: Number(room.participantCount || 0),
  }));

  const chats = backendChats.length > 0 ? backendChats : mockChats;

  useEffect(() => {
    if (chats.length === 0) return;
    if (!selectedChat || !chats.some((chat) => chat.id === selectedChat)) {
      setSelectedChat(chats[0].id);
    }
  }, [selectedChat, chats]);

  const isBackendChat = !!selectedChat && backendChats.some((chat) => chat.id === selectedChat);

  const { data: backendMessages = [] } = useQuery<any[]>({
    queryKey: ['/api/chat/rooms/messages', selectedChat, currentUserId],
    queryFn: async () => {
      const response = await apiRequest(
        'GET',
        `/api/chat/rooms/${selectedChat}/messages?userId=${encodeURIComponent(currentUserId)}`,
      );
      return response.json();
    },
    enabled: Boolean(selectedChat && isBackendChat),
  });

  const normalizedBackendMessages: ChatMessage[] = [...backendMessages]
    .reverse()
    .map((message: any) => ({
      id: message.id,
      text: message.content,
      sender: message.senderId === currentUserId ? 'user' : 'host',
      senderName: message.senderName || 'Host',
      timestamp: message.createdAt ? new Date(message.createdAt) : new Date(),
      avatar: message.senderAvatar || undefined,
    }));

  const messages = isBackendChat ? normalizedBackendMessages : localMessages;

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedChat) return null;
      const response = await apiRequest('POST', `/api/chat/rooms/${selectedChat}/messages`, {
        senderId: currentUserId,
        senderName: currentUserName,
        content,
        type: 'text',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms/messages', selectedChat, currentUserId] });
      queryClient.invalidateQueries({ queryKey: ['/api/chat/rooms', currentUserId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Message failed',
        description: error.message || 'Unable to send message.',
        variant: 'destructive',
      });
    },
  });

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.tripTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hostChats = filteredChats.filter(chat => chat.type === 'host');
  const groupChats = filteredChats.filter(chat => chat.type === 'group');

  const sendMessage = () => {
    const content = messageInput.trim();
    if (!content || !selectedChat) return;

    setMessageInput('');

    if (isBackendChat) {
      sendMessageMutation.mutate(content);
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: content,
      sender: 'user',
      senderName: currentUserName,
      timestamp: new Date()
    };

    setLocalMessages((prev) => [...prev, newMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  return (
    <div className="min-h-screen view-shell fit-screen">
      {/* Header */}
      <header className="view-header">
        <div className="flex items-center justify-between">
          {/* Left: Logo placeholder */}
          <div className="w-8 h-8 bg-black" style={{borderRadius: '1px'}}></div>
          
          {/* Center: Navigation */}
          <nav className="flex items-center space-x-12">
            <Link href="/" className="prada-nav text-gray-700 hover:text-black transition-colors">Home</Link>
            <Link href="/trips" className="prada-nav text-gray-700 hover:text-black transition-colors">Trips</Link>
            <Link href="/chats" className="prada-nav text-black hover:text-gray-600 transition-colors">Chats</Link>
            <Link href="/trails" className="prada-nav text-gray-700 hover:text-black transition-colors">Trails</Link>
            <Link href="/story" className="prada-nav text-gray-700 hover:text-black transition-colors">Story</Link>
            <Link href="/shop" className="prada-nav text-gray-700 hover:text-black transition-colors">Shop</Link>
            <Link href="/corporate" className="prada-nav text-gray-700 hover:text-black transition-colors">Corporate</Link>
          </nav>
          
          {/* Right: Buttons and Language */}
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="outline" className="prada-button h-9 px-6 text-xs font-light border-black text-black hover:bg-black hover:text-white">
                LOG IN
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="prada-button prada-gold-accent h-9 px-6 text-xs font-light">
                REGISTER
              </Button>
            </Link>
            <span className="text-xs text-gray-500 font-light ml-4">EN</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex h-[calc(100vh-200px)] fit-panel rounded-[34px] overflow-hidden">
          {/* Chat List Sidebar */}
          <div className="w-1/3 border-r border-[#f1efef] flex flex-col bg-white/80">
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search chats..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Chat Tabs */}
            <Tabs defaultValue="all" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mx-4 mt-4 bg-[#fff2eb] rounded-full p-1">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="hosts">Hosts</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="flex-1 overflow-y-auto">
                <div className="space-y-1 p-2">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedChat === chat.id ? 'bg-[#fff1ea] border-l-4 border-[#ff6c2f]' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={chat.avatar} />
                            <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {chat.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">{formatTime(chat.lastMessageTime)}</span>
                              {chat.unreadCount > 0 && (
                                <Badge className="bg-[#ff6c2f] text-white text-xs px-2 py-0">
                                  {chat.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                          <div className="flex items-center mt-1 space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {chat.type === 'group' ? <Users className="w-3 h-3 mr-1" /> : null}
                              {chat.tripTitle}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="hosts" className="flex-1 overflow-y-auto">
                <div className="space-y-1 p-2">
                  {hostChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedChat === chat.id ? 'bg-[#fff1ea] border-l-4 border-[#ff6c2f]' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={chat.avatar} />
                            <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {chat.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                            <span className="text-xs text-gray-500">{formatTime(chat.lastMessageTime)}</span>
                          </div>
                          <p className="text-xs text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                          <div className="flex items-center mt-1 space-x-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{chat.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="groups" className="flex-1 overflow-y-auto">
                <div className="space-y-1 p-2">
                  {groupChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedChat === chat.id ? 'bg-[#fff1ea] border-l-4 border-[#ff6c2f]' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 fit-orange rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-black" />
                          </div>
                          {chat.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm truncate">{chat.name}</h3>
                            <span className="text-xs text-gray-500">{formatTime(chat.lastMessageTime)}</span>
                          </div>
                          <p className="text-xs text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                          <div className="flex items-center mt-1 space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {chat.participants} participants
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{chat.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-[#f1efef] bg-white flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedChatData?.avatar} />
                      <AvatarFallback>{selectedChatData?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{selectedChatData?.name}</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${selectedChatData?.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span className="text-sm text-gray-600">
                          {selectedChatData?.isOnline ? 'Online' : 'Offline'}
                        </span>
                        {selectedChatData?.type === 'group' && (
                          <span className="text-sm text-gray-600">• {selectedChatData.participants} members</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f7f7]">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {message.sender !== 'user' && (
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={selectedChatData?.avatar} />
                            <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          {message.sender !== 'user' && (
                            <p className="text-xs text-gray-500 mb-1">{message.senderName}</p>
                          )}
                          <div
                            className={`px-4 py-2 rounded-lg ${
                              message.sender === 'user'
                                ? 'fit-orange text-white'
                                : 'bg-white text-gray-900 border'
                            }`}
                          >
                            {message.text}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t bg-white">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!messageInput.trim() || sendMessageMutation.isPending}
                      className="prada-button prada-gold-accent"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a chat to start messaging</h3>
                  <p className="text-gray-600">Choose from your host conversations or group chats to continue</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
