import gql from 'graphql-tag';

const allPostsQuery = gql`
  {
    allPosts(orderBy: createdAt_DESC) {
      id
      title
      author {
        name
      }
      comments {
        id
      }
      createdAt
    }
  }
`;

const loggedInUserQuery = gql`
  {
    loggedInUser {
      id
    }
  }
`;

const postQuery = gql`
  query PostQuery($id: ID!) {
    Post(id: $id) {
      id
      author {
        id
        name
      }
      title
      content
      imageUrl
      createdAt
    }
  }
`;

export { allPostsQuery, loggedInUserQuery, postQuery };
