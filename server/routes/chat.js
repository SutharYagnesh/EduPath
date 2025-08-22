const express = require('express');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all chats for a user
// Route to get all chats for a user
router.get('/chat', auth, async (req, res) => {
  try {
    // Log the user ID to ensure it's correctly populated by the auth middleware
    console.log('Fetching chats for userId:', req.user._id);
    const chats = await Chat.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    // Log the number of chats found
    console.log('Found', chats.length, 'chats for userId:', req.user._id);
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new chat
// Route to create a new chat
router.post('/chat', auth, async (req, res) => {
  try {
    const { title } = req.body;
    // Log incoming request body and user ID
    console.log('Creating new chat for userId:', req.user._id, 'with title:', title);
    const chat = new Chat({
      userId: req.user._id,
      title: title || 'New Chat',
      messages: [] // New chats start with an empty message array
    });
    await chat.save();
    // Log the newly created chat object
    console.log('New chat created:', chat);
    res.json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update chat title
// Route to update chat title or messages
router.put('/chat/:id', auth, async (req, res) => {
  try {
    const { title, messages } = req.body;
    const updateFields = {};
    if (title) updateFields.title = title;
    if (messages) updateFields.messages = messages;

    // Log update request details
    console.log('Updating chat ID:', req.params.id, 'for userId:', req.user._id, 'with fields:', updateFields);

    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id }, // Find by chat ID and user ID for security
      updateFields,
      { new: true } // Return the updated document
    );
    
    if (!chat) {
      // Log if chat is not found
      console.log('Chat not found for update:', req.params.id);
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    // Log the updated chat object
    console.log('Chat updated successfully:', chat);
    res.json(chat);
  } catch (error) {
    console.error('Error updating chat:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a chat
// Route to delete a chat
router.delete('/chat/:id', auth, async (req, res) => {
  try {
    // Log delete request details
    console.log('Deleting chat ID:', req.params.id, 'for userId:', req.user._id);
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!chat) {
      // Log if chat is not found
      console.log('Chat not found for deletion:', req.params.id);
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    console.log('Chat deleted successfully:', req.params.id);
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send a message and get AI response
// Route to send a message and get AI response
router.post('/message', auth, async (req, res) => {
  try {
    const { message, chatId } = req.body;
    
    // Log incoming message request
    console.log('Received message request:', { message, chatId, userId: req.user._id });

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let chat;
    if (chatId) {
      // Find existing chat by ID and user ID
      chat = await Chat.findOne({ _id: chatId, userId: req.user._id });
      if (!chat) {
        console.log('Existing chat not found for chatId:', chatId);
        return res.status(404).json({ error: 'Chat not found' });
      }
      console.log('Found existing chat:', chat._id);
    } else {
      // Create new chat if no chatId provided (first message in a new conversation)
      console.log('No chatId provided, creating new chat.');
      chat = new Chat({
        userId: req.user._id,
        title: 'New Chat', // Default title, will be updated after AI response
        messages: []
      });
      await chat.save();
      console.log('New chat created with ID:', chat._id);
    }

    // Add user message to chat history
    const userMessage = {
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    chat.messages.push(userMessage);
    console.log('User message added to chat:', userMessage);
    
    // Emit the user message to all clients in the chat room via Socket.io
    // This ensures real-time update for all connected clients in the same chat
    req.app.get('io').to(chat._id.toString()).emit('receive_message', {
      chatId: chat._id,
      message: userMessage.text,
      sender: userMessage.sender,
      timestamp: userMessage.timestamp
    });

    // Generate AI response (placeholder for now - integrate with ML service later)
    // This function would typically call an external ML model or service
    const aiResponse = await generateAIResponse(message);
    console.log('AI generated response:', aiResponse);
    
    // Add AI response to chat history
    const aiMessage = {
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date()
    };
    
    chat.messages.push(aiMessage);
    console.log('AI message added to chat:', aiMessage);
    
    // Emit the AI response to all clients in the chat room via Socket.io
    req.app.get('io').to(chat._id.toString()).emit('receive_message', {
      chatId: chat._id,
      message: aiMessage.text,
      sender: aiMessage.sender,
      timestamp: aiMessage.timestamp
    });

    // Update chat title based on the first user message if it's a new chat
    // This makes chat titles more descriptive in the sidebar
    if (chat.messages.length === 2) { // User message + AI response = 2 messages
      chat.title = message.length > 30 ? message.substring(0, 30) + '...' : message; // Truncate long titles
      console.log('Chat title updated to:', chat.title);
    }

    // Save the updated chat document to the database
    await chat.save();
    console.log('Chat saved successfully with new messages.');
    
    res.json({
      response: aiResponse,
      chatId: chat._id
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Placeholder function for AI response generation
async function generateAIResponse(message) {
  // This is a placeholder - integrate with your ML service here
  // For now, return a simple response with markdown formatting
  const responses = [
    `## I understand you're asking about ${message}

Let me help you with that. Here are some key points:

* First important point
* Second important point
* Third important point

### Additional Resources

You might find these resources helpful:
1. Resource one
2. Resource two
3. Resource three`,
    
    `## That's an interesting question about ${message}

Here's what I can tell you:

### Overview
${message} is an important topic in this field. Let's break it down:

* **Key concept 1**: Explanation here
* **Key concept 2**: Explanation here
* **Key concept 3**: Explanation here

> Remember that understanding these fundamentals is crucial for mastering this topic.`,
    
    `## Based on your query about ${message}

I'd recommend the following approach:

1. First step in the process
2. Second step in the process
3. Third step in the process

### Code Example
\`\`\`javascript
// Sample code related to ${message}
function example() {
  console.log("This is a sample code");
  return "Success!";
}
\`\`\``,
    
    `## Great question about ${message}!

Here's my advice:

### Main Points

1. First important consideration
2. Second important consideration
3. Third important consideration

### Practical Application

When applying this knowledge, remember to:
* Start with the basics
* Practice regularly
* Seek feedback from experts`,
    
    `## I'd be happy to help you with ${message}

Let me provide some guidance:

### Learning Path

| Stage | Focus Area | Estimated Time |
|-------|------------|----------------|
| Beginner | Fundamentals | 2-4 weeks |
| Intermediate | Applied Skills | 1-2 months |
| Advanced | Specialization | 3+ months |

### Key Resources

* **Books**: Recommended reading list
* **Courses**: Online learning options
* **Communities**: Places to connect with others`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

module.exports = router;
