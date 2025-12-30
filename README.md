# Tackstage - a [Backstage](https://backstage.io) instance

Tackstage from merging the words Technat and Backstage together. Not very creative I know.

My own instance of backstage to tinker & learn. 

## Local development

To start the app, run:

```sh
yarn install
yarn start
```

If you want to have a persistent local catalog:

```sh
docker compose up -d
```

And then edit your `app-config.local.yaml` to include:

```yaml
backend:
  database:
    client: 'pg'
    connection:
      host: postgres-db.tackstage.orb.local
      port: 5432
      user: wurm
      password: wurmig
```

## Production instance

Deployed on fly.io. See the [deploy](./deploy) folder for setup docs.