import dbus
import json
bus = dbus.SystemBus()
adapter_props = dbus.Interface(bus.get_object('org.bluez', '/org/bluez/hci0'), "org.freedesktop.DBus.Properties")
props = adapter_props.GetAll("org.bluez.Adapter1")
print json.dumps(props)