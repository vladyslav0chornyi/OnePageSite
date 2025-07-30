from flask import Flask, request, jsonify, send_file, abort, render_template, Response
import gspread
from google.oauth2.service_account import Credentials
import io
import csv
import os
import re
import json

app = Flask(__name__)

# --- Google Sheets налаштування ---
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = '1bgRbJv8CRkITl1r2x1gFQj2keYlV_W4Zf9Ojp1WUEIU'  # встав свій ID
SHEET_NAME = 'Sheet1'  # або як називається лист

# --- Авторизація через секрет у змінній оточення ---
service_account_info = json.loads(os.environ["GOOGLE_SERVICE_ACCOUNT"])
creds = Credentials.from_service_account_info(service_account_info, scopes=SCOPES)
gc = gspread.authorize(creds)
sheet = gc.open_by_key(SPREADSHEET_ID).worksheet(SHEET_NAME)

# --- Інші налаштування ---
ADMIN_SECRET = "Sharaga"

def is_valid_ua_phone(phone):
    """Валідація українського номера телефону."""
    pattern = r"^(?:\+380|380|0)\d{9}$"
    return bool(re.fullmatch(pattern, phone))

def is_valid_name(name):
    """
    Приймає українські та латинські літери, пробіли, дефіси, апостроф.
    Довжина — мінімум 2 символи.
    """
    pattern = r"^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ'’ʼ\- ]{2,}$"
    return bool(re.fullmatch(pattern, name))

@app.route("/subscribe", methods=["POST"])
def subscribe():
    data = request.get_json(force=True)
    name = data.get("name", "").strip()
    phone = data.get("phone", "").strip()
    if not name or not phone:
        return jsonify({"success": False, "message": "Вкажіть ім'я і телефон!"}), 400

    if not is_valid_name(name):
        return jsonify({"success": False, "message": "Введіть коректне ім'я. Допустимі лише літери, пробіли, дефіси, апостроф. Мінімум 2 символи."}), 400

    if not is_valid_ua_phone(phone):
        return jsonify({"success": False, "message": "Введіть коректний номер телефону у форматі +380XXXXXXXXX, 380XXXXXXXXX або 0XXXXXXXXX"}), 400

    sheet.append_row([name, phone])
    return jsonify({"success": True, "message": "Дякуємо за підписку!"}), 200

@app.route("/get_subscribers/<secret>")
def get_subscribers(secret):
    if secret != ADMIN_SECRET:
        abort(403)
    # Отримуємо всі дані з Google таблиці
    records = sheet.get_all_values()
    # Записуємо у тимчасовий CSV
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerows(records)
    output.seek(0)
    return Response(output, mimetype="text/csv", headers={"Content-Disposition": "attachment;filename=subscribers.csv"})

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)