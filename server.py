from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)  # Active CORS pour toutes les routes

# Dictionnaire pour stocker temporairement les codes (remplacez par une DB en production)
codes = {}

@app.route('/api/send-code', methods=['POST'])
def send_code():
    data = request.json
    phone = data.get('phone')
    
    # Génère un code à 6 chiffres
    code = str(random.randint(100000, 999999))
    codes[phone] = code  # Stocke le code
    
    print(f"[DEBUG] Code pour {phone}: {code}")  # À remplacer par un vrai service SMS
    
    return jsonify({"success": True, "code": code})

@app.route('/api/verify-code', methods=['POST'])
def verify_code():
    data = request.json
    phone = data.get('phone')
    user_code = data.get('code')
    
    if codes.get(phone) == user_code:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Code invalide"}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)