import netifaces

ip = netifaces.ifaddresses('wlan0')[2][0]['addr']
print(ip)
