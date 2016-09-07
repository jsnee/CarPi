import bluetoothctl
import json

bl = bluetoothctl.Bluetoothctl()
print json.dumps(bl.connect(sys.argv[1]))