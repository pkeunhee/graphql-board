import React from 'react';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { allPostsQuery, loggedInUserQuery } from '../queries/queries';

class CreatePost extends React.Component {
  constructor(props) {
    super();

    this.state = {
      title: '',
      content: '',
      imageUrl: '',
    };
  }

  render() {
    if (this.props.loggedInUserQuery && this.props.loggedInUserQuery.loading) {
      return <div>Loading</div>;
    }

    return (
      <form>
        <div className="w-100 pa4 flex justify-center">
          <div style={{ maxWidth: 800 }} className="">
            <input
              className="w-100 pa3 mv2"
              value={this.state.title}
              placeholder="title"
              onChange={e => this.setState({ title: e.target.value })}
            />
            <textarea
              style={{ height: 300 }}
              className="w-100 pa3 mv2"
              value={this.state.content}
              placeholder="content"
              onChange={e => this.setState({ content: e.target.value })}
            />
            <input
              className="w-100 pa3 mv2"
              value={this.state.imageUrl}
              placeholder="Image Url"
              onChange={e => this.setState({ imageUrl: e.target.value })}
            />
            {this.state.imageUrl && (
              <img src={this.state.imageUrl} alt="" className="w-100 mv3" />
            )}
            {this.state.title.length < 2 && (
              <span style={{ color: 'red' }}>제목을 3자 이상 입력해주세요</span>
            )}
            {this.state.content &&
              this.state.imageUrl && (
                <button
                  className="pa3 bg-black-10 bn dim ttu pointer"
                  onClick={this.handlePost}>
                  작성완료
                </button>
              )}
          </div>
        </div>
      </form>
    );
  }

  handlePost = async () => {
    if (!this.props.loggedInUserQuery.loggedInUser) {
      console.warn('only logged in users can create new posts');
      return;
    }

    const { title, content, imageUrl } = this.state;
    const authorId = this.props.loggedInUserQuery.loggedInUser.id;

    await this.props.createPostMutation({
      variables: { title, content, imageUrl, authorId },
      refetchQueries: [{ query: allPostsQuery }],
    });
    this.props.history.replace('/');
  };
}

const createPostMutation = gql`
  mutation CreatePostMutation(
    $title: String!
    $content: String!
    $imageUrl: String!
    $authorId: ID!
  ) {
    createPost(
      title: $title
      content: $content
      imageUrl: $imageUrl
      authorId: $authorId
    ) {
      id
    }
  }
`;

export default compose(
  graphql(createPostMutation, {
    name: 'createPostMutation',
  }),
  graphql(loggedInUserQuery, {
    name: 'loggedInUserQuery',
    options: { fetchPolicy: 'network-only' },
  })
)(withRouter(CreatePost));
