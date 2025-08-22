import requests
from bs4 import BeautifulSoup
import json
import random

# ----------------------------
# Coursera Scraper
# ----------------------------
def scrape_coursera_courses(query, limit=5):
    """Scrape courses from Coursera"""
    courses = []
    try:
        search_url = f"https://www.coursera.org/search?query={query}"
        headers = {"User-Agent": "Mozilla/5.0"}
        resp = requests.get(search_url, headers=headers, timeout=15)
        soup = BeautifulSoup(resp.text, 'html.parser')

        course_cards = soup.select('li[data-testid="search-result"]')
        count = 0
        for course in course_cards:
            if count >= limit:
                break

            title_elem = course.select_one('[data-testid="search-result-title"]')
            provider_elem = course.select_one('[data-testid="partner-name"]')
            link_elem = course.select_one('a')

            if title_elem and link_elem:
                title = title_elem.get_text(strip=True)
                if not title:
                    continue

                url = link_elem.get("href", "")
                if not url.startswith("http"):
                    url = f"https://www.coursera.org{url}"

                # avoid duplicates
                if any(c['title'] == title for c in courses):
                    continue

                courses.append({
                    "title": title,
                    "provider": provider_elem.get_text(strip=True) if provider_elem else "Coursera",
                    "platform": "Coursera",
                    "url": url
                })
                count += 1

        return courses
    except Exception as e:
        print(f"Error scraping Coursera: {str(e)}")
        return []


# ----------------------------
# Udemy Scraper
# ----------------------------
def scrape_udemy_courses(query, limit=5):
    """Scrape courses from Udemy using JSON-LD"""
    courses = []
    try:
        search_url = f"https://www.udemy.com/courses/search/?q={query}"
        headers = {"User-Agent": "Mozilla/5.0"}
        resp = requests.get(search_url, headers=headers, timeout=10)
        soup = BeautifulSoup(resp.text, 'html.parser')

        scripts = soup.find_all("script", {"type": "application/ld+json"})
        count = 0
        for script in scripts:
            if count >= limit:
                break
            try:
                data = json.loads(script.string)
                if isinstance(data, dict) and data.get("@type") == "Course":
                    title = data.get("name", "Untitled")
                    if any(c['title'] == title for c in courses):
                        continue
                    courses.append({
                        "title": title,
                        "provider": data.get("provider", {}).get("name", "Udemy"),
                        "platform": "Udemy",
                        "url": data.get("url", "https://www.udemy.com")
                    })
                    count += 1
            except Exception:
                continue

        return courses
    except Exception as e:
        print(f"Error scraping Udemy: {str(e)}")
        return []


# ----------------------------
# Platform Suggestions Fallback
# ----------------------------
def get_course_suggestions(query, limit=5):
    """Get course suggestions: real courses first, fallback to platform links"""
    # Try real courses first
    coursera_courses = scrape_coursera_courses(query, limit)
    udemy_courses = scrape_udemy_courses(query, limit)
    all_courses = coursera_courses + udemy_courses

    # Deduplicate
    unique_courses = []
    seen_titles = set()
    for c in all_courses:
        if c['title'] not in seen_titles:
            unique_courses.append(c)
            seen_titles.add(c['title'])

    if unique_courses:
        return unique_courses[:limit]

    # Fallback links
    platforms = [
        {"name": "Coursera", "url": f"https://www.coursera.org/search?query={query}", "logo": "https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/favicon-v2-96x96.png"},
        {"name": "Udemy", "url": f"https://www.udemy.com/courses/search/?q={query}", "logo": "https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg"},
        {"name": "edX", "url": f"https://www.edx.org/search?q={query}", "logo": "https://www.edx.org/images/logos/edx-logo-elm.svg"},
        {"name": "Khan Academy", "url": f"https://www.khanacademy.org/search?page_search_query={query}", "logo": "https://cdn.kastatic.org/images/khan-logo-vertical-transparent.png"},
        {"name": "MIT OCW", "url": f"https://ocw.mit.edu/search/?q={query}", "logo": "https://ocw.mit.edu/images/mit_logo.png"}
    ]
    
    platform_courses = []
    for platform in platforms[:limit]:
        platform_courses.append({
            "title": f"Search {platform['name']} for {query}",
            "provider": platform['name'],
            "platform": platform['name'],
            "url": platform['url'],
            "logo": platform['logo']
        })
    
    return platform_courses


# ----------------------------
# Mock Data Fallback
# ----------------------------
def generate_mock_courses(query, limit=5):
    """Generate mock course data for testing"""
    platforms = [
        {"name": "Coursera", "logo": "https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/favicon-v2-96x96.png"},
        {"name": "Udemy", "logo": "https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg"},
        {"name": "edX", "logo": "https://www.edx.org/images/logos/edx-logo-elm.svg"},
        {"name": "Khan Academy", "logo": "https://cdn.kastatic.org/images/khan-logo-vertical-transparent.png"},
        {"name": "MIT OCW", "logo": "https://ocw.mit.edu/images/mit_logo.png"}
    ]
    instructors = ["Dr. Andrew Ng", "Prof. David Malan", "Dr. Angela Yu", "Colt Steele", "Maximilian Schwarzmüller"]
    course_titles = [
        f"Complete {query.title()} Bootcamp",
        f"Introduction to {query.title()}",
        f"Advanced {query.title()} Masterclass",
        f"{query.title()} for Beginners",
        f"Professional {query.title()} Certification",
        f"The Ultimate {query.title()} Guide",
        f"{query.title()} Fundamentals",
        f"Practical {query.title()} Projects",
        f"{query.title()} Specialization",
        f"Modern {query.title()} Techniques"
    ]
    mock_courses = []
    for i in range(min(limit, 10)):
        platform = platforms[i % len(platforms)]
        mock_courses.append({
            "title": course_titles[i % len(course_titles)],
            "provider": random.choice(instructors),
            "platform": platform["name"],
            "url": f"https://{platform['name'].lower().replace(' ', '')}.com/course/{query.lower().replace(' ', '-')}-{i+1}",
            "logo": platform["logo"]
        })
    return mock_courses


# ----------------------------
# Markdown Formatter
# ----------------------------
def formatCoursesToMarkdown(data):
    if not data:
        return "No courses found."
    markdown = "## Course Recommendations\n\n"
    for i, course in enumerate(data):
        title = course.get('title', f'Course {i+1}')
        provider = course.get('provider', '')
        platform = course.get('platform', '')
        url = course.get('url', '#')
        markdown += f"### {i + 1}. {title}\n"
        if provider:
            markdown += f"**Instructor/Provider:** {provider}\n"
        if platform:
            markdown += f"**Platform:** {platform}\n"
        markdown += f"**Link:** [View Course]({url})\n\n"
    return markdown
