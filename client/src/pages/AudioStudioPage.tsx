import React from 'react';
import { AudioGenerator } from '@/components/AudioGenerator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Headphones, Mic, Volume2 } from 'lucide-react';
import { Link } from 'wouter';

const AudioStudioPage: React.FC = () => {
  return (
    <div className="min-h-screen view-shell">
      {/* Header */}
      <header className="view-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <Headphones className="w-6 h-6 text-[#D4AF37]" />
                <h1 className="text-xl font-semibold text-gray-900">Lakbay Audio Studio</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Introduction */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Professional Audio Generation for Travel Content
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Create high-quality audio content for your travel experiences. Generate voice-overs for tour descriptions, 
            safety instructions, welcome messages, and more using advanced AI technology.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
            <Volume2 className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Text-to-Speech</h3>
            <p className="text-sm text-gray-600">
              Convert written content into natural-sounding speech with multiple voice options
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
            <Mic className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Voice Recording</h3>
            <p className="text-sm text-gray-600">
              Record your own audio messages and announcements directly in the browser
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
            <Headphones className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Audio Analysis</h3>
            <p className="text-sm text-gray-600">
              Analyze recorded content for quality, clarity, and travel-specific insights
            </p>
          </div>
        </div>

        {/* Audio Generator Component */}
        <AudioGenerator />

        {/* Additional Information */}
        <div className="mt-12 bg-white rounded-lg p-8 shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Perfect for Travel Professionals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Tour Guides & Hosts</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Pre-recorded welcome messages</li>
                <li>• Safety briefings and instructions</li>
                <li>• Cultural and historical narrations</li>
                <li>• Multilingual content creation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Travel Agencies</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Destination promotional content</li>
                <li>• Itinerary descriptions</li>
                <li>• Customer service messages</li>
                <li>• Emergency contact information</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Requirements */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Technical Requirements</h4>
          <p className="text-sm text-blue-700">
            To use the text-to-speech features, an OpenAI API key is required. Voice recording works directly in your browser 
            with microphone permissions. All generated audio can be downloaded in MP3 format for use in your travel content.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AudioStudioPage;