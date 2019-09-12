#!/usr/bin/env bash
CITY_TAR_URL="http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz"
COUNTRY_TAR_URL="http://geolite.maxmind.com/download/geoip/database/GeoLite2-Country.tar.gz"
ASN_TAR_URL="http://geolite.maxmind.com/download/geoip/database/GeoLite2-ASN.tar.gz"

CITY_TAR_PATH="maintenance/db/tmp/GeoLite2-City.tar.gz"
COUNTRY_TAR_PATH="maintenance/db/tmp/GeoLite2-Country.tar.gz"
ASN_TAR_PATH="maintenance/db/tmp/GeoLite2-ASN.tar.gz"

CITY_TMP_PATH="maintenance/db/tmp/GeoLite2-City"
COUNTRY_TMP_PATH="maintenance/db/tmp/GeoLite2-Country"
ASN_TMP_PATH="maintenance/db/tmp/GeoLite2-Country"

mkdir -p $COUNTRY_TMP_PATH
mkdir -p $CITY_TMP_PATH
mkdir -p $ASN_TMP_PATH

echo "Getting the latest GeoLite2-City database"
wget $CITY_TAR_URL -O $CITY_TAR_PATH
echo "Done. Now getting the latest GeoLite2-Country database"
wget $COUNTRY_TAR_URL -O $COUNTRY_TAR_PATH
echo "Done. Now getting the latest GeoLite2-ASN database"
wget $ASN_TAR_URL -O $ASN_TAR_PATH

echo "Unpacking MaxMind DB"
tar -zxf $CITY_TAR_PATH -C $CITY_TMP_PATH
tar -zxf $COUNTRY_TAR_PATH -C $COUNTRY_TMP_PATH
tar -zxf $ASN_TAR_PATH -C $ASN_TMP_PATH

cp $CITY_TMP_PATH/$(ls $CITY_TMP_PATH/|head -n 1)/*.mmdb maintenance/db/city.mmdb
cp $COUNTRY_TMP_PATH/$(ls $COUNTRY_TMP_PATH/|head -n 1)/*.mmdb maintenance/db/country.mmdb
cp $ASN_TMP_PATH/$(ls $ASN_TMP_PATH/|head -n 1)/*.mmdb maintenance/db/asn.mmdb

# Download ip set of bad ip's - ipsum
echo "Getting the latest IpSum DB"
wget https://raw.githubusercontent.com/stamparm/ipsum/master/ipsum.txt -O maintenance/db/tmp/ipsum.txt --no-check-certificate
tail -n +5 maintenance/db/tmp/ipsum.txt >> maintenance/db/ipsum.tsv


# Download ipsets / netsets of bad ip's - blocklist
echo "Getting the latest blocklist DB"
wget https://github.com/firehol/blocklist-ipsets/archive/master.zip -O maintenance/db/tmp/blocklist.zip --no-check-certificate
unzip maintenance/db/tmp/blocklist.zip -d maintenance/db/tmp/blocklist
cat maintenance/db/tmp/blocklist/blocklist-ipsets-master/*.ipset | grep -o '^[^#]*' | sort | uniq -c | sed -E 's/^[ ]+([0-9]+) (.*)/\2\t\1/g' > maintenance/db/blocklist-ipsets.tsv
cat maintenance/db/tmp/blocklist/blocklist-ipsets-master/*.netset | grep -o '^[^#]*' | sort | uniq -c | sed -E 's/^[ ]+([0-9]+) (.*)/\2\t\1/g' > maintenance/db/blocklist-netsets.tsv

echo "Cleaning up"
rm -r "maintenance/db/tmp"
echo "Done, enjoy!"