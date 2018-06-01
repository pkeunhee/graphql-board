import React from 'react';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { Modal } from 'antd';
import { allPostsQuery, postQuery } from '../queries/queries';

class UpdatePostButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      confirmLoading: false,
      ...props,
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { Post } = this.props.postQuery;
    const { visible, confirmLoading } = this.state;

    return (
      <div>
        <a
          className="f6 link dim br3 ba bw1 ph3 pv2 mb2 dib light-purple"
          onClick={this.showModal}
          style={{ float: 'right', marginRight: '10px' }}>
          수정하기
        </a>
        <Modal
          title="Update Post"
          visible={visible}
          onOk={this.handleUpdate}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}>
          <div className="w-100 pa4 flex justify-center">
            <div style={{ maxWidth: 800 }} className="">
              <input
                className="w-100 pa3 mv2"
                placeholder="title"
                defaultValue={Post.title}
                onChange={e => this.setState({ title: e.target.value })}
              />
              <input
                className="w-100 pa3 mv2"
                placeholder="content"
                defaultValue={Post.content}
                onChange={e => this.setState({ content: e.target.value })}
              />
              <input
                className="w-100 pa3 mv2"
                placeholder="imageUrl"
                defaultValue={Post.imageUrl}
                onChange={e => this.setState({ imageUrl: e.target.value })}
              />
              {this.state.imageUrl && (
                <img src={this.state.imageUrl} alt="" className="w-100 mv3" />
              )}
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  handleUpdate = async () => {
    await this.props.updatePostMutation({
      variables: {
        id: this.props.postQuery.Post.id,
        title: this.state.title || this.props.postQuery.Post.title,
        content: this.state.content || this.props.postQuery.Post.content,
        imageUrl: this.state.imageUrl || this.props.postQuery.Post.imageUrl,
      },
      refetchQueries: [{ query: allPostsQuery }],
    });
    this.setState({ visible: false });
    this.props.history.replace('/');
  };
}

const UPDATE_POST_MUTATION = gql`
  mutation UpdatePostMutation(
    $id: ID!
    $title: String!
    $content: String!
    $imageUrl: String!
  ) {
    updatePost(id: $id, title: $title, content: $content, imageUrl: $imageUrl) {
      id
    }
  }
`;

const UpdatePostWithGraphQL = compose(
  graphql(postQuery, {
    name: 'postQuery',
    options: ({ match }) => ({
      variables: {
        id: match.params.id,
      },
    }),
  }),
  graphql(UPDATE_POST_MUTATION, {
    name: 'updatePostMutation',
  })
)(UpdatePostButton);

export default compose(
  graphql(UPDATE_POST_MUTATION, { name: 'updatePostMutation' })
)(withRouter(UpdatePostWithGraphQL));
