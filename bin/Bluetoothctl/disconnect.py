import bluetoothctl
import json
import sys

bl = bluetoothctl.Bluetoothctl()
print json.dumps(bl.disconnect(sys.argv[1]))