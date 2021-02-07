import React from 'react';
import type { FC } from 'react';
import { Container } from '../ui/container';
import { BEM } from '../../lib/bem';
import { Button } from './button';

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
  onReset?: undefined | (() => void);
}

export const Config: FC<ConfigProps> = ({ header, onReset, children }) => (
  <Container header={header}>
    <div className={bem()}>
      <table className={bem('table')}>{children}</table>
    </div>
    {onReset && (
      <Button modifier="danger" onClick={onReset}>
        リセット
      </Button>
    )}
  </Container>
);
