import React from 'react';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import { Modal } from 'antd';
import { postQuery } from '../queries/queries';

class DeletePostButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ModalText: '정말 삭제하시겠습니까?',
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
    const { ModalText, visible, confirmLoading } = this.state;

    return (
      <div>
        <a
          className="f6 link dim br3 ba bw1 ph3 pv2 mb2 dib hot-pink"
          onClick={this.showModal}
          style={{ float: 'right', marginRight: '110px', marginTop: '-50px' }}>
          삭제하기
        </a>
        <Modal
          title="Delete Post"
          visible={visible}
          onOk={this.handleDelete}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}>
          <p>{ModalText}</p>
        </Modal>
      </div>
    );
  }

  handleDelete = async () => {
    await this.props.deletePostMutation({
      variables: { id: this.props.postQuery.Post.id },
    });
    this.setState({ visible: false });
    this.props.history.replace('/');
  };
}

const DELETE_POST_MUTATION = gql`
  mutation DeletePostMutation($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;

const DeletePostWithGraphQL = compose(
  graphql(postQuery, {
    name: 'postQuery',
    options: ({ match }) => ({
      variables: {
        id: match.params.id,
      },
    }),
  }),
  graphql(DELETE_POST_MUTATION, {
    name: 'deletePostMutation',
  })
)(DeletePostButton);

export default compose(
  graphql(DELETE_POST_MUTATION, { name: 'deletePostMutation' })
)(withRouter(DeletePostWithGraphQL));
