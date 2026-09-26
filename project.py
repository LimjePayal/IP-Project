import cv2
import numpy as np
import matplotlib.pyplot as plt
import time
import os
import csv

# ============================================================
# PROJECT TITLE
# ============================================================
# Motion Detection using Frame Difference
# Performance Metrics:
# PSNR, Accuracy, Precision, Recall, F1-Score
# Histogram + 5 Output Images
# ============================================================


# ==============================
# VIDEO INPUT
# ==============================

video_path = "video.mp4"

# Ground Truth folder
ground_truth_folder = "ground_truth"

# Output folder
output_folder = "output_images"

# Create output folder automatically
os.makedirs(output_folder, exist_ok=True)


# ==============================
# PARAMETERS
# ==============================

THRESHOLD_VALUE = 25
KERNEL_SIZE = 5
MIN_CONTOUR_AREA = 500

# Number of output images required
REQUIRED_IMAGES = 5


# ==============================
# VIDEO OPEN
# ==============================

cap = cv2.VideoCapture(video_path)

if not cap.isOpened():

    print("ERROR: Video open nahi ho rahi!")
    print("Check karo ki video.mp4 same folder me hai.")

    exit()


# ==============================
# VIDEO INFORMATION
# ==============================

video_fps = cap.get(cv2.CAP_PROP_FPS)
video_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
video_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

print("\n====================================")
print("       VIDEO INFORMATION")
print("====================================")

print(f"Video FPS       : {video_fps:.2f}")
print(f"Video Width     : {video_width}")
print(f"Video Height    : {video_height}")

print("====================================")


# ==============================
# PERFORMANCE MATRIX VARIABLES
# ==============================

total_frames = 0

motion_frames = 0

total_processing_time = 0

total_detected_objects = 0

total_psnr = 0

psnr_frame_count = 0


# ==============================
# CLASSIFICATION METRICS
# ==============================

true_positive = 0
true_negative = 0
false_positive = 0
false_negative = 0

ground_truth_available = False


# ==============================
# FIRST FRAME
# ==============================

ret, previous = cap.read()

if not ret:

    print("ERROR: First frame read nahi hua!")

    cap.release()

    exit()


previous_gray = cv2.cvtColor(
    previous,
    cv2.COLOR_BGR2GRAY
)


# ============================================================
# OUTPUT IMAGE FRAME NUMBERS
# ============================================================

# 5 images video ke different parts se save karne ke liye
total_video_frames = int(
    cap.get(cv2.CAP_PROP_FRAME_COUNT)
)

if total_video_frames > 1:

    image_frame_numbers = np.linspace(
        1,
        total_video_frames - 1,
        REQUIRED_IMAGES,
        dtype=int
    )

else:

    image_frame_numbers = np.arange(
        1,
        REQUIRED_IMAGES + 1
    )


saved_images = 0


# ============================================================
# CSV REPORT
# ============================================================

csv_file = open(
    "performance_report.csv",
    "w",
    newline=""
)

csv_writer = csv.writer(csv_file)

csv_writer.writerow([
    "Frame",
    "Detected Objects",
    "PSNR (dB)",
    "Processing Time (sec)",
    "FPS"
])


# ============================================================
# VIDEO PROCESSING
# ============================================================

