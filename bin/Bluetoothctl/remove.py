import bluetoothctl
import json
import sys

bl = bluetoothctl.Bluetoothctl()
print json.dumps(bl.remove(sys.argv[1]))