from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import model
import os
import datetime
import uuid

app = Flask(__name__)
CORS(app)  # Frontend ile iletişim için CORS'u aktif ediyoruz

# MySQL veritabanı yapılandırması
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:211213058nA@localhost:3306/file_uploads'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
db = SQLAlchemy(app)

# Fotoğraf tablosu modeli
class Photo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    filepath = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    cancer_status = db.Column(db.Integer, nullable=False, default=1)  # Varsayılan olarak "Not Cancer"
    result_filename = db.Column(db.String(255))
    original_path = db.Column(db.String(255), nullable=False)

# Veritabanını yeniden oluştur
with app.app_context():
    db.drop_all()  # Mevcut tabloları sil
    db.create_all()  # Yeni tabloları oluştur

# Fotoğraf yükleme klasörünü ayarla
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Dosya adını güvenli hale getirme ve timestamp ekleyelim
    original_filename = file.filename
    # Dosya uzantısını jpg olarak belirle, orijinal uzantıyı yoksay
    file_ext = '.jpg'
    # Benzersiz bir dosya adı oluştur: timestamp_uuid.jpg
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    unique_id = str(uuid.uuid4().hex[:8])  # UUID'nin kısa versiyonu
    new_filename = f"{timestamp}_{unique_id}{file_ext}"

    # Dosya yolunu oluştur
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)

    try:
        # Dosyayı sunucuda kaydet
        file.save(filepath)

        # Model sonuçlarını al
        cnn_result, unet_result_path, message = model.run_full_system(filepath)

        # CNN sonucu (0: Kanser, 1: Kanser değil)
        cancer_status = "Not Cancer" if cnn_result == 1 else "Cancer"

        # Dosya bilgilerini veritabanına kaydet
        new_photo = Photo(
            filename=new_filename,
            filepath=new_filename,
            cancer_status=cnn_result,
            original_path=original_filename
        )
        db.session.add(new_photo)
        db.session.commit()

        result_filename = None
        if unet_result_path:
            result_filename = os.path.basename(unet_result_path)
            new_photo.result_filename = result_filename
            db.session.commit()

        return jsonify({
            'message': message,
            'cancer_status': cancer_status,
            'saved_filename': new_filename,
            'result_filename': result_filename
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Tüm fotoğrafları getirme endpoint'i
@app.route('/photos', methods=['GET'])
def get_photos():
    photos = Photo.query.all()
    return jsonify([{'id': photo.id, 'filename': photo.filename, 'filepath': photo.filepath} for photo in photos])

@app.route('/uploads/<path:filename>')
def serve_file(filename):
    return send_from_directory('uploads', filename)

@app.route('/results/<path:filename>')
def serve_result(filename):
    return send_from_directory('results', filename)

if __name__ == '__main__':
    app.run(debug=True)
