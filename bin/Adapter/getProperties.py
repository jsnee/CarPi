import dbus
bus = dbus.SystemBus()
adapter_props = dbus.Interface(bus.get_object('org.bluez', '/org/bluez/hci0'), "org.freedesktop.DBus.Properties")
print adapter_props.GetAll("org.bluez.Adapter1")