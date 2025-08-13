// import React, { useEffect, useState, useRef } from 'react';
// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
// import axios from 'axios';
// import moment from 'moment';

// // Props:
// // - appointmentId: Long
// // - currentUserId: string (username)
// // - otherUserId: string (receiver username)
// // - disabled: boolean (if chat allowed or not)

// const SOCKET_URL = 'http://localhost:8082/ws'; // your backend WS URL, adjust if needed
// const CHAT_HISTORY_API = `/api/chats`; // REST API base path for chat history

// const AppointmentChat = ({ appointmentId, currentUserId, otherUserId, disabled }) => {
//   const [messages, setMessages] = useState([]); // { senderId, message, timestamp }
//   const [input, setInput] = useState('');
//   const [connected, setConnected] = useState(false);
//   const clientRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   // Scroll chat to bottom on messages update
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(scrollToBottom, [messages]);

//   // Initialize STOMP client and load past messages
//   useEffect(() => {
//     if (!appointmentId || disabled) return;

//     // Load past messages via REST with Authorization header
//     axios.get(`${CHAT_HISTORY_API}/${appointmentId}`, {
//       headers: {
//         Authorization: 'Bearer ' + localStorage.getItem('token')
//       }
//     })
//       .then(res => {
//         setMessages(res.data);
//       })
//       .catch(err => {
//         console.error('Failed to load chat history:', err);
//       });

//     // Setup WebSocket + STOMP client with Authorization header on connect
//     const sock = new SockJS(SOCKET_URL);
//     const stompClient = new Client({
//       webSocketFactory: () => sock,
//       debug: () => { /* console.log disabled */ },
//       reconnectDelay: 5000,
//       heartbeatIncoming: 4000,
//       heartbeatOutgoing: 4000,

//       // Add JWT token in connectHeaders for auth on connect
//       connectHeaders: {
//         Authorization: 'Bearer ' + localStorage.getItem('token')
//       },

//       onConnect: () => {
//         setConnected(true);
//         // Subscribe to user queue for messages
//         stompClient.subscribe('/user/queue/messages', message => {
//           const msgBody = JSON.parse(message.body);
//           if (msgBody.appointmentId === appointmentId) {
//             setMessages(prev => [...prev, msgBody]);
//           }
//         });
//       },

//       onStompError: frame => {
//         console.error('Broker reported error: ' + frame.headers['message']);
//         console.error('Details: ' + frame.body);
//       }
//     });

//     clientRef.current = stompClient;
//     stompClient.activate();

//     // Cleanup on unmount
//     return () => {
//       stompClient.deactivate();
//       setConnected(false);
//     };
//   }, [appointmentId, disabled]);

//   const sendMessage = () => {
//     if (!input.trim() || !connected || !clientRef.current) return;

//     const chatMessage = {
//       appointmentId,
//       senderId: currentUserId,
//       receiverId: otherUserId,
//       message: input.trim(),
//       timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
//     };

//     clientRef.current.publish({
//       destination: '/app/chat.send',
//       body: JSON.stringify(chatMessage),
//       headers: {
//         Authorization: 'Bearer ' + localStorage.getItem('token') // send JWT on each send too
//       }
//     });

//     // Optimistically add the message
//     setMessages(prev => [...prev, chatMessage]);
//     setInput('');
//   };

//   const onKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <div
//       className={`chat-container ${disabled ? 'disabled' : ''}`}
//       style={{
//         border: '1px solid #ccc',
//         borderRadius: 8,
//         maxWidth: 600,
//         margin: '0 auto',
//         display: 'flex',
//         flexDirection: 'column',
//         height: 400
//       }}
//     >
//       <div
//         className="chat-header"
//         style={{
//           padding: 10,
//           background: '#007bff',
//           color: 'white',
//           borderTopLeftRadius: 8,
//           borderTopRightRadius: 8
//         }}
//       >
//         Chat for Appointment #{appointmentId}
//       </div>

