import { ChevronDown, MessageSquareMore, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { useRateMessage, useSendMessage } from '@/hooks/useChat';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { TypingIndicator } from '@/components/chat/TypingIndicator';

const createWelcomeMessage = () => ({
  _id: 'welcome-message',
  content:
    "Hello! I'm AgroBot 🌱 Ask me about crops, livestock health, fertiliser, pest control, or any farming question. How can I help today?",
  createdAt: new Date().toISOString(),
  feedbackRating: 0,
  role: 'model',
});

export function ChatPanel({ expanded, onClose, onMinimize, setExpanded }) {
  const panelRef = useRef(null);
  const messagesRef = useRef(null);
  const [messageText, setMessageText] = useState('');
  const [sessionId, setSessionId] = useState(() => uuidv4());
  const [messages, setMessages] = useState([createWelcomeMessage()]);
  const [hasUnread, setHasUnread] = useState(false);
  const sendMessage = useSendMessage();
  const rateMessage = useRateMessage();

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.to(panelRef.current, {
      borderRadius: expanded ? 20 : 9999,
      duration: 0.4,
      ease: 'back.out(1.7)',
      height: expanded ? 500 : 56,
      transformOrigin: 'bottom right',
      width: expanded ? 320 : 56,
    });
  }, [expanded]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sendMessage.isPending]);

  const visibleMessages = useMemo(() => messages, [messages]);

  const handleSend = async () => {
    const trimmed = messageText.trim();
    if (!trimmed || sendMessage.isPending) return;

    const optimisticUser = {
      _id: `local-user-${Date.now()}`,
      content: trimmed,
      createdAt: new Date().toISOString(),
      role: 'user',
    };

    setMessages((current) => [...current, optimisticUser]);
    setMessageText('');

    try {
      const response = await sendMessage.mutateAsync({ message: trimmed, sessionId });
      const raw = response.assistantMessage || response.response || {};
      const assistantMessage = {
        _id: raw._id || `local-model-${Date.now()}`,
        content: raw.content || raw.message || 'AgroBot could not answer right now.',
        createdAt: raw.createdAt || new Date().toISOString(),
        feedbackRating: raw.feedbackRating || 0,
        role: 'model',
      };

      setMessages((current) => [...current, { ...assistantMessage, role: 'model' }]);
      setHasUnread(false);
    } catch (error) {
      toast.error(error?.message || 'Unable to send message right now.');
    }
  };

  return (
    <div
      ref={panelRef}
      style={{
        background: expanded ? 'var(--color-surface)' : 'var(--harvest-gradient)',
        borderRadius: 9999,
        bottom: 0,
        boxShadow: 'var(--shadow-float)',
        overflow: 'hidden',
        position: 'absolute',
        right: 0,
      }}
    >
      {!expanded ? (
        <button
          onClick={() => {
            setExpanded(true);
            setHasUnread(false);
          }}
          style={{
            alignItems: 'center',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            display: 'inline-flex',
            height: 56,
            justifyContent: 'center',
            position: 'relative',
            width: 56,
          }}
          type="button"
        >
          <MessageSquareMore size={24} />
          {hasUnread ? (
            <span style={{ background: '#b91c1c', borderRadius: 9999, height: 8, position: 'absolute', right: 10, top: 10, width: 8 }} />
          ) : null}
        </button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <header className="harvest-gradient" style={{ alignItems: 'center', color: '#fff', display: 'flex', justifyContent: 'space-between', minHeight: 56, padding: '10px 14px' }}>
            <div>
              <div style={{ alignItems: 'center', display: 'flex', gap: 8, fontSize: 14, fontWeight: 700 }}>
                <MessageSquareMore size={16} />
                AgroBot
              </div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>AI Agricultural Advisor</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={onMinimize} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }} type="button">
                <ChevronDown size={18} />
              </button>
              <button
                onClick={() => {
                  onClose?.();
                  setExpanded(false);
                  setSessionId(uuidv4());
                  setMessages([createWelcomeMessage()]);
                }}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                type="button"
              >
                <X size={18} />
              </button>
            </div>
          </header>
          <div ref={messagesRef} style={{ display: 'grid', flex: 1, gap: 8, overflowY: 'auto', padding: 12 }}>
            {visibleMessages.map((message) => (
              <ChatBubble
                key={message._id}
                isModel={message.role === 'model'}
                message={message}
                onRate={
                  message.role === 'model' && message._id !== 'welcome-message'
                    ? async (rating) => {
                        await rateMessage.mutateAsync({ messageId: message._id, rating });
                        setMessages((current) =>
                          current.map((entry) =>
                            entry._id === message._id ? { ...entry, feedbackRating: rating } : entry,
                          ),
                        );
                      }
                    : undefined
                }
              />
            ))}
            {sendMessage.isPending ? <TypingIndicator /> : null}
          </div>
          <ChatInput disabled={sendMessage.isPending} onChange={setMessageText} onSubmit={handleSend} value={messageText} />
        </div>
      )}
    </div>
  );
}

export default ChatPanel;
