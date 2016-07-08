import dbus
import sys
bus = dbus.SystemBus()
player = bus.get_object('org.bluez', '/org/bluez/hci0/dev_' + sys.argv[1] + '/player0')
BT_Media_iface = dbus.Interface(player, dbus_interface='org.bluez.MediaPlayer1')
BT_Media_iface.Pause()
