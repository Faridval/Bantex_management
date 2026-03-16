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
    return jsonify({"message": "Sakura Backend Running"})


# =========================
# REGISTER
# =========================
@app.route("/api/register", methods=["POST"])
def register():

    data = request.json
    db = get_db()
    cursor = db.cursor(dictionary=True)

    name = data["name"]
    email = data["email"]
    password = data["password"]

    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    if user:
        return jsonify({
            "success": False,
            "message": "Email already exists"
        }), 400

    cursor.execute(
        "INSERT INTO users (name,email,password) VALUES (%s,%s,%s)",
        (name,email,password)
    )

    return jsonify({
        "success": True,
        "message": "User registered"
    })


# =========================
# LOGIN
# =========================
@app.route("/api/login", methods=["POST"])
def login():

    data = request.json
    db = get_db()
    cursor = db.cursor(dictionary=True)

    email = data["email"]
    password = data["password"]

    cursor.execute(
        "SELECT * FROM users WHERE email=%s AND password=%s",
        (email,password)
    )

    user = cursor.fetchone()

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
        "message": "Invalid email or password"
    }),401


# =========================
# GET DEPARTMENTS
# =========================
@app.route("/api/departments", methods=["GET"])
def get_departments():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM departments")
    departments = cursor.fetchall()

    return jsonify(departments)


# =========================
# CREATE BANTEX
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

    cursor.execute("""
        INSERT INTO bantex
        (nama_bantex, department_id, document_date, kode_bantex, created_by)
        VALUES (%s,%s,%s,%s,%s)
    """,(nama_bantex,department_id,document_date,kode_bantex,created_by))

    bantex_id = cursor.lastrowid

    for file in files:

        if file and file.filename:

            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)

            file.save(filepath)

            cursor.execute("""
                INSERT INTO files
                (bantex_id,file_name,file_path)
                VALUES (%s,%s,%s)
            """,(bantex_id,filename,filepath))

    return jsonify({
        "success": True,
        "message": "Bantex created with files"
    })


# =========================
# GET ALL BANTEX
# =========================
@app.route("/api/bantex", methods=["GET"])
def get_bantex():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
        b.id,
        b.nama_bantex,
        b.department_id,
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

    return jsonify(data)


# =========================
# GET FILES BY BANTEX
# =========================
@app.route("/api/bantex/<int:bantex_id>/files", methods=["GET"])
def get_files(bantex_id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM files WHERE bantex_id=%s",
        (bantex_id,)
    )

    files = cursor.fetchall()

    return jsonify(files)


# =========================
# DELETE BANTEX
# =========================
@app.route("/api/bantex/<int:bantex_id>", methods=["DELETE"])
def delete_bantex(bantex_id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "DELETE FROM bantex WHERE id=%s",
        (bantex_id,)
    )

    return jsonify({
        "success": True,
        "message": "Bantex deleted"
    })


# =========================
# DELETE FILE
# =========================
@app.route("/api/files/<int:file_id>", methods=["DELETE"])
def delete_file(file_id):

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM files WHERE id=%s",
        (file_id,)
    )

    file = cursor.fetchone()

    if file:

        path = file["file_path"]

        if os.path.exists(path):
            os.remove(path)

        cursor.execute(
            "DELETE FROM files WHERE id=%s",
            (file_id,)
        )

    return jsonify({
        "success": True,
        "message": "File deleted"
    })


# =========================
# SERVE FILES
# =========================
@app.route("/uploads/<path:filename>")
def get_file(filename):

    return send_from_directory(
        app.config["UPLOAD_FOLDER"],
        filename
    )


# =========================
# DASHBOARD STATS
# =========================
@app.route("/api/dashboard", methods=["GET"])
def dashboard():

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) as total FROM bantex")
    total_bantex = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT COUNT(DISTINCT department_id) as total
        FROM bantex
    """)
    total_departments = cursor.fetchone()["total"]

    cursor.execute("""
        SELECT COUNT(*) as total
        FROM bantex
        WHERE DATE(created_at) = CURDATE()
    """)
    today_upload = cursor.fetchone()["total"]

    return jsonify({
        "totalDocuments": total_bantex,
        "totalDepartments": total_departments,
        "documentsToday": today_upload
    })


# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(debug=True)