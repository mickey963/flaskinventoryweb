from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# --- DATABASE SETUP ---
def init_db():
    with sqlite3.connect('inventory.db') as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS fashion (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                price REAL,
                image TEXT
            )
        ''')

# --- ROUTES ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/items', methods=['GET'])
def get_items():
    with sqlite3.connect('inventory.db') as conn:
        items = conn.execute('SELECT * FROM fashion').fetchall()
        result = [
            {'id': row[0], 'name': row[1], 'description': row[2], 'price': row[3], 'image': row[4]}
            for row in items
        ]
    return jsonify(result)

@app.route('/add', methods=['POST'])
def add_item():
    data = request.json
    with sqlite3.connect('inventory.db') as conn:
        conn.execute('INSERT INTO fashion (name, description, price, image) VALUES (?, ?, ?, ?)',
                     (data['name'], data['description'], data['price'], data['image']))
    return jsonify({'message': 'Item added successfully'})

@app.route('/edit/<int:item_id>', methods=['POST'])
def edit_item(item_id):
    data = request.json
    with sqlite3.connect('inventory.db') as conn:
        conn.execute('''
            UPDATE fashion
            SET name = ?, description = ?, price = ?, image = ?
            WHERE id = ?
        ''', (data['name'], data['description'], data['price'], data['image'], item_id))
    return jsonify({'message': 'Item updated successfully'})

@app.route('/delete/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    with sqlite3.connect('inventory.db') as conn:
        conn.execute('DELETE FROM fashion WHERE id = ?', (item_id,))
    return jsonify({'message': 'Item deleted successfully'})

# --- START APP ---
if __name__ == '__main__':
    init_db()
    app.run(debug=True)
