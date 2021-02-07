import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Container } from './ui/container';
import { Button } from './ui/button';
import { BEM } from '../lib/bem';

const bem = BEM('notify-update');

export const NotifyUpdate: FC = () => {
  const [showNotification, setShowNotification] = useState(false);
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
      <Container header="アップデート" modifier="warning">
        <p>
          アップデートがあります。再読み込みすると、アップデートが適用されます。
        </p>
        <div className={bem('buttons')}>
          <Button onClick={() => location.reload()} modifier="primary">
            再読み込み
          </Button>
          <Button onClick={() => setShowNotification(false)}>閉じる</Button>
        </div>
      </Container>
    </div>
  );
};
