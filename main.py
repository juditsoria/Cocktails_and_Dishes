from flask_cors import CORS
import db
from flask import Flask
from routes import api

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


# Registra el Blueprint
app.register_blueprint(api, url_prefix='/api')

@app.route("/")
def home():
    return "holi"

if __name__ == '__main__':
    # Crea todas las tablas si no existen
    db.Base.metadata.create_all(db.engine)
    app.run(debug=True, host='0.0.0.0', port=5000)
