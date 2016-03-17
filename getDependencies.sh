wget http://code.jquery.com/jquery-1.11.0.js
mv jquery-1.11.0.js javascript/jquery-1.11.0.js

wget https://github.com/twbs/bootstrap/releases/download/v3.3.6/bootstrap-3.3.6-dist.zip
unzip bootstrap-3.3.6-dist.zip 
cd bootstrap-3.3.6-dist/
cd css
mv bootstrap.css ../../stylesheets/bootstrap.css
cd ../js/
mv bootstrap.js ../../javascript/bootstrap.js 
cd ../../
rm bootstrap-3.3.6-dist.zip
rm -rf bootstrap-3.3.6-dist/
