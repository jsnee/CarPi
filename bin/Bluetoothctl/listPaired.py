import bluetoothctl
import json

bl = bluetoothctl.Bluetoothctl()
print json.dumps(bl.get_paired_devices())