//       <div
//         className="chat-messages"
//         style={{ flex: 1, overflowY: 'auto', padding: 10, background: '#f9f9f9' }}
//       >
//         {messages.length === 0 && (
//           <p style={{ color: '#777', textAlign: 'center' }}>No messages yet</p>
//         )}
//         {messages.map((msg, i) => {
//           const isCurrentUser = msg.senderId === currentUserId;
//           return (
//             <div
//               key={i}
//               style={{
//                 marginBottom: 8,
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: isCurrentUser ? 'flex-end' : 'flex-start'
//               }}
//             >
//               <div
//                 style={{
//                   background: isCurrentUser ? '#007bff' : '#e5e5ea',
//                   color: isCurrentUser ? 'white' : 'black',
//                   padding: '8px 12px',
//                   borderRadius: 20,
//                   maxWidth: '70%',
//                   whiteSpace: 'pre-wrap',
//                   wordWrap: 'break-word'
//                 }}
//               >
//                 {msg.message}
//               </div>
//               <small style={{ fontSize: 10, color: '#666', marginTop: 2 }}>
//                 {moment(msg.timestamp).format('hh:mm A, MMM Do')}
//               </small>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="chat-input" style={{ padding: 10, borderTop: '1px solid #ddd' }}>
//         <textarea
//           rows={2}
//           disabled={disabled}
//           placeholder={disabled ? 'Chat disabled for this appointment' : 'Type a message...'}
//           value={input}
//           onChange={e => setInput(e.target.value)}
//           onKeyDown={onKeyDown}
//           style={{
//             width: '100%',
//             resize: 'none',
//             padding: 8,
//             borderRadius: 4,
//             border: '1px solid #ccc'
//           }}
//         />
//         <button
//           disabled={disabled || !input.trim()}
//           onClick={sendMessage}
//           style={{
//             marginTop: 6,
//             padding: '8px 16px',
//             borderRadius: 4,
//             background: '#007bff',
//             color: 'white',
//             border: 'none',
//             cursor: disabled ? 'not-allowed' : 'pointer'
//           }}
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AppointmentChat;

import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import moment from "moment";

const SOCKET_URL = "http://localhost:8082/ws"; // Spring WebSocket endpoint
const CHAT_HISTORY_API = `/api/chats`; // REST API for chat history

// Props:
// appointmentId: number
// currentUserId: string (DB id)
// currentUserRole: "USER" | "DOCTOR"
// otherUserId: string (DB id)
// otherUserRole: "USER" | "DOCTOR"
// disabled: boolean

const AppointmentChat = ({
  appointmentId,
  currentUserId,
  currentUserRole,
  otherUserId,
  otherUserRole,
  disabled,
}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize WebSocket connection + load history
  useEffect(() => {
    if (!appointmentId || disabled) return;

    const token = localStorage.getItem("token");

    // Load past messages
    axios
      .get(`${CHAT_HISTORY_API}/${appointmentId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to load chat history:", err));

    // Setup STOMP client
    const sock = new SockJS(SOCKET_URL);
    const stompClient = new Client({
      webSocketFactory: () => sock,
      debug: () => {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: "Bearer " + token,
      },
      onConnect: () => {
        setConnected(true);
        // Subscribe to private user queue
        stompClient.subscribe("/user/queue/messages", (message) => {
          const msgBody = JSON.parse(message.body);
          if (msgBody.appointmentId === appointmentId) {
            setMessages((prev) => [...prev, msgBody]);
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"], frame.body);
      },
    });

    clientRef.current = stompClient;
    stompClient.activate();

    return () => {
      stompClient.deactivate();
      setConnected(false);
    };
  }, [appointmentId, disabled]);

  // Send message
  const sendMessage = () => {
    if (!input.trim() || !connected || !clientRef.current) return;

    const chatMessage = {
      appointmentId,
      senderId: currentUserId,
      receiverId: otherUserId,
      receiverRole: otherUserRole, // <-- NEW field for backend
      message: input.trim(),
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
    };

    clientRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(chatMessage),
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    // Add message locally
    setMessages((prev) => [...prev, chatMessage]);
    setInput("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        maxWidth: 600,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        height: 400,
      }}
    >
      <div
        style={{
          padding: 10,
          background: "#007bff",
          color: "white",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        Chat for Appointment #{appointmentId}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 10,
          background: "#f9f9f9",
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#777", textAlign: "center" }}>No messages yet</p>
        )}
        {messages.map((msg, i) => {
          const isCurrentUser = msg.senderId === currentUserId;
          return (
            <div
              key={i}
              style={{
                marginBottom: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: isCurrentUser ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  background: isCurrentUser ? "#007bff" : "#e5e5ea",
                  color: isCurrentUser ? "white" : "black",
                  padding: "8px 12px",
                  borderRadius: 20,
                  maxWidth: "70%",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              >
                {msg.message}
              </div>
              <small style={{ fontSize: 10, color: "#666", marginTop: 2 }}>
                {moment(msg.timestamp).format("hh:mm A, MMM Do")}
              </small>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: 10, borderTop: "1px solid #ddd" }}>
        <textarea
          rows={2}
          disabled={disabled}
          placeholder={disabled ? "Chat disabled" : "Type a message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          style={{
            width: "100%",
            resize: "none",
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />
        <button
          disabled={disabled || !input.trim()}
          onClick={sendMessage}
          style={{
            marginTop: 6,
            padding: "8px 16px",
            borderRadius: 4,
            background: "#007bff",
            color: "white",
            border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AppointmentChat;
