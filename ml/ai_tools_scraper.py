import requests
from bs4 import BeautifulSoup
import random
import json

# ----------------------------
# User-Agent rotation
# ----------------------------
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    "Mozilla/5.0 (X11; Linux x86_64) Gecko/20100101 Firefox/122.0"
]

# ----------------------------
# Primary Aixploria Scraper
# ----------------------------
def scrape_ai_tools_real_time(query="AI tools", limit=5):
    tools = []
    base_url = "https://www.aixploria.com"
    search_url = f"{base_url}/en/?s={query.replace(' ', '+')}"

    try:
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        resp = requests.get(search_url, headers=headers, timeout=20)
        resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")
        articles = soup.find_all(lambda tag: tag.name == 'div' and tag.find(class_='post-info'), limit=limit)
        i=0
        for art in articles:
            title_tag = art.find(class_="dark-title")
            url_tag = art.find("a", class_="visit-site-button4")
            desc_tag = art.find("p", class_="post-excerpt")

            if not title_tag or not url_tag:
                continue

            title = title_tag.get_text(strip=True)
            url = url_tag["href"]
            description = desc_tag.get_text(strip=True) if desc_tag else f"AI tool: {title}"
            if title not in tools:
                i=i+1
                tools.append({"title": title, "url": url, "description": description})

        if tools:
            print(f"✅ Found {len(tools)} tools on Aixploria for '{query}'")
            return tools

        # If no results, fallback
        return scrape_ai_tools_fallback(query, limit)

    except Exception as e:
        print(f"⚠️ Error scraping Aixploria: {e}")
        return scrape_ai_tools_fallback(query, limit)

# ----------------------------
# DuckDuckGo Fallback Scraper
# ----------------------------
def scrape_ai_tools_fallback(query="AI tools", limit=10):
    tools = []
    try:
        search_url = f"https://duckduckgo.com/html/?q=site:aixploria.com+{query}"
        headers = {"User-Agent": random.choice(USER_AGENTS)}
        resp = requests.get(search_url, headers=headers, timeout=15)
        resp.raise_for_status()

        soup = BeautifulSoup(resp.text, "html.parser")
        results = soup.select("a.result__a")

        for r in results[:limit]:
            title = r.get_text(strip=True)
            url = r["href"]
            tools.append({"title": title, "url": url, "description": f"AI tool from Aixploria: {title}"})

        if tools:
            print(f"🔄 DuckDuckGo fallback: {len(tools)} tools found")
            return tools

        return generate_mock_ai_tools(query, limit)

    except Exception as e:
        print(f"⚠️ Fallback error: {e}")
        return generate_mock_ai_tools(query, limit)

# ----------------------------
def generate_mock_ai_tools(query="AI tools", limit=10):
    mock_tools = [
        {"title": "ChatGPT", "url": "https://chat.openai.com/", "description": "OpenAI's conversational AI assistant."},
        {"title": "Claude", "url": "https://claude.ai/", "description": "Anthropic's helpful AI assistant."},
        {"title": "Midjourney", "url": "https://www.midjourney.com/", "description": "AI-powered image generation platform."},
        {"title": "DALL·E", "url": "https://openai.com/dall-e-2/", "description": "OpenAI's AI image generator."},
        {"title": "Notion AI", "url": "https://www.notion.so/product/ai", "description": "AI-powered productivity and writing assistant."},
        {"title": "Jasper", "url": "https://www.jasper.ai/", "description": "AI content and marketing platform."},
        {"title": "Copy.ai", "url": "https://www.copy.ai/", "description": "AI-powered content and copywriting tool."},
    ]
    print("ℹ️ Using mock AI tools as last resort")
    return mock_tools[:limit]

# ----------------------------
# Markdown Formatter (Optional)
# ----------------------------
def formatAIToolsToMarkdown(data):
    if not data:
        return "No AI tools found."

    markdown = "## AI Tools Recommendations\n\n"
    for i, tool in enumerate(data):
        markdown += f"### {i+1}. {tool['title']}\n"
        if tool.get('description'):
            desc = tool['description'][:150] + "..." if len(tool['description']) > 150 else tool['description']
            markdown += f"**Description:** {desc}\n"
        markdown += f"**Link:** [Visit Website]({tool['url']})\n\n"
    return markdown

# ----------------------------
if __name__ == "__main__":
    query = input("Enter tool search query: ")
    tools = scrape_ai_tools_real_time(query, limit=5)
    print(json.dumps(tools, indent=2, ensure_ascii=False))
