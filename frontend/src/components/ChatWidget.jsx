import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Smile } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

function ChatWidget({ dealId, isCompleted }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const socket = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (socket && isOpen) {
      socket.emit('join_deal_chat', dealId);
      
      const onReceiveMessage = (message) => {
        // Only add if it belongs to this conversation to be safe
        setMessages((prev) => {
          // Prevent duplicates (e.g. if socket and optimistic update both trigger)
          if (prev.some(m => m._id === message._id)) return prev;
          return [...prev, message];
        });
      };

      socket.on('receive_message', onReceiveMessage);
      return () => {
        socket.off('receive_message', onReceiveMessage);
      };
    }
  }, [socket, isOpen, dealId]);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen, dealId]);

  useEffect(scrollToBottom, [messages]);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`/chat/${dealId}`);
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isCompleted) return;

    const messageContent = newMessage.trim();
    setNewMessage(''); // Clear immediately for better UX

    try {
      setLoading(true);
      await axios.post(`/chat/${dealId}`, { content: messageContent });
      // We don't manually add to state here because the socket will emit back to us
    } catch (err) {
      console.error("Failed to send message:", err);
      setNewMessage(messageContent); // Restore on failure
    } finally {
      setLoading(false);
    }
  };

  const currentUserId = user?.id || user?._id;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-white text-black rounded-2xl shadow-xl flex items-center justify-center hover:bg-secondary transition-colors relative group border border-outline-variant/10"
      >
        <MessageSquare size={24} className="group-hover:rotate-12 transition-transform duration-300" />
        <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-4 z-[100] w-80 sm:w-96 h-[450px] bg-surface-container-low border border-outline-variant/10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-6 bg-surface-container border-b border-outline-variant/10 flex justify-between items-center">
              <div>
                <h4 className="font-black text-on-surface text-lg tracking-tight">Collaboration Chat</h4>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-teal animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Live Now</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-surface-container-highest rounded-xl transition-colors text-on-surface-variant"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant/40 mb-1 px-1">
                      {isMe ? 'You' : (user.role === 'brand' ? 'Creator' : 'Brand')}
                    </span>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-bold leading-relaxed ${
                      isMe 
                      ? 'bg-primary text-on-primary rounded-tr-none shadow-lg shadow-primary/20' 
                      : 'bg-surface-container-high text-on-surface rounded-tl-none border border-outline-variant/10'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer / Input */}
            <div className="p-6 bg-surface-container border-t border-outline-variant/10">
              {isCompleted ? (
                <div className="text-center p-3 bg-surface-container-highest rounded-2xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
                  Read-only: Deal finalized
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-surface-container-high border border-outline-variant/5 rounded-xl px-4 py-3 text-sm font-bold text-on-surface outline-none focus:ring-2 focus:ring-secondary/50 transition-all placeholder:text-on-surface-variant/30"
                  />
                  <button 
                    disabled={loading || !newMessage.trim()}
                    type="submit"
                    className="p-3 bg-secondary text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-secondary/10"
                  >
                    <Send size={18} />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatWidget;
