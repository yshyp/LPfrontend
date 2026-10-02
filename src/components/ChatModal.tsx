import React, { useState, useEffect, useRef } from 'react';
import { BloodRequest, ChatMessage } from '../types/blood';
import { X, Send, Phone, MapPin, Building, ShieldCheck } from 'lucide-react';

interface ChatModalProps {
  request: BloodRequest | null;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ request, onClose }) => {
  if (!request) return null;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      requestId: request.id,
      sender: 'coordinator',
      senderName: request.contactName,
      text: `Hello! Thank you for reaching out regarding patient ${request.patientName} (${request.bloodGroup} needed at ${request.hospitalName}). How quickly are you able to arrive?`,
      timestamp: '10:42 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "I'm on my way to the hospital now!",
    "Which ward or reception desk should I report to?",
    "I have arrived at the hospital lobby.",
    "Can you confirm the patient bed number?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      requestId: request.id,
      sender: 'user',
      senderName: 'You (Alex Reed)',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsTyping(true);

    // Realistic coordinator auto-reply
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "Received! Please proceed directly to the Blood Transfusion Service counter on the 2nd Floor, Tower B. Present your ID and mention Dr. Chen's trauma authorization.";
      if (text.toLowerCase().includes('arrived')) {
        replyText = "Great! A nurse is walking down to the main reception triage desk right now to receive you.";
      } else if (text.toLowerCase().includes('ward') || text.toLowerCase().includes('bed')) {
        replyText = `Patient is currently in ICU Bay 4. Our phlebotomist will draw and cross-match your sample in Room 204.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          requestId: request.id,
          sender: 'coordinator',
          senderName: request.contactName,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 h-[600px] max-h-[90vh] flex flex-col">
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center font-bold text-sm font-['Syne']">
              {request.bloodGroup}
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <span>{request.contactName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-[11px] text-slate-300 truncate max-w-[240px]">
                {request.hospitalName} · Patient: {request.patientName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${request.contactPhone}`}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Call Coordinator"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70 text-xs">
          {messages.map((m) => {
            const isMe = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] text-slate-400 mb-0.5 px-1">
                  {m.senderName} · {m.timestamp}
                </div>
                <div
                  className={`max-w-[82%] p-3 rounded-2xl leading-relaxed text-xs ${
                    isMe
                      ? 'bg-rose-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-1.5 text-slate-400 text-xs italic pl-2">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] ml-1">{request.contactName} is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {quickReplies.map((qr) => (
            <button
              key={qr}
              type="button"
              onClick={() => handleSendMessage(qr)}
              className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap transition-colors shrink-0"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message to the hospital coordinator..."
            className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
