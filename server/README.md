# bedfellow-api

See readme in /bedfellow-api

# bedfellow-db-api

This is the CRUD-like (no PATCH / DELETE) service for bedfellow's db. Whenever we get a sample from whosampled, we'll POST it to the db for easier retrieval.

## setting up

The docker-compose file is meant to be a quickstart and can be run to create the database and external volume. Perform a repo search and replace all the 'xxxxx' instances with their user and password equivalents for the database. Additionally you'll need to have values for SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET if you want to run the bedfellow-api.

After that just run `docker-compose up` from appropriate docker-compose file (/server/docker-compose.yml runs the app api AND the db api).

Below are some other paths for setting up:

## setting up the db

You can manually create the db using the /bedfellow-db-api/db/init.sql file. If not using the docker-compose mysql db then comment out the mysql server service and remove the dependency in the bedfellow-db-api service, then update the DATABASE_URL to point to your mysql instance.

### running the db-api only

Setting up is pretty easy, to start do a repo search for xxxxx and replace those with your passwords. Then run `docker-compose up`

### what about running without docker

You sure can! Normal rust commands work just make sure to export the required env variables before doing so.

## running tests

You'll have to build the app and start a mysql server separately, obviously once you have your env variables entered. You'll likely need a root user for testing since we're using sqlx to create test dbs.
Then run `cargo test` and you should be good.
