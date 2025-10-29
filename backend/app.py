from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import cv2
import os
import uuid
import base64
import tensorflow as tf
from werkzeug.utils import secure_filename
from PIL import Image
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'temp_uploads'
ALLOWED_EXTENSIONS = {'bmp', 'gif', 'png', 'jpeg', 'jpg', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024

for folder in [UPLOAD_FOLDER]:
    if not os.path.exists(folder):
        os.makedirs(folder)

MODEL_PATH = "10mush_model_CORRECT.h5"

try:
    model = load_model(MODEL_PATH)
    logger.info("Model loaded successfully!")
except Exception as e:
    logger.error(f"Error loading model: {e}")
    model = None

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(img_path):
    """Preprocess image exactly like training"""
    try:
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        logger.error(f"Error preprocessing: {str(e)}")
        raise

def load_image_cv2(img_path):
    """Load image with PIL to avoid cv2 issues"""
    try:
        pil_img = Image.open(img_path)
        if pil_img.mode != 'RGB':
            pil_img = pil_img.convert('RGB')
        return np.array(pil_img)
    except Exception as e:
        logger.error(f"Error loading image: {str(e)}")
        raise

def generate_gradcam_heatmap(model, img_array):
    """Generate Grad-CAM heatmap - ROBUST VERSION"""
    try:
        base_model = None
        for layer in model.layers:
            if 'mobilenet' in layer.name.lower():
                base_model = layer
                break

        if base_model is None:
            raise ValueError("MobileNetV2 not found")

        last_conv_layer = None
        last_conv_name = None

        possible_names = ['Conv_1', 'out_relu', 'Conv_1_bn', 'top_activation']

        for name in possible_names:
            try:
                last_conv_layer = base_model.get_layer(name)
                last_conv_name = name
                break
            except:
                continue

        if last_conv_layer is None:
            for layer in reversed(base_model.layers):
                if isinstance(layer, tf.keras.layers.Conv2D):
                    last_conv_layer = layer
                    last_conv_name = layer.name
                    break

        if last_conv_layer is None:
            raise ValueError("No Conv layer found")

        _ = base_model(img_array)

        conv_layer_model = tf.keras.models.Model(
            inputs=base_model.input,
            outputs=last_conv_layer.output
        )

        conv_outputs = conv_layer_model(img_array)

        with tf.GradientTape() as tape:
            tape.watch(conv_outputs)

            x = conv_outputs

            found_target = False
            for layer in base_model.layers:
                if layer.name == last_conv_name:
                    found_target = True
                    continue
                if found_target:
                    x = layer(x)

            for layer in model.layers[1:]:
                x = layer(x)
            predictions = x
            class_channel = predictions[:, 0]

        grads = tape.gradient(class_channel, conv_outputs)
        
        if grads is None:
            logger.warning("Gradients are None, using fallback method")
            heatmap = np.ones((conv_outputs.shape[1], conv_outputs.shape[2]))
        else:
            pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

            conv_outputs_np = conv_outputs[0].numpy()
            pooled_grads_np = pooled_grads.numpy()

            for i in range(len(pooled_grads_np)):
                conv_outputs_np[:, :, i] *= pooled_grads_np[i]

            heatmap = np.mean(conv_outputs_np, axis=-1)

        heatmap = np.maximum(heatmap, 0)

        if heatmap.max() > 0:
            heatmap = heatmap / heatmap.max()
        else:
            heatmap = np.ones_like(heatmap)

        return heatmap

    except Exception as e:
        logger.error(f"Grad-CAM error: {str(e)}")
        raise

def create_gradcam_images(img_path, heatmap, img_array):
    """Create visualizations - FIXED VERSION"""
    try:
        img_pil = Image.open(img_path)
        if img_pil.mode != 'RGB':
            img_pil = img_pil.convert('RGB')
        
        img_cv_resized = np.array(img_pil)
        
        # Ensure image is 224x224
        if img_cv_resized.shape[0] != 224 or img_cv_resized.shape[1] != 224:
            img_cv_resized = cv2.resize(img_cv_resized, (224, 224))

        # Ensure heatmap is 224x224
        if heatmap.shape[0] != 224 or heatmap.shape[1] != 224:
            heatmap_resized = cv2.resize(heatmap, (224, 224))
        else:
            heatmap_resized = heatmap

        heatmap_uint8 = np.uint8(255 * heatmap_resized)
        heatmap_colored = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
        heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)

        # Verify sizes match before addWeighted
        if img_cv_resized.shape != heatmap_colored.shape:
            logger.warning(f"Size mismatch: img={img_cv_resized.shape}, heatmap={heatmap_colored.shape}")
            heatmap_colored = cv2.resize(heatmap_colored, (img_cv_resized.shape[1], img_cv_resized.shape[0]))

        overlay = cv2.addWeighted(
            img_cv_resized,
            0.6,
            heatmap_colored,
            0.4,
            0
        )

        def image_to_base64(img):
            pil_img = Image.fromarray(img.astype('uint8'))
            buffer = io.BytesIO()
            pil_img.save(buffer, format='PNG')
            return base64.b64encode(buffer.getvalue()).decode()

        return {
            'original': image_to_base64(img_cv_resized),
            'heatmap': image_to_base64(heatmap_colored),
            'overlay': image_to_base64(overlay)
        }

    except Exception as e:
        logger.error(f"Image creation error: {str(e)}")
        raise

