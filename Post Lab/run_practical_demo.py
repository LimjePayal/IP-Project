"""
run_practical_demo.py
Interactive Runner for Image Processing Lab Portal & Practicals
Student: Payal Limje (CS24219) | S.B.J.I.T.M.R., Nagpur
"""

import sys
import os
import webbrowser

def open_portal_website():
    """Opens the interactive laboratory website in the user's default browser."""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    index_file = os.path.join(current_dir, "index.html")
    file_url = f"file:///{index_file.replace(os.sep, '/')}"
    
    print("\n" + "=" * 65)
    print("  IMAGE PROCESSING LAB PORTAL (N-PECCS502P)")
    print("  S. B. JAIN INSTITUTE OF TECHNOLOGY, MANAGEMENT & RESEARCH")
    print("  Student: Payal Limje (Roll No: CS24219)")
    print("=" * 65)
    print(f"\n[+] 🚀 Launching Lab Website in your Browser...")
    print(f"[+] File: {index_file}")
    
    try:
        webbrowser.open(file_url)
        print("[✓] Browser window opened successfully!\n")
    except Exception as e:
        print(f"[!] Could not auto-launch browser: {e}")
        print(f"[*] Please double-click 'index.html' in your folder to open it manually.\n")

def run_opencv_practicals_if_installed():
    """Runs Python OpenCV algorithms if cv2 and numpy are installed."""
    print("[-] Checking Python OpenCV & NumPy packages...")
    
    try:
        import numpy as np
        import cv2
        print(f"[✓] OpenCV installed: Version {cv2.__version__}")
        print(f"[✓] NumPy installed: Version {np.__version__}")
    except ImportError as err:
        print(f"[!] Python Image Processing packages are not installed in this environment.")
        print(f"    Missing: {err}")
        print("\n[i] NOTE: The website has a BUILT-IN Canvas Image Processing engine")
        print("    so you CAN run all 12 practicals, Canny/Sobel filters, and motion detection")
        print("    directly inside the browser without installing anything!")
        print("\n[*] To ALSO run OpenCV inside Python terminal, run this command in terminal:")
        print("    pip install opencv-python numpy matplotlib\n")
        return

    # If OpenCV and NumPy are present, execute practicals demo
    print("\n--- Executing Practical 02: Color Space Conversions ---")
    img = np.zeros((300, 400, 3), dtype=np.uint8)
    for y in range(300):
        img[y, :, 0] = int(y / 300 * 180)
        img[y, :, 1] = int((1 - y / 300) * 120)
        img[y, :, 2] = 80
    cv2.circle(img, (200, 150), 70, (255, 255, 255), -1)
    cv2.putText(img, "SBJAIN CS24219", (70, 260), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 242, 254), 2)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    cv2.imwrite("output_demo_gray.jpg", gray)
    cv2.imwrite("output_demo_hsv.jpg", hsv)
    print("[✓] Generated: output_demo_gray.jpg, output_demo_hsv.jpg")

    print("\n--- Executing Practical 03: Canny & Sobel Edge Detection ---")
    canny = cv2.Canny(gray, 50, 150)
    sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
    sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
    sobel_mag = np.uint8(cv2.magnitude(sobelx, sobely))
    cv2.imwrite("output_demo_canny.jpg", canny)
    cv2.imwrite("output_demo_sobel.jpg", sobel_mag)
    print("[✓] Generated: output_demo_canny.jpg, output_demo_sobel.jpg")
    print("\n[SUCCESS] All Python OpenCV operations executed successfully!")

if __name__ == "__main__":
    # 1. Always open the website so the user sees the portal immediately
    open_portal_website()
    
    # 2. Check and run OpenCV if available
    run_opencv_practicals_if_installed()
