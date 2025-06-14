from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
import bcrypt

app = Flask(__name__)
app.config.from_pyfile("config.py")
db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

# --- Routes ---
@app.route('/')
def index():
    messages = Message.query.order_by(Message.created_at.desc()).all()
    return render_template("index.html", messages=messages)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password'].encode('utf-8')
        hashed = bcrypt.hashpw(password, bcrypt.gensalt())

        if User.query.filter_by(username=username).first():
            flash("Имя занято")
            return redirect(url_for('register'))

        new_user = User(username=username, email=email, password=hashed.decode('utf-8'))
        db.session.add(new_user)
        db.session.commit()

        return redirect(url_for('login'))

    return render_template("register.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password'].encode('utf-8')

        user = User.query.filter_by(username=username).first()

        if user and bcrypt.checkpw(password, user.password.encode('utf-8')):
            login_user(user)
            return redirect(url_for('index'))

        flash("Неправильное имя или пароль")
        return redirect(url_for('login'))

    return render_template("login.html")

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/send', methods=['POST'])
@login_required
def send_message():
    text = request.form['message']
    new_msg = Message(text=text, user_id=current_user.id)
    db.session.add(new_msg)
    db.session.commit()
    return redirect(url_for('index'))

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# --- Run DB setup ---
with app.app_context():
    db.create_all()