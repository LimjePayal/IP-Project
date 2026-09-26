import numpy as np
import cv2 as cv
img = cv.imread('cat.jpg',0)
cropped_img = img[30:120, 30:200]
cv.imshow('CS24219',cropped_img)
cv.waitKey(0)
cv.destroyAllWindows()
