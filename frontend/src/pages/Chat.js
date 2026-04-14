import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Chat() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [roomId, setRoomId] = useState('');
  const [contactId, setContactId] = useState('');
  const [contactName, setContactName] = useState('');
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }

    // Check for query params for direct chat
    const params = new URLSearchParams(window.location.search);
    const targetId = params.get('with');
    const targetName = params.get('name');
    if (targetId) {
      setContactId(targetId);
      setContactName(targetName || 'User');
      initChat(targetId);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
    // eslint-disable-next-line
  }, []);

  const initChat = async (otherId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/chat/room?user1=${user.email}&user2=${otherId}`
      );
      const room = res.data;
      setRoomId(room);
      fetchMessages(room);

      // Poll for new messages every 3 seconds
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(() => fetchMessages(room), 3000);
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async (room) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/chat/history/${room}`);
      setMessages(res.data);
    } catch (err) { /* ignore */ }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !roomId) return;

    try {
      // Save via REST (fallback since WebSocket requires sockjs-client)
      await axios.post('http://localhost:8080/api/chat/history/' + roomId, {}, {
        params: { dummy: true }
      }).catch(() => {});

      // Direct save approach
      const msg = {
        senderId: user.email,
        receiverId: contactId,
        senderName: user.fullName,
        message: inputMsg.trim(),
        roomId: roomId
      };

      // We'll use a simple POST to save messages
      await axios.post('http://localhost:8080/api/chat/send', msg);
      setInputMsg('');
      fetchMessages(roomId);
    } catch (err) {
      // Fallback: add to local state
      setMessages([...messages, {
        id: Date.now().toString(),
        senderId: user.email,
        senderName: user.fullName,
        message: inputMsg.trim(),
        roomId: roomId,
        sentAt: new Date().toISOString()
      }]);
      setInputMsg('');
    }
  };

  const startNewChat = () => {
    const newContactId = prompt('Enter contact ID or email to start chatting:');
    if (newContactId) {
      const name = prompt('Enter their name:') || 'User';
      setContactId(newContactId);
      setContactName(name);
      initChat(newContactId);
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
          💬 Messages
        </h3>
        <button className="btn btn-primary btn-block btn-sm" onClick={startNewChat}
          style={{ marginBottom: '16px' }}>
          + New Chat
        </button>

        {contactId && (
          <div className="chat-contact active">
            <div className="nav-avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
              {contactName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{contactName}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {messages.length > 0 ? 'Active chat' : 'Start chatting'}
              </div>
            </div>
          </div>
        )}

        {!contactId && (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <p>No conversations yet.</p>
            <p style={{ marginTop: '8px' }}>Start a chat from a service detail page or click "New Chat" above.</p>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {contactId ? (
          <>
            {/* Chat Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div className="nav-avatar" style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                {contactName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '15px' }}>{contactName}</div>
                <div style={{ fontSize: '12px', color: 'var(--success)' }}>● Online</div>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '32px', marginBottom: '12px' }}>👋</p>
                  <p>Start the conversation!</p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id}
                  className={`chat-bubble ${msg.senderId === user.email ? 'sent' : 'received'}`}>
                  <div>{msg.message}</div>
                  <div className="chat-bubble-time">
                    {msg.sentAt ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="chat-input-area">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                id="chat-message-input"
              />
              <button className="btn btn-primary" type="submit" id="chat-send-btn">
                Send ↗
              </button>
            </form>
          </>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', flexDirection: 'column', gap: '16px', color: 'var(--text-muted)'
          }}>
            <span style={{ fontSize: '64px' }}>💬</span>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-secondary)' }}>
              Select a conversation
            </h3>
            <p style={{ fontSize: '14px' }}>
              Choose an existing chat or start a new one
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
