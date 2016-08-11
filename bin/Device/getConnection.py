import json
import dbus
import sys
bus = dbus.SystemBus()
try:
    device_props = dbus.Interface(bus.get_object('org.bluez', '/org/bluez/hci0/dev_' + sys.argv[1]), "org.freedesktop.DBus.Properties")
    props = device_props.GetAll("org.bluez.Device1")
    print json.dumps(props)
except:
    print ""