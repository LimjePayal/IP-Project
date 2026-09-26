/**
 * practicals-data.js
 * Complete syllabus of 12 Practicals for Image Processing Lab (N-PECCS502P)
 * Department of Computer Science & Engineering, S.B.J.I.T.M.R., Nagpur
 * Student: Payal Limje (CS24219)
 */

const PRACTICALS_DATA = [
  {
    id: 1,
    number: "Practical No. 01",
    category: "Fundamentals",
    title: "Digital Image Fundamentals & Basic Operations",
    aim: "Perform basic image handling operations including image reading, display, properties extraction, pixel slicing, arithmetic operations, and blending using OpenCV.",
    session: "2026-2027",
    performedDate: "15-08-2026",
    submissionDate: "22-08-2026",
    objectives: [
      "To understand digital image representation as multi-dimensional matrices in NumPy.",
      "To read, display, write, and extract core metadata (height, width, channels, data type) using OpenCV.",
      "To perform pixel-level intensity manipulation, region of interest (ROI) slicing, and image resizing.",
      "To execute arithmetic operations (addition, subtraction, weighted blending) on images."
    ],
    theory: `
### Digital Image Representation
A digital image is a two-dimensional grid of finite pixels, mathematically represented as a matrix f(x,y) where x and y are spatial coordinates, and the value of f at any coordinate is the intensity or color value.

- **Grayscale Images:** 2D matrix of shape (H, W) with intensity values I in [0, 255] (8-bit unsigned integer).
- **Color Images (BGR in OpenCV):** 3D array of shape (H, W, 3) where channels correspond to Blue, Green, and Red light intensities.

### Core Mathematical Operations:
1. **Weighted Alpha Blending:**
   Output(x,y) = alpha * I_1(x,y) + beta * I_2(x,y) + gamma
   where alpha + beta = 1.0 and gamma is a scalar offset.
2. **Region of Interest (ROI) Slicing:**
   ROI = Image[y1:y2, x1:x2]
3. **Resizing:**
   Interpolation techniques such as Bilinear (cv2.INTER_LINEAR) or Area relation (cv2.INTER_AREA) to scale spatial dimensions.
`,
    code: `import cv2
import numpy as np

# 1. Read input images
img1 = cv2.imread('input1.jpg')
img2 = cv2.imread('input2.jpg')

if img1 is None or img2 is None:
    print("Error: Could not load images.")
    exit()

# 2. Extract image properties
h, w, c = img1.shape
print(f"Dimensions: Width={w}, Height={h}, Channels={c}")
print(f"Data Type: {img1.dtype}, Total Pixels: {img1.size}")

# 3. Resize image2 to match image1
img2_resized = cv2.resize(img2, (w, h), interpolation=cv2.INTER_LINEAR)

# 4. Image Blending (Alpha Blending)
alpha, beta, gamma = 0.65, 0.35, 0.0
blended = cv2.addWeighted(img1, alpha, img2_resized, beta, gamma)

# 5. Region of Interest (ROI) manipulation
roi = img1[50:200, 50:200]
img1[0:150, 0:150] = roi

cv2.imshow('Alpha Blended Image', blended)
cv2.waitKey(0)
cv2.destroyAllWindows()`,
    sampleType: "cat",
    filterAction: "grayscale",
    outputDescription: "Metadata displayed in console. Blended output composites two images smoothly with specified alpha weights.",
    conclusion: "Successfully explored digital image representation, extracted structural metadata, and implemented arithmetic blending and matrix ROI slicing in OpenCV.",
    vivaQuestions: [
      {
        q: "Why does OpenCV read images in BGR format instead of RGB?",
        a: "OpenCV was originally developed when BGR was the standard color format among camera manufacturers and graphics software developers. For historical compatibility, OpenCV maintains BGR by default."
      },
      {
        q: "What is the difference between cv2.add() and NumPy '+' addition?",
        a: "cv2.add() performs saturated addition (values above 255 stay 255), preventing wraparound artifacts. In contrast, NumPy addition performs modulo arithmetic (250 + 10 = 260 % 256 = 4), creating distorted color inversions."
      },
      {
        q: "What is a Region of Interest (ROI)?",
        a: "An ROI is a sub-matrix of an image selected for localized processing, feature extraction, or filtering without modifying the entire image frame."
      }
    ],
    references: [
      "https://docs.opencv.org/4.x/d3/df2/tutorial_py_basic_ops.html",
      "https://docs.opencv.org/4.x/d0/d86/tutorial_py_image_arithmetics.html",
      "Digital Image Processing, Rafael C. Gonzalez & Richard E. Woods, 4th Edition."
    ]
  },
  {
    id: 2,
    number: "Post Lab 02",
    category: "Color Spaces",
    title: "Color Space Conversions & Channel Analysis",
    aim: "Convert images between the RGB, HSV, YCrCb, and Lab colour spaces, analyzing how colour information is encoded in each.",
    session: "2026-2027",
    performedDate: "05-09-2026",
    submissionDate: "12-09-2026",
    objectives: [
      "To understand and apply color space conversion techniques in OpenCV by transforming images between RGB, HSV, YCrCb, and Lab formats.",
      "To analyze the differences in color representation across RGB, HSV, YCrCb, and Lab color spaces, emphasizing how hue, brightness, and chrominance are encoded.",
      "To visualize and interpret individual channels (e.g., Hue, Saturation, Lightness, Cr, Cb) to assess how different color spaces isolate color and intensity components.",
      "To evaluate the suitability of each color space for various image processing tasks such as enhancement, segmentation, and compression."
    ],
    theory: `
### What is a Color Model?
A color model is a mathematical way to describe and represent colors using numbers - typically in tuple like RGB (Red, Green, Blue) or quadruple like CMYK (Cyan, Magenta, Yellow, Black).

#### 1. RGB (Red, Green, Blue) Color Space:
- **Description:** Represents color through additive combination of red, green, and blue light.
- **Encoding:** Each pixel contains three values (R, G, B) in [0, 255].
- **Limitation:** Not perceptually uniform; mixes chromaticity and luminance components.

#### 2. HSV (Hue, Saturation, Value) Color Space:
- **Hue (H):** Represents dominant wavelength (0 - 179 in OpenCV).
- **Saturation (S):** Measures purity / vibrancy of the color (0 - 255).
- **Value (V):** Indicates luminance / brightness (0 - 255).
- **Advantage:** Decouples chromatic content from illumination, ideal for color-based object tracking.

#### 3. YCrCb (Luminance-Chrominance) Color Space:
- **Y:** Luminance / Luma component (brightness).
- **Cr:** Red-difference chroma (R - Y).
- **Cb:** Blue-difference chroma (B - Y).
- **Advantage:** Enables chroma subsampling (4:2:0) in video compression (JPEG/MPEG).

#### 4. CIELAB (Lab) Color Space:
- **L*:** Lightness (0 - 100).
- **a*:** Green-Red color axis.
- **b*:** Blue-Yellow color axis.
- **Advantage:** Perceptually uniform color space where Euclidean distances match human perception.
`,
    code: `import cv2

# 1. Grayscale Conversion
img = cv2.imread('color.png', cv2.IMREAD_GRAYSCALE)
if img is not None:
    cv2.imshow('Grayscale Image', img)
    cv2.waitKey(0)

# 2. Split B, G, R Channels
image = cv2.imread('cspace.png')
if image is not None:
    B, G, R = cv2.split(image)
    cv2.imshow("Original", image)
    cv2.imshow("Blue", B)
    cv2.imshow("Green", G)
    cv2.imshow("Red", R)
    cv2.waitKey(0)

# 3. YCrCb Color Space
img_ycrcb = cv2.imread('color2.png')
ycrcb = cv2.cvtColor(img_ycrcb, cv2.COLOR_BGR2YCrCb)
cv2.imshow('YCrCb Image', ycrcb)
cv2.waitKey(0)

# 4. HSV Color Space
hsv = cv2.cvtColor(img_ycrcb, cv2.COLOR_BGR2HSV)
cv2.imshow('HSV Image', hsv)
cv2.waitKey(0)

# 5. LAB Color Space
lab = cv2.cvtColor(img_ycrcb, cv2.COLOR_BGR2LAB)
cv2.imshow('LAB Image', lab)
cv2.waitKey(0)
cv2.destroyAllWindows()`,
    sampleType: "cat",
    filterAction: "hsv",
    outputDescription: "Visual breakdown showing Grayscale, individual Blue/Green/Red split channels, and color space transformations in YCrCb, HSV, and CIELAB.",
    conclusion: "The practical successfully converted images into RGB, HSV, YCrCb, and Lab color spaces using OpenCV and showed how each space represents color and brightness differently.",
    vivaQuestions: [
      {
        q: "How does the separation of chromatic and luminance components in HSV, YCrCb, and Lab help in image processing tasks like segmentation compared to RGB?",
        a: "In RGB, lighting changes alter all three channels simultaneously. In HSV and YCrCb, color thresholding can be performed independently of shadows and illumination variations."
      },
      {
        q: "In what scenarios would HSV be more suitable than RGB for image thresholding or object tracking?",
        a: "HSV is ideal when tracking objects with a consistent color under uneven lighting, such as detecting colored balls, traffic cones, or road signs in outdoor environments."
      },
      {
        q: "Why is the Lab color space considered more perceptually uniform compared to RGB and HSV?",
        a: "In CIELAB, equal numerical distance roughly corresponds to equal perceived color difference across the human visual system, making it ideal for color correction and printing."
      },
      {
        q: "What challenges might arise when converting between color spaces, and how can data loss or distortion be minimized?",
        a: "Quantization errors from converting floating-point values into 8-bit integers ([0-255] or [0-179] for Hue) can cause rounding loss. Using float32 representation minimizes truncation."
      },
      {
        q: "How do individual channels (e.g., Hue in HSV, Cr in YCrCb, or L in Lab) contribute to image understanding?",
        a: "Hue isolates pure wavelength independent of shadows; Cr isolates red-opponent chroma for skin detection; and L isolates luminance for lighting correction without hue distortion."
      }
    ],
    references: [
      "https://docs.opencv.org/3.4/de/d25/imgproc_color_conversions.html",
      "https://www.tutorialspoint.com/color-spaces-in-opencv-and-python",
      "https://learnopencv.com/color-spaces-in-opencv-cpp-python/",
      "https://www.geeksforgeeks.org/python/python-visualizing-image-in-different-color-spaces/",
      "https://www.dynamsoft.com/blog/insights/image-processing/image-processing-101-color-models/"
    ]
  },
  {
    id: 3,
    number: "Post Lab 03",
    category: "Edge Detection",
    title: "Edge Detection using Canny, Sobel, and Prewitt",
    aim: "Detect edges in images with the Canny method and contrast the results with Sobel and Prewitt detectors.",
    session: "2026-2027",
    performedDate: "05-09-2026",
    submissionDate: "12-09-2026",
    objectives: [
      "To implement edge detection on grayscale images using the Canny edge detection method.",
      "To apply Sobel and Prewitt operators for edge detection and understand their working principles.",
      "To compare and contrast the results obtained from Canny, Sobel, and Prewitt methods in terms of edge clarity, noise sensitivity, and computational complexity.",
      "To visualize and analyze the differences in edge maps generated by gradient-based (Sobel, Prewitt) and multi-stage (Canny) techniques.",
      "To develop an understanding of selecting appropriate edge detection methods for different image processing applications."
    ],
    theory: `
### Understanding Edges in Images
An edge represents a boundary where there is a significant change in intensity or color.

#### 1. Sobel Operator:
Computes the gradient vector using two 3x3 convolution kernels:
Sobel_x = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]
Sobel_y = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]
Gradient Magnitude G = sqrt(G_x^2 + G_y^2)

#### 2. Prewitt Operator:
Prewitt_x = [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]]
Prewitt_y = [[-1, -1, -1], [0, 0, 0], [1, 1, 1]]

#### 3. Roberts Cross Operator:
Fast 2x2 diagonal kernels: R1 = [[1, 0], [0, -1]], R2 = [[0, 1], [-1, 0]]

#### 4. Canny Edge Detector (Multi-Stage):
1. **Gaussian Blur:** Smooth image to eliminate noise (5x5, sigma=1.4).
2. **Gradient Calculation:** Calculate magnitude and angle using Sobel.
3. **Non-Maximum Suppression (NMS):** Thin edges to 1-pixel wide local maxima.
4. **Double Thresholding:** Distinguish strong, weak, and non-edge pixels.
5. **Edge Tracking by Hysteresis:** Retain weak edges connected to strong edges.
`,
    code: `import cv2
import numpy as np

img = cv2.imread('image.jpg', cv2.IMREAD_GRAYSCALE)
if img is None:
    raise ValueError("Image not found.")

# 1. Canny Edge Detection with parameter tuning
blurred = cv2.GaussianBlur(img, (5, 5), 1.4)
canny_basic = cv2.Canny(blurred, 50, 150)
canny_aperture = cv2.Canny(blurred, 100, 200, apertureSize=5)
canny_l2 = cv2.Canny(blurred, 100, 200, apertureSize=5, L2gradient=True)

# 2. Sobel Edge Detection
sobelx = cv2.Sobel(img, cv2.CV_64F, 1, 0, ksize=3)
sobely = cv2.Sobel(img, cv2.CV_64F, 0, 1, ksize=3)
sobel_edges = np.uint8(cv2.magnitude(sobelx, sobely))

# 3. Prewitt Edge Detection
kernelx = np.array([[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]], dtype=np.float32)
kernely = np.array([[-1, -1, -1], [0, 0, 0], [1, 1, 1]], dtype=np.float32)
prewittx = cv2.filter2D(img, cv2.CV_64F, kernelx)
prewitty = cv2.filter2D(img, cv2.CV_64F, kernely)
prewitt_edges = np.uint8(cv2.magnitude(prewittx, prewitty))

cv2.imshow('Sobel', sobel_edges)
cv2.imshow('Prewitt', prewitt_edges)
cv2.imshow('Canny L2', canny_l2)
cv2.waitKey(0)
cv2.destroyAllWindows()`,
    sampleType: "lamp",
    filterAction: "canny",
    outputDescription: "High-contrast edge map of the modern lamp setup. Canny produces thin, 1-pixel continuous contours, while Sobel and Prewitt display gradient intensity thickness with more background texture.",
    conclusion: "The practical successfully demonstrated edge detection using Canny, Sobel, and Prewitt methods. Canny produced clearer and more continuous edges, while Sobel and Prewitt provided simpler gradient-based edge detection.",
    vivaQuestions: [
      {
        q: "How do the working principles of Canny, Sobel, and Prewitt edge detectors differ?",
        a: "Sobel and Prewitt are single-pass first-order derivative spatial filters calculating intensity gradients. Canny is a multi-stage pipeline incorporating Gaussian noise filtering, non-maximum suppression for 1-pixel edge thinning, and hysteresis thresholding to link broken edges."
      },
      {
        q: "Why does the Canny edge detector generally produce thinner and more continuous edges compared to Sobel and Prewitt?",
        a: "Non-maximum suppression in Canny suppresses all non-peak gradient pixels along the orthogonal direction of the edge, reducing thick ramps to razor-sharp 1-pixel wide lines, followed by hysteresis that connects weak edges."
      },
      {
        q: "How does image noise affect the performance of each edge detection method?",
        a: "Gradient operators (Sobel, Prewitt) amplify high-frequency noise, creating spurious edge dots. Canny includes a built-in Gaussian smoothing stage to suppress noise before computing derivatives."
      },
      {
        q: "In what situations would Sobel or Prewitt be preferable to Canny for edge detection?",
        a: "When computational speed and low latency are critical (such as on low-power embedded microcontrollers or real-time high-FPS edge devices), Sobel or Prewitt is preferred because it requires far fewer clock cycles than multi-pass Canny."
      },
      {
        q: "How does the choice of thresholds in the Canny method influence the detected edges?",
        a: "A high upper threshold detects only prominent sharp boundaries, discarding finer details. A lower threshold captures delicate textures but risks including noise. The 1:2 or 1:3 ratio is recommended."
      }
    ],
    references: [
      "https://opencv.org/blog/edge-detection-using-opencv/",
      "https://www.geeksforgeeks.org/python/python-opencv-canny-function/",
      "https://learnopencv.com/edge-detection-using-opencv/",
      "https://www.geeksforgeeks.org/computer-vision/what-is-edge-detection-in-image-processing/"
    ]
  },
  {
    id: 4,
    number: "Practical No. 04",
    category: "Filtering",
    title: "Spatial Domain Filtering & Image Restoration",
    aim: "Implement spatial smoothing and sharpening filters to study noise reduction (Gaussian and Salt-and-Pepper) and feature enhancement.",
    session: "2026-2027",
    performedDate: "12-09-2026",
    submissionDate: "19-09-2026",
    objectives: [
      "To explore linear spatial filtering (Averaging / Box filter and Gaussian filter).",
      "To implement non-linear spatial filtering using Median filter for impulse noise removal.",
      "To apply Laplacian kernel and unsharp masking for image edge sharpening.",
      "To compare PSNR (Peak Signal-to-Noise Ratio) across different filtering techniques."
    ],
    theory: `
### Spatial Domain Filtering
Spatial filtering involves moving a mask or kernel w(s,t) of size m x n across an image f(x,y).

#### 1. Linear Smoothing Filters:
- **Box / Mean Filter:** Assigns average pixel value within kernel window. Softens edges.
- **Gaussian Filter:** Weight decreases with radial distance according to a 2D Gaussian distribution.

#### 2. Non-Linear Filtering:
- **Median Filter:** Sorts neighborhood intensities and selects the median. Highly effective at removing salt-and-pepper noise while preserving sharp edges.

#### 3. Sharpening:
- **Laplacian Kernel:** Highlights regions of rapid intensity change to enhance edge details.
`,
    code: `import cv2
import numpy as np

img = cv2.imread('noisy_image.jpg')
mean_blur = cv2.blur(img, (5, 5))
gaussian_blur = cv2.GaussianBlur(img, (5, 5), sigmaX=1.5)
median_filtered = cv2.medianBlur(img, 5)

kernel_sharpen = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
sharpened = cv2.filter2D(img, -1, kernel_sharpen)

cv2.imshow('Median Filtered', median_filtered)
cv2.imshow('Sharpened', sharpened)
cv2.waitKey(0)
cv2.destroyAllWindows()`,
    sampleType: "cat",
    filterAction: "blur",
    outputDescription: "Comparison showing Gaussian filter smoothing high-frequency textures, Median filter removing salt-and-pepper artifacts, and 3x3 Laplacian kernel enhancing fine edge contours.",
    conclusion: "Demonstrated that linear Gaussian filters excel at smoothing Gaussian noise, while non-linear Median filters are superior for preserving edges under salt-and-pepper noise.",
    vivaQuestions: [
      {
        q: "Why does the median filter outperform the mean filter for impulse (salt-and-pepper) noise?",
        a: "A mean filter averages extreme outlier values (0 or 255) into the neighborhood, blurring the noise into dark/bright patches. A median filter completely discards outliers because the median value is chosen from the ordered sequence."
      },
      {
        q: "What is the physical meaning of the parameter sigma in Gaussian filtering?",
        a: "Sigma represents the standard deviation of the Gaussian distribution, controlling the spatial spread or width of the bell curve; larger sigma values produce stronger smoothing over a wider radius."
      }
    ],
    references: [
      "https://docs.opencv.org/4.x/d4/d13/tutorial_py_filtering.html",
      "https://learnopencv.com/image-filtering-using-convolution-in-opencv/"
    ]
  },
  {
    id: 5,
    number: "Practical No. 05",
    category: "Enhancement",
    title: "Point Processing & Intensity Transformations",
    aim: "Implement spatial point transformations including Image Negative, Logarithmic Transformation, Power-Law (Gamma) Correction, and Contrast Stretching.",
    session: "2026-2027",
    performedDate: "19-09-2026",
    submissionDate: "26-09-2026",
    objectives: [
      "To understand pixel-by-pixel intensity mapping independent of spatial neighborhood.",
      "To apply Image Negative for enhancing white or light features on dark backgrounds.",
      "To implement Log Transformation for expanding low-intensity values in Fourier spectra.",
      "To implement Power-Law (Gamma) correction for display calibration and contrast tuning."
    ],
    theory: `
### Point Processing Functions
Point operations map an input intensity r to an output intensity s via a transformation function s = T(r).

1. **Image Negative:** s = (L - 1) - r = 255 - r
2. **Log Transformation:** s = c * log(1 + r)
3. **Power-Law (Gamma):** s = c * r^gamma
4. **Contrast Stretching:** s = ((r - r_min) / (r_max - r_min)) * 255
`,
    code: `import cv2
import numpy as np

img = cv2.imread('low_contrast.jpg', cv2.IMREAD_GRAYSCALE)
img_neg = 255 - img
gamma = 0.5
gamma_corrected = np.array(255 * (img / 255) ** gamma, dtype='uint8')

cv2.imshow('Negative', img_neg)
cv2.imshow('Gamma Corrected', gamma_corrected)
cv2.waitKey(0)
cv2.destroyAllWindows()`,
    sampleType: "cat",
    filterAction: "invert",
    outputDescription: "Visual comparison displaying the original underexposed input alongside inverted negative, expanded dynamic range log transform, gamma-boosted image, and full 0-255 contrast stretched output.",
    conclusion: "Successfully implemented intensity point transformations, validating gamma correction for non-linear display compensation and contrast stretching for dynamic range restoration.",
    vivaQuestions: [
      {
        q: "Why is log transformation useful in Fourier Transform visualization?",
        a: "The dynamic range of Fourier magnitude spectra spans several orders of magnitude (often from 0 to 10^6). Without log compression, only the DC peak is visible and all high-frequency details appear black."
      },
      {
        q: "What is the role of Gamma in modern computer monitors?",
        a: "CRTs and modern display panels have a non-linear voltage-to-luminance response with an inherent gamma around 2.2. Gamma correction pre-distorts stored pixel values with gamma = 1/2.2 so displayed output is linear."
      }
    ],
    references: [
      "https://learnopencv.com/understanding-contrast-and-brightness-adjustments-in-opencv/",
      "https://docs.opencv.org/4.x/d3/dc1/tutorial_basic_linear_transform.html"
    ]
  },
  {
    id: 6,
    number: "Practical No. 06",
    category: "Enhancement",
    title: "Histogram Analysis, Equalization & CLAHE",
    aim: "Compute and visualize image histograms, implement global histogram equalization and contrast limited adaptive histogram equalization (CLAHE).",
    session: "2026-2027",
    performedDate: "26-09-2026",
    submissionDate: "03-10-2026",
    objectives: [
      "To plot 1D grayscale and 3-channel BGR intensity frequency distributions.",
      "To derive and apply the Cumulative Distribution Function (CDF) transformation for global equalization.",
      "To implement CLAHE to prevent over-amplification of noise in homogeneous regions.",
      "To analyze contrast enhancement on medical and low-light imagery."
    ],
    theory: `
### Image Histogram & Equalization
A histogram is a discrete function h(r_k) = n_k, counting pixel occurrences.
- **Global Histogram Equalization (GHE):** Stretches histogram across [0, 255] via CDF.
- **CLAHE:** Partitions image into tiles, limits bin heights using clipLimit to avoid amplifying noise, and bilinearly interpolates.
`,
    code: `import cv2

img = cv2.imread('low_contrast.jpg', cv2.IMREAD_GRAYSCALE)
equalized = cv2.equalizeHist(img)
clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
clahe_img = clahe.apply(img)

cv2.imshow('Global Equalization', equalized)
cv2.imshow('CLAHE', clahe_img)
cv2.waitKey(0)
cv2.destroyAllWindows()`,
    sampleType: "lamp",
    filterAction: "threshold",
    outputDescription: "Side-by-side histogram plots showing the transformation of a narrow, skewed intensity peak into an evenly distributed profile, revealing subtle background details without washing out bright zones.",
    conclusion: "CLAHE significantly outperforms global histogram equalization in localized contrast enhancement by suppressing noise over-amplification in uniform areas.",
    vivaQuestions: [
      {
        q: "What is the primary drawback of global histogram equalization?",
        a: "Global equalization uses global statistics. If an image has large bright or dark regions, it over-amplifies background noise and washes out subtle localized features."
      },
      {
        q: "How does the clipLimit parameter work in CLAHE?",
        a: "clipLimit caps the maximum height of any histogram bin in each tile. The pixels exceeding the limit are redistributed uniformly across all bins before CDF computation, preventing local gradient runaway."
      }
    ],
    references: [
      "https://docs.opencv.org/4.x/d4/d1b/tutorial_py_histogram_equalization.html",
      "https://learnopencv.com/histogram-equalization-and-clahe-using-opencv/"
    ]
  },
  {
    id: 7,
    number: "Practical No. 07",
    category: "Compression",
    title: "Lossless & Lossy Compression (RLE, LZW & JPEG/PNG)",
    aim: "Implement a coding technique to achieve lossless compression and compare the original and compressed file sizes.",
    session: "2026-2027",
    performedDate: "22-08-2026",
    submissionDate: "29-08-2026",
    objectives: [
      "To understand and apply lossless compression techniques using suitable coding algorithms such as Huffman coding, Run Length Encoding (RLE), or LZW.",
      "To implement a coding algorithm in a programming environment (e.g., Python/OpenCV) for compressing digital files without loss of information.",
      "To compare the file sizes of original and compressed data to evaluate the effectiveness of the chosen lossless compression method.",
      "To analyze the compression ratio and efficiency achieved by different coding techniques under varying input conditions.",
      "To enhance problem-solving and programming skills by designing, testing, and validating a lossless compression system."
    ],
    theory: `
### Image Compression Fundamentals
Image compression reduces an image's file size while maintaining acceptable visual quality by exploiting redundancies:
1. **Spatial Redundancy:** Correlation between neighboring pixels.
2. **Color Redundancy:** Grouping similar adjacent hues into indexed palettes.
3. **Coding Redundancy:** Variable-length codes (e.g., Huffman, Shannon-Fano).

#### Algorithms:
- **Run-Length Encoding (RLE):** Replaces runs of identical values with [Value, Count].
- **LZW (Lempel-Ziv-Welch):** Dictionary-based substitution coder.
- **Compression Ratio:** CR = Original Size / Compressed Size.
`,
    code: `import cv2
import os

# Calculate compression ratio
def compression_ratio(original_file, compressed_file):
    original_size = os.path.getsize(original_file)
    compressed_size = os.path.getsize(compressed_file)
    ratio = original_size / compressed_size if compressed_size != 0 else 0
    return ratio, original_size / 1024, compressed_size / 1024

image = cv2.imread('input_image.jpg')
if image is not None:
    cv2.imwrite('compressed_lossy.jpg', image, [cv2.IMWRITE_JPEG_QUALITY, 30])
    cv2.imwrite('compressed_lossless.png', image, [cv2.IMWRITE_PNG_COMPRESSION, 9])
    
    lossy_ratio, orig_kb, lossy_kb = compression_ratio('input_image.jpg', 'compressed_lossy.jpg')
    lossless_ratio, _, lossless_kb = compression_ratio('input_image.jpg', 'compressed_lossless.png')
    print(f"Original: {orig_kb:.2f} KB | Lossy JPEG: {lossy_kb:.2f} KB (Ratio: {lossy_ratio:.2f}:1)")
    print(f"Lossless PNG: {lossless_kb:.2f} KB (Ratio: {lossless_ratio:.2f}:1)")

# RLE encode implementation
def rle_encode(data):
    encoding = []
    prev = data[0]; count = 1
    for pixel in data[1:]:
        if pixel == prev: count += 1
        else: encoding.append((prev, count)); prev = pixel; count = 1
    encoding.append((prev, count))
    return encoding`,
    sampleType: "cat",
    filterAction: "grayscale",
    outputDescription: "Console outputs verifying RLE and LZW lossless decompression assertions alongside comparative file sizes: Original (22.54 KB), Lossy JPEG (7.47 KB, CR 3.02:1), Lossless PNG (110.57 KB).",
    conclusion: "The practical demonstrated image compression using lossless techniques and compared the original and compressed file sizes. It helped us understand compression ratio and compression efficiency.",
    vivaQuestions: [
      {
        q: "What do we mean by lossless compression?",
        a: "Lossless compression is a data encoding technique where the reconstructed image after decompression is bit-for-bit mathematically identical to the original image without any degradation."
      },
      {
        q: "Name any two coding techniques used for lossless compression.",
        a: "Run Length Encoding (RLE) and Lempel-Ziv-Welch (LZW) [or Huffman Coding / Deflate algorithm]."
      },
      {
        q: "How do we find the file size of an image in a Python program?",
        a: "Using the Python standard library function os.path.getsize(filepath), which returns the file size in bytes."
      },
      {
        q: "What is the compression ratio, and how is it calculated?",
        a: "Compression Ratio (CR) is defined as the ratio of uncompressed original size to compressed size: CR = Original Size / Compressed Size."
      },
      {
        q: "Why do we compare original and compressed file sizes after compression?",
        a: "To quantify coding efficiency and verify that compression did not cause data expansion (which can occur in RLE when noisy images lack repeating runs)."
      }
    ],
    references: [
      "https://www.adobe.com/uk/creativecloud/photography/discover/lossy-vs-lossless.html",
      "https://www.opencvhelp.org/tutorials/advanced/image-compression/",
      "https://www.cloudflare.com/en-gb/learning/performance/glossary/what-is-image-compression/",
      "https://www.geeksforgeeks.org/machine-learning/what-is-image-compression/",
      "https://cloudinary.com/glossary/image-compression-algorithms"
    ]
  },
  {
    id: 8,
    number: "Practical No. 08",
    category: "Morphology",
    title: "Morphological Operations on Binary Images",
    aim: "Perform morphological operations erosion, dilation, opening, and closing on binary images to study their effects on object shapes and noise removal.",
    session: "2026-2027",
    performedDate: "29-08-2026",
    submissionDate: "05-09-2026",
    objectives: [
      "To understand the fundamental concepts of morphological operations such as erosion, dilation, opening, and closing in binary image processing.",
      "To implement morphological operations using OpenCV and analyze their effects on the shape, size, and structure of objects in binary images.",
      "To study the role of structuring elements (kernels) in determining how morphological transformations affect image features.",
      "To evaluate the effectiveness of opening and closing operations in removing noise, filling small holes, and improving image quality for further analysis.",
      "To compare the results of individual and combined morphological operations to determine suitable techniques for shape preservation and noise reduction in binary images."
    ],
    theory: `
### Morphological Image Processing
Morphological operations analyze and modify shape and boundaries using a Structuring Element (SE).

- **Fit:** When all pixels in the structuring element overlap foreground pixels.
- **Hit:** When at least one pixel in the structuring element overlaps a foreground pixel.
- **Miss:** When no pixel in the structuring element overlaps a foreground pixel.

#### Fundamental Operations:
1. **Erosion:** Strips boundaries; removes small noise, detaches connected objects.
2. **Dilation:** Expands boundaries; fills holes and bridges breaks.
3. **Opening:** Erosion followed by dilation; removes small bright noise.
4. **Closing:** Dilation followed by erosion; fills small dark voids and holes.
`,
    code: `import cv2
import numpy as np

image = cv2.imread('photo.jpg', cv2.IMREAD_GRAYSCALE)
_, binary = cv2.threshold(image, 127, 255, cv2.THRESH_BINARY)
kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))

erosion = cv2.erode(binary, kernel, iterations=1)
dilation = cv2.dilate(binary, kernel, iterations=1)
opening = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)
closing = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)

cv2.imshow('Erosion', erosion)
cv2.imshow('Dilation', dilation)
cv2.imshow('Opening', opening)
cv2.imshow('Closing', closing)
cv2.waitKey(0)
cv2.destroyAllWindows()`,
    sampleType: "fingerprint",
    filterAction: "erosion",
    outputDescription: "Detailed contour overlay showing binary erosion shrinking the subject silhouette (10 fragments), dilation merging gaps into a single solid mass (Area: 198,744 px), opening eliminating small noise spurs, and closing sealing interior voids.",
    conclusion: "Morphological operations were studied and implemented on binary images using OpenCV. Erosion reduces object size, dilation increases object size, opening removes small noise, and closing fills small holes and gaps. The structuring element plays an important role in controlling the effect of these operations.",
    vivaQuestions: [
      {
        q: "How do erosion and dilation differ in their effect on object boundaries in a binary image?",
        a: "Erosion shrinks foreground object boundaries by setting a pixel to foreground only if the structuring element fits completely. Dilation expands boundaries by setting a pixel to foreground if any kernel element hits a foreground pixel."
      },
      {
        q: "Why is the choice of structuring element (shape and size) important in morphological operations?",
        a: "The structuring element acts as a geometric probe. A square kernel preserves rectilinear edges, an elliptical kernel preserves rounded curvatures, and kernel size determines the scale of features preserved or destroyed."
      },
      {
        q: "How do opening and closing operations help in noise removal and shape restoration?",
        a: "Opening eliminates bright foreground noise specks smaller than the structuring element without permanently shrinking large objects. Closing fills dark pinhole gaps inside objects without expanding external boundaries."
      },
      {
        q: "What changes occur in the image when morphological operations are applied multiple times?",
        a: "Multiple iterations amplify boundary erosion or dilation. Repeated opening or closing is idempotent after the first pass for the same structuring element."
      },
      {
        q: "In what types of image processing applications are morphological operations most useful?",
        a: "Fingerprint ridge thinning, license plate character isolation, biomedical cell separation, and document text cleanup."
      }
    ],
    references: [
      "https://towardsdatascience.com/understanding-morphological-image-processing-and-its-operations7bcf1ed11756/",
      "https://www.geeksforgeeks.org/computer-vision/different-morphological-operations-in-image-processing/",
      "https://docs.opencv.org/4.x/d9/d61/tutorial_py_morphological_ops.html",
      "https://www.mathworks.com/help/images/morphological-dilation-and-erosion.html",
      "https://blog.roboflow.com/morphological-operations/"
    ]
  },
  {
    id: 9,
    number: "Practical No. 09",
    category: "Detection",
    title: "Object Detection using Correlation Principle",
    aim: "Develop a program to detect object using the correlation principle.",
    session: "2026-2027",
    performedDate: "05-09-2026",
    submissionDate: "12-09-2026",
    objectives: [
      "Students will be able to identify and locate objects in images using correlation-based object detection.",
      "Students will be able to apply correlation-based object detection to different types of objects and images.",
      "Students will be able to optimize a correlation-based object detection algorithm for performance."
    ],
    theory: `
### Correlation Principle in Object Detection
The correlation principle slides a reference template image T(x,y) across a target image I(x,y) and computes normalized cross-correlation:
R(x,y) = sum(T'(x',y') * I'(x+x', y+y')) / sqrt(sum(T'^2) * sum(I'^2))

1. Slide template across image systematically.
2. Calculate correlation score (cv2.TM_CCOEFF_NORMED).
3. Find peak correlation location exceeding threshold (>= 0.8).
4. Draw bounding box around detected coordinates.
`,
    code: `import cv2
import numpy as np

def detect_object(template_path, input_image_path):
    template = cv2.imread(template_path, 0)
    img = cv2.imread(input_image_path)
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    w, h = template.shape[::-1]
    
    res = cv2.matchTemplate(gray_img, template, cv2.TM_CCOEFF_NORMED)
    threshold = 0.8
    loc = np.where(res >= threshold)
    
    for pt in zip(*loc[::-1]):
        cv2.rectangle(img, pt, (pt[0] + w, pt[1] + h), (0, 255, 255), 2)
        
    cv2.imshow('Detected Objects', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

detect_object("i1.jpg", "Animals.jpg")`,
    sampleType: "flowers",
    filterAction: "correlation",
    outputDescription: "Yellow bounding box accurately localizing the matched flower cluster inside the multi-colored floral arrangement at maximum normalized correlation peak score (0.89).",
    conclusion: "The object was successfully detected using the Correlation Principle. Template matching was used to compare the template image with different regions of the input image. The region with the highest correlation score was identified as the object and highlighted using a bounding box.",
    vivaQuestions: [
      {
        q: "What is the Correlation Principle in the context of object detection in Image processing?",
        a: "It measures the mathematical degree of linear similarity between a template pattern and corresponding candidate sub-regions across an image as a function of spatial displacement."
      },
      {
        q: "What is the primary process involved in object detection using the Correlation Principle?",
        a: "Sliding a template mask pixel-by-pixel across the search frame, calculating the normalized cross-correlation coefficient at each position, and finding coordinates corresponding to peak correlation values."
      },
      {
        q: "What role does the template play in the Correlation Principle for object detection?",
        a: "The template serves as the canonical ground truth feature representation whose pixel intensity distribution is compared against candidate image sub-windows."
      },
      {
        q: "Are there any limitations or challenges associated with object detection using the Correlation Principle?",
        a: "Standard correlation is extremely sensitive to scale changes, rotation, 3D out-of-plane perspective shifts, and severe illumination variations, requiring multi-scale pyramids or feature invariant descriptors (SIFT/ORB) to compensate."
      },
      {
        q: "What library or tool is commonly used in implementing the Correlation Principle for object detection in Python?",
        a: "OpenCV (cv2) using the cv2.matchTemplate() function in conjunction with NumPy for peak thresholding."
      }
    ],
    references: [
      "Computer Vision: Algorithms and Applications, Richard Szeliski, 2010, Springer.",
      "Computer Vision - A Modern Approach, D. Forsyth, J. Ponce, 2nd Edition 2011, Pearson India.",
      "OpenCV Computer Vision with Python, Joseph Howse, 2013, Packt Publishing.",
      "Dictionary of Computer Vision and Image Processing, R. B. Fisher et al., Wiley.",
      "https://docs.opencv.org/4.x/d4/dc6/tutorial_py_template_matching.html",
      "https://www.geeksforgeeks.org/template-matching-using-opencv-in-python/"
    ]
  },
  {
    id: 10,
    number: "Practical No. 10",
    category: "Segmentation",
    title: "Image Segmentation via Otsu's & Adaptive Thresholding",
    aim: "Implement image segmentation algorithms using Global Thresholding, Otsu's optimal clustering, and Adaptive Gaussian thresholding.",
    session: "2026-2027",
    performedDate: "12-09-2026",
    submissionDate: "19-09-2026",
    objectives: [
      "To understand the mathematical objective of image segmentation: partitioning into salient semantic regions.",
      "To implement global fixed-level thresholding and evaluate its limitations under non-uniform illumination.",
      "To derive Otsu's method for maximizing inter-class variance between foreground and background.",
      "To apply local adaptive thresholding (Adaptive Gaussian & Mean) for document scanning and text segmentation."
    ],
    theory: `
### Image Segmentation
- **Otsu's Binarization:** Automatically calculates the optimal threshold t* maximizing inter-class variance between foreground and background.
- **Adaptive Thresholding:** Calculates a localized threshold for every individual pixel based on the mean or Gaussian weighted sum of its local neighborhood, overcoming uneven illumination.
`,
    code: `import cv2

img = cv2.imread('gradient_text.jpg', cv2.IMREAD_GRAYSCALE)
_, th_global = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY)
val_otsu, th_otsu = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
th_adaptive = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

cv2.imshow('Otsu Thresholding', th_otsu)
cv2.imshow('Adaptive Gaussian', th_adaptive)
cv2.waitKey(0)
cv2.destroyAllWindows()`,
    sampleType: "fingerprint",
    filterAction: "threshold",
    outputDescription: "Adaptive Gaussian thresholding cleanly extracts legible text from shaded, gradient-illuminated parchment where global thresholding caused dark blotches.",
    conclusion: "Otsu's method produces mathematically optimal bimodal thresholding, while Adaptive Gaussian thresholding is indispensable when illumination varies across the frame.",
    vivaQuestions: [
      {
        q: "Under what conditions does Otsu's thresholding perform best?",
        a: "When the image histogram is strongly bimodal (having two distinct peaks separated by a deep trough corresponding to foreground and background)."
      },
      {
        q: "What is the function of the constant C in cv2.adaptiveThreshold?",
        a: "Constant C is subtracted from the computed local mean or weighted Gaussian average, acting as a fine-tuning offset to eliminate spurious noise."
      }
    ],
    references: [
      "https://docs.opencv.org/4.x/d7/d4d/tutorial_py_thresholding.html",
      "https://learnopencv.com/otsu-thresholding-with-opencv/"
    ]
  },
  {
    id: 11,
    number: "Practical No. 11",
    category: "Frequency Domain",
    title: "Frequency Domain Filtering using 2D FFT",
    aim: "Compute the 2D Discrete Fourier Transform (DFT), visualize magnitude spectra, and implement Ideal and Gaussian Low-Pass and High-Pass filters.",
    session: "2026-2027",
    performedDate: "19-09-2026",
    submissionDate: "26-09-2026",
    objectives: [
      "To understand spatial frequency in images (smooth transitions vs sharp edge discontinuities).",
      "To compute 2D Fast Fourier Transform (FFT) and center zero-frequency components using numpy.fft.fftshift.",
      "To construct Low-Pass Filters (LPF) for frequency smoothing and High-Pass Filters (HPF) for edge extraction.",
      "To reconstruct filtered images in spatial domain via Inverse Fast Fourier Transform (IFFT)."
    ],
    theory: `
### 2D Discrete Fourier Transform (DFT)
Transforms an image from spatial domain (x,y) into frequency domain (u,v).
- **Magnitude Spectrum:** 20 * log(1 + |F(u,v)|) centered using fftshift.
- **Gaussian Low-Pass Filter (GLPF):** H(u,v) = exp(-D^2 / (2 * D_0^2)) suppresses high frequencies without ringing artifacts.
`,
    code: `import cv2
import numpy as np

img = cv2.imread('input.jpg', cv2.IMREAD_GRAYSCALE)
dft = np.fft.fft2(img)
dft_shift = np.fft.fftshift(dft)
magnitude_spectrum = 20 * np.log(np.abs(dft_shift) + 1)

# Inverse FFT
f_ishift = np.fft.ifftshift(dft_shift)
img_back = np.abs(np.fft.ifft2(f_ishift))

cv2.imshow('Magnitude Spectrum', np.uint8(magnitude_spectrum))
cv2.waitKey(0)
cv2.destroyAllWindows()`,
    sampleType: "lamp",
    filterAction: "blur",
    outputDescription: "Fourier power spectrum highlighting concentrated low frequencies at origin and cross-star high frequencies corresponding to structural edge boundaries.",
    conclusion: "Frequency domain filtering provides global control over spatial frequencies, confirming that Gaussian LPF removes high-frequency details smoothly without ringing artifacts.",
    vivaQuestions: [
      {
        q: "Why is fftshift needed after computing np.fft.fft2?",
        a: "By default, the FFT places the zero-frequency DC component at the top-left corner (0,0). np.fft.fftshift rotates quadrants so the DC component is centered at (rows/2, cols/2) for intuitive symmetric filtering."
      },
      {
        q: "Why does an Ideal Low-Pass Filter produce concentric ripples (ringing artifacts)?",
        a: "An ideal box filter in frequency domain has sharp step cutoffs. Its inverse Fourier transform in spatial domain is a 2D sinc function whose side lobes cause oscillating Gibbs phenomenon ripples."
      }
    ],
    references: [
      "https://docs.opencv.org/4.x/de/cbd/tutorial_py_transforms.html",
      "https://homepages.inf.ed.ac.uk/rbf/HIPR2/fourier.htm"
    ]
  },
  {
    id: 12,
    number: "Practical No. 12 (Project 23)",
    category: "Motion & Video",
    title: "Background Modeling & Frame Differencing",
    aim: "Implement Two-Frame & Three-Frame Differencing, Adaptive Running Average Background Subtraction, Noise Filtering (Gaussian/Median/Morphology), and Evaluate Full Performance Matrix (Accuracy, Precision, Recall, Specificity, F1-Score, IoU) for Moving Object Detection.",
    session: "2026-2027",
    performedDate: "26-09-2026",
    submissionDate: "03-10-2026",
    objectives: [
      "To understand motion detection principles in video surveillance using temporal image sequences.",
      "To implement Two-Frame and Three-Frame Differencing and analyze sensitivity to noise and ghost artifacts.",
      "To formulate and apply spatial filters (Gaussian, Median) and Morphological operations (Opening, Closing) with variable kernel sizes (3x3, 5x5, 7x7) for noise reduction.",
      "To calculate the complete Performance Matrix: True Positive (TP), False Positive (FP), True Negative (TN), False Negative (FN), Accuracy, Precision, Recall, Specificity, F1-Score, and Intersection over Union (IoU / Jaccard Index).",
      "To evaluate the Intensity Histogram of difference images and select optimal thresholds using Otsu's method."
    ],
    theory: `
### 1. Mathematical Formulation of Frame Differencing

#### A. Grayscale Luminance Conversion
Color frames $I(x,y)$ are transformed into grayscale intensity via the standard ITU-R BT.601 perceptual weighting:
$$\\\\text{I}_{\\\\text{gray}}(x, y) = 0.299 \\\\cdot R(x, y) + 0.587 \\\\cdot G(x, y) + 0.114 \\\\cdot B(x, y)$$

#### B. Two-Frame Differencing
Computes the pixel-wise absolute difference between consecutive frames $I_t$ and $I_{t-1}$:
$$\\\\Delta I_t(x, y) = |I_t(x, y) - I_{t-1}(x, y)|$$
$$M_t(x, y) = \\\\begin{cases} 255 & \\\\text{if } \\\\Delta I_t(x, y) \\\\ge T \\\\quad (\\\\text{Foreground Motion}) \\\\\\\\ 0 & \\\\text{if } \\\\Delta I_t(x, y) < T \\\\quad (\\\\text{Static Background}) \\\\end{cases}$$

#### C. Three-Frame Differencing (Ghosting Elimination)
Eliminates abandoned position ghosting by computing intersection of forward and backward differences:
$$\\\\Delta_1 = |I_t - I_{t-1}|, \\\\quad \\\\Delta_2 = |I_{t+1} - I_t|$$
$$M_t(x, y) = \\\\begin{cases} 255 & \\\\text{if } (\\\\Delta_1 \\\\ge T) \\\\land (\\\\Delta_2 \\\\ge T) \\\\\\\\ 0 & \\\\text{otherwise} \\\\end{cases}$$

#### D. Adaptive Running Average Background Subtraction
Updates the background model $B_t$ dynamically with learning rate $\\\\alpha \\\\in [0, 1]$:
$$B_t(x, y) = (1 - \\\\alpha) B_{t-1}(x, y) + \\\\alpha I_t(x, y)$$
$$M_t(x, y) = \\\\begin{cases} 255 & \\\\text{if } |I_t(x, y) - B_t(x, y)| \\\\ge T \\\\\\\\ 0 & \\\\text{otherwise} \\\\end{cases}$$

---

### 2. Noise Modeling & Filter Kernels

1. **Gaussian Noise:** $\\\\eta \\\\sim \\\\mathcal{N}(0, \\\\sigma^2)$ — Suppressed via Gaussian convolution kernel:
   $$G(i, j) = \\\\frac{1}{2\\\\pi\\\\sigma^2} \\\\exp\\\\left(-\\\\frac{i^2 + j^2}{2\\\\sigma^2}\\\\right)$$
2. **Salt-and-Pepper (Impulse) Noise:** Random isolated white/black pixels — Suppressed via **Median Filter**:
   $$I_{\\\\text{med}}(x, y) = \\\\text{median}\\\\left\\\\{ I(x+i, y+j) \\\\mid -k \\\\le i, j \\\\le k \\\\right\\\\}$$
3. **Morphological Filtering:**
   - **Opening ($A \\\\circ B = (A \\\\ominus B) \\\\oplus B$):** Erosion followed by dilation removes small background speckle noise.
   - **Closing ($A \\\\bullet B = (A \\\\oplus B) \\\\ominus B$):** Dilation followed by erosion fills interior holes in moving vehicle silhouettes.
   - **Kernel Sizes:** $3\\\\times3$ preserves fine boundary details; $5\\\\times5$ and $7\\\\times7$ aggressively eliminate noise clusters at the cost of slight boundary erosion.

---

### 3. Complete Performance Matrix Formulation

Evaluates detection mask $P(x,y)$ against Ground Truth $G(x,y)$:

- **True Positive (TP):** Moving pixels correctly detected ($G=1, P=1$).
- **False Positive (FP):** Static background falsely detected as motion ($G=0, P=1$, False Alarm).
- **True Negative (TN):** Static background correctly identified ($G=0, P=0$).
- **False Negative (FN):** Moving pixels missed ($G=1, P=0$).

$$\\\\text{Accuracy} = \\\\frac{\\\\text{TP} + \\\\text{TN}}{\\\\text{TP} + \\\\text{TN} + \\\\text{FP} + \\\\text{FN}}$$
$$\\\\text{Precision} = \\\\frac{\\\\text{TP}}{\\\\text{TP} + \\\\text{FP}}$$
$$\\\\text{Recall (Sensitivity)} = \\\\frac{\\\\text{TP}}{\\\\text{TP} + \\\\text{FN}}$$
$$\\\\text{Specificity (TNR)} = \\\\frac{\\\\text{TN}}{\\\\text{TN} + \\\\text{FP}}$$
$$\\\\text{F1-Score} = 2 \\\\cdot \\\\frac{\\\\text{Precision} \\\\cdot \\\\text{Recall}}{\\\\text{Precision} + \\\\text{Recall}} = \\\\frac{2\\\\text{TP}}{2\\\\text{TP} + \\\\text{FP} + \\\\text{FN}}$$
$$\\\\text{IoU (Jaccard Index)} = \\\\frac{\\\\text{TP}}{\\\\text{TP} + \\\\text{FP} + \\\\text{FN}}$$
`,
    code: `import cv2
import numpy as np

def evaluate_performance(pred_mask, gt_mask):
    """Calculates full confusion matrix and performance metrics."""
    p_bin = (pred_mask > 0).astype(np.uint8)
    g_bin = (gt_mask > 0).astype(np.uint8)
    
    tp = np.sum((p_bin == 1) & (g_bin == 1))
    fp = np.sum((p_bin == 1) & (g_bin == 0))
    tn = np.sum((p_bin == 0) & (g_bin == 0))
    fn = np.sum((p_bin == 0) & (g_bin == 1))
    
    acc = (tp + tn) / (tp + tn + fp + fn + 1e-8)
    prec = tp / (tp + fp + 1e-8)
    rec = tp / (tp + fn + 1e-8)
    spec = tn / (tn + fp + 1e-8)
    f1 = 2 * (prec * rec) / (prec + rec + 1e-8)
    iou = tp / (tp + fp + fn + 1e-8)
    
    return {"TP": tp, "FP": fp, "TN": tn, "FN": fn,
            "Accuracy": acc, "Precision": prec, "Recall": rec,
            "Specificity": spec, "F1": f1, "IoU": iou}

# Video Stream Differencing Pipeline
cap = cv2.VideoCapture('traffic_sequence.mp4')
ret, prev_frame = cap.read()
if ret:
    prev_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
    prev_gray = cv2.GaussianBlur(prev_gray, (5, 5), 0)

while cap.isOpened():
    ret, curr_frame = cap.read()
    if not ret: break
    
    # 1. Grayscale & Smoothing
    curr_gray = cv2.cvtColor(curr_frame, cv2.COLOR_BGR2GRAY)
    curr_blur = cv2.GaussianBlur(curr_gray, (5, 5), 0)
    
    # 2. Compute Absolute Difference
    diff = cv2.absdiff(curr_blur, prev_gray)
    
    # 3. Dynamic Thresholding (Otsu or Manual T=30)
    _, raw_mask = cv2.threshold(diff, 30, 255, cv2.THRESH_BINARY)
    
    # 4. Morphological Cleaning (Kernel 5x5)
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
    clean_mask = cv2.morphologyEx(raw_mask, cv2.MORPH_OPEN, kernel)
    clean_mask = cv2.morphologyEx(clean_mask, cv2.MORPH_CLOSE, kernel)
    
    # 5. Extract Contours & Draw Bounding Boxes
    contours, _ = cv2.findContours(clean_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for c in contours:
        if cv2.contourArea(c) > 500:
            x, y, w, h = cv2.boundingRect(c)
            cv2.rectangle(curr_frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(curr_frame, "Moving Object", (x, y - 8),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            
    cv2.imshow("Tracked Motion", curr_frame)
    cv2.imshow("Clean Binary Mask", clean_mask)
    
    prev_gray = curr_blur
    if cv2.waitKey(30) == 27: break

cap.release()
cv2.destroyAllWindows()`,
    sampleType: "motion",
    filterAction: "motion",
    outputDescription: "Real-time moving vehicle detection displaying 5-image sequence: Frame(t-1), Frame(t), Difference |Delta I|, Raw Binary Mask, and Filtered Clean Mask with Bounding Boxes and Live Performance Metrics.",
    conclusion: "Demonstrated that temporal frame differencing combined with morphological opening/closing effectively extracts moving foreground objects, while median and Gaussian filters eliminate sensor noise without sacrificing detection IoU.",
    vivaQuestions: [
      {
        q: "What is the mathematical difference between Two-Frame and Three-Frame Differencing?",
        a: "Two-frame differencing calculates |I(t) - I(t-1)|, which suffers from ghosting at the abandoned position. Three-frame differencing computes the logical AND of forward difference |I(t) - I(t-1)| and backward difference |I(t+1) - I(t)|, isolating the true object position at time t."
      },
      {
        q: "Why is Accuracy an unreliable metric for Background Modeling?",
        a: "Background modeling exhibits extreme class imbalance: 90% to 95% of pixels are static background (True Negatives). A naive detector that classifies every pixel as background would achieve 95% Accuracy. Precision, Recall, F1-Score, and IoU (Jaccard Index) are far more reliable as they focus on true foreground detection."
      },
      {
        q: "How does the structuring element kernel size (3x3 vs 5x5 vs 7x7) affect the binary mask?",
        a: "A 3x3 kernel removes isolated 1-pixel noise while preserving sharp corners. A 5x5 kernel effectively merges split object components and removes clumped noise. A 7x7 kernel aggressively smooths and bridges gaps, but risks over-dilation and eroding thin object limbs (e.g., pedestrian legs)."
      },
      {
        q: "What is the role of the Difference Histogram in setting the threshold T?",
        a: "The intensity histogram of the difference image is typically bimodal: a tall spike near 0 represents background noise, while a trailing spread represents motion. Analyzing the histogram allows automated threshold selection using Otsu's method by maximizing between-class variance."
      },
      {
        q: "How does Running Average Background Subtraction handle illumination changes?",
        a: "Using the formula B_t = (1 - alpha)*B_{t-1} + alpha*I_t, gradual ambient lighting shifts (like passing clouds or sunset) are slowly assimilated into the background model at a rate governed by alpha, preventing persistent false positive triggers."
      }
    ],
    references: [
      "https://docs.opencv.org/4.x/d1/dc5/tutorial_background_subtraction.html",
      "https://learnopencv.com/background-subtraction-with-opencv-and-python/",
      "Gonzalez, R. C., & Woods, R. E. Digital Image Processing (4th ed.). Pearson.",
      "Z. Zivkovic, Improved adaptive Gaussian mixture model for background subtraction, ICPR 2004."
    ]
  }
];

if (typeof window !== 'undefined') {
  window.PRACTICALS_DATA = PRACTICALS_DATA;
}
