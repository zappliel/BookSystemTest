import React from 'react';
import { Avatar, Divider, List, Skeleton } from 'antd';
import Item from 'antd/es/list/Item';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Orderoverall = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch('http://localhost:8080/order/query',{method:'GET',})
      .then((res) => res.json())
      .then((data) => {
        setData([...data]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    loadMoreData();
  }, []);
  return (
    <div>
    <Header />
    <div
      id="scrollableDiv"
      style={{
        height: 400,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < 50}
        loader={
          <Skeleton

            paragraph={{
              rows: 1,
            }}
            active
          />
        }
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.id}>
                <Link
                      to={'../orderdetail'}
                      state={{id:item.id}}
                    >
              <List.Item.Meta
                title={<a>{item.id}</a>}
                description={item.id}
              />
              </Link>
              <div>Content</div>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
    <Footer />
    </div>
  );
};
export default Orderoverall;