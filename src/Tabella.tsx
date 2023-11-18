import React, { useEffect, useState } from 'react';
import { List, Button, Empty, Spin, Modal } from 'antd';
import { DownloadOutlined, EyeOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
import './style.scss';

interface DataItem {
  numero: string;
  link: string;
  descrizione: string;
  data: string;
}

interface TabellaProps {
  searchQuery: string;
}

const SegmentedComponent: React.FC<{ ascendingOrder: boolean; toggleOrder: () => void }> = ({
  ascendingOrder,
  toggleOrder,
}) => (
  <Segmented
    options={[
      {
        label: 'Ordine Decrescente',
        value: 'Descending',
        icon: <ArrowDownOutlined />,
      },
      {
        label: 'Ordine Crescente',
        value: 'Ascending',
        icon: <ArrowUpOutlined />,
      },
    ]}
    value={ascendingOrder ? 'Ascending' : 'Descending'}
    onChange={(value) => {
      if (value === 'Ascending' || value === 'Descending') {
        toggleOrder();
      }
    }}
  />
);


const Tabella: React.FC<TabellaProps> = ({ searchQuery }) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [ascendingOrder, setAscendingOrder] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfNumero, setPdfNumero] = useState('');
  const [sortingLoading, setSortingLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 767);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setInitialLoading(true);

        const response = await fetch('https://vtmod.altervista.org/ParserCircolari/Export.php');
        if (response.ok) {
          const responseData = await response.json();
          setData(responseData);
        } else {
          console.error('Errore nella richiesta HTTP:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleOrder = async () => {
    if (!sortingLoading) {
      setSortingLoading(true);
  
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      setSortingLoading(false);
      setAscendingOrder(!ascendingOrder);
    }
  };
  


  const filteredData = data.filter((item) => {
    const { numero, link, descrizione, data } = item;
    const searchTerms = [numero, link, descrizione, data].join(' ').toLowerCase();
    return searchTerms.includes(searchQuery.toLowerCase());
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const numeroA = parseInt(a.numero, 10);
    const numeroB = parseInt(b.numero, 10);
    return ascendingOrder ? numeroA - numeroB : numeroB - numeroA;
  });

  function visualizzaPDF(url: string, numero: string) {
    setPdfUrl(url);
    setPdfNumero(numero);
    setModalVisible(true);
  }

  function scaricaPDF(url: string) {
    const link = document.createElement('a');
    link.href = 'https://vtmod.altervista.org/ParserCircolari/scaricatore.php?nome=' + url;
    link.target = '_blank';
    link.click();
  }

const centerLoadingStyle: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 9999,
};

return (
  <div>
    {initialLoading && (
      <div style={centerLoadingStyle}>
        <Spin spinning={initialLoading} size="large" />
      </div>
    )}



    {!initialLoading && (
      <div>
        <div className={modalVisible ? 'popup-background active' : 'popup-background'}>
          {/* Contenuto sfocato */}
        </div>

        <div className='popup-circolare'>
          <Modal
            title={<p>Circolare numero: <b>{pdfNumero}</b></p>}
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            width="75%"
            destroyOnClose
            centered
          >
            <iframe src={pdfUrl} width="100%" height="650px" frameBorder="0"></iframe>
          </Modal>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <SegmentedComponent ascendingOrder={ascendingOrder} toggleOrder={handleToggleOrder} />
        </div>

        {sortingLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <Spin spinning={sortingLoading} size="large" />
          </div>
        ) : (
          sortedData.length === 0 ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
              <Empty description={<p><b>Nessuna circolare trovata!</b></p>} imageStyle={{ height: 80 }} />
            </div>
          ) : (
            <List
              dataSource={sortedData}
              renderItem={(item) => (
                <List.Item key={item.numero} className="list-item">
                  <div className="list-item-content">
                    <List.Item.Meta
                      title={<a href={item.link} target="_blank" rel="noopener noreferrer">{`Circolare ${item.numero}`}</a>}
                      description={item.descrizione}
                    />
                    {`Data: ${item.data}`}
                  </div>
                  <div className="list-item-actions">
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => visualizzaPDF(item.link, item.numero)}
                      className={`action-button ${isMobile ? 'hidden' : ''}`}
                      style={{ display: isMobile ? 'none' : 'inline-block' }}
                    >
                      <span>Visualizza</span>
                    </Button>
                    <Button icon={<DownloadOutlined />} onClick={() => scaricaPDF(item.numero)} className="action-button">
                      {isMobile ? null : <span>Scarica</span>}
                    </Button>
                  </div>
                </List.Item>
              )}
            />
          )
        )}
      </div>
    )}
  </div>
);

};

export default Tabella;