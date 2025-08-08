import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, Download, Volume2, Loader2 } from 'lucide-react';

interface AdminAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripData: {
    title: string;
    duration: string;
    price: string;
    category: string;
    host: {
      name: string;
      bio: string;
    };
    itinerary: Array<{
      day: number;
      title: string;
      description: string;
    }>;
    meetingPlace?: string;
  };
}

export const AdminAudioModal: React.FC<AdminAudioModalProps> = ({ isOpen, onClose, tripData }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('welcome');
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [speed, setSpeed] = useState([1]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Available voices for text-to-speech
  const voices = [
    { id: 'alloy', name: 'Alloy', description: 'Neutral, balanced voice' },
    { id: 'echo', name: 'Echo', description: 'Male, clear and professional' },
    { id: 'fable', name: 'Fable', description: 'British accent, storytelling' },
    { id: 'onyx', name: 'Onyx', description: 'Deep, authoritative voice' },
    { id: 'nova', name: 'Nova', description: 'Female, warm and friendly' },
    { id: 'shimmer', name: 'Shimmer', description: 'Female, energetic and bright' }
  ];

  // Pre-determined text templates based on trip data
  const templates = {
    welcome: {
      name: 'Welcome Message',
      text: `Welcome to ${tripData.title}! I'm ${tripData.host.name}, your guide for this amazing ${tripData.duration} adventure. We're excited to have you join us for this incredible experience. ${tripData.meetingPlace ? `Please meet us at ${tripData.meetingPlace} at the designated time.` : ''} Let's make this journey unforgettable!`
    },
    safety: {
      name: 'Safety Briefing',
      text: `Safety briefing for ${tripData.title}: Please pay close attention to the following important safety guidelines. Always stay with your group and follow your guide's instructions. Inform us immediately if you feel unwell or uncomfortable. We have emergency protocols in place and your safety is our top priority throughout this ${tripData.duration} experience.`
    },
    itinerary: {
      name: 'Itinerary Overview',
      text: `Here's what we have planned for ${tripData.title}. ${tripData.itinerary.map((day, index) => 
        `Day ${day.day}: ${day.title} - ${day.description}`
      ).join('. ')} This ${tripData.duration} journey is priced at ${tripData.price} and promises to be an unforgettable experience.`
    },
    cultural: {
      name: 'Cultural Information',
      text: `Let me share some fascinating cultural insights about our ${tripData.title} experience. This region has a rich history and unique traditions that have been passed down through generations. During our ${tripData.duration} journey, we'll explore local customs, meet community members, and learn about the authentic way of life. Please be respectful of local traditions and customs throughout our adventure.`
    },
    closing: {
      name: 'Closing Message',
      text: `Thank you for choosing ${tripData.title} for your adventure! We hope this ${tripData.duration} experience has been memorable and enriching. ${tripData.host.name} and our entire team appreciate your participation. We'd love to hear your feedback and hope to welcome you back for future adventures with Lakbay. Safe travels!`
    }
  };

  // Update text when template changes
  useEffect(() => {
    if (selectedTemplate && templates[selectedTemplate as keyof typeof templates]) {
      setText(templates[selectedTemplate as keyof typeof templates].text);
    }
  }, [selectedTemplate, tripData]);

  // Initialize with welcome template
  useEffect(() => {
    if (isOpen) {
      setSelectedTemplate('welcome');
      setText(templates.welcome.text);
      setAudioUrl(null);
      setIsPlaying(false);
    }
  }, [isOpen, tripData]);

  const generateAudio = async () => {
    if (!text.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter text to generate audio",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text.trim(),
          voice,
          speed: speed[0]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      toast({
        title: "Audio Generated",
        description: "Your trip audio is ready to play!",
      });
    } catch (error) {
      console.error('Error generating audio:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate audio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `${tripData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${selectedTemplate}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
    };
  }, [audioUrl]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#D4AF37]" />
            Generate Audio for {tripData.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Template Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Content Template:</label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(templates).map(([key, template]) => (
                  <SelectItem key={key} value={key}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Text Editor */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Audio Script (Edit as needed):
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Edit the pre-generated text for your trip..."
              rows={6}
              maxLength={4000}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {text.length}/4000 characters
            </div>
          </div>

          {/* Voice and Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Voice Selection:</label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      <div>
                        <div className="font-medium">{v.name}</div>
                        <div className="text-xs text-gray-500">{v.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Speed: {speed[0]}x
              </label>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                min={0.25}
                max={4}
                step={0.25}
                className="mt-2"
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={generateAudio} 
            disabled={isGenerating || !text.trim()}
            className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Audio...
              </>
            ) : (
              'Generate Trip Audio'
            )}
          </Button>

          {/* Audio Player */}
          {audioUrl && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Audio Ready
                </Badge>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={togglePlayback}
                    className="flex items-center gap-1"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadAudio}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
              <audio ref={audioRef} src={audioUrl} className="w-full" controls />
            </div>
          )}

          {/* Trip Context Display */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Trip Context</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <span className="font-medium">Category:</span> {tripData.category}
              </div>
              <div>
                <span className="font-medium">Duration:</span> {tripData.duration}
              </div>
              <div>
                <span className="font-medium">Price:</span> {tripData.price}
              </div>
              <div>
                <span className="font-medium">Host:</span> {tripData.host.name}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};