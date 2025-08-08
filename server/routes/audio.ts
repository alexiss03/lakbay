import express, { Request } from 'express';
import multer from 'multer';
import { OpenAI } from 'openai';

// Extend Express Request interface to include file property
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
});

// Initialize OpenAI client (will need API key)
let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Text-to-Speech endpoint
router.post('/generate-audio', async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' 
      });
    }

    const { text, voice = 'alloy', speed = 1 } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    if (text.length > 4000) {
      return res.status(400).json({ error: 'Text too long. Maximum 4000 characters allowed.' });
    }

    // Validate voice
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    if (!validVoices.includes(voice)) {
      return res.status(400).json({ error: 'Invalid voice selection' });
    }

    // Validate speed
    if (typeof speed !== 'number' || speed < 0.25 || speed > 4) {
      return res.status(400).json({ error: 'Speed must be between 0.25 and 4' });
    }

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice as any,
      input: text,
      speed: speed,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length,
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    });

    res.send(buffer);
  } catch (error) {
    console.error('Error generating audio:', error);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
});

// Speech-to-Text endpoint
router.post('/transcribe-audio', upload.single('audio'), async (req: MulterRequest, res) => {
  try {
    if (!openai) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    // Check file type
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/webm'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Please upload WAV, MP3, M4A, or WebM files.' });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: new File([req.file.buffer], 'audio.wav', { type: req.file.mimetype }),
      model: 'whisper-1',
      language: 'en', // Can be made configurable
      response_format: 'json',
    });

    res.json({
      transcription: transcription.text,
      language: 'en'
    });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// Audio analysis for travel content
router.post('/analyze-audio', upload.single('audio'), async (req: MulterRequest, res) => {
  try {
    if (!openai) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    // First transcribe the audio
    const transcription = await openai.audio.transcriptions.create({
      file: new File([req.file.buffer], 'audio.wav', { type: req.file.mimetype }),
      model: 'whisper-1',
      language: 'en',
      response_format: 'json',
    });

    // Then analyze the content using GPT
    const analysis = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an expert travel content analyst. Analyze the following audio transcription and provide insights for a travel platform called Lakbay. Focus on:
          1. Content type (tour description, safety instruction, welcome message, etc.)
          2. Emotional tone and clarity
          3. Suggestions for improvement
          4. Suitability for different travel categories
          5. Any missing important information`
        },
        {
          role: 'user',
          content: `Please analyze this travel-related audio content: "${transcription.text}"`
        }
      ],
      max_tokens: 500,
    });

    res.json({
      transcription: transcription.text,
      analysis: analysis.choices[0]?.message?.content || 'Analysis not available',
      contentType: detectContentType(transcription.text),
      wordCount: transcription.text.split(' ').length,
      estimatedDuration: Math.ceil(transcription.text.split(' ').length / 150) // Approximate speaking time
    });
  } catch (error) {
    console.error('Error analyzing audio:', error);
    res.status(500).json({ error: 'Failed to analyze audio' });
  }
});

// Generate audio for specific travel scenarios
router.post('/generate-travel-audio', async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' 
      });
    }

    const { scenario, details, voice = 'alloy', language = 'en' } = req.body;

    if (!scenario) {
      return res.status(400).json({ error: 'Scenario is required' });
    }

    // Generate appropriate text based on scenario
    let generatedText = '';
    
    switch (scenario) {
      case 'welcome':
        generatedText = `Welcome to your Lakbay adventure! ${details?.destination ? `We're excited to have you join us in ${details.destination}.` : ''} Please gather around for a brief orientation about today's activities.`;
        break;
      case 'safety':
        generatedText = `Safety briefing: Please pay close attention to the following important safety guidelines. ${details?.activity ? `For today's ${details.activity},` : ''} always stay with your group, follow your guide's instructions, and inform us immediately if you feel unwell or uncomfortable.`;
        break;
      case 'itinerary':
        generatedText = `Here's what we have planned for today's adventure. ${details?.activities ? details.activities : 'We\'ll be exploring some amazing locations and experiencing local culture.'} Please ensure you have all necessary items from your packing list.`;
        break;
      case 'cultural':
        generatedText = `Let me share some fascinating cultural insights about this region. ${details?.culturalInfo ? details.culturalInfo : 'This area has a rich history and unique traditions that have been passed down through generations.'} Please be respectful of local customs and traditions.`;
        break;
      default:
        generatedText = details?.customText || 'Welcome to your Lakbay travel experience!';
    }

    // Generate the audio
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice as any,
      input: generatedText,
      speed: 1.0,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.length,
      'X-Generated-Text': generatedText,
    });

    res.send(buffer);
  } catch (error) {
    console.error('Error generating travel audio:', error);
    res.status(500).json({ error: 'Failed to generate travel audio' });
  }
});

// Helper function to detect content type
function detectContentType(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('safety') || lowerText.includes('emergency') || lowerText.includes('careful')) {
    return 'safety_instruction';
  } else if (lowerText.includes('welcome') || lowerText.includes('hello') || lowerText.includes('greeting')) {
    return 'welcome_message';
  } else if (lowerText.includes('itinerary') || lowerText.includes('schedule') || lowerText.includes('plan')) {
    return 'tour_description';
  } else if (lowerText.includes('culture') || lowerText.includes('history') || lowerText.includes('tradition')) {
    return 'cultural_information';
  } else if (lowerText.includes('meet') || lowerText.includes('gather') || lowerText.includes('location')) {
    return 'meeting_instruction';
  } else {
    return 'general_content';
  }
}

export default router;