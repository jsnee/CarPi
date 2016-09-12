#! /bin/sh

BRANCH="master"

while [ $# -gt 1 ]
do
key="$1"

case $key in
	-b|--branch)
	BRANCH="$2"
	shift
	;;
	*)
		# Unknown option
	;;
esac
shift
done

cd ~
curl -LOk https://github.com/jsnee/CarPi/archive/${BRANCH}.zip
unzip ${BRANCH}.zip
chmod +x CarPi-${BRANCH}/install.sh
chmod +x CarPi-${BRANCH}/upgrade.sh
chmod +x CarPi-${BRANCH}/update.sh
chmod +x CarPi-${BRANCH}/clean.sh
chmod +x CarPi-${BRANCH}/launch-car-pi.sh
./CarPi-${BRANCH}/upgrade.sh --branch ${BRANCH}