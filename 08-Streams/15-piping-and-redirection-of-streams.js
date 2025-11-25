/*
- log of first will be listened as input from second and log of second will be writted in text/file.txt

node 08-Streams/15-piping-and-redirection-of-streams.js | node 08-Streams/15-demo.js > texts/file.txt

- logging to log file and error in error file
node app.js > texts/log.txt 2> texts/errors.txt

- taking input from file
node app.js > texts/input.txt
*/

process.stdout.write("abcdef");
