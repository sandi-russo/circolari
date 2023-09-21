import React, { useEffect, useState } from 'react';
import { notification, Space, Button, Modal, QRCode } from 'antd';
import logo from './assets/Logo.png';

const close = () => {
  console.log(
    'Notification was closed. Either the close button was clicked or duration time elapsed.',
  );
};

const App: React.FC = () => {
  const [api, contextHolder] = notification.useNotification();
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    const key = `open${Date.now()}`;

    // Controlla se è stato salvato uno stato precedentemente
    const shouldShowNotification = localStorage.getItem('showNotification') !== 'false';

    // Chiudi qualsiasi notifica precedente
    api.destroy();

    // Mostra la notifica solo se dovrebbe essere mostrata
    if (shouldShowNotification) {
      const isMobile = window.innerWidth <= 768;

      const btn = (
        <Space>
          <Button
            type="default"
            size="small"
            onClick={() => {
              // Chiudi la notifica con un ritardo prima di aprire il link o il QR code
              api.destroy();
              setTimeout(() => {
                if (isMobile) {
                  // Se sei su un dispositivo mobile, mostra il pulsante
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
                  // Altrimenti, mostra il QR code e il pulsante "Apri Telegram"
                  setModalContent(
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <QRCode value="https://t.me/VERONATRENTOBOT" icon={logo} />
                      <Button
                        type="default"
                        style={{ marginTop: '10px', border: '1px solid #0088cc', display: 'flex', alignItems: 'center'}}
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
              }, 500); // Ritardo di 500 millisecondi
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
            onClick={() => api.destroy()}
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
        onClose: close,
        duration: 15 // 15 secondi per la notifica
      });
    }
  }, []); // Questo effetto si eseguirà solo una volta all'avvio del componente

  return (
    <>
      {contextHolder}
      <Modal
        title="Collegati al nostro Bot Telegram" style={{ textAlign: 'center' }}
        open={modalContent !== null}
        onOk={() => setModalContent(null)}
        onCancel={() => setModalContent(null)}
        centered // Centra il modal orizzontalmente e verticalmente
        footer={null}
      >
        {modalContent}
      </Modal>
    </>
  );
};

export default App;
