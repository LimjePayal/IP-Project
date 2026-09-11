import cv2
path = r'tomato.png'
img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
cv2.imshow('Payal', img)
cv2.waitKey(0)
cv2.destroyAllWindows()