while True:

    start_time = time.time()

    ret, current = cap.read()

    if not ret:
        break


    total_frames += 1


    # ==============================
    # CURRENT FRAME TO GRAYSCALE
    # ==============================

    current_gray = cv2.cvtColor(
        current,
        cv2.COLOR_BGR2GRAY
    )


    # ============================================================
    # FRAME DIFFERENCE
    # ============================================================

    difference = cv2.absdiff(
        previous_gray,
        current_gray
    )


    # ============================================================
    # PSNR CALCULATION
    # ============================================================

    mse = np.mean(
        (
            previous_gray.astype(np.float32)
            -
            current_gray.astype(np.float32)
        ) ** 2
    )


    if mse == 0:

        psnr = float("inf")

    else:

        psnr = 10 * np.log10(
            (255 ** 2) / mse
        )


    # Add PSNR to total
    if np.isfinite(psnr):

        total_psnr += psnr

        psnr_frame_count += 1


    # ============================================================
    # THRESHOLDING
    # ============================================================

    _, mask = cv2.threshold(
        difference,
        THRESHOLD_VALUE,
        255,
        cv2.THRESH_BINARY
    )


    # ============================================================
    # NOISE REMOVAL
    # ============================================================

    kernel = np.ones(
        (KERNEL_SIZE, KERNEL_SIZE),
        np.uint8
    )


    # Morphological Opening
    mask = cv2.morphologyEx(
        mask,
        cv2.MORPH_OPEN,
        kernel
    )


    # Dilation
    mask = cv2.dilate(
        mask,
        kernel,
        iterations=2
    )


    # ============================================================
    # CONTOUR DETECTION
    # ============================================================

    contours, _ = cv2.findContours(
        mask,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )


    detected_objects = 0


    for contour in contours:

        area = cv2.contourArea(contour)


        if area > MIN_CONTOUR_AREA:

            detected_objects += 1


            x, y, w, h = cv2.boundingRect(
                contour
            )


            cv2.rectangle(
                current,
                (x, y),
                (x + w, y + h),
                (0, 255, 0),
                2
            )


    # ============================================================
    # MOTION FRAME COUNT
    # ============================================================

    if detected_objects > 0:

        motion_frames += 1


    total_detected_objects += detected_objects


    # ============================================================
    # PROCESSING TIME
    # ============================================================

    processing_time = (
        time.time() - start_time
    )


    total_processing_time += processing_time


    if processing_time > 0:

        fps = 1 / processing_time

    else:

        fps = 0


    # ============================================================
    # GROUND TRUTH METRICS
    # ============================================================

    gt_filename = os.path.join(
        ground_truth_folder,
        f"gt_{total_frames:03d}.png"
    )


    if os.path.exists(gt_filename):

        ground_truth_available = True


        ground_truth = cv2.imread(
            gt_filename,
            cv2.IMREAD_GRAYSCALE
        )


        if ground_truth is not None:

            # Resize ground truth if dimensions differ
            if ground_truth.shape != mask.shape:

                ground_truth = cv2.resize(
                    ground_truth,
                    (
                        mask.shape[1],
                        mask.shape[0]
                    )
                )


            # Convert to binary
            _, ground_truth_binary = cv2.threshold(
                ground_truth,
                127,
                255,
                cv2.THRESH_BINARY
            )


            # Prediction binary
            prediction_binary = mask


            # Convert to boolean
            gt_bool = (
                ground_truth_binary > 0
            )

            pred_bool = (
                prediction_binary > 0
            )


            # True Positive
            tp = np.logical_and(
                pred_bool,
                gt_bool
            ).sum()


            # True Negative
            tn = np.logical_and(
                ~pred_bool,
                ~gt_bool
            ).sum()


            # False Positive
            fp = np.logical_and(
                pred_bool,
                ~gt_bool
            ).sum()


            # False Negative
            fn = np.logical_and(
                ~pred_bool,
                gt_bool
            ).sum()


            true_positive += tp
            true_negative += tn
            false_positive += fp
            false_negative += fn


    # ============================================================
    # DISPLAY PERFORMANCE ON FRAME
    # ============================================================

    psnr_display = (
        f"{psnr:.2f}"
        if np.isfinite(psnr)
        else "INF"
    )


    cv2.putText(
        current,
        f"Objects: {detected_objects}",
        (10, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (0, 255, 0),
        2
    )


    cv2.putText(
        current,
        f"FPS: {fps:.2f}",
        (10, 60),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (0, 255, 0),
        2
    )


    cv2.putText(
        current,
        f"PSNR: {psnr_display} dB",
        (10, 90),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (0, 255, 0),
        2
    )


    # ============================================================
    # SAVE 5 OUTPUT IMAGES
    # ============================================================

    if (
        total_frames in image_frame_numbers
        and saved_images < REQUIRED_IMAGES
    ):

        # Save original + bounding boxes
        image_path = os.path.join(
            output_folder,
            f"output_{saved_images + 1}.jpg"
        )


        cv2.imwrite(
            image_path,
            current
        )


        # Save difference image
        difference_path = os.path.join(
            output_folder,
            f"difference_{saved_images + 1}.jpg"
        )


        cv2.imwrite(
            difference_path,
            difference
        )


        # Save motion mask
        mask_path = os.path.join(
            output_folder,
            f"motion_mask_{saved_images + 1}.jpg"
        )


        cv2.imwrite(
            mask_path,
            mask
        )


        saved_images += 1


    # ============================================================
    # DISPLAY OUTPUT
    # ============================================================

    cv2.imshow(
        "Original + Motion Detection",
        current
    )


    cv2.imshow(
        "Frame Difference",
        difference
    )


    cv2.imshow(
        "Motion Mask",
        mask
    )


    # ============================================================
    # HISTOGRAM
    # ============================================================

    histogram = cv2.calcHist(
        [difference],
        [0],
        None,
        [256],
        [0, 256]
    )


    plt.clf()

    plt.plot(
        histogram
    )

    plt.title(
        "Histogram of Frame Difference"
    )

    plt.xlabel(
        "Pixel Difference Intensity"
    )

    plt.ylabel(
        "Number of Pixels"
    )

    plt.xlim(
        [0, 256]
    )

    plt.grid(
        True
    )

    plt.pause(
        0.001
    )


    # ============================================================
    # SAVE DATA TO CSV
    # ============================================================

    csv_writer.writerow([
        total_frames,
        detected_objects,
        psnr_display,
        f"{processing_time:.6f}",
        f"{fps:.2f}"
    ])


    # ============================================================
    # PREVIOUS FRAME UPDATE
    # ============================================================

    previous_gray = current_gray


    # ============================================================
    # PRESS Q TO QUIT
    # ============================================================

    if cv2.waitKey(30) & 0xFF == ord("q"):

        break


# ============================================================
# RELEASE
# ============================================================

cap.release()

cv2.destroyAllWindows()

plt.close()

csv_file.close()


# ============================================================
# FINAL PERFORMANCE MATRIX
# ============================================================

if total_frames > 0:

    motion_detection_rate = (
        motion_frames /
        total_frames
    ) * 100


    average_processing_time = (
        total_processing_time /
        total_frames
    )


    average_fps = (
        total_frames /
        total_processing_time
        if total_processing_time > 0
        else 0
    )


    average_objects = (
        total_detected_objects /
        total_frames
    )


else:

    motion_detection_rate = 0

    average_processing_time = 0

    average_fps = 0

    average_objects = 0


# ============================================================
# AVERAGE PSNR
# ============================================================

if psnr_frame_count > 0:

    average_psnr = (
        total_psnr /
        psnr_frame_count
    )

else:

    average_psnr = 0


# ============================================================
# ACCURACY
# ============================================================

total_pixels = (
    true_positive
    +
    true_negative
    +
    false_positive
    +
    false_negative
)


if total_pixels > 0:

    accuracy = (
        (
            true_positive
            +
            true_negative
        )
        /
        total_pixels
    ) * 100


    precision = (
        true_positive /
        (
            true_positive
            +
            false_positive
        )
    ) * 100 if (
        true_positive +
        false_positive
    ) > 0 else 0


    recall = (
        true_positive /
        (
            true_positive
            +
            false_negative
        )
    ) * 100 if (
        true_positive +
        false_negative
    ) > 0 else 0


    f1_score = (
        2 *
        precision *
        recall /
        (
            precision +
            recall
        )
    ) if (
        precision +
        recall
    ) > 0 else 0

else:

    accuracy = None

    precision = None

    recall = None

    f1_score = None


# ============================================================
# PRINT FINAL PERFORMANCE MATRIX
# ============================================================

print("\n")
print("==============================================")
print("           FINAL PERFORMANCE MATRIX")
print("==============================================")


print(
    f"Total Frames              : {total_frames}"
)


print(
    f"Frames with Motion        : {motion_frames}"
)


print(
    f"Motion Detection Rate     : "
    f"{motion_detection_rate:.2f}%"
)


print(
    f"Total Detected Objects    : "
    f"{total_detected_objects}"
)


print(
    f"Average Objects / Frame   : "
    f"{average_objects:.2f}"
)


print(
    f"Average Processing Time   : "
    f"{average_processing_time:.6f} sec"
)


print(
    f"Average FPS               : "
    f"{average_fps:.2f}"
)


print(
    f"Average PSNR              : "
    f"{average_psnr:.2f} dB"
)


print("----------------------------------------------")


if ground_truth_available and total_pixels > 0:

    print(
        f"Accuracy                  : "
        f"{accuracy:.2f}%"
    )


    print(
        f"Precision                 : "
        f"{precision:.2f}%"
    )


    print(
        f"Recall                    : "
        f"{recall:.2f}%"
    )


    print(
        f"F1-Score                  : "
        f"{f1_score:.2f}%"
    )


else:

    print(
        "Accuracy                  : N/A"
    )


    print(
        "Precision                 : N/A"
    )


    print(
        "Recall                    : N/A"
    )


    print(
        "F1-Score                  : N/A"
    )


    print(
        "\nNOTE: Ground-truth masks nahi mile."
    )


print("----------------------------------------------")


print(
    f"Threshold Value           : "
    f"{THRESHOLD_VALUE}"
)


print(
    f"Kernel Size               : "
    f"{KERNEL_SIZE} x {KERNEL_SIZE}"
)


print(
    f"Minimum Contour Area      : "
    f"{MIN_CONTOUR_AREA}"
)


print(
    f"Output Images Saved       : "
    f"{saved_images}"
)


print("==============================================")


print(
    "Processing completed successfully!"
)


print(
    "Performance report saved as: "
    "performance_report.csv"
)


print(
    "Output images saved in: "
    "output_images/"
)


print("==============================================")