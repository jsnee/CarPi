import dbus
bus = dbus.SystemBus()
player = bus.get_object('org.bluez', '/org/bluez/hci0/dev_74_A5_28_C0_60_CF/player0')
BT_Media_iface = dbus.Interface(player, dbus_interface='org.bluez.MediaPlayer1')
BT_Media_iface.Next()
