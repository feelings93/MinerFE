import { PieChartOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import Mine from './pages/mine';
import 'react-toastify/dist/ReactToastify.css';
const queryClient = new QueryClient();

const { Header, Content, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [getItem('Mine', '1', <PieChartOutlined />)];

// rowSelection object indicates the need for row selection

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Layout
          style={{
            minHeight: '100vh',
          }}
        >
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <div
              style={{
                height: 32,
                margin: 16,
                background: 'rgba(255, 255, 255, 0.2)',
              }}
            />
            <Menu
              theme='dark'
              defaultSelectedKeys={['1']}
              mode='inline'
              items={items}
            />
          </Sider>
          <Layout className='site-layout'>
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
              }}
            />
            <Content
              style={{
                margin: '0 16px',
              }}
            >
              <Mine />
            </Content>
          </Layout>
        </Layout>
      </QueryClientProvider>
      <ToastContainer />
    </>
  );
};
export default App;
