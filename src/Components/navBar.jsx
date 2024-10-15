import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
const items = [
  {
    key: 'sub4',
    label: 'My Students',
    icon: <SettingOutlined />,
    children: [
      {
        key: '9',
        label: 'Johnny',
      },
      {
        key: '10',
        label: 'Bobby',
      },
      {
        key: '11',
        label: 'Billy',
      },
      {
        key: '12',
        label: 'Kenny',
      },
    ],
  },
  {
    key: 'grp',
    label: 'Settings',
    type: 'group',
    children: [
      {
        key: '13',
        label: 'Help',
      },
      {
        key: '14',
        label: 'Logout',
      },
    ],
  },
];
const NavBar = () => {
  const onClick = (e) => {
    console.log('click ', e);
  };
  return (
    <Menu
      onClick={onClick}
      style={{
        height: '100vh',
        width: 256,
        position: 'fixed',
        top: 0,
        left: 0,
      }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};
export default NavBar;