import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Leaf, BookOpen, Zap, User, Sparkles, Trash2, ChevronLeft } from 'lucide-react'; 
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import './ChatPage.css';

/* ── Suggested questions per language ── */
const SUGGESTS = {
  en: [
    { q: 'My tomato leaves have brown spots — what disease?',   emoji: '🍅' },
    { q: 'Best fertilizer dose for wheat per acre?',            emoji: '🌾' },
    { q: 'How to prevent fungal disease in paddy?',             emoji: '🌱' },
    { q: 'What government schemes can I apply for?',            emoji: '🏛️' },
    { q: 'When should I sow rabi crops in North India?',        emoji: '📅' },
    { q: 'Organic treatment for powdery mildew on mango?',      emoji: '🥭' },
  ],
  hi: [
    { q: 'मेरे टमाटर की पत्तियों पर भूरे धब्बे हैं — कौन सा रोग?', emoji: '🍅' },
    { q: 'प्रति एकड़ गेहूं के लिए सर्वोत्तम खाद खुराक?',         emoji: '🌾' },
    { q: 'धान में फफूंद रोग को कैसे रोकें?',                       emoji: '🌱' },
    { q: 'किन सरकारी योजनाओं के लिए आवेदन कर सकता हूं?',          emoji: '🏛️' },
    { q: 'उत्तर भारत में रबी फसल कब बोएं?',                       emoji: '📅' },
    { q: 'आम पर पाउडरी फफूंदी का जैविक उपचार?',                   emoji: '🥭' },
  ],
  ta: [
    { q: 'என் தக்காளி இலைகளில் பழுப்பு புள்ளிகள் — என்ன நோய்?', emoji: '🍅' },
    { q: 'கோதுமைக்கு ஏக்கருக்கு சிறந்த உரம் அளவு?',               emoji: '🌾' },
    { q: 'நெல்லில் பூஞ்சை நோயை எப்படி தடுப்பது?',                 emoji: '🌱' },
    { q: 'நான் என்ன அரசு திட்டங்களுக்கு விண்ணப்பிக்கலாம்?',      emoji: '🏛️' },
    { q: 'வட இந்தியாவில் ரபி பயிர்களை எப்போது விதைக்க வேண்டும்?', emoji: '📅' },
    { q: 'மாம்பழத்தில் தூள் பூஞ்சைக்கு இயற்கை சிகிச்சை?',       emoji: '🥭' },
  ],
  te: [
    { q: 'నా టమాటా ఆకులపై గోధుమ మచ్చలు — ఏ వ్యాధి?',           emoji: '🍅' },
    { q: 'గోధుమకు ఎకరానికి ఉత్తమ ఎరువు మోతాదు?',                emoji: '🌾' },
    { q: 'వరిలో శిలీంద్ర వ్యాధిని ఎలా నివారించాలి?',             emoji: '🌱' },
    { q: 'నేను ఏ ప్రభుత్వ పథకాలకు దరఖాస్తు చేయగలను?',          emoji: '🏛️' },
    { q: 'ఉత్తర భారతదేశంలో రబీ పంటలు ఎప్పుడు విత్తాలి?',       emoji: '📅' },
    { q: 'మామిడిపై తెల్ల పొట్టు వ్యాధికి సేంద్రీయ చికిత్స?',    emoji: '🥭' },
  ],
};
const DEFAULT_SUGGESTS = SUGGESTS['en'];

// Topic translation keys — resolved inside component so they update with language
const TOPIC_KEYS = [
  'chat_topic_late_blight', 'chat_topic_pm_kisan', 'chat_topic_drip_irrigation', 'chat_topic_organic_farming', 'chat_topic_rabi_season',
  'chat_topic_wheat_disease', 'chat_topic_paddy_pest', 'chat_topic_soil_testing', 'chat_topic_crop_insurance', 'chat_topic_neem_oil',
  'chat_topic_vermicompost', 'chat_topic_intercropping'
];

