import db
from flask import Flask, render_template, request, redirect, url_for
import models

app = Flask(__name__)



@app.route("/")
def home():
    return "holi"


if __name__ == '__main__':
    # Crea todas las tablas si no existen
    db.Base.metadata.create_all(db.engine)
    app.run(debug=True)


