pg_dump -U blackholes nsrentals > nsrentals.sql

scp -i /Users/raoofmac/Documents/saint_marys/blackholes/creds/nsrentals.pem  nsrentals.sql ubuntu@54.196.154.157:/home/ubuntu/datadump

ssh -i /Users/raoofmac/Documents/saint_marys/blackholes/creds/nsrentals.pem ubuntu@54.196.154.157

psql -U postgres
CREATE DATABASE nsrentals;
psql -U blackholes nsrentals < /home/ubuntu/datadump/nsrentals.sql

