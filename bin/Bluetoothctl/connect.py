import bluetoothctl
import json
import sys

bl = bluetoothctl.Bluetoothctl()
print json.dumps(bl.connect(sys.argv[1]))