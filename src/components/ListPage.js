import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { Table } from 'antd';
import { allPostsQuery } from '../queries/queries';

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
          pagination={{ pageSize: 10 }}
          size="middle"
          rowKey="id"
        />
      </div>
    );
  }
}

export default graphql(allPostsQuery, { name: 'allPostsQuery' })(ListPage);
