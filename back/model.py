import time

import tensorflow as tf
import numpy as np
import cv2
from keras.api.models import load_model
from keras.api.preprocessing import image

def load_selected_model(model_type):
    if model_type == 0:
        # CNN modelini yükle
        model = load_model('models/cnn_model_05042025.h5')
        print("CNN modeli yüklendi")
        return model
    elif model_type == 1:
        # U-Net modelini yükle
        model = load_model('models/unet.keras')
        print("U-Net modeli yüklendi")
        return model
    else:
        # Geçersiz model tipi
        raise ValueError("Geçersiz model_type. 0 (CNN) veya 1 (U-Net) değeri giriniz.")

def preprocess_image(image_path):
    img_resized = image.load_img(image_path, target_size=(180, 180))

    img_arr = image.img_to_array(img_resized)

    img_array_expanded = np.expand_dims(img_arr, axis=0)
    img_array_expanded = img_array_expanded / 255.0

    return img_array_expanded, img_resized

def preprocess_image_for_unet(image_path):
    img_resized = image.load_img(image_path, target_size=(180, 180))
    img_arr = image.img_to_array(img_resized)
    image_norm = img_arr / 255.0  # Normalizasyon
    image_result = np.expand_dims(image_norm, axis=0)  # Model için batch boyutu ekle
    return image_result

def predict_image_cnn(model, image_path):
    img_processed, img_original = preprocess_image(image_path)

    prediction = model.predict(img_processed)

    predicted_class_index = int(prediction[0][0] > 0.5)

    print("Cancer" if predicted_class_index == 0 else "Not Cancer")

    return predicted_class_index

def predict_image_unet(model, image_path):
    image_processed = preprocess_image_for_unet(image_path)
    predicted_image = model.predict(image_processed)
    predicted_image = (predicted_image[0] > 0.5).astype(np.uint8)

    result_image = morf(predicted_image)

    return result_image

def morf(image_to_morph):
    # Yapısal eleman (çekirdek)
    kernel = np.ones((5, 5), np.uint8)

    # 1. Adım: Beyaz bölgeleri genişlet (dilation) – küçük siyah delikleri yok eder
    dilated = cv2.dilate(image_to_morph, kernel, iterations=1)

    # 2. Adım: Genişletilen alanları geri çek (erosion) – orijinal forma yakınlaştır
    closed = cv2.erode(dilated, kernel, iterations=1)

    # 3. Adım: Siyah bölgeler içindeki izole beyaz alanları yok et (inverse işlem)
    # Beyazla siyahı ters çevir
    inverted = cv2.bitwise_not(closed)

    # Küçük beyaz bölgeleri yok etmek için yine closing uygula
    inverted = cv2.morphologyEx(inverted, cv2.MORPH_CLOSE, kernel)

    # Tekrar orijinal tona çevir (bitwise_not ile)
    result = cv2.bitwise_not(inverted)

    return result

def run_full_system(image_path):
    cnn_model = load_selected_model(0)
    result_of_cnn = predict_image_cnn(cnn_model, image_path)

    if result_of_cnn == 1:
        raise ValueError("CNN modeli kanser tespit edemedi. U-Net modeli çalıştırılmayacak.")

    unet_model = load_selected_model(1)
    result_of_unet = predict_image_unet(unet_model, image_path)

    # timestamp ismi ile kaydet
    cv2.imwrite(f"results/{int(time.time())}.png", result_of_unet * 255, [cv2.IMWRITE_PNG_COMPRESSION, 0])

