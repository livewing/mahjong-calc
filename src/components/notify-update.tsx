import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from './ui/container';
import { Button } from './ui/button';
import { BEM } from '../lib/bem';
import type { FC } from 'react';

const bem = BEM('notify-update');

export const NotifyUpdate: FC = () => {
  const [showNotification, setShowNotification] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    (async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        registration?.addEventListener('updatefound', () => {
          setShowNotification(true);
        });
      }
    })();
  });

  if (!showNotification) return null;
  return (
    <div className={bem()}>
      <Container header={t('notify-update.title')} modifier="warning">
        <p>{t('notify-update.message')}</p>
        <div className={bem('buttons')}>
          <Button onClick={() => location.reload()} modifier="primary">
            {t('notify-update.reload')}
          </Button>
          <Button onClick={() => setShowNotification(false)}>
            {t('notify-update.close')}
          </Button>
        </div>
      </Container>
    </div>
  );
};
