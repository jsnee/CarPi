import dbus
import sys
import json
bus = dbus.SystemBus()
player_props = dbus.Interface(bus.get_object('org.bluez', '/org/bluez/hci0/dev_' + sys.argv[1] + '/player0'), "org.freedesktop.DBus.Properties")
props = player_props.GetAll("org.bluez.MediaPlayer1")
print json.dumps(props)