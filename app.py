from flask import Flask, request, jsonify, send_file, abort, render_template
import csv
import os

app = Flask(__name__)

# Налаштування
CSV_FILE = "subscribers.csv"
ADMIN_SECRET = "Sharaga"

# Ініціалізація файлу, якщо не існує
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["name", "phone"])

@app.route("/subscribe", methods=["POST"])
def subscribe():
    data = request.get_json(force=True)
    name = data.get("name", "").strip()
    phone = data.get("phone", "").strip()
    if not name or not phone:
        return jsonify({"success": False, "message": "Вкажіть ім'я і телефон!"}), 400

    with open(CSV_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([name, phone])

    return jsonify({"success": True, "message": "Дякуємо за підписку!"}), 200

@app.route("/get_subscribers/<secret>")
def get_subscribers(secret):
    if secret != ADMIN_SECRET:
        abort(403)
    return send_file(CSV_FILE, mimetype="text/csv", as_attachment=True)

# Головна — рендеримо index.html з templates
@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)