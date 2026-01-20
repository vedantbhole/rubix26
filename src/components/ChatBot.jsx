import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Image as ImageIcon, Loader2, Trash2, Minimize2 } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import ReactMarkdown from 'react-markdown';

export default function ChatBot() {
  const {
    isOpen,
    toggleChat,
    messages,
    isLoading,
    identifyPlant,
    sendMessage,
    clearChat,
    plantContext
  } = useChat();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      identifyPlant(file);
    }
    // Reset input to allow selecting same file again
    e.target.value = '';
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-herb-500 rounded-full shadow-lg shadow-herb-500/30 flex items-center justify-center text-white hover:bg-herb-600 transition-colors"
        >
          <MessageSquare className="w-7 h-7" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] glass-card flex flex-col shadow-2xl overflow-hidden border border-herb-500/20"
          >
            {/* Header */}
            <div className="bg-herb-900/50 p-4 border-b border-white/10 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-herb-500/20 flex items-center justify-center text-herb-400">
                  <span className="text-lg">🌿</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Botanical Assistant</h3>
                  {plantContext && (
                    <p className="text-xs text-herb-300 truncate max-w-[150px]">
                      Talking about: {plantContext.commonName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  title="Clear Chat"
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleChat}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900/50 scrollbar-thin scrollbar-thumb-herb-500/20 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 ${
                      msg.role === 'user'
                        ? 'bg-herb-600 text-white rounded-tr-none'
                        : 'bg-dark-700 text-gray-200 rounded-tl-none border border-white/5'
                    }`}
                  >
                    {msg.image && (
                      <img 
                        src={msg.image} 
                        alt="Uploaded plant" 
                        className="w-full h-48 object-cover rounded-xl mb-3 border border-white/10"
                      />
                    )}
                    <div className="prose prose-invert prose-sm max-w-none text-sm leading-relaxed">
                       <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="pl-1" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-semibold text-herb-300" {...props} />,
                          a: ({node, ...props}) => <a className="text-herb-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                    <div className={`text-[10px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-dark-700 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 text-gray-400 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-herb-500" />
                      <span>Thinking...</span>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-dark-800/80 backdrop-blur-md border-t border-white/10">
              <div className="flex items-end gap-2 bg-dark-900/50 rounded-xl p-2 border border-white/5 focus-within:border-herb-500/50 transition-colors">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-herb-400 transition-colors rounded-lg hover:bg-white/5 flex-shrink-0"
                  title="Upload Image"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 resize-none max-h-32 min-h-[44px] py-2.5 px-1 text-sm scrollbar-none"
                  rows={1}
                />

                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() || isLoading}
                  className="p-2 bg-herb-500 text-white rounded-lg hover:bg-herb-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 shadow-lg shadow-herb-500/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
