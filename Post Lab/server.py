"""
server.py
Simple Local Web Server for Image Processing Lab Portal
Runs at http://localhost:8080 and automatically opens your browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def main():
    os.chdir(DIRECTORY)
    url = f"http://localhost:{PORT}"
    print("=" * 65)
    print("  IMAGE PROCESSING LAB PORTAL (N-PECCS502P)")
    print("  S. B. JAIN INSTITUTE OF TECHNOLOGY, MANAGEMENT & RESEARCH")
    print("  Student: Payal Limje (CS24219)")
    print("=" * 65)
    print(f"\n[+] Local Server starting at: {url}")
    print("[+] Opening website in your default browser...")
    print("[+] Press Ctrl + C in terminal to stop server.\n")

    # Try to open browser automatically
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"[*] Note: Please open your browser manually and visit {url}")

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[-] Server stopped cleanly.")
            sys.exit(0)

if __name__ == "__main__":
    main()
