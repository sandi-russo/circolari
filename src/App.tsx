import { useState } from 'react';
import Navbar from './Navbar';
import Tabella from './Tabella';
import Notifica from './Notifica';
import './style.scss';
import { Layout, FloatButton } from 'antd';

const { Content } = Layout;

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Layout>
      <Navbar onSearch={handleSearch} />
      <Layout>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            backgroundColor: 'white',
            marginTop: '5rem',
            width: '100%'
          }}
          className='content'
        >
          <Notifica></Notifica>
          <Tabella searchQuery={searchQuery} />
        </Content>
        <FloatButton.BackTop
          style={{
            width: '55px',
            height: '55px',
            position: 'fixed',
            bottom: '10px',
            right: '80px',
            border: '1px solid rgba(0, 0, 0, 0.10)',
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      </Layout>
    </Layout>
  );
}

export default App;
