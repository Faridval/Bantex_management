from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import mysql.connector
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# =========================
# DATABASE CONFIG
# =========================
db_config = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "",
    "database": "document_management",
    "autocommit": True
}

def get_db():
    return mysql.connector.connect(**db_config)

# =========================
# UPLOAD FOLDER
# =========================
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# =========================
# ROOT
# =========================
@app.route("/")
def home():
    return jsonify({"message": "Backend Running"})

# =========================
# LOGIN
# =========================
@app.route("/api/login", methods=["POST"])
def login():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    data = request.json
    email = data["email"]
    password = data["password"]

    cursor.execute(
        "SELECT * FROM users WHERE email=%s AND password=%s",
        (email, password)
    )

    user = cursor.fetchone()

    cursor.close()
    db.close()

    if user:
        return jsonify({
            "success": True,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        })

    return jsonify({
        "success": False,
        "message": "Invalid email/password"
    }), 401

# =========================
# GET + ADD DEPARTMENTS
# =========================
@app.route("/api/departments", methods=["GET", "POST"])
def departments():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    # ================= GET =================
    if request.method == "GET":

        cursor.execute("SELECT * FROM departments")
        data = cursor.fetchall()

        cursor.close()
        db.close()

        return jsonify(data)

    # ================= POST =================
    if request.method == "POST":

        data = request.json
        name = data.get("name")

        if not name:
            return jsonify({
                "success": False,
                "message": "Department name required"
            }), 400

        # cek duplicate
        cursor.execute(
            "SELECT * FROM departments WHERE name=%s",
            (name,)
        )
        existing = cursor.fetchone()

        if existing:
            return jsonify({
                "success": False,
                "message": "Department already exists"
            }), 400

        cursor.execute(
            "INSERT INTO departments (name) VALUES (%s)",
            (name,)
        )

        db.commit()

        cursor.close()
        db.close()

        return jsonify({
            "success": True,
            "message": "Department added"
        })

# =========================
# CREATE BANTEX + MULTI FILE
# =========================
@app.route("/api/bantex", methods=["POST"])
def create_bantex():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    nama_bantex = request.form.get("nama_bantex")
    department_id = request.form.get("department_id")
    document_date = request.form.get("document_date")
    kode_bantex = request.form.get("kode_bantex")
    created_by = request.form.get("created_by")

    files = request.files.getlist("files")

    # insert bantex
    cursor.execute("""
        INSERT INTO bantex
        (nama_bantex, department_id, document_date, kode_bantex, created_by)
        VALUES (%s,%s,%s,%s,%s)
    """, (nama_bantex, department_id, document_date, kode_bantex, created_by))

    bantex_id = cursor.lastrowid

    # save files
    for file in files:
        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(filepath)

            cursor.execute("""
                INSERT INTO files (bantex_id, file_name, file_path)
                VALUES (%s,%s,%s)
            """, (bantex_id, filename, filepath))

    db.commit()

    cursor.close()
    db.close()

    return jsonify({"success": True})

# =========================
# GET BANTEX (SEARCH PAGE)
# =========================
@app.route("/api/bantex", methods=["GET"])
def get_bantex():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            b.id,
            b.nama_bantex,
            b.kode_bantex,
            b.document_date,
            d.name as department_name,
            COUNT(f.id) as total_files
        FROM bantex b
        LEFT JOIN departments d ON b.department_id = d.id
        LEFT JOIN files f ON b.id = f.bantex_id
        GROUP BY b.id
        ORDER BY b.created_at DESC
    """)

    data = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(data)

# =========================
# DASHBOARD STATS (FIX BUG DEPARTMENT)
# =========================
@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    db = get_db()
    cursor = db.cursor(dictionary=True)

    # total bantex
    cursor.execute("SELECT COUNT(*) as total FROM bantex")
    total_docs = cursor.fetchone()["total"]

    # total departments (REAL)
    cursor.execute("SELECT COUNT(*) as total FROM departments")
    total_depts = cursor.fetchone()["total"]

    # today
    cursor.execute("""
        SELECT COUNT(*) as total 
        FROM bantex 
        WHERE DATE(created_at) = CURDATE()
    """)
    today = cursor.fetchone()["total"]

    cursor.close()
    db.close()

    return jsonify({
        "totalDocuments": total_docs,
        "totalDepartments": total_depts,
        "documentsToday": today
    })

# =========================
# GET FILES BY BANTEX
# =========================
@app.route("/api/bantex/<int:id>/files", methods=["GET"])
def get_files(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM files WHERE bantex_id=%s", (id,))
    data = cursor.fetchall()

    cursor.close()
    db.close()

    return jsonify(data)

# =========================
# DELETE BANTEX
# =========================
@app.route("/api/bantex/<int:id>", methods=["DELETE"])
def delete_bantex(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("DELETE FROM bantex WHERE id=%s", (id,))
    db.commit()

    cursor.close()
    db.close()

    return jsonify({"success": True})

# =========================
# DELETE FILE
# =========================
@app.route("/api/files/<int:id>", methods=["DELETE"])
def delete_file(id):
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM files WHERE id=%s", (id,))
    file = cursor.fetchone()

    if file:
        if os.path.exists(file["file_path"]):
            os.remove(file["file_path"])

        cursor.execute("DELETE FROM files WHERE id=%s", (id,))
        db.commit()

    cursor.close()
    db.close()

    return jsonify({"success": True})

# =========================
# SERVE FILE
# =========================
@app.route("/uploads/<path:filename>")
def serve_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# =========================
# RUN
# =========================
if __name__ == "__main__":
    app.run(debug=True)