@app.route('/predict', methods=['POST'])
def predict():
    """Predict mushroom - EDIBLE or NON-EDIBLE"""    
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    img_path = None
    try:
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        img_path = os.path.join(UPLOAD_FOLDER, unique_filename)

        file.save(img_path)

        img_array = preprocess_image(img_path)
        pred_raw = model.predict(img_array, verbose=0)[0][0]

        if pred_raw > 0.5:
            prediction = "NON-EDIBLE"
            confidence = float(pred_raw)
        else:
            prediction = "EDIBLE"
            confidence = float(1 - pred_raw)

        logger.info(f"Prediction: {prediction} (raw={pred_raw:.4f}, confidence={confidence:.4f})")

        return jsonify({
            "prediction": prediction,
            "confidence": confidence,
            "raw_prediction": float(pred_raw),
            "success": True
        })

    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({"error": str(e), "success": False}), 500

    finally:
        if img_path and os.path.exists(img_path):
            try:
                os.remove(img_path)
            except:
                pass

@app.route('/gradcam', methods=['POST'])
def gradcam():
    """Generate Grad-CAM explanation"""
    
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    img_path = None
    try:
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        img_path = os.path.join(UPLOAD_FOLDER, unique_filename)

        file.save(img_path)

        img_array = preprocess_image(img_path)
        pred_raw = model.predict(img_array, verbose=0)[0][0]

        if pred_raw > 0.5:
            prediction = "NON-EDIBLE"
            confidence = float(pred_raw)
        else:
            prediction = "EDIBLE"
            confidence = float(1 - pred_raw)

        heatmap = generate_gradcam_heatmap(model, img_array)
        visualizations = create_gradcam_images(img_path, heatmap, img_array)

        h, w = heatmap.shape
        quadrants = {
            'top_left': float(heatmap[:h//2, :w//2].mean()),
            'top_right': float(heatmap[:h//2, w//2:].mean()),
            'bottom_left': float(heatmap[h//2:, :w//2].mean()),
            'bottom_right': float(heatmap[h//2:, w//2:].mean())
        }

        return jsonify({
            "prediction": prediction,
            "confidence": confidence,
            "raw_prediction": float(pred_raw),
            "visualizations": visualizations,
            "quadrants": quadrants,
            "strongest_region": max(quadrants, key=quadrants.get),
            "heatmap_stats": {
                "mean": float(heatmap.mean()),
                "max": float(heatmap.max()),
                "std": float(heatmap.std())
            },
            "success": True
        })

    except Exception as e:
        logger.error(f"Grad-CAM error: {str(e)}")
        return jsonify({"error": str(e), "success": False}), 500

    finally:
        if img_path and os.path.exists(img_path):
            try:
                os.remove(img_path)
            except:
                pass

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy" if model is not None else "model_not_loaded",
        "model_loaded": model is not None
    })

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "Mushroom Classification API with Grad-CAM",
        "endpoints": {
            "POST /predict": "Predict mushroom (EDIBLE or NON-EDIBLE)",
            "POST /gradcam": "Predict with Grad-CAM visualization",
            "GET /health": "Health check"
        }
    })

if __name__ == "__main__":
    import io
    logger.info("Starting Flask API...")
    app.run(debug=True, host='0.0.0.0', port=5000)