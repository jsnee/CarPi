import json
import dbus
bus = dbus.SystemBus()
device_props = dbus.Interface(bus.get_object('org.bluez', '/org/bluez/hci0/' + sys.argv[0]), "org.freedesktop.DBus.Properties")
props = device_props.GetAll("org.bluez.Device1")
print json.dumps(props)