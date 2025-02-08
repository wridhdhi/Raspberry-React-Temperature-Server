from flask import Flask, jsonify,request,send_from_directory
from flask_cors import CORS
import os
import time
import sqlite3
from datetime import datetime, timedelta
import csv
import threading
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)
app.config['PROPAGATE_EXCEPTIONS'] = False #for debugging
CORS(app)
# Global variables for thread-safe temperature sharing
latest_temperature = None
temperature_lock = threading.Lock()

# Database setup
def init_db():
    conn = sqlite3.connect('temperature.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS readings
                 (timestamp DATETIME, temperature_c REAL)''')
    conn.commit()
    conn.close()

init_db()

def read_temp_sensor():
    device_folder = '/sys/bus/w1/devices/'
    device_id = [f for f in os.listdir(device_folder) if f.startswith('28-')][0]
    device_file = os.path.join(device_folder, device_id, 'w1_slave')

    try:
        with open(device_file, 'r') as f:
            lines = f.readlines()
            while lines[0].strip()[-3:] != 'YES':
                time.sleep(0.2)
                lines = f.readlines()
            temp_pos = lines[1].find('t=')
            if temp_pos != -1:
                return float(lines[1][temp_pos+2:]) / 1000.0
    except Exception as e:
        print(f"Error reading sensor: {e}")
        return None

def sensor_loop():
    global latest_temperature
    while True:
        temp = read_temp_sensor()
        if temp is not None:
            timestamp = datetime.now().isoformat()
            # Store reading in database
            conn = sqlite3.connect('temperature.db')
            c = conn.cursor()
            c.execute("INSERT INTO readings VALUES (?, ?)", (timestamp, temp))
            conn.commit()
            conn.close()
            
            # Update latest temperature
            with temperature_lock:
                latest_temperature = temp
        time.sleep(10)
 # 
 # 
 # 
 #To modify the averaging frequency or sensor reading interval, adjust:
#time.sleep(10) in sensor_loop (current: 10 seconds)
#minute='*' in scheduler config (current: every minute)

def log_average_temperature():
    # Calculate time range for previous minute
    now = datetime.now()
    previous_minute = now - timedelta(minutes=1)
    start_time = previous_minute.replace(second=0, microsecond=0)
    end_time = start_time + timedelta(minutes=1)
    
    # Get readings from database
    conn = sqlite3.connect('temperature.db')
    c = conn.cursor()
    c.execute('''
        SELECT temperature_c FROM readings
        WHERE timestamp >= ? AND timestamp < ?
    ''', (start_time.isoformat(), end_time.isoformat()))
    
    readings = [row[0] for row in c.fetchall()]
    
    if not readings:
        conn.close()
        return
    
    # Calculate average
    avg_temp = sum(readings) / len(readings)
    
    # Determine filename based on year
    year = start_time.year
    filename = f'temperature_logs_{year}.csv'
    
    # Write to CSV
    file_exists = os.path.isfile(filename)
    with open(filename, 'a', newline='') as csvfile:
        writer = csv.writer(csvfile)
        if not file_exists:
            writer.writerow(['timestamp', 'temperature_c'])
        writer.writerow([start_time.isoformat(), round(avg_temp, 2)])
    
    # Delete processed readings
    c.execute('''
        DELETE FROM readings
        WHERE timestamp >= ? AND timestamp < ?
    ''', (start_time.isoformat(), end_time.isoformat()))
    conn.commit()
    conn.close()

@app.route('/temperature', methods=['GET'])
def get_temperature():
    with temperature_lock:
        current_temp = latest_temperature
    
    if current_temp is None:
        return jsonify({'error': 'Sensor not initialized yet'}), 503
    
    return jsonify({'temperature_c': current_temp})
    
    
@app.route('/history', methods=['GET'])
def get_history():
    # Get data from the last 15 minutes
    end_time = datetime.now()
    start_time = end_time - timedelta(minutes=60)
    
    # Get all yearly files that might contain relevant data
    years = range(start_time.year, end_time.year + 1)
    data = []
    
    for year in years:
        filename = f'temperature_logs_{year}.csv'
        if not os.path.exists(filename):
            continue
            
        with open(filename, 'r') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                row_time = datetime.fromisoformat(row['timestamp'])
                if start_time <= row_time <= end_time:
                    data.append({
                        'timestamp': row_time.isoformat(),
                        'temperature_c': float(row['temperature_c'])
                    })
    
    # Sort and return the last 15, x- minutes of data
    data.sort(key=lambda x: x['timestamp'])
    return jsonify(data[-60:])  # Return max 15 most recent entries   
    
# Add these to your existing Flask app
active_number = 0  # Simple in-memory storage
switch_idx=1

@app.route('/switch', methods=['GET'])
def get_active_number():
    return jsonify({"switch_id": 1,'active_number': active_number})

@app.route('/switch', methods=['POST'])
def set_active_number():
    global active_number
    data = request.get_json()
    print(data)
    switch_id = data.get('switch_id')
    active_number = data.get('number', 0)
    return jsonify({'status': 'success',"switch_id": switch_id, 'active_number': active_number})
    
    
@app.route('/verify-passcode', methods=['POST'])
def verify_passcode():
    global switch_idx
    passcode='1234'
    data = request.get_json()
    switch_id = data.get('switch_id')
    print(data)
    inputcode=data.get('passcode',None)
    if inputcode==passcode :
        print('input code is: ',inputcode==passcode)
        active_number = data.get('number', 0)
        switch_idx=switch_id
        return jsonify({'status': 'success','success':True, "switch_id": switch_idx,'active_number': active_number})
    else:
        return jsonify({'status':'error'})

        # Add this route at the end of your existing routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    static_folder = '../build'
    print(f"Requested path: {path}")
    print(f"Static folder: {static_folder}")
    if path != "" and os.path.exists(os.path.join(static_folder, path)):
        print(f"Serving file: {os.path.join(static_folder, path)}")
        return send_from_directory(static_folder, path)
        
    else:
        print(f"Serving index.html from: {static_folder}")
        return send_from_directory(static_folder, 'index.html')


if __name__ == '__main__':
    sensor_thread = threading.Thread(target=sensor_loop, daemon=True)
    sensor_thread.start()
    
    # Configure scheduler for minute averages
    scheduler = BackgroundScheduler()
    scheduler.add_job(log_average_temperature, 'cron', minute='*')
    scheduler.start()
    
    try:
        app.run(host='0.0.0.0', port=5000)
    finally:
        scheduler.shutdown()
