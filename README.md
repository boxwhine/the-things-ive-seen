# The Things I've Seen

_Concert/event dashboard and visualization app_

Just a hobby project I've been working on to demo various technologies using the concerts and events I've attended as a dataset.

I've saved the ticket stubs from (almost) every concert I've been to since I was a teenager.  I thought it would be interesting to use this data as a dataset for creating a hobby code project using the latest technologies.

So far, it's mainly just a list of events that link to detail pages, but eventually I would like to tie it into third party API's like Spotify, Setlist.fm, Last.fm, Google Maps, et al., to create a more immersive experience.

## Potential features

* "Play this artist" on Spotify
* Display actual setlist from concert
* Plot venues on interactive map
* Filter by taxonomies, e.g., genre, venue

Since my primary goal in this is really just to create a hobby code demo to showcase new tech, I may also create a React port of the app.

## Development

Fire up the docker containers (one for web app, one for API):

```
docker-compose up
```

Access the web app at `http://localhost:3000/`

Hit the API at `http://localhost:8080/api`
