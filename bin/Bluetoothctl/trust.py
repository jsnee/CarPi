import bluetoothctl
import json
import sys

bl = bluetoothctl.Bluetoothctl()
print json.dumps(bl.trust(sys.argv[1]))