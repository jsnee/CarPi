import dbus

bus = dbus.SystemBus()
#player = bus.get_object('org.bluez', '/org/bluez/hci0/dev_74_A5_28_C0_60_CF/player0')
#BT_Media_iface = dbus.Interface(player, dbus_interface='org.bluez.MediaPlayer1')
#print BT_Media_iface.Track()

def getPlayer(mac_address):
    return bus.get_object('org.bluez', '/org/bluez/hci0/dev_%s/player0' % (mac_address.replace(':', '_')))

def getIMedia(player):
    return dbus.Interface(player, dbus_interface='org.bluez.MediaPlayer1')

def play():
    getIMedia(getPlayer('74:A5:28:C0:60:CF')).Play()
    print 'Playing Track ...'

def pause():
    getIMedia(getPlayer('74:A5:28:C0:60:CF')).Pause()

def next():
    getIMedia(getPlayer('74:A5:28:C0:60:CF')).Next()

def previous():
    getIMedia(getPlayer('74:A5:28:C0:60:CF')).Previous()

def getStatus():
    print getIMedia(getPlayer('74:A5:28:C0:60:CF')).Status()

def getTrack():
    print getIMedia(getPlayer('74:A5:28:C0:60:CF')).Track()

def getProperties():
    adapter_props = dbus.Interface(bus.get_object('org.bluez', '/org/bluez/hci0'), "org.freedesktop.DBus.Properties")
    print adapter.GetAll("org.bluez.Adapter1")