import bluetoothctl
import json

bl = bluetoothctl.Bluetoothctl()
print json.dumps(bl.remove(sys.argv[1]))