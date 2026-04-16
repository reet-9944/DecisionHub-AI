import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Heart, Pill, Stethoscope, Activity, Brain, 
  Droplet, HeartPulse, Users, Award, TrendingUp, ArrowLeft,
  MessageSquare, Send, ThumbsUp, ThumbsDown, CheckCircle, AlertCircle
} from 'lucide-react';

const HealthcareDashboard = () => {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [humanReviewOpen, setHumanReviewOpen] = useState(false);
  const [currentReviewMessage, setCurrentReviewMessage] = useState(null);

  const API_URL = process.env.REACT_APP_BACKEND_URL;

  const treatments = [
    { name: "Alzheimer's Disease", icon: Brain, color: 'from-orange-400 to-orange-600' },
    { name: 'Chronic Hepatitis', icon: Activity, color: 'from-lime-400 to-green-600' },
    { name: 'Chronic Kidney Disease', icon: Droplet, color: 'from-cyan-400 to-teal-600' },
    { name: 'Atrial Fibrillation', icon: HeartPulse, color: 'from-pink-400 to-rose-600' },
  ];

  const stats = [
    { number: '100+', label: 'Treatments' },
    { number: '90+', label: 'Specialists' },
    { number: '99%', label: 'Success Rate' },
  ];

  const products = [
    { name: 'Sample - Composition 1', description: 'Homeopathic Disease Name', image: 'https://images.pexels.com/photos/356054/pexels-photo-356054.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Sample - Composition 2', description: 'Homeopathic Disease Name', image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Sample - Composition 3', description: 'Homeopathic Disease Name', image: 'https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { name: 'Sample - Composition 4', description: 'Homeopathic Disease Name', image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=300' },
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { type: 'user', content: inputMessage, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/medical-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage, session_id: sessionId })
      });
      const data = await response.json();
      if (!sessionId) setSessionId(data.session_id);
      setMessages(prev => [...prev, {
        type: 'ai',
        content: data.message,
        confidence: data.confidence_score,
        doctorRecommended: data.doctor_recommended,
        doctorReason: data.doctor_reason,
        suggestions: data.suggestions,
        messageId: Date.now().toString(),
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (messageId, isCorrect) => {
    try {
      await fetch(`${API_URL}/api/medical-feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message_id: messageId, is_correct: isCorrect })
      });
      setMessages(prev => prev.map(msg =>
        msg.messageId === messageId ? { ...msg, feedbackSubmitted: isCorrect ? 'correct' : 'incorrect' } : msg
      ));
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header with Back Button */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-md sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </button>
          <h1 className="text-2xl font-bold text-green-800">Healthcare AI Dashboard</h1>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            AI Assistant
          </button>
        </div>
      </motion.div>

      {/* Hero Section - Schedule Appointment */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20 px-6"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h2
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              className="text-5xl font-bold mb-6"
            >
              Schedule an Appointment
            </motion.h2>
            <p className="text-xl mb-8 text-green-50">
              Get personalized healthcare guidance powered by AI + Human expertise
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChatOpen(true)}
              className="flex items-center gap-2 px-8 py-4 bg-white text-green-600 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              <Calendar className="w-5 h-5" />
              Book Appointment
            </motion.button>
          </div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative"
          >
            <img
              src="https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Healthcare team"
              className="rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Treatments Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              <span className="text-emerald-500">Expert</span> Treatments for every condition
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatments.map((treatment, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                whileInView={{ y: 0, opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.15,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -15, 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}
                className={`bg-gradient-to-br ${treatment.color} rounded-3xl p-6 text-white shadow-xl cursor-pointer relative overflow-hidden`}
              >
                {/* Animated background blob */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"
                />
                
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <treatment.icon className="w-12 h-12 mb-4 relative z-10" />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-2 relative z-10">{treatment.name}</h3>
                <motion.button
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold relative z-10"
                >
                  Learn More →
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Health Our Priority */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="w-64 h-64 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-2xl">
                <div className="w-48 h-48 border-4 border-green-600 rounded-full flex items-center justify-center">
                  <Heart className="w-24 h-24 text-green-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                About Us
              </span>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Your Health<br />
                <span className="text-green-600">Our Priority</span>
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Allergies, also known as allergy diseases, are various conditions caused by hypersensitivity of the immune system to typically harmless substances in the environment. These diseases include hay fever, food allergies, atopic dermatitis, allergic asthma, and anaphylaxis.
              </p>

              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.2,
                      type: "spring",
                      stiffness: 200,
                      damping: 15
                    }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="text-center"
                  >
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.2 + 0.5 }}
                      className="text-4xl font-bold text-green-600"
                    >
                      {stat.number}
                    </motion.h3>
                    <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-600 to-teal-700">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Our Product<br />
              <span className="text-green-200">100% Effective</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-bold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full font-semibold"
                  >
                    <Pill className="w-4 h-4" />
                    Buy Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat Sidebar */}
      {chatOpen && (
        <motion.div
          initial={{ x: 400 }}
          animate={{ x: 0 }}
          exit={{ x: 400 }}
          className="fixed right-0 top-0 h-screen w-full md:w-[500px] bg-white shadow-2xl z-50 flex flex-col"
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold">AI Health Assistant</h3>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-green-50">Real-time medical guidance • AI + Human wisdom</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-20">
                <Stethoscope className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <p>Ask me anything about your health!</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-800 shadow-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                  {msg.type === 'ai' && msg.confidence && (
                    <div className="mt-4 space-y-3">
                      {/* Confidence Score with animation */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-xs text-gray-600 font-semibold">AI Confidence</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${msg.confidence}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="h-full bg-green-500 rounded-full"
                            />
                          </div>
                          <span className="text-sm font-bold text-green-600">
                            {msg.confidence.toFixed(0)}%
                          </span>
                        </div>
                      </motion.div>

                      {/* Doctor Recommendation with animation */}
                      {msg.doctorRecommended && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                        >
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-amber-800">👨‍⚕️ Doctor Visit Recommended</p>
                            <p className="text-xs text-amber-700 mt-1">{msg.doctorReason}</p>
                          </div>
                        </motion.div>
                      )}

                      {/* Suggestions with stagger animation */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-600 font-semibold mb-2">💡 What You Can Do:</p>
                          <ul className="space-y-1">
                            {msg.suggestions.map((s, i) => (
                              <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-2 text-xs text-gray-700"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                {s}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Request Human Analysis Button */}
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setCurrentReviewMessage(msg);
                          setHumanReviewOpen(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-xs font-semibold shadow-md"
                      >
                        <Users className="w-4 h-4" />
                        Request Human Doctor Analysis
                      </motion.button>

                      {/* Feedback Buttons */}
                      {msg.messageId && !msg.feedbackSubmitted && (
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                          <span className="text-xs text-gray-500">Was this helpful?</span>
                          <button
                            onClick={() => handleFeedback(msg.messageId, true)}
                            className="p-1.5 hover:bg-green-100 rounded-lg transition-colors group"
                          >
                            <ThumbsUp className="w-4 h-4 text-gray-400 group-hover:text-green-500" />
                          </button>
                          <button
                            onClick={() => handleFeedback(msg.messageId, false)}
                            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors group"
                          >
                            <ThumbsDown className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                          </button>
                        </div>
                      )}

                      {msg.feedbackSubmitted && (
                        <p className="text-xs text-gray-500 italic pt-2 border-t border-gray-200">
                          ✅ Thank you for your feedback! This helps us improve.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex gap-3">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Describe your symptoms..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full font-semibold hover:from-green-600 hover:to-teal-600 disabled:opacity-50 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HealthcareDashboard;
