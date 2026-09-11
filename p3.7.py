import numpy as np
import cv2 as cv
img = cv.imread('cat.jpg', 0)
rows, cols = img.shape
M = np.float32([[1,0, 0], [0.5, 1, 0], [0,   0, 1]])
sheared_img = cv.warpPerspective(img, M, (int(cols*1.5), int(rows*1.5)))
cv.imshow('CS24219', sheared_img)
cv.waitKey(0)
cv.destroyAllWindows()
