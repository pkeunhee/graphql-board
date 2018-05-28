# Simple board based on GraphQL & React

The project is a simple board implementation based on the Graphcool's [Email & Password Authentication](https://github.com/graphcool/templates/tree/master/auth/email-password) template.

## Getting Started

> It is recommended that you follow the instructions below rather than just cloning this repository.

### 1. Download the example

```sh
curl https://codeload.github.com/graphcool-examples/react-graphql/tar.gz/master | tar -xz --strip=1 react-graphql-master/authentication-with-email-and-apollo
cd authentication-with-email-and-apollo/server
```

### 2. Create your Graphcool service

```sh
# Install latest version of the Graphcool CLI
npm install -g graphcool

# Install dependencies and deploy service
yarn install
graphcool deploy
```

When prompted which cluster you want to deploy to, choose any of the **Shared Clusters** options (recommendation: `shared-ap-northeast-1`).

> Note: The service's schema is created based on the type definitions in [`./server/types.graphql`](./server/types.graphql).

#### 3. Connect the app with your GraphQL API

Paste the `Simple API` endpoint from the previous step to `./src/index.js` as the `uri` argument in the `createHttpLink` call:

```js
// replace `__SIMPLE_API_ENDPOINT__` with the endpoint from the previous step
const httpLink = new createHttpLinkHttpLink({ uri: '__SIMPLE_API_ENDPOINT__' });
```

> Note: You can get access to your endpoint using the `graphcool info` command.

### 4. Install dependencies & run locally

Navigate back into the root directory of the project, install the dependencies and run the app:

```sh
cd ..
yarn install
yarn start
```

You can now use the app at `http://localhost:3000`.

## Next steps

* [Tutorial](https://heeinso.netlify.com)
