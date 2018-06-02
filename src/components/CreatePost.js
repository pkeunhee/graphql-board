import React from 'react';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Form, Icon, Input, Button } from 'antd';
import { allPostsQuery, loggedInUserQuery } from '../queries/queries';

const FormItem = Form.Item;

class CreatePost extends React.Component {
  constructor(props) {
    super();

    this.state = {
      title: '',
      content: '',
      imageUrl: '',
    };
  }

  componentDidMount() {
    this.props.form.validateFields();
  }

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
    } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    if (this.props.loggedInUserQuery && this.props.loggedInUserQuery.loading) {
      return <div>Loading</div>;
    }

    return (
      <Form>
        <div className="w-100 pa4 flex justify-center">
          <div style={{ maxWidth: 800 }} className="w-100 pa3 mv2">
            <FormItem>
              {getFieldDecorator('title', {
                rules: [
                  {
                    min: 2,
                    message: '제목을 2자 이상 입력해주세요',
                  },
                ],
              })(
                <input
                  className="w-100 pa3 mv2"
                  value={this.state.title}
                  placeholder="제목"
                  onChange={e => this.setState({ title: e.target.value })}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('content', {
                rules: [
                  {
                    min: 5,
                    message: '내용을 5자 이상 입력해주세요',
                  },
                ],
              })(
                <textarea
                  style={{ height: 300 }}
                  className="w-100 pa3 mv2"
                  value={this.state.content}
                  placeholder="내용"
                  onChange={e => this.setState({ content: e.target.value })}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('url', {
                rules: [
                  {
                    pattern: /\.(jpeg|jpg|gif|png)$/,
                    message: '유효한 이미지 url을 입력해주세요.',
                  },
                ],
              })(
                <input
                  className="w-100 pa3 mv2"
                  value={this.state.imageUrl}
                  placeholder="이미지 URL"
                  onChange={e => this.setState({ imageUrl: e.target.value })}
                />
              )}
            </FormItem>

            {this.state.imageUrl && (
              <img src={this.state.imageUrl} alt="" className="w-100 mv3" />
            )}

            {this.state.title.length > 1 &&
              this.state.content.length > 4 &&
              this.state.imageUrl.match(/\.(jpeg|jpg|gif|png)$/) && (
                <button
                  className="pa3 bg-black-10 bn dim ttu pointer"
                  onClick={this.handlePost}>
                  작성완료
                </button>
              )}
          </div>
        </div>
      </Form>
    );
  }

  handlePost = async () => {
    if (!this.props.loggedInUserQuery.loggedInUser) {
      console.warn('only logged in users can create new posts');
      return;
    }

    this.props.form.validateFields((err, values) => {
      if (err) {
        console.log('Form validation error!');
        return;
      }
    });

    const { title, content, imageUrl } = this.state;
    const authorId = this.props.loggedInUserQuery.loggedInUser.id;

    await this.props.createPostMutation({
      variables: { title, content, imageUrl, authorId },
      refetchQueries: [{ query: allPostsQuery }],
    });
    this.props.history.replace('/');
  };
}

const WrappedCreatePostForm = Form.create()(CreatePost);

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
)(withRouter(WrappedCreatePostForm));
