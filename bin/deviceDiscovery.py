import bluetooth
import json

nearby_devices = bluetooth.discover_devices(lookup_names=True)

print json.dumps(nearby_devices)