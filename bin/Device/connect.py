import dbus
import sys

bus = dbus.SystemBus()
device_path = '/org/bluez/hci0/dev_' + sys.argv[0]
device = bus.get_object('org.bluez', device_path)
BT_Device_iface = dbus.Interface(device, dbus_interface='org.bluez.Device1')