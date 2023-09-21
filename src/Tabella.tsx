import React, { useEffect, useState } from 'react';
import { List, Button, Empty, Spin } from 'antd';
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

const SegmentedComponent: React.FC<{ ascendingOrder: boolean; toggleOrder: (newOrder: boolean) => void }> = ({
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
    onChange={(value) => {
      if (value === 'Ascending' || value === 'Descending') {
        toggleOrder(!ascendingOrder);
      }
    }}
  />
);

const Tabella: React.FC<TabellaProps> = ({ searchQuery }) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [ascendingOrder, setAscendingOrder] = useState<boolean>(false);

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
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  function scaricaPDF(url: string) {
    const link = document.createElement('a');
    link.href = 'https://vtmod.altervista.org/ParserCircolari/scaricatore.php?nome=' + url;
    link.target = '_blank';
    link.click();
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <SegmentedComponent ascendingOrder={ascendingOrder} toggleOrder={setAscendingOrder} />
        </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
          <Spin size="large" />
        </div>
      ) : (
        sortedData.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <Empty description="Nessuna circolare trovata!" imageStyle={{ height: 80 }} />
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
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
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
  );
};

export default Tabella;
