import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DirectMessage } from '../types';
import { MessageSquare, Send, Paperclip, User, ShieldCheck } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const partnerIdFromQuery = searchParams.get('partner') || '';

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<any | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedPartner) {
      fetchMessages(selectedPartner.id);
    }
  }, [selectedPartner]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const data = await api.getConversations();
      setConversations(data);

      if (data.length > 0) {
        if (partnerIdFromQuery) {
          const match = data.find((c) => c.partner.id === partnerIdFromQuery);
          setSelectedPartner(match ? match.partner : data[0].partner);
        } else {
          setSelectedPartner(data[0].partner);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    try {
      const data = await api.getMessages(partnerId);
      setMessages(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedPartner) return;

    try {
      const sent = await api.sendMessage(selectedPartner.id, newMessageText);
      setMessages((prev) => [...prev, sent]);
      setNewMessageText('');
      fetchConversations();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0b0f19] text-gray-100 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto flex flex-col space-y-4">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 shadow-glass flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">Direct Messaging</h1>
            <p className="text-xs text-gray-400">Safe direct communication between student and tutor.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[450px]">
        {/* CONVERSATION LIST */}
        <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-4 space-y-2 overflow-y-auto max-h-[500px]">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-2">Conversations</h3>
          {conversations.length === 0 ? (
            <p className="text-xs text-gray-500 p-2 italic">No conversations yet.</p>
          ) : (
            conversations.map((c) => (
              <div
                key={c.partner.id}
                onClick={() => setSelectedPartner(c.partner)}
                className={`p-3 rounded-2xl cursor-pointer transition flex items-center space-x-3 ${
                  selectedPartner?.id === c.partner.id ? 'bg-brand-600/30 border border-brand-500/50' : 'bg-gray-800/40 hover:bg-gray-800'
                }`}
              >
                <img
                  src={c.partner.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80'}
                  alt={c.partner.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-700"
                />
                <div className="overflow-hidden flex-1">
                  <h4 className="text-xs font-bold text-white truncate">{c.partner.name}</h4>
                  <p className="text-[11px] text-gray-400 truncate">{c.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CHAT MESSAGES WINDOW */}
        <div className="md:col-span-2 bg-gray-900/90 border border-gray-800 rounded-3xl p-4 flex flex-col justify-between h-[500px]">
          {selectedPartner ? (
            <>
              {/* CHAT PARTNER HEADER */}
              <div className="pb-3 border-b border-gray-800 flex items-center space-x-3">
                <img
                  src={selectedPartner.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80'}
                  alt={selectedPartner.name}
                  className="w-9 h-9 rounded-full object-cover border border-brand-500"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedPartner.name}</h3>
                  <span className="text-[10px] text-emerald-400 font-mono">Online</span>
                </div>
              </div>

              {/* MESSAGES CONTAINER */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 px-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.senderId === user?.id ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-xs max-w-sm ${
                        m.senderId === user?.id
                          ? 'bg-brand-600 text-white rounded-br-none'
                          : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-none'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* SEND INPUT */}
              <form onSubmit={handleSendMessage} className="pt-2 flex items-center space-x-2 border-t border-gray-800">
                <input
                  type="text"
                  placeholder={`Write a message to ${selectedPartner.name}...`}
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-glow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