/* ── Simple markdown-like formatter for AI responses ── */
function formatMessage(text) {
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <span key={i} className="sec-head">{line.replace('## ', '')}</span>
      );
      i++;
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(
        <strong key={i}>{line.replace(/\*\*/g, '')}</strong>
      );
      i++;
    } else if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('• '))) {
        items.push(
          <li key={i}>{lines[i].replace(/^[-•] /, '')}</li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${elements.length}`}>{items}</ul>
      );
    } else if (line.trim()) {
      const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
      elements.push(
        <span key={i} className="sec">
          {parts.map((p, pi) => {
            if (p.startsWith('**') && p.endsWith('**')) {
              return <strong key={pi}>{p.slice(2, -2)}</strong>;
            } else if (p.startsWith('`') && p.endsWith('`')) {
              return <code key={pi}>{p.slice(1, -1)}</code>;
            }
            return p;
          })}
        </span>
      );
      i++;
    } else {
      i++;
    }
  }

  return <>{elements}</>;
}

export default function ChatPage() {
  const { lang, t } = useLang();
  const [msgs, setMsgs]       = useState([]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, loading]);

  // Welcome message on mount or lang change
  useEffect(() => {
    setMsgs([{
      id: 0,
      role: 'ai',
      text: t('chat_welcome') || "Hello! I'm your AI Farming Assistant.",
      time: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
    }]);
  }, [lang, t]);

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: userText,
      time: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
    };

    setMsgs(p => [...p, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const langNames = { en:'English', hi:'Hindi', ta:'Tamil', te:'Telugu' };
      
      // 1. Prepare system instructions
      const systemPrompt = `You are an expert AI agricultural assistant for CropSense AI, specializing in Indian farming. Respond ONLY in ${langNames[lang] || 'English'}. Be concise, use simple language, and provide practical advice. Format with **bold** for emphasis and ## for headers. Max 250 words.`;

      // 2. Extract conversation history
      let history = [];
      setMsgs(current => {
        history = current
          .filter(m => m.id !== 0) // Skip welcome message for context tokens
          .map(m => ({ 
            role: m.role === 'ai' ? 'assistant' : 'user', 
            content: m.text 
          }));
        return current;
      });

      // 3. API Call using the variables correctly
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': 'YOUR_API_KEY_HERE', // Use your environment variable or proxy
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [...history, { role: 'user', content: userText }],
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || 'I encountered an issue processing that. Please try again.';

      setMsgs(p => [...p, {
        id: Date.now() + 1,
        role: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
      }]);
    } catch (err) {
      setMsgs(p => [...p, {
        id: Date.now() + 1,
        role: 'ai',
        text: '⚠️ Connection error. Please check your internet and try again.',
        time: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, lang]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
        e.preventDefault(); 
        sendMessage(); 
    }
  };

  const suggests = SUGGESTS[lang] || DEFAULT_SUGGESTS;

  // Resolve topic labels for current language
  const topics = TOPIC_KEYS.map(k => t(k));

  return (
    <div className="chat-pg">
      <div className="chat-header">
        <div className="chat-header__inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Link to="/" className="chat-back-btn" style={{ color: 'white' }}><ChevronLeft size={24}/></Link>
            <div>
                <div className="eyebrow">{t('chat_assistant_label')}</div>
                <h1 className="chat-header__title">{t('chat_title')}<span className="fill">{t('chat_title2')}</span></h1>
            </div>
          </div>
          <div className="chat-status">
            <span className="live-dot"/>{t('chat_powered_by_claude')}
            <button onClick={() => setMsgs([])} style={{ background: 'none', border: 'none', color: '#ff5757', cursor: 'pointer', marginLeft: '10px' }}>
              <Trash2 size={16}/>
            </button>
          </div>
        </div>
      </div>

      <div className="chat-layout">
          <div className="chat-sidebar">
          <div className="chat-sidebar__card">
            <div className="chat-sidebar__title"><Zap size={15} color="var(--plasma)"/>{t('chat_suggested')}</div>
            <div className="suggest-list">
              {suggests.map((s, i) => (
                <button key={i} className="suggest-btn" onClick={() => sendMessage(s.q)}>
                  <span className="sq">{s.emoji}</span>{s.q}</button>
              ))}
            </div>
          </div>

          <div className="chat-sidebar__card">
            <div className="chat-sidebar__title"><Leaf size={15} color="var(--plasma)"/>{t('chat_topics')}</div>
              <div className="topic-grid">
              {topics.map((topic, idx) => (
                <button key={idx} className="topic-chip" onClick={() => sendMessage(`Tell me about ${topic}`)}>{topic}</button>
              ))}
            </div>
          </div>

          <div className="chat-sidebar__card">
            <div className="chat-sidebar__title"><BookOpen size={15} color="var(--plasma)"/>{t('chat_quick_stats')}</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[
                {icon:'🌱', val:'50+', lbl:t('stat_diseases_covered')},
                {icon:'📋', val:'100+', lbl:t('stat_treatment_guides')},
                {icon:'🏛️', val:'6', lbl:t('stat_govt_schemes')},
                {icon:'🌾', val:'20+', lbl:t('stat_crop_varieties')},
              ].map((s,i) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:9}}>
                  <span style={{fontSize:16}}>{s.icon}</span>
                  <div>
                    <div style={{fontFamily:'var(--font-display)',fontSize:15,fontWeight:700,color:'var(--plasma)',letterSpacing:'-0.5px',lineHeight:1}}>{s.val}</div>
                    <div style={{fontSize:11,color:'var(--t3)',marginTop:1}}>{s.lbl}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

            <div className="chat-panel">
          <div className="chat-messages">
            {msgs.length === 0 ? (
              <div className="chat-empty">
                <div className="chat-empty__icon">🌿</div>
                <div className="chat-empty__title">{t('chat_start_conversation')}</div>
                <p className="chat-empty__sub">{t('chat_sub')}</p>
              </div>
            ) : (
              msgs.map(m => (
                <div key={m.id} className={`msg msg--${m.role}`}>
                  <div className="msg__avatar">{m.role === 'ai' ? <Sparkles size={14}/> : <User size={14}/>}</div>
                  <div>
                    <div className="msg__bubble">{formatMessage(m.text)}</div>
                    <div className="msg__time">{m.time}</div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="msg msg--ai">
                <div className="msg__avatar"><Sparkles size={14}/></div>
                <div className="msg__bubble">
                  <div className="typing-indicator">
                    <div className="typing-dot"/>
                    <div className="typing-dot"/>
                    <div className="typing-dot"/>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          <div className="chat-input-bar">
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder={t('chat_placeholder')}
              value={input}
              onChange={e => { 
                setInput(e.target.value); 
                e.target.style.height='auto'; 
                e.target.style.height=e.target.scrollHeight+'px'; 
              }}
              onKeyDown={handleKey}
              disabled={loading}
              rows={1}
            />
            <button className="chat-send-btn" onClick={() => sendMessage()} disabled={!input.trim() || loading}>
              {loading ? (
                <div className="spinner" />
              ) : (
                <Send size={18}/>
              )}
            </button>
          </div>
          <div className="chat-input-hint">{t('chat_input_hint')}</div>
        </div>
      </div>
    </div>
  );
}