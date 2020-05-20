[Link to tool](https://steam-collection-comparer.herokuapp.com)

# Steam Collection Comparer
Flask/React webapp hosted on a free-tier Heroku dyno.
Users can visit the site and insert various public Steam Workshop Collections to produce a sortable chart displaying all the mods within the collections.

## How it works
Flask server communicates with the [Steamworks API](https://partner.steamgames.com/doc/webapi) to retrieve information about submitted collections and their constituent files.