import cv2
image_path = r'C:\Users\Payal\OneDrive\Desktop\payal1\tomato.png'
directory = r'C:\Users\Payal\PycharmProjects\Project2'
# importing os module
import os
image_path = r'tomato.png'
directory = r'C:\Users\Payal\PycharmProjects\Project2'
img = cv2.imread(image_path)
os.chdir(directory)
print("Before saving image:")
print(os.listdir(directory))
filename = 'savedImage.jpg'
cv2.imwrite(filename, img)
print("After saving image:")
print(os.listdir(directory))
print('Successfully saved')