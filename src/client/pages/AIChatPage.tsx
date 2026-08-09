import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { AIMemoryItem } from '../types';
import { Sparkles, Send, BrainCircuit, Lightbulb, Flame, Target, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  activeMemories?: any[];
  newMemories?: any[];
}

export const AIChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### 👋 Hello! I am LearnMate AI — Your Personal Study Assistant

I remember your learning preferences, weak topics, and study goals to personalize every explanation.

How can I help you today?
- 📐 **Explain quadratic equations**
- 🌿 **Explain photosynthesis step-by-step**
- 🇮🇳 **Explain this concept in Hindi**
- 📝 **Generate 5 practice board exam questions**`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [memories, setMemories] = useState<AIMemoryItem[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMemories();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchMemories = async () => {
    try {
      const data = await api.getMemories();
      setMemories(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const res = await api.askAI(query);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        activeMemories: res.activeMemories,
        newMemories: res.newMemoriesExtracted,
      };

      setMessages((prev) => [...prev, aiMsg]);
      fetchMemories(); // Refresh memory list if new memory was stored
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: '⚠️ AI Assistant is temporarily unavailable. Please try asking again in a moment.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Explain photosynthesis step by step',
    'How do I solve quadratic equations?',
    'Give me 5 practice questions on Class 10 Maths',
    'Explain Newton third law in Hindi',
    'Help me prepare a 7-day Physics study plan',
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0b0f19] text-gray-100 flex flex-col max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4">
      {/* HEADER & ACTIVE MEMORY BADGE */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-glass">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              LearnMate AI Study Assistant
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                Gemini Powered
              </span>
            </h1>
            <p className="text-xs text-gray-400">Personalized doubt solving with persistent student memory context.</p>
          </div>
        </div>

        {/* ACTIVE MEMORY SUMMARY PILL */}
        <div className="flex items-center space-x-2 bg-purple-950/60 border border-purple-800/40 px-3 py-1.5 rounded-2xl text-xs text-purple-200">
          <BrainCircuit className="w-4 h-4 text-purple-400 animate-pulse" />
          <span><strong className="text-white">{memories.length}</strong> Persistent Memories Active</span>
        </div>
      </div>

      {/* QUICK SUGGESTED PROMPTS CHIPS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1 flex-shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Try Asking:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1 rounded-xl text-xs font-medium bg-gray-900 border border-gray-800 hover:border-brand-500/50 hover:bg-gray-800 text-gray-300 whitespace-nowrap transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* CHAT MESSAGES AREA */}
      <div className="flex-1 bg-gray-900/90 border border-gray-800 rounded-3xl p-4 sm:p-6 overflow-y-auto space-y-6 min-h-[420px] max-h-[550px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
          >
            <div className="flex items-center space-x-2 text-[10px] text-gray-400">
              <span>{msg.role === 'user' ? 'You' : 'LearnMate AI'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`p-4 rounded-3xl max-w-2xl text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-br-none shadow-glow font-medium'
                  : 'bg-gray-800/90 text-gray-100 border border-gray-700/80 rounded-bl-none shadow-glass'
              }`}
            >
              {/* Formatted Text Content */}
              <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                {msg.content}
              </div>

              {/* Memory Extraction Notification Toast inside message */}
              {msg.newMemories && msg.newMemories.length > 0 && (
                <div className="mt-3 p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-200 text-xs flex items-center space-x-2">
                  <BrainCircuit className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white block">New AI Memory Extracted:</span>
                    <span>{msg.newMemories[0].content}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-brand-300 bg-gray-800/60 p-3 rounded-2xl w-max border border-gray-700">
            <Sparkles className="w-4 h-4 animate-spin text-brand-400" />
            <span>LearnMate AI is crafting your personalized answer...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT BAR */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-2 shadow-glass flex items-center space-x-2"
      >
        <input
          type="text"
          placeholder="Ask any question, request practice problems, or ask for explanations in Hindi..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 px-3 py-2 focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow transition flex items-center space-x-1.5 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>Ask AI</span>
        </button>
      </form>
    </div>
  );
};
