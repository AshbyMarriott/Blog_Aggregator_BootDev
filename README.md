# Blog Aggregator (Boot.Dev guided project)
### *A CLI RSS feed aggregator written in TypeScript with local database storage and multi-user support*
## Setup
- Install [NVM](https://github.com/nvm-sh/nvm)
- Install [PostgreSQL](https://www.postgresql.org/)
    - Once installed, open postgres with `psql postgres` (Mac) or `sudo -u postgres psql` (Linux)
    - Create the database: `CREATE DATABASE gator;`
    - If on Linux/WSL: 
        - Connect to the database: `\c gator`
        - Set the user password:
            - `ALTER USER postgres PASSWORD 'postgres';` (your choice on actual password)
- In your home directory, create the `.gatorconfig.json` file and add your DB URL as shown:
### Mac
```json
{
    "db_url":"postgres://[username]:@localhost:5432/gator?sslmode=disable"
}
```
### Linux
```json
{
    "db_url":"postgres://postgres:[postgres_password]@localhost:5432/gator?sslmode=disable"
}
```
- You can test your DB URL string with `psql "[your_db_url]"`
- Note that `5432` is the **default Postgres port** - if you changed it you will need to use your custom port number
- From the root directory of the repo, run `npm install`
- If you have changed the database schema, generate before migration: `npm run generate`
- Perform the existing project migration: `npm run migrate`


## Using the program
- To run the program: `npm run start [command_name] [args]`
- The `agg` command is meant to be left long-running in its own terminal after being started and will add posts to the database over time. Be careful to set the interval as long enough to avoid DOS feeds. As your number of feeds added grows, a shorter interval may keep your database fresher.

## Commands (append to `npm run start`)
`register [username]`
Create/add a user

`login [username]`
Log in as a user (for switching from current user to another existing user). Does not require a password, just changes the current user.

`users`
List registered users and display which is the current user

`reset`
Reset the database and clear all users. **Deletes all saved posts!**

`addfeed "[feed_name]" "[feed_url]"`
Add a feed to the database. Creates a following record for the current user.

`feeds`
Display all feed entries.

`follow "[feed_url]"`
Follows the feed with url feed_url for the current user. Feed must already exist.

`following`
Display the feeds the current user follows.

`unfollow "[feed_url]"`
Unfollows the feed with url feed_url for the current user.

`agg [fetchInterval]` (e.g. `agg 30s`, `agg 15m`, `agg 1h`)
Fetch most stale feed at given interval (default unit is ms, only supports single number/unit character combos as above - no 1h1m30s) and adds posts to database.

`browse [post_count]`
Displays the post_count (expects a positive integer) most recent posts from feeds the current user follows. Defaults to 2 if not provided.