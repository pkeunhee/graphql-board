import React from 'react';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { Modal } from 'antd';

class PostDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ModalText: '정말 삭제하시겠습니까?',
      visible1: false,
      visible2: false,
      confirmLoading1: false,
      confirmLoading2: false,
      ...props,
    };
  }

  showModal1 = () => {
    this.setState({
      visible1: true,
    });
  };

  showModal2 = () => {
    this.setState({
      visible2: true,
    });
  };

  handleCancel1 = () => {
    this.setState({
      visible1: false,
    });
  };

  handleCancel2 = () => {
    this.setState({
      visible2: false,
    });
  };

  render() {
    if (this.props.postQuery.loading) {
      return (
        <div className="flex w-100 h-100 items-center justify-center pt7">
          <div>Loading...</div>
        </div>
      );
    }

    const { Post } = this.props.postQuery;
    const {
      visible1,
      visible2,
      confirmLoading1,
      confirmLoading2,
      ModalText,
    } = this.state;

    return (
      <article class="baskerville pb5" style={{ marginTop: '10px' }}>
        <Link to="/" style={{ margin: '10px' }}>
          <a class="f6 link dim br3 ba bw1 ph3 pv2 mb2 dib purple">뒤로가기</a>
        </Link>
        <a
          class="f6 link dim br3 ba bw1 ph3 pv2 mb2 dib light-purple"
          onClick={this.showModal1}
          style={{ float: 'right', marginRight: '10px' }}>
          수정하기
        </a>
        <Modal
          title="Update Post"
          visible={visible1}
          onOk={this.handleUpdate}
          confirmLoading={confirmLoading1}
          onCancel={this.handleCancel1}>
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

        <a
          class="f6 link dim br3 ba bw1 ph3 pv2 mb2 dib hot-pink"
          onClick={this.showModal2}
          style={{ float: 'right', marginRight: '10px' }}>
          삭제하기
        </a>
        <Modal
          title="Delete Post"
          visible={visible2}
          onOk={this.handleDelete}
          confirmLoading={confirmLoading2}
          onCancel={this.handleCancel2}>
          <p>{ModalText}</p>
        </Modal>

        <header class="avenir tc-l ph3 ph4-ns pt4 pt5-ns">
          <h1 class="f3 f2-m f-subheadline-l measure lh-title fw1 mt0">
            {Post.title}
          </h1>
          <h4 class="f3 fw4 i lh-title mt0">{Post.author.name}</h4>
          <time class="f5 f4-l db fw1 baskerville mb4">
            {Post.createdAt.split('T', 1)}
          </time>
        </header>
        <div class="measure db center f5 f4-ns lh-copy">
          <img class="db w-100 mt4 mt5-ns" src={Post.imageUrl} />
          <br />
          <p>{Post.content}</p>
        </div>
      </article>
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
    });
    this.setState({ visible: false });
    this.props.history.replace('/');
  };

  handleDelete = async () => {
    await this.props.deletePostMutation({
      variables: { id: this.props.postQuery.Post.id },
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

const DELETE_POST_MUTATION = gql`
  mutation DeletePostMutation($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

const POST_QUERY = gql`
  query PostQuery($id: ID!) {
    Post(id: $id) {
      id
      author {
        name
      }
      title
      content
      imageUrl
      createdAt
    }
  }
`;

const DetailPageWithGraphQL = compose(
  graphql(POST_QUERY, {
    name: 'postQuery',
    options: ({ match }) => ({
      variables: {
        id: match.params.id,
      },
    }),
  }),
  graphql(UPDATE_POST_MUTATION, {
    name: 'updatePostMutation',
  }),
  graphql(DELETE_POST_MUTATION, {
    name: 'deletePostMutation',
  })
)(PostDetail);

export default compose(
  graphql(UPDATE_POST_MUTATION, { name: 'updatePostMutation' }),
  graphql(DELETE_POST_MUTATION, { name: 'deletePostMutation' })
)(withRouter(DetailPageWithGraphQL));
