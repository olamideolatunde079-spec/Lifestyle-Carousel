# ============================================================
# app.py  —  Python web server for Lifestyle Carousel
# ============================================================
#
# This replaces the old server.js (Node.js) file.
# It uses Flask — a simple Python web framework.
#
# HOW TO RUN:
#   1.  source venv/bin/activate      (turns on the Python environment)
#   2.  python app.py                 (starts the server)
#   3.  Open:  http://localhost:5000
#
# WHAT FLASK DOES HERE:
#   - Serves index.html when someone visits /
#   - Serves style.css, carousel.js, images/ automatically
#   - That's it — simple!
#
# ============================================================

from flask import Flask, send_from_directory

# Create the Flask app.
# Setting static_folder to '.' means Flask looks for files
# (images, CSS, JS) right here in the project root folder.
app = Flask(__name__, static_folder='.', static_url_path='')


# ── HOME PAGE ──────────────────────────────────────────────
# When the browser visits http://localhost:5000/
# Flask sends back the index.html file.
@app.route('/')
def home():
    # send_from_directory sends a file from a folder.
    # '.' means the current folder (project root).
    return send_from_directory('.', 'index.html')


# ── START THE SERVER ───────────────────────────────────────
if __name__ == '__main__':
    print()
    print('=' * 45)
    print('  Lifestyle Carousel  —  Python / Flask')
    print('  Open in your browser:')
    print('  http://localhost:5000')
    print('=' * 45)
    print()
    # debug=True  → shows errors in the browser and
    #               auto-restarts when you save a file
    app.run(debug=True, host='0.0.0.0', port=5000)
