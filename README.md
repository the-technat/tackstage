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

Deployed on fly.io.

Some references:
- https://fly.io/docs/launch/continuous-deployment-with-github-actions/
- https://fly.io/docs/networking/custom-domain/
- https://fly.io/docs/postgres/getting-started/create-pg-cluster/
- https://fly.io/docs/postgres/managing/scale-to-zero/

Manual steps:
- add an org token to github actions secret
- create a scale-to-zero self-managed postgres cluster (see linked doc)
- save config for this cluster & tweak
- create db user for our app
- launch your app initially: `fly launch --no-deploy`
- somehow specify the correct image tag in fly.toml
- trigger fly deploy action whenever there is a new image