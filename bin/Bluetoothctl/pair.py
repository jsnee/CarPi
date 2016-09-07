import bluetoothctl
import json

bl = bluetoothctl.Bluetoothctl()
print json.dumps(bl.pair(sys.argv[1]))