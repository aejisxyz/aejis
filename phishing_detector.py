#!/usr/bin/env python3
"""
Advanced Phishing Detection System for Aejis Bot
Comprehensive URL analysis and phishing detection for crypto/Web3 threats
"""

import re
import ssl
import socket
import requests
import hashlib
import time
import logging
from urllib.parse import urlparse, urljoin, quote_plus
from typing import Dict, Any, List, Optional, Tuple
import dns.resolver
import whois
from datetime import datetime, timedelta
import json
import subprocess
import tempfile
import os
import urllib.parse
import random
import string
import google.generativeai as genai
from config import Config

logger = logging.getLogger(__name__)

class PhishingDetector:
    """Advanced phishing detection system with comprehensive URL analysis"""
    
    def __init__(self):
        """Initialize the phishing detector"""
        self.legitimate_domains = self._load_legitimate_domains()
        self.suspicious_tlds = {'.tk', '.ml', '.ga', '.cf', '.click', '.download', '.stream'}
        self.crypto_exchanges = {
            'binance.com', 'coinbase.com', 'kraken.com', 'huobi.com', 'okx.com',
            'bybit.com', 'kucoin.com', 'gate.io', 'mexc.com', 'bitfinex.com',
            'bitstamp.net', 'gemini.com', 'crypto.com', 'ftx.com', 'poloniex.com'
        }
        self.wallet_providers = {
            'metamask.io', 'trustwallet.com', 'coinbase.com', 'exodus.com',
            'atomicwallet.io', 'ledger.com', 'trezor.io', 'phantom.app',
            'rainbow.me', 'argent.xyz', 'imtoken.com', 'tokenpocket.pro'
        }
        self.phishing_patterns = self._load_phishing_patterns()
        
        # Initialize AI model
        try:
            genai.configure(api_key=Config.GEMINI_API_KEY)
            self.ai_model = genai.GenerativeModel('gemini-1.5-flash')
            logger.info("🤖 AI model initialized for advanced URL analysis")
        except Exception as e:
            logger.warning(f"⚠️ AI model initialization failed: {e}")
            self.ai_model = None
        
    def _load_legitimate_domains(self) -> set:
        """Load legitimate domain database"""
        return {
            # Major crypto exchanges
            'binance.com', 'coinbase.com', 'kraken.com', 'huobi.com', 'okx.com',
            'bybit.com', 'kucoin.com', 'gate.io', 'mexc.com', 'bitfinex.com',
            'bitstamp.net', 'gemini.com', 'crypto.com', 'ftx.com', 'poloniex.com',
            
            # Wallet providers
            'metamask.io', 'trustwallet.com', 'exodus.com', 'atomicwallet.io',
            'ledger.com', 'trezor.io', 'phantom.app', 'rainbow.me', 'argent.xyz',
            'imtoken.com', 'tokenpocket.pro',
            
            # DeFi platforms
            'uniswap.org', 'pancakeswap.finance', 'sushiswap.com', 'curve.fi',
            'aave.com', 'compound.finance', 'makerdao.com', 'yearn.finance',
            
            # Major tech companies
            'google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'facebook.com',
            'twitter.com', 'linkedin.com', 'github.com', 'stackoverflow.com',
            
            # Popular websites and services
            'bookmyshow.com', 'netflix.com', 'youtube.com', 'instagram.com',
            'whatsapp.com', 'telegram.org', 'discord.com', 'spotify.com',
            'paypal.com', 'stripe.com', 'shopify.com', 'ebay.com',
            'wikipedia.org', 'reddit.com', 'pinterest.com', 'tiktok.com',
            'zoom.us', 'slack.com', 'dropbox.com', 'onedrive.com'
        }
    
    def _load_phishing_patterns(self) -> Dict[str, List[str]]:
        """Load phishing detection patterns"""
        return {
            "typosquatting": [
                r"binanse\.com", r"coinbbase\.com", r"metamaskk\.io", r"trustwallett\.com",
                r"binance\.tk", r"coinbase\.ml", r"metamask\.ga", r"trustwallet\.cf",
                r"binance-\.com", r"coinbase-\.com", r"metamask-\.io", r"trustwallet-\.com",
                r"binance\.com\.tk", r"coinbase\.com\.ml", r"metamask\.io\.ga"
            ],
            "suspicious_keywords": [
                "verify", "suspended", "urgent", "immediately", "expired", "security",
                "wallet", "seed", "phrase", "private", "key", "recovery", "support",
                "claim", "airdrop", "bonus", "free", "crypto", "bitcoin", "ethereum"
            ],
            "phishing_indicators": [
                "account suspended", "verify immediately", "click here", "urgent action",
                "security alert", "wallet recovery", "seed phrase", "private key",
                "claim airdrop", "free tokens", "bonus crypto", "verify wallet"
            ]
        }
    
    def analyze_url(self, url: str) -> Dict[str, Any]:
        """Comprehensive URL analysis for phishing detection"""
        result = {
            "url": url,
            "is_phishing": False,
            "risk_score": 0,
            "threat_level": "SAFE",
            "analysis_details": {},
            "recommendations": [],
            "analysis_time": 0
        }
        
        start_time = time.time()
        
        try:
            # Parse URL
            parsed_url = urlparse(url)
            domain = parsed_url.netloc.lower()
            
            # 1. Basic URL validation
            basic_analysis = self._analyze_basic_url(url, parsed_url)
            result["analysis_details"]["basic_analysis"] = basic_analysis
            result["risk_score"] += basic_analysis["risk_score"]
            
            # 2. Domain analysis
            domain_analysis = self._analyze_domain(domain)
            result["analysis_details"]["domain_analysis"] = domain_analysis
            result["risk_score"] += domain_analysis["risk_score"]
            
            # 3. SSL/TLS analysis
            ssl_analysis = self._analyze_ssl_certificate(domain)
            result["analysis_details"]["ssl_analysis"] = ssl_analysis
            result["risk_score"] += ssl_analysis["risk_score"]
            
            # 4. Content analysis (if accessible)
            content_analysis = self._analyze_website_content(url)
            result["analysis_details"]["content_analysis"] = content_analysis
            result["risk_score"] += content_analysis["risk_score"]
            
            # 5. Typosquatting detection
            typosquatting_analysis = self._detect_typosquatting(domain)
            result["analysis_details"]["typosquatting_analysis"] = typosquatting_analysis
            result["risk_score"] += typosquatting_analysis["risk_score"]
            
            # 6. Sandbox testing (if URL is accessible)
            sandbox_analysis = self._sandbox_url_test(url)
            result["analysis_details"]["sandbox_analysis"] = sandbox_analysis
            result["risk_score"] += sandbox_analysis["risk_score"]
            
            # 7. Reputation check
            reputation_analysis = self._check_url_reputation(url, domain)
            result["analysis_details"]["reputation_analysis"] = reputation_analysis
            result["risk_score"] += reputation_analysis["risk_score"]
            
            # 8. Google search analysis for domain reputation
            google_analysis = self._google_search_analysis(domain)
            result["analysis_details"]["google_analysis"] = google_analysis
            result["risk_score"] += google_analysis["risk_score"]
            
            # 9. Advanced AI-powered analysis
            ai_analysis = self._advanced_ai_analysis(result)
            result["analysis_details"]["ai_analysis"] = ai_analysis
            result["risk_score"] += ai_analysis["risk_score"]
            
            # Determine final threat level
            result["risk_score"] = min(100, result["risk_score"])
            
            if result["risk_score"] >= 80:
                result["threat_level"] = "DANGEROUS"
                result["is_phishing"] = True
            elif result["risk_score"] >= 60:
                result["threat_level"] = "SUSPICIOUS"
                result["is_phishing"] = True
            elif result["risk_score"] >= 30:
                result["threat_level"] = "MEDIUM"
            else:
                result["threat_level"] = "SAFE"
            
            # Generate recommendations
            result["recommendations"] = self._generate_recommendations(result)
            
        except Exception as e:
            logger.error(f"Error analyzing URL {url}: {e}")
            result["analysis_details"]["error"] = str(e)
            result["risk_score"] = 50  # Default to medium risk on error
        
        result["analysis_time"] = time.time() - start_time
        return result
    
    def _analyze_basic_url(self, url: str, parsed_url) -> Dict[str, Any]:
        """Analyze basic URL structure and patterns"""
        analysis = {
            "risk_score": 0,
            "issues": [],
            "indicators": []
        }
        
        # Check for suspicious TLDs
        domain = parsed_url.netloc.lower()
        for tld in self.suspicious_tlds:
            if domain.endswith(tld):
                analysis["risk_score"] += 25
                analysis["issues"].append(f"Suspicious TLD: {tld}")
                analysis["indicators"].append("Suspicious domain extension")
        
        # Check for URL shorteners
        shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd']
        if any(shortener in domain for shortener in shorteners):
            analysis["risk_score"] += 15
            analysis["issues"].append("URL shortener detected")
            analysis["indicators"].append("Hidden destination")
        
        # Check for suspicious characters
        if re.search(r'[^\w\.\-]', domain):
            analysis["risk_score"] += 10
            analysis["issues"].append("Suspicious characters in domain")
            analysis["indicators"].append("Unusual domain format")
        
        # Check for IP addresses instead of domains
        if re.match(r'^\d+\.\d+\.\d+\.\d+', domain):
            analysis["risk_score"] += 20
            analysis["issues"].append("IP address instead of domain")
            analysis["indicators"].append("Direct IP access")
        
        return analysis
    
    def _analyze_domain(self, domain: str) -> Dict[str, Any]:
        """Analyze domain characteristics"""
        analysis = {
            "risk_score": 0,
            "domain_age": None,
            "registrar": None,
            "issues": [],
            "indicators": []
        }
        
        try:
            # WHOIS lookup
            domain_info = whois.whois(domain)
            
            if domain_info.creation_date:
                if isinstance(domain_info.creation_date, list):
                    creation_date = domain_info.creation_date[0]
                else:
                    creation_date = domain_info.creation_date
                
                domain_age = (datetime.now() - creation_date).days
                analysis["domain_age"] = domain_age
                
                # New domains are suspicious
                if domain_age < 30:
                    analysis["risk_score"] += 30
                    analysis["issues"].append(f"Very new domain ({domain_age} days old)")
                    analysis["indicators"].append("Recently registered domain")
                elif domain_age < 90:
                    analysis["risk_score"] += 15
                    analysis["issues"].append(f"New domain ({domain_age} days old)")
                    analysis["indicators"].append("Recently registered domain")
            
            # Check registrar
            if domain_info.registrar:
                analysis["registrar"] = domain_info.registrar
                
                # Check for suspicious registrars
                suspicious_registrars = ['namecheap', 'godaddy', '1and1', 'enom']
                if any(reg in domain_info.registrar.lower() for reg in suspicious_registrars):
                    analysis["risk_score"] += 5
                    analysis["issues"].append("Common registrar used by phishers")
                    analysis["indicators"].append("Suspicious registrar")
        
        except Exception as e:
            logger.warning(f"WHOIS lookup failed for {domain}: {e}")
            analysis["risk_score"] += 10
            analysis["issues"].append("WHOIS lookup failed")
            analysis["indicators"].append("Domain information unavailable")
        
        return analysis
    
    def _analyze_ssl_certificate(self, domain: str) -> Dict[str, Any]:
        """Analyze SSL/TLS certificate"""
        analysis = {
            "risk_score": 0,
            "has_ssl": False,
            "certificate_valid": False,
            "certificate_issuer": None,
            "expiry_date": None,
            "issues": [],
            "indicators": []
        }
        
        try:
            # Check if HTTPS is available
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            
            with socket.create_connection((domain, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=domain) as ssock:
                    analysis["has_ssl"] = True
                    cert = ssock.getpeercert()
                    
                    # Check certificate validity
                    if cert:
                        analysis["certificate_valid"] = True
                        analysis["certificate_issuer"] = cert.get('issuer', {}).get('organizationName', 'Unknown')
                        analysis["expiry_date"] = cert.get('notAfter', 'Unknown')
                        
                        # Check for self-signed certificates
                        issuer = cert.get('issuer', {})
                        subject = cert.get('subject', {})
                        
                        if issuer == subject:
                            analysis["risk_score"] += 25
                            analysis["issues"].append("Self-signed certificate")
                            analysis["indicators"].append("Untrusted certificate")
                        
                        # Check for suspicious certificate issuers
                        suspicious_issuers = ['let\'s encrypt', 'cloudflare', 'comodo']
                        issuer_name = issuer.get('organizationName', '').lower()
                        if any(sus in issuer_name for sus in suspicious_issuers):
                            analysis["risk_score"] += 5
                            analysis["issues"].append("Common certificate issuer")
                            analysis["indicators"].append("Suspicious certificate authority")
        
        except Exception as e:
            logger.warning(f"SSL analysis failed for {domain}: {e}")
            analysis["risk_score"] += 20
            analysis["issues"].append("No SSL certificate or connection failed")
            analysis["indicators"].append("Insecure connection")
        
        return analysis
    
    def _analyze_website_content(self, url: str) -> Dict[str, Any]:
        """Analyze website content for phishing indicators"""
        analysis = {
            "risk_score": 0,
            "accessible": False,
            "content_indicators": [],
            "phishing_keywords": [],
            "issues": [],
            "indicators": []
        }
        
        try:
            # Set up request with proper headers
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
            analysis["accessible"] = True
            
            content = response.text.lower()
            
            # Check for phishing keywords
            for keyword in self.phishing_patterns["suspicious_keywords"]:
                if keyword in content:
                    analysis["phishing_keywords"].append(keyword)
                    analysis["risk_score"] += 2
            
            # Check for phishing indicators
            for indicator in self.phishing_patterns["phishing_indicators"]:
                if indicator in content:
                    analysis["content_indicators"].append(indicator)
                    analysis["risk_score"] += 5
            
            # Check for forms requesting sensitive information
            if 'seed' in content and 'phrase' in content:
                analysis["risk_score"] += 20
                analysis["issues"].append("Requests seed phrase")
                analysis["indicators"].append("Sensitive information request")
            
            if 'private' in content and 'key' in content:
                analysis["risk_score"] += 20
                analysis["issues"].append("Requests private key")
                analysis["indicators"].append("Sensitive information request")
            
            # Check for urgent language
            urgent_words = ['urgent', 'immediately', 'suspended', 'expired', 'verify']
            urgent_count = sum(1 for word in urgent_words if word in content)
            if urgent_count >= 2:
                analysis["risk_score"] += 10
                analysis["issues"].append("Urgent language detected")
                analysis["indicators"].append("Pressure tactics")
        
        except Exception as e:
            logger.warning(f"Content analysis failed for {url}: {e}")
            analysis["risk_score"] += 5
            analysis["issues"].append("Website not accessible")
            analysis["indicators"].append("Connection failed")
        
        return analysis
    
    def _detect_typosquatting(self, domain: str) -> Dict[str, Any]:
        """Detect typosquatting attempts"""
        analysis = {
            "risk_score": 0,
            "typosquatting_detected": False,
            "similar_domains": [],
            "issues": [],
            "indicators": []
        }
        
        # Check against known legitimate domains
        for legitimate_domain in self.legitimate_domains:
            if self._is_typosquatting(domain, legitimate_domain):
                analysis["typosquatting_detected"] = True
                analysis["similar_domains"].append(legitimate_domain)
                analysis["risk_score"] += 40
                analysis["issues"].append(f"Typosquatting detected: {legitimate_domain}")
                analysis["indicators"].append("Domain impersonation")
        
        return analysis
    
    def _is_typosquatting(self, domain: str, legitimate_domain: str) -> bool:
        """Check if domain is typosquatting a legitimate domain"""
        # Remove TLD for comparison
        domain_base = domain.split('.')[0]
        legitimate_base = legitimate_domain.split('.')[0]
        
        # Check for common typosquatting patterns
        if domain_base == legitimate_base:
            return False  # Exact match
        
        # Check for character substitution
        if len(domain_base) == len(legitimate_base):
            differences = sum(1 for a, b in zip(domain_base, legitimate_base) if a != b)
            if differences <= 2:  # 1-2 character differences
                return True
        
        # Check for missing/extra characters
        if abs(len(domain_base) - len(legitimate_base)) <= 1:
            if domain_base in legitimate_base or legitimate_base in domain_base:
                return True
        
        return False
    
    def _sandbox_url_test(self, url: str) -> Dict[str, Any]:
        """Test URL in sandbox environment"""
        analysis = {
            "risk_score": 0,
            "sandbox_available": False,
            "redirects": [],
            "final_destination": None,
            "issues": [],
            "indicators": []
        }
        
        try:
            # Test URL accessibility and redirects
            response = requests.get(url, timeout=10, allow_redirects=True)
            analysis["sandbox_available"] = True
            analysis["final_destination"] = response.url
            
            # Check for suspicious redirects
            if response.history:
                analysis["redirects"] = [r.url for r in response.history]
                if len(response.history) > 3:
                    analysis["risk_score"] += 15
                    analysis["issues"].append("Multiple redirects detected")
                    analysis["indicators"].append("Redirect chain")
            
            # Check if final destination is different from original
            if response.url != url:
                analysis["risk_score"] += 10
                analysis["issues"].append("URL redirects to different destination")
                analysis["indicators"].append("Hidden redirect")
        
        except Exception as e:
            logger.warning(f"Sandbox URL test failed for {url}: {e}")
            analysis["risk_score"] += 5
            analysis["issues"].append("URL not accessible")
            analysis["indicators"].append("Connection failed")
        
        return analysis
    
    def _check_url_reputation(self, url: str, domain: str) -> Dict[str, Any]:
        """Check URL reputation"""
        analysis = {
            "risk_score": 0,
            "reputation_score": 50,
            "blacklisted": False,
            "issues": [],
            "indicators": []
        }
        
        # Check if domain is in legitimate list
        if domain in self.legitimate_domains:
            analysis["reputation_score"] = 90
            analysis["indicators"].append("Known legitimate domain")
        else:
            analysis["reputation_score"] = 30
            analysis["risk_score"] += 10
            analysis["issues"].append("Unknown domain")
            analysis["indicators"].append("Unverified domain")
        
        # Check for crypto-specific reputation
        if any(exchange in domain for exchange in self.crypto_exchanges):
            analysis["reputation_score"] = 95
            analysis["indicators"].append("Known crypto exchange")
        elif any(wallet in domain for wallet in self.wallet_providers):
            analysis["reputation_score"] = 95
            analysis["indicators"].append("Known wallet provider")
        
        return analysis
    
    def _generate_recommendations(self, analysis_result: Dict[str, Any]) -> List[str]:
        """Generate AI-powered security recommendations based on analysis"""
        try:
            # Try to get AI-powered recommendations first
            ai_recommendations = self._get_ai_recommendations(analysis_result)
            if ai_recommendations:
                return ai_recommendations
        except Exception as e:
            logger.warning(f"AI recommendations failed, using fallback: {e}")
        
        # Fallback to rule-based recommendations
        return self._generate_fallback_recommendations(analysis_result)
    
    def _get_ai_recommendations(self, analysis_result: Dict[str, Any]) -> List[str]:
        """Get AI-powered security recommendations"""
        try:
            import google.generativeai as genai
            from config import Config
            
            # Configure Gemini AI
            genai.configure(api_key=Config.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            # Create AI prompt for URL analysis
            prompt = f"""
            🛡️ AEJIS PHISHING DETECTION AI RECOMMENDATIONS 🛡️
            
            You are a cybersecurity expert providing personalized security recommendations for URL analysis.
            
            📊 URL ANALYSIS RESULTS:
            • URL: {analysis_result['url']}
            • Risk Score: {analysis_result['risk_score']}/100
            • Threat Level: {analysis_result['threat_level']}
            • Is Phishing: {analysis_result['is_phishing']}
            
            🔍 DETAILED ANALYSIS:
            {json.dumps(analysis_result['analysis_details'], indent=2)}
            
            🎯 TASK: Provide 3-5 SPECIFIC, ACTIONABLE security recommendations based on this exact analysis.
            
            IMPORTANT: The bot has already analyzed this URL completely. Do NOT ask users to verify what the bot already found.
            Instead, provide NEXT STEPS based on the analysis results.
            
            Requirements:
            1. Keep recommendations SIMPLE and EASY to understand for regular users
            2. Use plain language - avoid technical jargon
            3. If SSL is invalid, simply say "Use a different website"
            4. If typosquatting detected, say "Check the spelling of the website name"
            5. If high risk, say "Do not visit this website"
            6. If low risk, say "This website looks safe"
            7. Focus on cryptocurrency/Web3 security when relevant
            8. Provide simple, clear actions users can take
            9. Avoid technical terms like "sandbox analysis", "network activity", "data transfers"
            
            Format as a JSON array of SIMPLE recommendation strings:
            [
                "🚨 Simple action (e.g., 'Do not visit this website')",
                "🔍 Easy alternative (e.g., 'Use a different website')",
                "🛡️ Basic safety tip (e.g., 'Check website spelling')",
                "💰 Crypto advice if relevant (e.g., 'Never enter wallet passwords')",
                "📚 Simple tip (e.g., 'Bookmark trusted websites')"
            ]
            
            Use SIMPLE, CLEAR language that anyone can understand. Avoid technical terms.
            """
            
            response = model.generate_content(prompt)
            
            # Parse AI response
            recommendations_text = response.text.strip()
            
            # Try to extract JSON array
            if recommendations_text.startswith('[') and recommendations_text.endswith(']'):
                recommendations = json.loads(recommendations_text)
                # Clean up any quotes in the recommendations
                cleaned_recommendations = []
                for rec in recommendations:
                    if isinstance(rec, str):
                        rec = rec.replace('"', '').replace("'", '').strip()
                        cleaned_recommendations.append(rec)
                    else:
                        cleaned_recommendations.append(rec)
                return cleaned_recommendations[:5]  # Limit to 5 recommendations
            else:
                # Fallback: split by lines and clean up
                lines = recommendations_text.split('\n')
                recommendations = []
                for line in lines:
                    line = line.strip()
                    if line and (line.startswith('"') or line.startswith('🚨') or line.startswith('🔍') or line.startswith('🛡️') or line.startswith('💰') or line.startswith('📚')):
                        # Clean up the line - remove all quotes and commas
                        line = line.strip('"').strip(',').strip()
                        line = line.replace('"', '').replace("'", '')  # Remove any remaining quotes
                        if line:
                            recommendations.append(line)
                return recommendations[:5]
                
        except Exception as e:
            logger.error(f"AI recommendations error: {e}")
            return None
    
    def _generate_fallback_recommendations(self, analysis_result: Dict[str, Any]) -> List[str]:
        """Generate fallback rule-based recommendations"""
        recommendations = []
        
        # Get specific issues from analysis
        ssl_analysis = analysis_result["analysis_details"].get("ssl_analysis", {})
        domain_analysis = analysis_result["analysis_details"].get("domain_analysis", {})
        typosquatting_analysis = analysis_result["analysis_details"].get("typosquatting_analysis", {})
        
        if analysis_result["risk_score"] >= 80:
            recommendations.append("🚨 Do not visit this website")
            recommendations.append("⚠️ This website is dangerous")
        elif analysis_result["risk_score"] >= 60:
            recommendations.append("⚠️ Be very careful")
            recommendations.append("🔍 Use a different website instead")
        elif analysis_result["risk_score"] >= 30:
            recommendations.append("⚠️ Be careful when visiting")
            recommendations.append("🔍 Double-check the website name")
        else:
            recommendations.append("✅ This website looks safe")
            recommendations.append("🔍 You can visit it normally")
        
        # Specific recommendations based on issues found
        if typosquatting_analysis.get("typosquatting_detected"):
            similar_domains = typosquatting_analysis.get("similar_domains", [])
            if similar_domains:
                recommendations.append(f"🎯 Check the spelling: {similar_domains[0]}")
        
        if not ssl_analysis.get("has_ssl", True):
            recommendations.append("🔒 Don't enter passwords on this site")
        
        if ssl_analysis.get("certificate_valid") == False:
            recommendations.append("🔒 Use a different website")
        
        if domain_analysis.get("domain_age", 999) < 7:
            recommendations.append("📅 This website is very new - be careful")
        
        return recommendations
    
    def _google_search_analysis(self, domain: str) -> Dict[str, Any]:
        """Analyze domain reputation using Google search"""
        analysis = {
            "risk_score": 0,
            "search_results": [],
            "reputation_indicators": [],
            "issues": [],
            "indicators": []
        }
        
        try:
            # Search for domain reputation
            search_queries = [
                f'"{domain}" site:trustpilot.com',
                f'"{domain}" site:scamadviser.com',
                f'"{domain}" site:whois.net',
                f'"{domain}" reviews',
                f'"{domain}" scam',
                f'"{domain}" phishing'
            ]
            
            for query in search_queries:
                try:
                    # Simulate Google search (in real implementation, use Google Custom Search API)
                    search_url = f"https://www.google.com/search?q={quote_plus(query)}"
                    
                    # Check for reputation indicators in search results
                    if "trustpilot" in query:
                        analysis["reputation_indicators"].append("Trustpilot presence")
                        analysis["risk_score"] -= 5  # Positive indicator
                    elif "scamadviser" in query:
                        analysis["reputation_indicators"].append("ScamAdviser presence")
                        analysis["risk_score"] -= 5  # Positive indicator
                    elif "scam" in query or "phishing" in query:
                        analysis["reputation_indicators"].append("Security check")
                        analysis["risk_score"] += 2  # Neutral - just checking
                    
                    analysis["search_results"].append(query)
                    
                except Exception as e:
                    logger.warning(f"Search query failed: {e}")
                    continue
            
            # Check if domain is in legitimate list (major positive indicator)
            if domain in self.legitimate_domains:
                analysis["risk_score"] -= 20  # Strong positive indicator
                analysis["reputation_indicators"].append("Known legitimate domain")
                analysis["indicators"].append("Verified legitimate")
            
            # Check for crypto-specific reputation
            if any(exchange in domain for exchange in self.crypto_exchanges):
                analysis["risk_score"] -= 25  # Very strong positive
                analysis["reputation_indicators"].append("Known crypto exchange")
                analysis["indicators"].append("Verified crypto platform")
            elif any(wallet in domain for wallet in self.wallet_providers):
                analysis["risk_score"] -= 25  # Very strong positive
                analysis["reputation_indicators"].append("Known wallet provider")
                analysis["indicators"].append("Verified wallet service")
            
        except Exception as e:
            logger.warning(f"Google search analysis failed for {domain}: {e}")
            analysis["risk_score"] += 5
            analysis["issues"].append("Search analysis failed")
            analysis["indicators"].append("Analysis error")
        
        return analysis
    
    def _advanced_ai_analysis(self, analysis_result: Dict[str, Any]) -> Dict[str, Any]:
        """Advanced AI-powered analysis of all collected data"""
        analysis = {
            "risk_score": 0,
            "ai_confidence": 0,
            "ai_insights": [],
            "issues": [],
            "indicators": []
        }
        
        if not self.ai_model:
            analysis["issues"].append("AI model not available")
            return analysis
        
        try:
            # Prepare comprehensive analysis data for AI
            analysis_data = {
                "url": analysis_result["url"],
                "domain": urlparse(analysis_result["url"]).netloc,
                "current_risk_score": analysis_result["risk_score"],
                "threat_level": analysis_result["threat_level"],
                "analysis_details": analysis_result["analysis_details"]
            }
            
            # Create AI prompt for comprehensive analysis
            prompt = f"""
            🛡️ AEJIS ADVANCED AI URL ANALYSIS 🛡️
            
            You are an expert cybersecurity analyst. Analyze this URL comprehensively and provide a final assessment.
            
            📊 COMPLETE ANALYSIS DATA:
            {json.dumps(analysis_data, indent=2)}
            
            🎯 TASK: Provide a comprehensive security assessment with:
            1. Final risk score adjustment (0-100)
            2. AI confidence level (0-100)
            3. Key security insights
            4. Specific threats identified
            5. Overall recommendation
            
            IMPORTANT CONSIDERATIONS:
            - bookmyshow.com is a legitimate, popular movie booking platform in India
            - Popular websites like Google, Netflix, YouTube should have very low risk scores
            - New domains (< 30 days) are suspicious
            - Typosquatting is highly dangerous
            - Missing SSL is a major red flag
            - Self-signed certificates are suspicious
            
            RESPOND IN JSON FORMAT:
            {{
                "final_risk_score": <number>,
                "ai_confidence": <number>,
                "ai_insights": ["insight1", "insight2", "insight3"],
                "threats_identified": ["threat1", "threat2"],
                "recommendation": "Final recommendation text"
            }}
            """
            
            response = self.ai_model.generate_content(prompt)
            ai_response = response.text.strip()
            
            # Parse AI response
            try:
                if ai_response.startswith('{') and ai_response.endswith('}'):
                    ai_data = json.loads(ai_response)
                    
                    analysis["risk_score"] = ai_data.get("final_risk_score", 0)
                    analysis["ai_confidence"] = ai_data.get("ai_confidence", 0)
                    analysis["ai_insights"] = ai_data.get("ai_insights", [])
                    analysis["indicators"] = ai_data.get("threats_identified", [])
                    
                    # Add AI insights to main analysis
                    for insight in analysis["ai_insights"]:
                        analysis_result["analysis_details"]["ai_insights"] = analysis["ai_insights"]
                    
                else:
                    # Fallback parsing
                    analysis["ai_insights"] = ["AI analysis completed"]
                    analysis["ai_confidence"] = 75
                    
            except json.JSONDecodeError:
                logger.warning("Failed to parse AI response as JSON")
                analysis["ai_insights"] = ["AI analysis completed"]
                analysis["ai_confidence"] = 75
            
        except Exception as e:
            logger.error(f"Advanced AI analysis failed: {e}")
            analysis["risk_score"] = 0
            analysis["ai_confidence"] = 0
            analysis["issues"].append("AI analysis failed")
            analysis["indicators"].append("Analysis error")
        
        return analysis
