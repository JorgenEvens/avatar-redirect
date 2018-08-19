# Avatar Redirect

[![CircleCI](https://circleci.com/gh/JorgenEvens/avatar-redirect.svg?style=svg)](https://circleci.com/gh/JorgenEvens/avatar-redirect)

Redirects to a user's profile picture on any of the supported social networks.

Currently supported:

- Facebook
- Twitter
- Instagram
- Google
- Skype

Looking for an easy way to plug this service into React? Check out [react-avatar](https://github.com/Sitebase/react-avatar).

Example:

![JorgenEvens on Twitter](https://avatar-redirect.appspot.com/twitter/JorgenEvens?size=bigger)

## Deployment

### Google App Engine

Requires the [Google Cloud SDK](https://cloud.google.com/sdk/) to be installed

Modify any of the settings in the `app.yaml` file.

```sh
gcloud config set project <project-id>
gcloud app deploy
```

### Heroku

Push this repository to a Heroku app or use the Deploy to Heroku button.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Usage

Each avatar URL follows the same base format which is `<base-url>/<network-name>/<user-name>`, for Twitter this would be `https://avatar-redirect.appspot.com/twitter/jorgenevens`.

If you are simply trying to show an avatar that would look something like this in HTML:

```html
<img src="https://avatar-redirect.appspot.com/twitter/jorgenevens"
    alt="JorgenEvens on Twitter" />
```

## Configuration

The app is configured using environment variables which you either add to your `app.yaml` file or set using the Heroku CLI / Dashboard.

| Environment variable | Description | Default value |
| --- | --- | --- |
| REDIS\_URL | connectionString used to connect to a Redis cache | `undefined` |
| MEMCACHE\_URL | connectionString used to connect to a Memcache instance | `undefined` |
| TTL\_PROFILE\_PICTURE | The duration for which the picture URL is cached in ms | `3600000` (1 hour) |
| NETWORKS | The social networks available to this deployment, if no value is set all are enabled. | `undefined` |
| LIMIT\_REFERER | A regular expression matched against the [Referer header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer). If the Referer does not match a `401 Unauthorized` will be returned. | `undefined` |
| LOG\_FORMAT | A valid log format as specified in the [morgan documentation](https://github.com/expressjs/morgan#predefined-formats) | `"combined"` |

## Contributing

I really appreciate any contribution you would like to make, so don't hesitate to report an issue or submit pull requests.

## About me

Hi, my name is [Jorgen Evens](https://jorgen.evens.eu). By day I built things (mainly in PHP and JavaScript) for [Ambassify](https://ambassify.com) and by night I tinker around with these kinds of projects.
