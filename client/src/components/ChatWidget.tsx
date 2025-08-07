import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { X, MessageCircle, Send, Bot, User, Grid3X3, Plus, Trash2, BarChart3 } from "lucide-react";

interface Poll {
  id: string;
  question: string;
  options: { text: string; votes: number }[];
  totalVotes: number;
  createdBy: string;
  timestamp: Date;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support' | 'host';
  timestamp: Date;
  poll?: Poll;
}

export const ChatWidget = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! Welcome to Lakbay Travel Support. How can I help you today?',
      sender: 'support',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [userRole] = useState<'user' | 'host'>('host'); // For demo purposes, set as host
  const [votedPolls, setVotedPolls] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate support response
    setTimeout(() => {
      const supportResponses = [
        "Thank you for your message! I'm here to help you with any questions about our travel packages.",
        "I'd be happy to assist you with booking information, trip details, or payment options.",
        "For immediate assistance with bookings, you can also call us at +63 912 345 6789.",
        "Is there a specific destination or trip you're interested in? I can provide more details.",
        "Our team is available 24/7 to help make your travel dreams come true!"
      ];

      const randomResponse = supportResponses[Math.floor(Math.random() * supportResponses.length)];
      
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'support',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, supportMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const createPoll = () => {
    if (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim())) return;

    const poll: Poll = {
      id: Date.now().toString(),
      question: pollQuestion,
      options: pollOptions.filter(opt => opt.trim()).map(opt => ({ text: opt, votes: 0 })),
      totalVotes: 0,
      createdBy: 'Host',
      timestamp: new Date()
    };

    const pollMessage: Message = {
      id: Date.now().toString(),
      text: '',
      sender: 'host',
      timestamp: new Date(),
      poll
    };

    setMessages(prev => [...prev, pollMessage]);
    setPollQuestion('');
    setPollOptions(['', '']);
    setShowPollModal(false);
    setShowAppsMenu(false);
  };

  const voteOnPoll = (pollId: string, optionIndex: number) => {
    if (votedPolls.has(pollId)) return;

    setMessages(prev => prev.map(message => {
      if (message.poll?.id === pollId) {
        const updatedPoll = { ...message.poll };
        updatedPoll.options[optionIndex].votes += 1;
        updatedPoll.totalVotes += 1;
        return { ...message, poll: updatedPoll };
      }
      return message;
    }));

    setVotedPolls(prev => new Set(Array.from(prev).concat(pollId)));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Widget */}
      {isOpen && (
        <Card className="mb-4 w-80 h-96 shadow-2xl border-0 overflow-hidden">
          {/* Header */}
          <div className="bg-[#D4AF37] text-black p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Lakbay Support</h3>
                <p className="text-xs opacity-80">Online now</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 h-64 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-2 max-w-[85%]`}>
                  {(message.sender === 'support' || message.sender === 'host') && (
                    <div className={`w-6 h-6 ${message.sender === 'host' ? 'bg-purple-600' : 'bg-[#D4AF37]'} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {message.sender === 'host' ? (
                        <BarChart3 className="w-3 h-3 text-white" />
                      ) : (
                        <Bot className="w-3 h-3 text-white" />
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    {message.poll ? (
                      // Poll Message
                      <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <BarChart3 className="w-4 h-4 text-purple-600 mr-2" />
                          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Poll by {message.poll.createdBy}</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-3">{message.poll.question}</h4>
                        <div className="space-y-2">
                          {message.poll.options.map((option, index) => {
                            const percentage = message.poll!.totalVotes > 0 ? (option.votes / message.poll!.totalVotes) * 100 : 0;
                            const hasVoted = votedPolls.has(message.poll!.id);
                            return (
                              <div key={index}>
                                <button
                                  onClick={() => voteOnPoll(message.poll!.id, index)}
                                  disabled={hasVoted}
                                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                                    hasVoted 
                                      ? 'bg-gray-50 cursor-not-allowed' 
                                      : 'hover:bg-purple-50 hover:border-purple-300 cursor-pointer'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-900">{option.text}</span>
                                    {hasVoted && (
                                      <span className="text-xs text-gray-500">
                                        {option.votes} votes ({percentage.toFixed(0)}%)
                                      </span>
                                    )}
                                  </div>
                                  {hasVoted && (
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                        {votedPolls.has(message.poll.id) && (
                          <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500 text-center">
                            Total votes: {message.poll.totalVotes}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular Message
                      <div
                        className={`px-3 py-2 rounded-lg text-sm ${
                          message.sender === 'user'
                            ? 'bg-gray-900 text-white rounded-br-none'
                            : message.sender === 'host'
                            ? 'bg-purple-100 text-purple-900 rounded-bl-none border border-purple-200'
                            : 'bg-white text-gray-900 rounded-bl-none border'
                        }`}
                      >
                        {message.text}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(message.timestamp)}
                      {message.sender === 'host' && <span className="ml-2 text-purple-600">• Host</span>}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2">
                  <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white text-gray-900 rounded-lg rounded-bl-none border px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Apps Menu */}
          {showAppsMenu && (
            <div className="p-4 border-t bg-white">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Chat Apps</h4>
                {userRole === 'host' && (
                  <Button
                    onClick={() => setShowPollModal(true)}
                    variant="outline"
                    className="w-full justify-start text-sm h-10"
                  >
                    <BarChart3 className="w-4 h-4 mr-3" />
                    Create Poll
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm h-10"
                  disabled
                >
                  <div className="w-4 h-4 mr-3 bg-gray-300 rounded"></div>
                  More apps coming soon
                </Button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowAppsMenu(!showAppsMenu)}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 text-sm"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-black"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Lakbay Travel Support
            </p>
          </div>
        </Card>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#D4AF37] hover:bg-[#B8941F] text-black shadow-lg hover:shadow-xl transition-all duration-300 relative"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            {/* Notification Dot */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">1</span>
            </div>
          </>
        )}
      </Button>

      {/* Poll Creation Modal */}
      <Dialog open={showPollModal} onOpenChange={setShowPollModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
              Create Poll
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="poll-question" className="text-sm font-medium">
                Poll Question
              </Label>
              <Input
                id="poll-question"
                placeholder="Ask a question..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Poll Options</Label>
              <div className="space-y-2 mt-2">
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                      className="flex-1"
                    />
                    {pollOptions.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePollOption(index)}
                        className="px-3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPollOption}
                    className="w-full mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Option
                  </Button>
                )}
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPollModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={createPoll}
                disabled={!pollQuestion.trim() || pollOptions.some(opt => !opt.trim())}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Create Poll
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};