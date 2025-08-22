"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Send, User, Bot, Plus, Trash2, Menu, X, FileText, Map, Video, Paperclip, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chats, setChats] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileProcessing, setFileProcessing] = useState(false)
  const [selectedTool, setSelectedTool] = useState(null)
  const [error, setError] = useState("")
  const [userId] = useState("user123") // Added userId for MongoDB integration
  const [userName, setUserName] = useState("Guest"); // State for user's name
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const API_ML_BASE_URL = "https://edu-path-ml.vercel.app"
  const API_NODE_BASE_URL = "https://edu-path-server.vercel.app"

  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name'); // Clear name on logout
    navigate('/login');
  }

  // Tool buttons configuration
  const TOOL_BUTTONS = [
    { id: "summary", label: "Summary", icon: FileText, color: "bg-blue-500" },
    { id: "roadmap", label: "Road Map", icon: Map, color: "bg-green-500" },
    { id: "courses", label: "Courses", icon: Video, color: "bg-purple-500" },
    { id: "jobs", label: "Job Finder", icon: User, color: "bg-orange-500" },
    { id: "ai-tools", label: "AI Tools", icon: Bot, color: "bg-pink-500" },
  ]

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
      loadChatsFromDatabase();
      const storedName = localStorage.getItem('name');
      if (storedName) {
        setUserName(storedName);
      } else {
        // Fetch user name if not in localStorage (e.g., after Google login redirect)
        fetchUserName();
      }
  }, [])

  const fetchUserName = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_NODE_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserName(data.name);
        localStorage.setItem('name', data.name);
      } else {
        console.error('Failed to fetch user name:', response.status);
        setUserName('User');
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
      setUserName('User');
    }
  };

  const loadChatsFromDatabase = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) { 
        console.log("No auth token found, initializing with welcome message")
        setMessages([
          {
            text: "Hello! I'm your EduPath AI assistant. How can I help with your learning journey today?",
            sender: "ai",
            timestamp: new Date(),
          },
        ])
        return
      }

      const response = await fetch(`${API_NODE_BASE_URL}/api/chat/chat`, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      })
      
      if (response.ok) {
        const userChats = await response.json()
        setChats(userChats)

        // If no current chat selected and chats exist, select the first one
        if (!currentChatId && userChats.length > 0) {
          setCurrentChatId(userChats[0]._id)
          setMessages(userChats[0].messages || [])
        } else if (userChats.length === 0) {
          // No chats found, show welcome message
          setMessages([
            {
              text: "Hello! I'm your EduPath AI assistant. How can I help with your learning journey today?",
              sender: "ai",
              timestamp: new Date(),
            },
          ])
        }
      } else {
        console.error("Failed to load chats:", response.status)
        // Show welcome message on error
        setMessages([
          {
            text: "Hello! I'm your EduPath AI assistant. How can I help with your learning journey today?",
            sender: "ai",
            timestamp: new Date(),
          },
        ])
      }
    } catch (error) {
      console.error("Error loading chats:", error)
      // Initialize with welcome message if no chats found
      if (messages.length === 0) {
        setMessages([
          {
            text: "Hello! I'm your EduPath AI assistant. How can I help with your learning journey today?",
            sender: "ai",
            timestamp: new Date(),
          },
        ])
      }
    }
  }

  const saveChatToDatabase = async (chatData) => {
    try {
      const response = await fetch(`${API_NODE_BASE_URL}/api/chat/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title: chatData?.title || 'New Chat', messages: chatData?.messages || [] }),
      })

      if (response.ok) {
        const savedChat = await response.json()
        return savedChat
      }
    } catch (error) {
      console.error("Error saving chat:", error)
    }
    return null
  }

  const updateChatInDatabase = async (chatId, messages, title = null) => {
    try {
      const updateData = { messages };
      if (title) {
        updateData.title = title;
      }

      const response = await fetch(`${API_NODE_BASE_URL}/api/chat/chat/${chatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData),
      })

      return response.ok
    } catch (error) {
      console.error("Error updating chat:", error)
      return false
    }
  }

  const createNewChat = async () => {
    const welcomeMessage = {
      text: "Hello! I'm your EduPath AI assistant. How can I help with your learning journey today?",
      sender: "ai",
      timestamp: new Date(),
    }

    const newChatData = {
      userId: userId,
      title: "New Chat",
      messages: [welcomeMessage],
    }

    const savedChat = await saveChatToDatabase(newChatData)

    if (savedChat) {
      setChats((prev) => [savedChat, ...prev])
      setCurrentChatId(savedChat._id)
      setMessages([welcomeMessage])
    } else {
      // Fallback to local state if database save fails
      const localChatId = Date.now().toString()
      const localChat = {
        _id: localChatId,
        title: "New Chat",
        messages: [welcomeMessage],
        createdAt: new Date(),
      }

      setChats((prev) => [localChat, ...prev])
      setCurrentChatId(localChatId)
      setMessages([welcomeMessage])
    }

    setSelectedTool(null)
    setError("")
  }

  const deleteChat = async (chatId, e) => {
    e.stopPropagation()

    try {
      await fetch(`${API_NODE_BASE_URL}/api/chat/chat/${chatId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
    } catch (error) {
      console.error("Error deleting chat:", error)
    }

    const updatedChats = chats.filter((chat) => chat._id !== chatId)
    setChats(updatedChats)

    if (chatId === currentChatId) {
      if (updatedChats.length > 0) {
        setCurrentChatId(updatedChats[0]._id)
        setMessages(updatedChats[0].messages || [])
      } else {
        setCurrentChatId(null)
        setMessages([])
      }
    }
  }

  // Select a chat
  const selectChat = (chatId) => {
    setCurrentChatId(chatId)
    const selectedChat = chats.find((chat) => chat._id === chatId)
    if (selectedChat) {
      setMessages(selectedChat.messages || [])
    }
    setSelectedTool(null)
    setError("")
  }

  const sendMessage = async () => {
    if (!input.trim() && !selectedFile && !selectedTool) return

    let chatId = currentChatId
    if (!chatId) {
      const newChatData = {
        userId: userId,
        title: input.substring(0, 30) + (input.length > 30 ? '...' : '') || 'New Chat',
        messages: [], // Will be populated after user message is added
      };
      const savedChat = await saveChatToDatabase(newChatData);
      if (savedChat) {
        setCurrentChatId(savedChat._id);
        setChats((prev) => [savedChat, ...prev]);
        chatId = savedChat._id;
      } else {
        // Fallback if saving new chat fails
        chatId = Date.now().toString();
        const localChat = {
          _id: chatId,
          title: input.substring(0, 30) + (input.length > 30 ? '...' : '') || 'New Chat',
          messages: [],
          createdAt: new Date(),
        };
        setChats((prev) => [localChat, ...prev]);
        setCurrentChatId(localChat._id);
      }
    }

    const userMessage = {
      text: selectedFile ? `${input || "File uploaded"}: ${selectedFile.name}` : input,
      sender: "user",
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)
    setError("")

    try {
      let response

      if (selectedFile) {
        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("action", selectedTool && TOOL_BUTTONS.some(t => t.id === selectedTool) ? selectedTool : "summary")

        if (input.trim()) {
          formData.append("additional_text", input)
        }

        response = await fetch(`${API_ML_BASE_URL}/api/process-file`, {
          method: "POST",
          body: formData,
        })
      } else {
        // All text queries go to ML backend
        let endpoint = "/api/chat"
        let requestBody = { message: input }

        if (selectedTool) {
          switch (selectedTool) {
            case "summary":
            case "roadmap":
              endpoint = "/api/process-text"
              requestBody = { text: input, action: selectedTool }
              break
            case "courses":
              endpoint = `/api/courses?query=${encodeURIComponent(input)}&format=markdown`
              break
            case "jobs":
              endpoint = `/api/jobs?query=${encodeURIComponent(input)}&format=markdown`
              break
            case "ai-tools":
              endpoint = `/api/ai-tools?query=${encodeURIComponent(input)}&format=markdown`
              break
            default:
              // Handle unknown tool types
              endpoint = "/api/chat"
              requestBody = { message: input }
              break
          }
        }

        // Use ML server for all queries
        if (selectedTool && ["courses", "jobs", "ai-tools"].includes(selectedTool)) {
          response = await fetch(`${API_ML_BASE_URL}${endpoint}`)
        } else {
          response = await fetch(`${API_ML_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          })
        }
      }

      if (!response || !response.ok) {
        throw new Error(`ML backend error! status: ${response ? response.status : 'No response'}`)
      }

      const data = await response.json()

      let botContent = ""
      if (selectedTool && ["courses", "jobs", "ai-tools"].includes(selectedTool)) {
        botContent = data.markdown || JSON.stringify(data, null, 2)
      } else {
        botContent = data.response || data.result || "Sorry, I couldn't process your request."
      }

      const botMessage = {
        text: botContent,
        sender: "ai",
        timestamp: new Date(),
      }

      const finalMessages = [...updatedMessages, botMessage]
      setMessages(finalMessages)

      setChats((prev) => prev.map((chat) => (chat._id === chatId ? { ...chat, messages: finalMessages } : chat)))

      // Save chat to database after message exchange
      if (chatId) {
        await updateChatInDatabase(chatId, finalMessages)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setError("Failed to send message. Please check if the ML backend server is running on port 8000.")

      const errorMessage = {
        text: "Sorry, I encountered an error. Please make sure the ML backend server is running and try again.",
        sender: "ai",
        timestamp: new Date(),
      }

      const errorMessages = [...updatedMessages, errorMessage]
      setMessages(errorMessages)
    } finally {
      setIsLoading(false)
      setSelectedTool(null)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setError("")

    // Show success message
    setError(`File "${file.name}" selected. Choose a tool and click send to process.`)
  }

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-screen w-screen bg-gray-900 text-white">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-80 bg-gray-800 border-r border-gray-800 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-900">
              <div className="flex items-center justify-between">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent cursor-pointer"
                  onClick={() => navigate('/')}
                >
                  EduPath
                </motion.h1>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-gray-800 rounded-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={createNewChat}
                className="w-full bg-white hover:bg-gray-200 text-black p-3 rounded-md flex items-center justify-center gap-2 transition-all duration-200"
              >
                <Plus size={20} />
                New Chat
              </motion.button>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto px-4">
              <AnimatePresence>
                {chats.map((chat, index) => (
                  <motion.div
                    key={chat._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`group flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      currentChatId === chat._id
                        ? "bg-[#111] border border-gray-800"
                        : "hover:bg-[#111]"
                    }`}
                    onClick={() => selectChat(chat._id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm truncate">{chat.title}</span>
                    </div>
                    <button
                      onClick={(e) => deleteChat(chat._id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600/20 rounded transition-all duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black border border-gray-800 rounded-full flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <div className="text-sm font-medium">{userName}</div>
                  <div className="text-xs text-gray-400">Online</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 w-full bg-white hover:bg-gray-200 text-black py-2 rounded-md transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-800 rounded-md transition-colors"
              >
                <Menu size={20} />
              </button>
            )}
            <h2 className="text-xl font-semibold">EduPath AI Assistant</h2>
          </div>
        </div>

        {/* Tool Selection */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex flex-wrap gap-2">
            {TOOL_BUTTONS.map((tool) => {
              const Icon = tool.icon
              return (
                <motion.button
                  key={tool.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTool(selectedTool === tool.id ? null : tool.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedTool === tool.id
                      ? `bg-white text-black shadow-lg`
                      : "bg-black border border-gray-800 hover:bg-[#111] text-white"
                  }`}
                >
                  <Icon size={16} />
                  {tool.label}
                </motion.button>
              )
            })}
          </div>
          <div className="mt-2 space-y-1">
            {selectedTool && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-400"
              >
                Mode: {TOOL_BUTTONS.find((t) => t.id === selectedTool)?.label || selectedTool}
              </motion.div>
            )}
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-400 flex items-center gap-2"
              >
                <FileText size={14} />
                File ready: {selectedFile.name}
                <button
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""
                    }
                  }}
                  className="text-gray-500 hover:text-white ml-2"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mx-4 mt-4 p-3 border rounded-lg text-sm ${
              error.includes("selected")
                ? "bg-[#111] border-gray-800 text-gray-400"
                : "bg-[#111] border-gray-800 text-gray-400"
            }`}
          >
            {error}
          </motion.div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        message.sender === "user"
                          ? "bg-white text-black ml-3"
                          : "bg-black border border-gray-800 mr-3"
                      }`}
                    >
                      {message.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div
                      className={`p-4 rounded-md ${
                        message.sender === "user"
                          ? "bg-white text-black"
                          : "bg-[#111] border border-gray-800 text-white"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <p className="whitespace-pre-wrap">{message.text}</p>
                      ) : (
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown components={{
            a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />
          }}>{message.text}</ReactMarkdown>
                        </div>
                      )}
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp && new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading Animation */}
            {(isLoading || fileProcessing) && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="flex">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black border border-gray-800 mr-3">
                    <Bot size={16} />
                  </div>
                  <div className="bg-[#111] border border-gray-800 p-4 rounded-md text-white">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">{fileProcessing ? "Processing file..." : "Thinking..."}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".txt,.pdf,.png,.jpg,.jpeg,.gif,.doc,.docx"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => fileInputRef.current?.click()}
                className={`p-3 rounded-md transition-colors ${
                  selectedFile ? "bg-white text-black" : "bg-black border border-gray-800 hover:bg-[#111] text-white"
                }`}
                disabled={isLoading || fileProcessing}
              >
                <Paperclip size={20} />
              </motion.button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    selectedFile
                      ? `Add message for ${selectedFile.name}...`
                      : selectedTool
                        ? `Ask about ${selectedTool}...`
                        : "Message EduPath..."
                  }
                  className="w-full bg-black border border-gray-800 rounded-md px-4 py-3 text-white placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-colors"
                  disabled={isLoading || fileProcessing}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={isLoading || fileProcessing || (!input.trim() && !selectedFile && !selectedTool)}
                className="p-3 bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all duration-200"
              >
                {isLoading || fileProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={20} />}
              </motion.button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}
