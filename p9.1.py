import cv2
import numpy as np
def detect_object(template_path, input_image_path):
# Read the template and input image
template = cv2.imread(template_path, 0)
# Read the template image in grayscale
img = cv2.imread(input_image_path)
# Read the input image
# Convert the input image to grayscale for template matching
gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
# Get the width and height of the template image
w, h = template.shape[::1]
# Perform template matching
res = cv2.matchTemplate(gray_img, template, cv2.TM_CCOEFF_NORMED)
threshold = 0.8 # Set a threshold for the matching
# Find the locations where the match is above the threshold
loc = np.where(res >= threshold)
# Draw rectangles around the matched areas on the input image
for pt in zip(*loc[::-1]):
    cv2.rectangle(img, pt, (pt[0] + w, pt[1] + h), (0, 255, 255), 2)
# Display the input image with detected objects
cv2.imshow('Detected Objects', img)
cv2.waitKey(0)
cv2.destroyAllWindows()
# Provide the paths to the template and input images
template_path = "C:\\Users\\LAB-005\\Downloads\\i1.jpg"
input_image_path = "C:\\Users\\LAB-005\\Downloads\\Animals.jpg"
# Detect the object in the input image using the template
detect_object(template_path,input_image_path)