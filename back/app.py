from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import model
import os
import datetime
import uuid

app = Flask(__name__)
CORS(app)  # Frontend ile iletişim için CORS'u aktif ediyoruz

# MySQL veritabanı yapılandırması
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:211213058nA@localhost:3310/file_uploads'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
db = SQLAlchemy(app)

# Fotoğraf tablosu modeli
class Photo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    filepath = db.Column(db.String(255), nullable=False)
    

# Veritabanını oluştur
with app.app_context():
    db.create_all()

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
    # Dosya uzantısını ayır
    file_ext = os.path.splitext(original_filename)[1]
    # Benzersiz bir dosya adı oluştur: timestamp_uuid.uzantı
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    unique_id = str(uuid.uuid4().hex[:8])  # UUID'nin kısa versiyonu
    new_filename = f"{timestamp}_{unique_id}{file_ext}"

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], new_filename)

    try:
        # Dosyayı sunucuda kaydet
        file.save(filepath)

        model.run_full_system(filepath)

        # Dosya bilgilerini veritabanına kaydet - orijinal adını da saklayalım
        new_photo = Photo(filename=new_filename, filepath=filepath)
        db.session.add(new_photo)
        db.session.commit()

        return jsonify({
            'message': 'File uploaded successfully',
            'saved_filename': new_filename,
            'filepath': filepath
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Tüm fotoğrafları getirme endpoint'i
@app.route('/photos', methods=['GET'])
def get_photos():
    photos = Photo.query.all()
    return jsonify([{'id': photo.id, 'filename': photo.filename, 'filepath': photo.filepath} for photo in photos])

if __name__ == '__main__':
    app.run(debug=True)

