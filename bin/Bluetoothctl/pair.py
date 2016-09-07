import bluetoothctl
import json
import sys

bl = bluetoothctl.Bluetoothctl()
print json.dumps(bl.pair(sys.argv[1]))