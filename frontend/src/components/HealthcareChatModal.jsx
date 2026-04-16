import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle } from 'lucide-react';

const HealthcareChatModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Welcome message on open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        type: 'ai',
        content: 'Hello! I\'m your Healthcare AI assistant. I can help you understand symptoms, suggest treatments, and advise when to see a doctor. What health concern can I help you with today?',
        confidence: null,
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/medical-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          session_id: sessionId
        })
      });

      const data = await response.json();

      if (!sessionId) {
        setSessionId(data.session_id);
      }

      const aiMessage = {
        type: 'ai',
        content: data.message,
        confidence: data.confidence_score,
        doctorRecommended: data.doctor_recommended,
        doctorReason: data.doctor_reason,
        suggestions: data.suggestions,
        messageId: Date.now().toString(),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId, isCorrect) => {
    try {
      await fetch(`${API_URL}/api/medical-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message_id: messageId,
          is_correct: isCorrect
        })
      });

      // Update message to show feedback submitted
      setMessages(prev => prev.map(msg => 
        msg.messageId === messageId 
          ? { ...msg, feedbackSubmitted: isCorrect ? 'correct' : 'incorrect' }
          : msg
      ));
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl h-[90vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
            <div>
              <h2 className="text-2xl font-bold text-white">Healthcare AI Assistant</h2>
              <p className="text-sm text-gray-400 mt-1">AI + Human Wisdom • Real-time Analysis</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : msg.type === 'error'
                      ? 'bg-red-500/20 border border-red-500/30 text-red-200'
                      : 'bg-gray-800 border border-gray-700 text-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  {/* AI Message Extras */}
                  {msg.type === 'ai' && msg.confidence !== null && (
                    <div className="mt-4 space-y-3">
                      {/* Confidence Score */}
                      <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <span className="text-xs text-gray-400">AI Confidence</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                msg.confidence >= 80
                                  ? 'bg-green-500'
                                  : msg.confidence >= 60
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${msg.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-white">
                            {msg.confidence.toFixed(0)}%
                          </span>
                        </div>
                      </div>

                      {/* Doctor Recommendation */}
                      {msg.doctorRecommended && (
                        <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-amber-400">Doctor Visit Recommended</p>
                            <p className="text-xs text-amber-200 mt-1">{msg.doctorReason}</p>
                          </div>
                        </div>
                      )}

                      {/* Suggestions */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-400 font-semibold">💡 Suggestions:</p>
                          <ul className="space-y-1">
                            {msg.suggestions.map((suggestion, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Feedback Buttons */}
                      {msg.messageId && !msg.feedbackSubmitted && (
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                          <span className="text-xs text-gray-400">Was this helpful?</span>
                          <button
                            onClick={() => handleFeedback(msg.messageId, true)}
                            className="p-1.5 hover:bg-green-500/20 rounded-lg transition-colors group"
                          >
                            <ThumbsUp className="w-4 h-4 text-gray-400 group-hover:text-green-400" />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.messageId, false)}
                            className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors group"
                          >
                            <ThumbsDown className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                          </button>
                        </div>
                      )}

                      {msg.feedbackSubmitted && (
                        <p className="text-xs text-gray-500 italic pt-2 border-t border-gray-700">
                          Thank you for your feedback! 🙏
                        </p>
                      )}
                    </div>
                  )}

                  <span className="text-xs text-gray-400 mt-2 block">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-700 bg-gray-900/50">
            <div className="flex gap-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms or ask a health question..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="2"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ⚠️ This is AI-powered advice. Always consult a healthcare professional for medical diagnosis and treatment.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HealthcareChatModal;
