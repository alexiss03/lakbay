import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, Download, Volume2, Mic, Square } from 'lucide-react';

interface AudioGeneratorProps {
  className?: string;
}

export const AudioGenerator: React.FC<AudioGeneratorProps> = ({ className }) => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [speed, setSpeed] = useState([1]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
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

  // Travel-related sample texts
  const sampleTexts = [
    "Welcome to Lakbay! Discover the hidden gems of the Philippines with our authentic travel experiences.",
    "Join us for an unforgettable island hopping adventure in Palawan, where crystal clear waters meet pristine white sand beaches.",
    "Experience the rich culture of the Philippines through our guided tours, featuring local cuisines, traditional crafts, and historical landmarks.",
    "Your safety is our priority. Please listen carefully to your guide's instructions and follow all safety protocols during activities."
  ];

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
        description: "Your audio is ready to play!",
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
    link.download = 'lakbay-audio.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setRecordedAudio(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Failed",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Your recording is ready for playback",
      });
    }
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
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Text-to-Speech Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Audio Generation for Travel Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sample Text Buttons */}
          <div>
            <label className="text-sm font-medium mb-2 block">Quick Start Templates:</label>
            <div className="flex flex-wrap gap-2">
              {sampleTexts.map((sample, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setText(sample)}
                  className="text-xs"
                >
                  Template {index + 1}
                </Button>
              ))}
            </div>
          </div>

          {/* Text Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">Text to Convert:</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to convert to audio... Perfect for travel announcements, tour descriptions, safety instructions, and welcome messages."
              rows={4}
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
            {isGenerating ? 'Generating Audio...' : 'Generate Audio'}
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
        </CardContent>
      </Card>

      {/* Voice Recording */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Recording
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Record your own audio for personalized travel messages, tour guides, or announcements.
          </p>

          <div className="flex gap-2">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Start Recording
                </>
              )}
            </Button>
          </div>

          {recordedAudio && (
            <div className="bg-gray-50 rounded-lg p-4">
              <Badge variant="outline" className="text-blue-600 border-blue-600 mb-3">
                Recording Complete
              </Badge>
              <audio src={recordedAudio} controls className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Use Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Audio Use Cases for Travel Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Content Creation</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tour descriptions and itineraries</li>
                <li>• Welcome messages for guests</li>
                <li>• Cultural information and stories</li>
                <li>• Historical facts about destinations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">Safety & Operations</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Safety instructions and protocols</li>
                <li>• Emergency procedures</li>
                <li>• Meeting point announcements</li>
                <li>• Activity briefings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};