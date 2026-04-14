'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Send, Loader2, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const quickSuggestions = ['H-1B Visa', 'F-1 Student', 'US Citizen Sponsor', 'Outside US'];

const offlineScriptedQuestions = [
  {
    question: "What's your current immigration status?",
    suggestions: ['H-1B Visa holder', 'F-1 Student', 'Visa visitor', 'No status'],
  },
  {
    question: 'Do you have a job offer from a US employer?',
    suggestions: ['Yes, currently employed', 'Yes, pending', 'No'],
  },
  {
    question: 'Do you have family in the US?',
    suggestions: ['US Citizen spouse', 'US Citizen parent', 'US Citizen sibling', 'No'],
  },
  {
    question: 'What is your current location?',
    suggestions: ['Inside US', 'Outside US'],
  },
  {
    question: 'How long have you been in the US?',
    suggestions: ['Less than 1 year', '1-3 years', '3-5 years', 'More than 5 years'],
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const [offlineQuestionIndex, setOfflineQuestionIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check API availability on mount
  useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'HEAD',
        });
        setApiAvailable(response.ok);
        if (!response.ok) {
          setOfflineMode(true);
          initializeOfflineMode();
        }
      } catch (error) {
        setApiAvailable(false);
        setOfflineMode(true);
        initializeOfflineMode();
      }
    };

    checkAPI();
  }, []);

  const initializeOfflineMode = () => {
    const welcomeMessage: Message = {
      id: '0',
      type: 'ai',
      content: `Hello! I'm your GreenCard AI Assistant. I'm currently in demo mode, but I can still help you understand your visa options! Let me ask you some questions about your immigration situation.`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    setOfflineQuestionIndex(0);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(
    async (messageText?: string) => {
      const textToSend = messageText || input.trim();
      if (!textToSend) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: textToSend,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      try {
        if (offlineMode) {
          // Simulated offline response
          setTimeout(() => {
            const nextQuestion = offlineScriptedQuestions[offlineQuestionIndex + 1];
            if (nextQuestion && offlineQuestionIndex < offlineScriptedQuestions.length - 1) {
              const aiMessage: Message = {
                id: Date.now().toString(),
                type: 'ai',
                content: nextQuestion.question,
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, aiMessage]);
              setOfflineQuestionIndex((prev) => prev + 1);
            } else {
              const summaryMessage: Message = {
                id: Date.now().toString(),
                type: 'ai',
                content: `Great! Based on your answers, I can see you have a promising case. Your situation likely qualifies for one of several visa pathways. Would you like me to create a detailed assessment report? You can then view it by going to your assessment page.`,
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, summaryMessage]);
            }
            setIsLoading(false);
          }, 800);
        } else {
          // Stream response from API
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: [
                ...messages.map((m) => ({
                  role: m.type === 'user' ? 'user' : 'assistant',
                  content: m.content,
                })),
                { role: 'user', content: textToSend },
              ],
            }),
          });

          if (!response.ok) throw new Error('API request failed');

          const reader = response.body?.getReader();
          if (!reader) throw new Error('No response body');

          let aiContent = '';
          const aiMessageId = Date.now().toString();

          const decoder = new TextDecoder();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            aiContent += chunk;

            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage?.id === aiMessageId) {
                return [
                  ...prev.slice(0, -1),
                  { ...lastMessage, content: aiContent },
                ];
              }
              return [
                ...prev,
                {
                  id: aiMessageId,
                  type: 'ai' as const,
                  content: aiContent,
                  timestamp: new Date(),
                },
              ];
            });
          }

          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
      }
    },
    [messages, input, offlineMode, offlineQuestionIndex]
  );

  // Initialize with welcome message when offline
  useEffect(() => {
    if (messages.length === 0 && offlineMode) {
      initializeOfflineMode();
    }
  }, [offlineMode, messages.length]);

  const messageCount = messages.filter((m) => m.type === 'user').length;
  const showAssessmentLink = messageCount >= 5;

  return (
    <div className="h-screen flex flex-col bg-midnight">
      {/* Header */}
      <div className="border-b border-white/10 bg-surface/30 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-brand to-blue-accent flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-primary">GreenCard AI Advisor</h1>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-brand animate-pulse-glow" />
                <span className="text-secondary">Online</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-4">
            <Badge variant={apiAvailable ? 'green' : 'amber'} withPulse={!apiAvailable}>
              {apiAvailable === null ? 'Checking...' : apiAvailable ? 'Live AI' : 'Demo Mode'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 space-y-6"
            >
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-primary">
                  Welcome to GreenCard AI
                </h2>
                <p className="text-secondary max-w-md mx-auto">
                  I'll help you understand your visa options and guide you through your immigration journey.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                {quickSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSendMessage(suggestion)}
                    className="p-3 rounded-lg border border-white/10 hover:bg-surface/50 hover:border-white/20 transition-all text-left text-secondary hover:text-primary"
                  >
                    <p className="font-medium">{suggestion}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md lg:max-w-2xl rounded-lg px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-green-brand text-white rounded-br-none'
                      : 'bg-surface/60 border border-white/10 text-primary rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </motion.div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-surface/60 border border-white/10 rounded-lg rounded-bl-none px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-green-brand" />
                <span className="text-secondary text-sm">AI is thinking...</span>
              </div>
            </motion.div>
          )}

          {/* Assessment CTA */}
          {showAssessmentLink && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="my-4"
            >
              <Card withGradientBorder withGlow className="p-4 border-green-brand/50">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-green-brand flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-primary font-semibold mb-2">Ready for your assessment?</p>
                    <p className="text-secondary text-sm mb-4">
                      Based on our conversation, I can generate a detailed assessment of your case.
                    </p>
                    <Link href="/assessment">
                      <button className="text-green-brand hover:text-green-light transition-colors text-sm font-medium flex items-center gap-2">
                        View Assessment <Zap className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-surface/30 backdrop-blur-md sticky bottom-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Offline suggestions */}
          {offlineMode && offlineQuestionIndex < offlineScriptedQuestions.length && (
            <div className="mb-4 flex gap-2 flex-wrap">
              {offlineScriptedQuestions[offlineQuestionIndex].suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSendMessage(suggestion)}
                  className="px-3 py-1.5 text-sm rounded-full bg-green-brand/15 border border-green-brand/30 text-green-light hover:bg-green-brand/25 hover:border-green-brand/50 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input field */}
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ask me about your visa options, timeline, or requirements..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              variant="primary"
              size="md"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-muted text-xs mt-3">
            GreenCard.ai is not a law firm. Always consult with a qualified immigration attorney for legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
