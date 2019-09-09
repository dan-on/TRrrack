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

echo "Unpacking"
tar -zxf $CITY_TAR_PATH -C $CITY_TMP_PATH
tar -zxf $COUNTRY_TAR_PATH -C $COUNTRY_TMP_PATH
tar -zxf $ASN_TAR_PATH -C $ASN_TMP_PATH

cp $CITY_TMP_PATH/$(ls $CITY_TMP_PATH/|head -n 1)/*.mmdb maintenance/db/city.mmdb
cp $COUNTRY_TMP_PATH/$(ls $COUNTRY_TMP_PATH/|head -n 1)/*.mmdb maintenance/db/country.mmdb
cp $ASN_TMP_PATH/$(ls $ASN_TMP_PATH/|head -n 1)/*.mmdb maintenance/db/asn.mmdb

echo "Cleaning up"
rm -r "maintenance/db/tmp"
echo "Done, enjoy!"