from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
import google.generativeai as genai
from dotenv import load_dotenv
import PyPDF2

# Import scraper modules
import job_scraper
import courses_scraper
import ai_tools_scraper 

load_dotenv()

app = Flask(__name__)
CORS(app)

# Gemini API setup
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
else:
    model = None
    print("⚠️ GEMINI_API_KEY not found. Using fallback responses.")

# File uploads
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ---------------- File/Text Processing ----------------
def extract_text_from_pdf(filepath):
    try:
        with open(filepath, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return f"Error extracting text from PDF: {str(e)}"

def generate_gemini_response(prompt, context=""):
    if not model:
        return "Gemini API key not configured. Please set GEMINI_API_KEY in environment variables."
    try:
        full_prompt = f"{context}\n\n{prompt}" if context else prompt
        response = model.generate_content(full_prompt)
        return response.text
    except Exception as e:
        return f"Error generating response: {str(e)}"

def generate_gemini_response_chunked(prompt, max_chunk_chars=4000, context=""):
    """Generate a response for long prompts by chunking input text.

    Splits the prompt into reasonably sized chunks to avoid model/context limits
    and returns a concise aggregated summary.
    """
    if not model:
        return "Gemini API key not configured. Please set GEMINI_API_KEY in environment variables."
    try:
        text = f"{context}\n\n{prompt}" if context else prompt
        chunks = []
        start_index = 0
        while start_index < len(text):
            end_index = min(start_index + max_chunk_chars, len(text))
            chunks.append(text[start_index:end_index])
            start_index = end_index

        partial_summaries = []
        for idx, chunk in enumerate(chunks):
            instruction = (
                "You will receive a large query in parts. For each part, write a brief,"
                " information-dense summary in markdown. Keep each part's summary under 120 words."
            )
            resp = model.generate_content(f"{instruction}\n\nPart {idx+1}/{len(chunks)}:\n\n{chunk}")
            partial_summaries.append(resp.text or "")

        final_instruction = (
            "Combine the following part-summaries into a single concise answer."
            " Use clear sections and bullet points where helpful. Keep total under 400 words."
        )
        resp_final = model.generate_content(
            f"{final_instruction}\n\nPart summaries:\n\n" + "\n\n".join(partial_summaries)
        )
        return resp_final.text
    except Exception as e:
        return f"Error generating response: {str(e)}"

def extract_topics_from_query(query, action_type):
    """Extract relevant topics from a big query using Gemini for better scraping results."""
    if not model:
        return query  # Fallback to original query if no Gemini
    
    try:
        # Create specific prompts based on action type
        if action_type == "jobs":
            prompt = f"""
            Extract 2-3 key job-related keywords from this query for job search:
            "{query}"
            
            Return only the keywords separated by commas, no explanations.
            Focus on job titles, skills, technologies, or industries.
            """
        elif action_type == "courses":
            prompt = f"""
            Extract 2-3 key learning-related keywords from this query for course search:
            "{query}"
            
            Return only the keywords separated by commas, no explanations.
            Focus on subjects, skills, technologies, or learning areas.
            """
        elif action_type == "ai-tools":
            prompt = f"""
            Extract 2-3 key AI tool-related keywords from this query for AI tools search:
            "{query}"
            
            Return only the keywords separated by commas, no explanations.
            Focus on AI applications, use cases, or tool types.
            """
        else:
            prompt = f"""
            Extract 2-3 key keywords from this query:
            "{query}"
            
            Return only the keywords separated by commas, no explanations.
            """
        
        response = model.generate_content(prompt)
        extracted_keywords = response.text.strip()
        
        # Clean up the response and use it if valid
        if extracted_keywords and len(extracted_keywords) > 0:
            # Remove any extra text and get just the keywords
            keywords = extracted_keywords.split(',')[:3]  # Take first 3 keywords
            keywords = [kw.strip() for kw in keywords if kw.strip()]
            if keywords:
                return ' '.join(keywords)
        
        return query  # Fallback to original query
    except Exception as e:
        print(f"Error extracting topics: {str(e)}")
        return query  # Fallback to original query

def extract_topics_from_document(file_text, action_type):
    """Extract relevant topics from uploaded document content."""
    if not model:
        return "document analysis"  # Fallback if no Gemini
    
    try:
        # Truncate text if too long
        text_sample = file_text[:2000] if len(file_text) > 2000 else file_text
        
        if action_type == "jobs":
            prompt = f"""
            Analyze this document and extract 2-3 key job-related keywords:
            "{text_sample}"
            
            Return only the keywords separated by commas, no explanations.
            Focus on job titles, skills, technologies, or industries mentioned.
            """
        elif action_type == "courses":
            prompt = f"""
            Analyze this document and extract 2-3 key learning-related keywords:
            "{text_sample}"
            
            Return only the keywords separated by commas, no explanations.
            Focus on subjects, skills, technologies, or learning areas mentioned.
            """
        elif action_type == "ai-tools":
            prompt = f"""
            Analyze this document and extract 2-3 key AI tool-related keywords:
            "{text_sample}"
            
            Return only the keywords separated by commas, no explanations.
            Focus on AI applications, use cases, or tool types mentioned.
            """
        else:
            prompt = f"""
            Analyze this document and extract 2-3 key keywords:
            "{text_sample}"
            
            Return only the keywords separated by commas, no explanations.
            """
        
        response = model.generate_content(prompt)
        extracted_keywords = response.text.strip()
        
        # Clean up the response
        if extracted_keywords and len(extracted_keywords) > 0:
            keywords = extracted_keywords.split(',')[:3]
            keywords = [kw.strip() for kw in keywords if kw.strip()]
            if keywords:
                return ' '.join(keywords)
        
        return "document analysis"  # Fallback
    except Exception as e:
        print(f"Error extracting topics from document: {str(e)}")
        return "document analysis"  # Fallback

def process_file_content(filename, action, filepath):
    file_ext = filename.rsplit('.', 1)[1].lower()
    if file_ext == 'pdf':
        file_text = extract_text_from_pdf(filepath)
    elif file_ext in ['txt', 'doc', 'docx']:
        with open(filepath, 'r', encoding='utf-8') as f:
            file_text = f.read()
    else:
        file_text = f"Image file: {filename}"

    # Use chunked handling for large inputs
    is_large = isinstance(file_text, str) and len(file_text) > 4000
    responder = generate_gemini_response_chunked if is_large else generate_gemini_response

    if action == 'summary':
        prompt = f"Summarize this document in markdown:\n\n{file_text}..."
        return responder(prompt)
    elif action == 'roadmap':
        prompt = f"Create a learning roadmap in markdown:\n\n{file_text[:500]}..."
        return responder(prompt)
    elif action in ['jobs', 'courses', 'ai-tools']:
        # Extract topics from document for related searches
        extracted_topics = extract_topics_from_document(file_text, action)
        
        # Get related data based on extracted topics
        if action == 'jobs':
            jobs = job_scraper.get_jobs(extracted_topics, 'gujarat', 5)
            markdown = job_scraper.formatJobsToMarkdown({"jobs": jobs}) if jobs else "No related jobs found."
            return f"## Document Analysis: {extracted_topics}\n\n### Related Jobs Found:\n\n{markdown}"
        
        elif action == 'courses':
            courses = courses_scraper.get_course_suggestions(extracted_topics, 5)
            markdown = courses_scraper.formatCoursesToMarkdown(courses) if courses else "No related courses found."
            return f"## Document Analysis: {extracted_topics}\n\n### Related Courses Found:\n\n{markdown}"
        
        elif action == 'ai-tools':
            tools = ai_tools_scraper.scrape_ai_tools_real_time(extracted_topics, 5)
            markdown = ai_tools_scraper.formatAIToolsToMarkdown(tools) if tools else "No related AI tools found."
            return f"## Document Analysis: {extracted_topics}\n\n### Related AI Tools Found:\n\n{markdown}"
    else:
        return responder(f"Analyze this document: {file_text[:4000]}...")

def process_text_content(text, action):
    # Use chunked handling for large inputs
    is_large = isinstance(text, str) and len(text) > 4000
    responder = generate_gemini_response_chunked if is_large else generate_gemini_response

    if action == 'summary':
        prompt = f"Summarize this text in markdown:\n\n{text}"
        return responder(prompt)
    elif action == 'roadmap':
        prompt = f"Create a detailed learning roadmap:\n\n{text}"
        return responder(prompt)
    else:
        return responder(f"Analyze this text: {text}")

@app.route('/api/process-file', methods=['POST'])
def process_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        file = request.files['file']
        action = request.form.get('action', 'summary')
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            result = process_file_content(filename, action, filepath)
            os.remove(filepath)
            return jsonify({'success': True, 'result': result, 'filename': filename, 'action': action})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/process-text', methods=['POST'])
def process_text():
    try:
        data = request.get_json()
        text = data.get('text', '')
        action = data.get('action', 'summary')
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        result = process_text_content(text, action)
        return jsonify({'success': True, 'result': result, 'action': action})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        # Use chunked handling for large inputs
        is_large = isinstance(message, str) and len(message) > 4000
        responder = generate_gemini_response_chunked if is_large else generate_gemini_response
        response = responder(message)
        return jsonify({'success': True, 'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ---------------- Real-time AI Tools ----------------

@app.route('/api/ai-tools', methods=['GET'])
def get_ai_tools():
    query = request.args.get('query', 'AI tools')
    limit = int(request.args.get('limit', 10))
    
    # Extract topics from big queries using Gemini
    if len(query) > 50:  # Consider it a big query
        extracted_query = extract_topics_from_query(query, "ai-tools")
        print(f"Big query detected. Original: '{query}' -> Extracted: '{extracted_query}'")
        query = extracted_query
    
    # Real-time scrape only - no fallback to mock data
    result = ai_tools_scraper.scrape_ai_tools_real_time(query, limit)
    print(f"AI Tools: Found {len(result) if result else 0} real tools for '{query}'")
    
    # Format to markdown if requested
    format_type = request.args.get('format', '')
    if format_type == 'markdown':
        markdown = ai_tools_scraper.formatAIToolsToMarkdown(result)
        return jsonify({"markdown": markdown, "data": result})
    
    return jsonify(result)

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    query = request.args.get('query', 'Software Engineer')
    location = request.args.get('location', 'gujarat')
    limit = int(request.args.get('limit', 10))
    
    # Extract topics from big queries using Gemini
    if len(query) > 50:  # Consider it a big query
        extracted_query = extract_topics_from_query(query, "jobs")
        print(f"Big query detected. Original: '{query}' -> Extracted: '{extracted_query}'")
        query = extracted_query
    
    # Real-time LinkedIn jobs only (no mock fallback)
    jobs = job_scraper.get_jobs(query, 'gujarat', limit)
    print(f"Jobs endpoint returned {len(jobs) if jobs else 0} items for '{query}' in '{location}'")
    
    result = {"jobs": jobs}
    
    # Format to markdown if requested
    format_type = request.args.get('format', '')
    if format_type == 'markdown':
        markdown = job_scraper.formatJobsToMarkdown(result)
        return jsonify({"markdown": markdown, "data": result})
    
    return jsonify(result)


@app.route('/api/courses', methods=['GET'])
def get_courses():
    query = request.args.get('query', 'AI')
    limit = int(request.args.get('limit', 5))
    
    # Extract topics from big queries using Gemini
    if len(query) > 50:  # Consider it a big query
        extracted_query = extract_topics_from_query(query, "courses")
        print(f"Big query detected. Original: '{query}' -> Extracted: '{extracted_query}'")
        query = extracted_query
    
    # Prefer real scraped courses; get_course_suggestions already tries real then platform links
    courses = courses_scraper.get_course_suggestions(query, limit)
    print(f"Courses endpoint returned {len(courses) if courses else 0} items for '{query}'")
    
    # Format to markdown if requested
    format_type = request.args.get('format', '')
    if format_type == 'markdown':
        markdown = courses_scraper.formatCoursesToMarkdown(courses)
        return jsonify({"markdown": markdown, "data": courses})
    
    return jsonify(courses)

# ---------------- Health Check ----------------
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'gemini_configured': bool(GEMINI_API_KEY)})

# ---------------- Run Server ----------------
if __name__ == '__main__':
    print("Starting Flask Server...")
    app.run(host='0.0.0.0', port=8000, debug=True)
