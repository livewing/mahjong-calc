import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/container';
import { BEM } from '../../lib/bem';
import { Button } from './button';
import type { FC } from 'react';

const bem = BEM('config');

interface ConfigRowProps {
  name: React.ReactNode;
}

export const ConfigRow: FC<ConfigRowProps> = ({ name, children }) => (
  <tbody>
    <tr>
      <td>{name}</td>
      <td>{children}</td>
    </tr>
  </tbody>
);

interface ConfigProps {
  header: React.ReactNode;
  fixedWidth?: undefined | boolean;
  onReset?: undefined | (() => void);
}

export const Config: FC<ConfigProps> = ({
  header,
  fixedWidth,
  onReset,
  children
}) => {
  const { t } = useTranslation();

  return (
    <Container header={header}>
      <div className={bem()}>
        <table
          className={bem('table', (fixedWidth && 'fixed-width') || void 0)}
        >
          {children}
        </table>
      </div>
      {onReset && (
        <Button modifier="danger" onClick={onReset}>
          {t('ui.reset')}
        </Button>
      )}
    </Container>
  );
};
