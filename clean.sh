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
rm ${BRANCH}.zip
rm -r CarPi-${BRANCH}
./car-pi/install.sh