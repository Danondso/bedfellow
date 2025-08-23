# bedfellow-api

See readme in /bedfellow-api

# bedfellow-db-api

This is the CRUD-like (no PATCH / DELETE) service for bedfellow's db. Whenever we get a sample from whosampled, we'll POST it to the db for easier retrieval.

## setting up

The docker-compose file is meant to be a quickstart and can be run to create the database and external volume.

### Required Configuration

Before running the services, you MUST configure the following in `docker-compose.yml`:

1. **Spotify API Credentials** (required for authentication):
   - `SPOTIFY_CLIENT_ID`: Your Spotify app's Client ID from the Spotify Developer Dashboard
   - `SPOTIFY_CLIENT_SECRET`: Your Spotify app's Client Secret from the Spotify Developer Dashboard
2. **Database Credentials** (replace all 'xxxxx' placeholders):
   - `MYSQL_ROOT_PASSWORD`: Root password for MySQL
   - `MYSQL_PASSWORD`: Password for the application user
   - `DATABASE_URL`: Update the password in the connection string to match `MYSQL_PASSWORD`

### Important Notes

- The authentication will fail with "INVALID_CLIENT" error if the Spotify credentials are not configured
- The backend services will crash if credentials are empty or invalid
- Make sure your Spotify app has the correct redirect URIs configured:
  - iOS: `org.danondso.bedfellow://callback/`
  - Android: `com.bedfellow://callback/`

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
