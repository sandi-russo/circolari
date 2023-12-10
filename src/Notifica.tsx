import React, { useEffect, useState } from 'react';
import { notification, Space, Button, Modal, QRCode, FloatButton } from 'antd';
import logo from './assets/Logo.png';
import './style.scss';

const close = () => {
  console.log(
    'Notification was closed. Either the close button was clicked or duration time elapsed.',
  );
};

const App: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [isFloatButtonEnabled, setIsFloatButtonEnabled] = useState(true);

  const openNotification = () => {
    const key = `open${Date.now()}`;
    const isMobile = window.innerWidth <= 768;

    const btn = (
      <Space>
        <Button
          type="default"
          size="small"
          onClick={() => {
            api.destroy();
            setTimeout(() => {
              if (isMobile) {
                setModalContent(
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <a
                      href="https://t.me/VERONATRENTOBOT"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button type="default" style={{ border: '1px solid #0088cc', display: 'flex', alignItems: 'center' }}>
                        <i className='bx bxl-telegram' style={{ marginRight: '5px', fontSize: '24px' }}></i>
                        Apri Telegram
                      </Button>
                    </a>
                  </div>
                );
              } else {
                setModalContent(
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <QRCode value="https://t.me/VERONATRENTOBOT" icon={logo} />
                    <Button
                      type="default"
                      style={{ marginTop: '10px', border: '1px solid #0088cc', display: 'flex', alignItems: 'center' }}
                      onClick={() => {
                        window.open('https://t.me/VERONATRENTOBOT', '_blank');
                        setModalContent(null);
                      }}
                    >
                      <i className='bx bxl-telegram' style={{ marginRight: '5px', fontSize: '24px' }}></i>
                      Apri Telegram
                    </Button>
                  </div>
                );
              }
            }, 500);
          }}
        >
          {isMobile ? 'Mostra Bottone' : 'Mostra QR Code'}
        </Button>
        <Button
          type="default"
          size="small"
          onClick={() => {
            api.destroy(key);
            localStorage.setItem('showNotification', 'false');
          }}
        >
          Non visualizzare più
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => api.destroy(key)}
        >
          Chiudi
        </Button>
      </Space>
    );

    api.open({
      message: <div><b>🚀 Novità dal nostro Bot Telegram!</b></div>,
      description: (
        <div>
          <p>📚 Il nostro Bot su Telegram è ora online!</p>
          <p>Resta sempre aggiornato sull'orario e le circolari scolastiche.</p>
          <p>🌟 Abbiamo migliorato e semplificato il bot per rendere la tua esperienza migliore.</p>
          <p>Stiamo lavorando su tante altre fantastiche funzionalità, come un orario personalizzato e l'integrazione con le API di Google.</p>
          <p>Non perderti le prossime novità! 🚀</p>
        </div>
      ),
      btn,
      key,
      onClose: () => {
        close();
        setIsFloatButtonEnabled(true); // Rendi il pulsante nuovamente premibile quando la notifica si chiude
      },
      duration: 15,
    });

    setIsFloatButtonEnabled(false);

  };



  useEffect(() => {
    // Controlla se è stato salvato uno stato precedentemente
    const shouldShowNotification = localStorage.getItem('showNotification') !== 'false';

    // Chiudi qualsiasi notifica precedente
    api.destroy();

    // Mostra la notifica solo se dovrebbe essere mostrata
    if (shouldShowNotification) {
      openNotification();
    }
  }, []); // Questo effetto si eseguirà solo una volta all'avvio del componente

  return (
    <>
      {contextHolder}
      {modalContent && (
      <div className="modal-container">
        <Modal
          title="Collegati al nostro Bot Telegram"
          style={{ textAlign: 'center' }}
          visible={modalContent !== null} // Usa true per renderlo sempre visibile
          onOk={() => setModalContent(null)}
          onCancel={() => setModalContent(null)}
          centered
          footer={null}
        >
          {modalContent}
        </Modal>
      </div>
    )}
      <FloatButton
        style={{
          width: '55px',
          height: '55px',
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          border: '1px solid rgba(0, 0, 0, 0.10)',
        }}
        icon={<i className='bx bxl-telegram' style={{ fontSize: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', }}></i>}
        onClick={isFloatButtonEnabled ? openNotification : undefined} // Aggiungi una condizione per l'onClick
      />

    </>
  );
};

export default App;
