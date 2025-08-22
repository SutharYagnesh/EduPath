# EduPath ML Server

This is the Python Flask server that handles file processing and AI responses using Google's Gemini API.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the `ml` directory with your Gemini API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8000
HOST=0.0.0.0
```

3. Get your Gemini API key:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy it to your `.env` file

4. Run the server:
```bash
python main.py
```

## Features

- **PDF Processing**: Uses PyPDF2 to extract text from PDF files
- **AI Responses**: Uses Google Gemini API for intelligent responses
- **Video Scraping**: Uses BeautifulSoup to find educational videos on YouTube
- **File Upload**: Handles multiple file types (PDF, DOC, TXT, images)

## API Endpoints

- `GET /health` - Server health check
- `POST /api/process-file` - Process uploaded files
- `POST /api/process-text` - Process text input

## File Processing Actions

1. **Summary**: Generate a comprehensive summary of the document
2. **Roadmap**: Create a learning roadmap based on the content
3. **Video**: Find relevant educational videos on YouTube
