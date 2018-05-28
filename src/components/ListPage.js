import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { Table } from 'antd';

class ListPage extends React.Component {
  render() {
    const { allPostsQuery } = this.props;
    const allPosts = allPostsQuery.allPosts;

    if (allPostsQuery && allPostsQuery.loading) {
      return <div>Loading</div>;
    }
    return (
      <div style={{ margin: '4em' }}>
        <Table
          columns={[
            {
              title: '제목',
              key: 'id',
              render: post => <Link to={`/post/${post.id}`}>{post.title}</Link>,
            },
            {
              title: '글쓴이',
              dataIndex: 'author.name',
            },
            {
              title: '작성일시',
              dataIndex: 'createdAt',
              render: time => time.split('T', 1),
            },
          ]}
          dataSource={allPosts}
          size="middle"
          rowKey="id"
        />
      </div>
    );
  }
}

const ALL_POSTS_QUERY = gql`
  query AllPostsQuery {
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

export default graphql(ALL_POSTS_QUERY, { name: 'allPostsQuery' })(ListPage);
