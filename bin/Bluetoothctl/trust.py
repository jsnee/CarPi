import bluetoothctl
import json

bl = bluetoothctl.Bluetoothctl()
print json.dumps(bl.trust(sys.argv[1]))