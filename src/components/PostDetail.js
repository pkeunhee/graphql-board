import React from 'react';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import UpdatePostButton from './UpdatePostButton';
import DeletePostButton from './DeletePostButton';
import { loggedInUserQuery, postQuery } from '../queries/queries';

class PostDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.postQuery.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <div>Loading...</div>
        </div>
      );
    }

    const { Post } = this.props.postQuery;
    const { loggedInUser } = this.props.loggedInUserQuery;

    return (
      <article className="baskerville pb5" style={{ marginTop: '10px' }}>
        <Link to="/" style={{ margin: '10px' }}>
          <span className="f6 link dim br3 ba bw1 ph3 pv2 mb2 dib purple">
            뒤로가기
          </span>
        </Link>

        {loggedInUser
          ? Post.author.id === loggedInUser.id && (
              <span>
                <UpdatePostButton />
                <DeletePostButton />
              </span>
            )
          : null}

        <header className="avenir tc-l ph3 ph4-ns pt4 pt5-ns">
          <h1 className="f3 f2-m f-subheadline-l measure lh-title fw1 mt0">
            {Post.title}
          </h1>
          <h4 className="f3 fw4 i lh-title mt0">{Post.author.name}</h4>
          <time className="f5 f4-l db fw1 baskerville mb4">
            {Post.createdAt.split('T', 1)}
          </time>
        </header>
        <div className="measure db center f5 f4-ns lh-copy">
          <img className="db w-100 mt4 mt5-ns" src={Post.imageUrl} />
          <br />
          <p>{Post.content}</p>
        </div>
      </article>
    );
  }
}

export default compose(
  graphql(loggedInUserQuery, {
    name: 'loggedInUserQuery',
  }),
  graphql(postQuery, {
    name: 'postQuery',
    options: ({ match }) => ({
      variables: {
        id: match.params.id,
      },
    }),
  })
)(withRouter(PostDetail));
