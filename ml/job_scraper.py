import requests
from bs4 import BeautifulSoup
import json
import sys
import random

def scrape_linkedin_jobs(query, location="gujarat", limit=10):
    jobs = []
    try:
        search_url = f"https://www.linkedin.com/jobs/search/?keywords={query}&location={location}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1"
        }
        resp = requests.get(search_url, headers=headers, timeout=15)
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # Try multiple selectors for job cards
        job_cards = soup.select('div.base-card') or soup.select('li.job-search-card') or soup.select('div.job-search-card')
        
        count = 0
        for job in job_cards:
            if count >= limit:
                break
                
            # Try multiple selectors for title
            title_elem = (job.select_one('h3.base-search-card__title') or 
                         job.select_one('h3.job-search-card__title') or
                         job.select_one('a.job-search-card__title'))
            
            # Try multiple selectors for company
            company_elem = (job.select_one('h4.base-search-card__subtitle') or
                           job.select_one('h4.job-search-card__subtitle') or
                           job.select_one('a.job-search-card__subtitle'))
            
            # Try multiple selectors for location
            location_elem = (job.select_one('span.job-search-card__location') or
                            job.select_one('div.job-search-card__location') or
                            job.select_one('span.base-search-card__metadata'))
            
            # Try multiple selectors for link
            link_elem = (job.select_one('a.base-card__full-link') or
                        job.select_one('a.job-search-card__title') or
                        job.select_one('a'))
            
            # Try multiple selectors for description
            description_elem = (job.select_one('p.job-search-card__snippet') or
                               job.select_one('div.job-search-card__snippet') or
                               job.select_one('p.base-search-card__snippet'))
            
            if title_elem and company_elem:
                title = title_elem.get_text(strip=True)
                company = company_elem.get_text(strip=True)
                
                # Skip if title or company is empty
                if not title or not company:
                    continue
                    
                jobs.append({
                    "title": title,
                    "company": company,
                    "location": location_elem.get_text(strip=True) if location_elem else location,
                    "description": description_elem.get_text(strip=True) if description_elem else f"Exciting opportunity for {title} at {company}",
                    "link": f"{link_elem.get('href')}" if link_elem and link_elem.get('href') else "#"
                })
                count += 1
        
        print(f"LinkedIn: Found {len(jobs)} jobs for '{query}' in '{location}'")
        return jobs
    except Exception as e:
        print(f"Error scraping LinkedIn jobs: {str(e)}")
        return []

def scrape_naukri_jobs(query, location="gujarat", limit=10):
    jobs = []
    try:
        search_url = f"https://www.naukri.com/{query}-jobs-in-{location}" if location else f"https://www.naukri.com/{query}-jobs"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1"
        }
        resp = requests.get(search_url, headers=headers, timeout=15)
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # Try multiple selectors for job cards
        job_cards = soup.select('article.jobTuple') or soup.select('div.jobTuple') or soup.select('div.job-card')
        
        count = 0
        for job in job_cards:
            if count >= limit:
                break
                
            # Try multiple selectors for title
            title_elem = (job.select_one('a.title') or 
                         job.select_one('h2.job-title') or
                         job.select_one('a.job-title'))
            
            # Try multiple selectors for company
            company_elem = (job.select_one('a.subTitle') or
                           job.select_one('div.company-name') or
                           job.select_one('a.company-name'))
            
            # Try multiple selectors for location
            location_elem = (job.select_one('li.location span') or
                            job.select_one('div.location') or
                            job.select_one('span.location'))
            
            # Try multiple selectors for description
            description_elem = (job.select_one('.job-description') or
                               job.select_one('div.description') or
                               job.select_one('p.description'))
            
            if title_elem and company_elem:
                title = title_elem.get_text(strip=True)
                company = company_elem.get_text(strip=True)
                
                # Skip if title or company is empty
                if not title or not company:
                    continue
                    
                jobs.append({
                    "title": title,
                    "company": company,
                    "location": location_elem.get_text(strip=True) if location_elem else location,
                    "description": description_elem.get_text(strip=True) if description_elem else f"Exciting opportunity for {title} at {company}",
                    "link": title_elem.get('href') if title_elem.get('href') else "#"
                })
                count += 1
        
        print(f"Naukri: Found {len(jobs)} jobs for '{query}' in '{location}'")
        return jobs
    except Exception as e:
        print(f"Error scraping Naukri jobs: {str(e)}")
        return []


def formatJobsToMarkdown(data):
    """Format job data to markdown for display in the chat"""
    if not data.get("jobs") or len(data["jobs"]) == 0:
        return "No jobs found."
    
    markdown = "## Job Search Results\n\n"
    
    for i, job in enumerate(data["jobs"]):
        markdown += f"### {i + 1}. {job['title']}\n"
        markdown += f"**Company:** {job['company']}\n"
        if job.get('location'):
            markdown += f"**Location:** {job['location']}\n"
        if job.get('description'):
            # Truncate description if it's too long
            description = job['description'][:150] + "..." if len(job['description']) > 150 else job['description']
            markdown += f"**Description:** {description}\n"
        markdown += f"**Link:** [Apply Here]({job['link']})\n\n"
    
    return markdown



def get_jobs(query, location="gujarat", limit=10):
    """Return real-time LinkedIn jobs only.

    This function intentionally restricts results to LinkedIn to avoid
    variability across sites and reduce scraping brittleness.
    """
    linkedin_jobs = scrape_linkedin_jobs(query, "india" , limit)

    if isinstance(limit, int) and limit > 0:
        linkedin_jobs = (linkedin_jobs or [])[:limit]

    return linkedin_jobs or []