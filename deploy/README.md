# Deployment of Tackstage

This doc describes the deployment of Tackstage since it's done manually at the time.

## Prerequisites

- A fly.io account and organization
- flyctl installed locally and authenticated
- An organization api token for your fly organization
- A Github Actions Secrets named `FLY_ORG_API_TOKEN` with the token

## Database

Backstage uses a Postgres Database. The cheapest option to deploy such a database on fly.io is not using their managed service but using their CLI tool and scale it to zero when not needed.

In a terminal I ran:

```sh
fly pg create --autostart \
    --flex \
    --initial-cluster-size 1 \
    --name tackstage-db \
    --org technat-dev \
    --region fra \
    --vm-cpu-kind shared \
    --vm-cpus 1 \
    --vm-memory 512MiB \
    --volume-size 1
```

The command will provision your PG "cluster" and show you a number of connection information that you can ignore. We won't be using this.

Next dump the config of the db into the [db/fly.toml](./db/fly.toml) file using `fly config save -a tackstage-db`.

I like to lower the time the DB waits before it shuts down again, so I set `FLY_SCALE_TO_ZERO` to `10m` in the config and update the cluster using: `fly deploy . --image flyio/postgres-flex:17.2`, ensuring the image version matches the currently deployed one (use `fly image show --app <app-name>` for this).

## App

The app itself comes packaged as a container already that listens on HTTP. That makes it very easy to install it as a fly.io app.

All we do is:

```sh
fly launch --no-deploy -o technat-dev
```

This creates the inital app without deploying anything. Next we need to attach some secrets. 

We start by generating a db/user:

```sh
fly pg attach tackstage-db -a tackstage  
```

Backstage can't read this format, so we manually also set the following secrets:

```sh
fly secrets set --stage POSTGRES_HOST=tackstage-db.flycast
fly secrets set --stage POSTGRES_PORT=5432
fly secrets set --stage POSTGRES_USER=tackstage
fly secrets set --stage POSTGRES_PASSWORD=
```

Now that Backstage has access to the DB, we also add some secrets for our OIDC integration:

```sh
fly secrets set --stage OIDC_SECRET=<openssl rand -base64 32>
fly secrets set --stage OIDC_CLIENT_ID=
fly secrets set --stage OIDC_CLIENT_SECRET=
```

Before we finally start the initial deployment:

```sh
fly deploy --remote-only 
```

And the app is live. What's left is to update DNS to point to the IPs that got provisioned automatically and then request a certificate for them:

```sh
fly certs add example.com
```


Future updates to the app can now be pushed with a new image that the github actions pipeline builds. The corresponding deploy job is already in place.

## References
- https://fly.io/docs/launch/continuous-deployment-with-github-actions/
- https://fly.io/docs/networking/custom-domain/
- https://fly.io/docs/postgres/getting-started/create-pg-cluster/
- https://fly.io/docs/postgres/managing/scale-to-zero/
