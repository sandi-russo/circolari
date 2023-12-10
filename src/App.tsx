// App.tsx
import React from 'react';
import { useState } from 'react';
import Navbar from './Navbar';
import Tabella from './Tabella';
import Notifica from './Notifica';
import { Layout } from 'antd';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { ToolbarSlot, TransformToolbarSlot, toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';

const { Content, Sider } = Layout;

const App: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Open: () => <></>,
    OpenMenuItem: () => <></>,
    Print: () => <></>,
    PrintMenuItem: () => <></>,
    Download: () => <></>,
    DownloadMenuItem: () => <></>,
    EnterFullScreen: () => <></>,
    EnterFullScreenMenuItem: () => <></>,
    SwitchTheme: () => <></>,
    SwitchThemeMenuItem: () => <></>,
    ShowProperties: () => <></>,
    ShowPropertiesMenuItem: () => <></>,
    SwitchScrollMode: () => <></>,
    SwitchScrollModeMenuItem: () => <></>,
    SwitchSelectionMode: () => <></>,
    SwitchSelectionModeMenuItem: () => <></>,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Layout hasSider style={{ background: 'white' }}>
      <Navbar onSearch={handleSearch} />

      <Sider
        theme='light'
        breakpoint='md'
        collapsed={collapsed}
        onCollapse={(collapsed) => setCollapsed(collapsed)}
        width={'40%'}
        style={{ overflow: 'auto', height: '100vh', position: 'fixed', right: 0, top: '75px', transition: 'width 0.4s'}}
      >
        {/* Visualizzatore PDF */}
        {pdfUrl ? (
          <Worker workerUrl={"https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"}>
            <div style={{ marginTop: '20px', padding: '0px 12px 0px 12px' }}>
              <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
            </div>
            <div style={{ height: 'calc(90vh - 60px)', overflowY: 'auto', marginTop: '30px' }}>
              <Viewer plugins={[toolbarPluginInstance]} fileUrl={pdfUrl} />
            </div>
          </Worker>
        ) : (
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            textAlign: 'center',
            color: 'gray',
            height: '100vh'
          }}>
            <p>Nessuna circolare selezionata. Premi "<b>Visualizza</b>" per mostrare l'anteprima della circolare.</p>
          </div>
        )}
      </Sider>

      <Content style={{ marginRight: collapsed ? 0 : '40%', marginTop: '75px', padding: 10, transition: 'margin-right 0.4s' }}>
        <Notifica />
        <div style={{ padding: '10px', textAlign: 'left' }}>
          <Tabella searchQuery={searchQuery} setPdfUrl={setPdfUrl} />
        </div>
      </Content>
    </Layout>
  );
};

export default App;