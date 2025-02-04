from flask import Flask, jsonify
from flask_cors import CORS
import os
import time

app = Flask(__name__)
CORS(app)

def read_temp():
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
                temp_c = float(lines[1][temp_pos+2:]) / 1000.0
                return temp_c
    except Exception as e:
        return str(e)

@app.route('/temperature', methods=['GET'])
def get_temperature():
    temp = read_temp()
    return jsonify({'temperature_c': temp})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
