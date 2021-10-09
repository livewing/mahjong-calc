import React from 'react';
import { useTranslation } from 'react-i18next';
import { is_complete_input } from '../lib/hand';
import { Container } from './ui/container';
import { generate_result } from '../lib/result';
import { HoraItem } from './hora-item';
import type { FC } from 'react';
import type { HandInput } from '../lib/hand';
import type { HandConfig, RuleConfig, TableConfig } from '../lib/config';

interface ResultProps {
  tableConfig: TableConfig;
  handInput: HandInput;
  handConfig: HandConfig;
  ruleConfig: RuleConfig;
}

export const Result: FC<ResultProps> = ({
  tableConfig,
  handInput,
  handConfig,
  ruleConfig
}) => {
  const { t } = useTranslation();

  const result = is_complete_input(handInput)
    ? generate_result(handInput, tableConfig, handConfig, ruleConfig)
    : void 0;

  if (typeof result === 'undefined') {
    return (
      <Container
        header={`${t('result.result')}: ${t('result.no-input')}`}
        modifier="danger"
      >
        <p>{t('result.no-input-message')}</p>
      </Container>
    );
  }
  if (!result.tempai) {
    return (
      <Container
        header={`${t('result.result')}: ${t('result.noten')}`}
        modifier="warning"
      >
        <p>
          {t('result.mentsu-hand')}:{' '}
          {t('result.shanten', { count: result.shanten })}
        </p>
        {typeof result.shantenChitoitsu === 'number' && (
          <p>
            {t('result.chitoitsu-hand')}:{' '}
            {t('result.shanten', { count: result.shantenChitoitsu })}
          </p>
        )}
        {typeof result.shantenKokushi === 'number' && (
          <p>
            {t('result.kokushi-hand')}:{' '}
            {t('result.shanten', { count: result.shantenKokushi })}
          </p>
        )}
      </Container>
    );
  }
  if (result.hora.length === 0) {
    return (
      <Container
        header={`${t('result.result')}: ${t('result.noten')}`}
        modifier="warning"
      >
        <div>{t('result.no-hora-tiles')}</div>
      </Container>
    );
  }
  return (
    <Container
      header={`${t('result.result')}: ${t('result.tempai')}`}
      modifier="primary"
    >
      {result.hora.map((h, i) => (
        <HoraItem
          key={i}
          hora={h}
          tableConfig={tableConfig}
          ruleConfig={ruleConfig}
        />
      ))}
    </Container>
  );
};
