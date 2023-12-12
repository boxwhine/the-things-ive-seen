# The Things I've Seen

_Concert/event dashboard and visualization app_

<img src="repo-icon.jpg" alt="Joey Ramone" title="Joey Ramone" width="225" align="left"></img>

Just a hobby project I've been working on to demo various technologies using the concerts and events I've attended as a dataset.

I've saved the ticket stubs from (almost) every concert I've been to since I was a teenager (or at least the emails and digital tickets since we don't get paper tickets these days).  I thought it would be interesting to use as a dataset for creating a hobby code project using the latest technologies.

So far, it's mainly just a list of events that link to detail pages, but eventually I would like to tie it into third party API's like Spotify, Setlist.fm, Last.fm, Google Maps, et al., to create a more rich experience.

## Potential features

* "Play this artist" on Spotify
* Display actual setlist from concert
* Plot venues on interactive map
* Filter by taxonomies, e.g., genre, venue

## Resources

  * [Trello board for tracking work items](https://trello.com/b/oMusq7vm/the-things-ive-seen)

## Development

Set your env vars in `./{ui,server}/.env` files.  You can copy/paste/rename the `.env.dev` files to `.env` for running dev env quickly.

Fire up the docker containers (one for web app, one for API):

```
docker-compose up
```

Access the React web app at `http://localhost:3000/`

Hit the local [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server/docs) API playground at `http://localhost:4000/playground`
