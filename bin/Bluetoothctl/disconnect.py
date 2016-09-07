import bluetoothctl
import json

bl = bluetoothctl.Bluetoothctl()
print json.dumps(bl.disconnect(sys.argv[1]))