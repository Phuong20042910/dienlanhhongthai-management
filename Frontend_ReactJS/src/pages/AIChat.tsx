import { useState, useRef, useEffect } from 'react';
import api from '../utils/api';
import { Bot, Send, User, Sparkles, Loader2, RefreshCw } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "🔍 Mã lỗi Daikin E4 là gì và cách xử lý?",
  "⛽ Áp suất nạp Gas R32 chuẩn là bao nhiêu PSI?",
  "❄️ Cách tính công suất máy lạnh cho phòng 20m2?",
  "📦 Hướng dẫn quy tắc đặt mã SKU vật tư kho"
];

export const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Dạ em chào anh/chị ạ! Em là Trợ lý AI Điện Lạnh Hồng Thái đây ạ.\n\nEm có thể hỗ trợ anh/chị tra cứu mã lỗi thiết bị, tư vấn kỹ thuật nạp gas, tính công suất lạnh hoặc hướng dẫn đặt mã kho vật tư.\n\nAnh/chị cần em hỗ trợ gì hôm nay ạ?',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<'gemini' | 'openrouter'>('gemini');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      // Tạo lịch sử hội thoại ngắn 6 tin nhắn gần nhất
      const historyContext = messages
        .slice(-6)
        .map((m) => `${m.sender === 'user' ? 'Người dùng' : 'Trợ lý AI'}: ${m.text}`)
        .join('\n');

      const res = await api.post('/ai/chat', { 
        message: text.trim(),
        context: historyContext,
        provider: provider
      });
      const aiReply = res.data.reply;

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error('Lỗi chat AI:', err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: '⚠️ **Rất tiếc**, không thể kết nối tới Trợ lý AI lúc này. Hãy đảm bảo Python AI Service đang chạy trên cổng 8000.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-gradient-to-br from-white to-gray-50 dark:from-[#0B1120] dark:via-[#111827] dark:to-[#0F172A] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden relative">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/5 blur-[100px] rounded-full"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-xl blur animate-pulse"></div>
            <div className="relative p-2.5 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-inner">
              <Bot size={24} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg flex items-center gap-2">
              Trợ lý AI Điện Lạnh <Sparkles size={16} className="text-yellow-300 animate-pulse" />
            </h1>
            <p className="text-xs text-blue-100">Chuyên gia Kỹ thuật Điện Lạnh & Quản lý Kho vật tư</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={provider}
            onChange={(e) => setProvider(e.target.value as 'gemini' | 'openrouter')}
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors cursor-pointer outline-none appearance-none pr-6 relative"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em 1em' }}
            title="Chọn nguồn Trí Tuệ Nhân Tạo"
          >
            <option value="gemini" className="text-gray-900">Mô hình: Google Gemini</option>
            <option value="openrouter" className="text-gray-900">Mô hình: GPT-4o Mini (OpenRouter)</option>
          </select>

          <button
            onClick={() => setMessages([messages[0]])}
            className="p-2 hover:bg-white/10 rounded-lg text-blue-100 hover:text-white transition-colors flex items-center gap-1 text-xs"
            title="Làm mới cuộc trò chuyện"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Làm mới</span>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 sm:gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            {msg.sender === 'ai' && (
              <div className="relative shrink-0 mt-1">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur"></div>
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md border border-white/10">
                  <Bot size={18} />
                </div>
              </div>
            )}

            <div className={`max-w-[85%] sm:max-w-[75%] relative group ${
              msg.sender === 'user'
                ? 'order-1'
                : 'order-2'
            }`}>
              <div className={`p-4 sm:p-5 text-sm whitespace-pre-wrap leading-relaxed shadow-md backdrop-blur-sm transition-all hover:shadow-lg ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm'
                  : 'bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
              <div className={`text-[11px] mt-2 font-medium ${msg.sender === 'user' ? 'text-right text-gray-500 dark:text-gray-400' : 'text-left text-gray-500 dark:text-gray-400'}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="order-2 shrink-0 mt-1">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center shadow-md border border-gray-600">
                  <User size={18} />
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 sm:gap-4 justify-start animate-in fade-in slide-in-from-bottom-2">
            <div className="relative shrink-0 mt-1">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md border border-white/10 animate-pulse">
                <Bot size={18} />
              </div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-2xl rounded-tl-sm border border-gray-200/50 dark:border-gray-700/50 flex items-center gap-2 shadow-sm backdrop-blur-sm">
              <div className="flex gap-1 items-center px-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="relative z-10 px-4 py-3 bg-white/50 dark:bg-[#0B1120]/80 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-800/50 overflow-x-auto flex gap-2 scrollbar-hide">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-[13px] font-medium bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl whitespace-nowrap transition-all border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-gray-600 shadow-sm hover:shadow shrink-0 disabled:opacity-50 hover:-translate-y-0.5"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-4 sm:p-5 bg-white/80 dark:bg-[#0B1120]/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-3 relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi AI về mã lỗi, kỹ thuật sửa chữa hoặc giá vật tư..."
            className="flex-1 px-5 py-3.5 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-[15px] text-gray-900 dark:text-white transition-all shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 sm:px-8 py-3.5 rounded-2xl font-medium transition-all shadow-md hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};
