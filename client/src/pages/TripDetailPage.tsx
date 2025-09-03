import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ChatWidget } from "@/components/ChatWidget";
import { TrailMap } from "@/components/TrailMap";
import { AdminAudioModal } from "@/components/AdminAudioModal";
import { MapPin, Star, Clock, Users, Calendar, Shield, AlertTriangle, CheckCircle2, Mountain, TrendingUp, MapIcon, Headphones, Play, Pause, Download, Volume2, Utensils, Package, Brain, Award, Timer, Target, ShoppingCart, Heart, Search, Monitor } from "lucide-react";

interface TripDetailPageProps {
  params?: {
    id?: string;
  };
}

// Type for quiz data
interface QuizTrip {
  title: string;
  duration: string;
  price: string;
  category: string;
  heroImage: string;
  host: { name: string; avatar: string; bio: string; };
  meetingPlace: string;
  mapCenter: { lat: number; lng: number };
  quiz: {
    title: string;
    description: string;
    totalQuestions: number;
    timeLimit: number;
    passingScore: number;
    questions: Array<{
      id: number;
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    }>;
  };
}

export const TripDetailPage = ({ params }: TripDetailPageProps): JSX.Element => {
  const [location] = useLocation();
  const [guests, setGuests] = useState("1 guest");
  const [checkIn, setCheckIn] = useState("09/14/2025");
  const [checkOut, setCheckOut] = useState("09/16/2025");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("Event details");
  const [isBooked, setIsBooked] = useState(false); // Trip booking status
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioTrack, setCurrentAudioTrack] = useState<number | null>(null);
  const [showAudioModal, setShowAudioModal] = useState(false);
  
  // Mock admin check - in real app this would come from auth context
  const isAdmin = true; // For demo purposes
  const [activeNavTab, setActiveNavTab] = useState("Home");
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  
  const { toast } = useToast();

  // Simple trip data function for debugging
  const getTripData = () => {
    return {
      title: "Sample Trip",
      duration: "3 Days 2 Nights",
      price: "PHP 12,500",
      category: "hiking",
      heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3",
      host: { 
        name: "Sample Host", 
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        bio: "Experienced guide"
      },
      meetingPlace: "Sample Location",
      mapCenter: { lat: 14.5995, lng: 120.9842 }
    };
  };

  const trip = getTripData();

  return (
    <div className="min-h-screen bg-white">
      <h1>Trip Detail Page - {trip.title}</h1>
      <p>Category: {trip.category}</p>
      <p>Duration: {trip.duration}</p>
      <p>Price: {trip.price}</p>
    </div>
  );
};