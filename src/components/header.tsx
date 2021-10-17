import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoLogoGithub, IoMdHelp } from 'react-icons/io';
import { AiOutlineGlobal } from 'react-icons/ai';
import { Dropdown } from './ui/dropdown';
import { Segment } from './ui/segment';
import { BEM } from '../lib/bem';
import type { FC } from 'react';

const bem = BEM('header');

export const Header: FC = () => {
  const { t, i18n } = useTranslation();
  const languages = Object.keys(i18n.store.data);
  const [show, setShow] = useState(false);
  return (
    <header className={bem()}>
      <h1 className={bem('title')}>{t('header.title')}</h1>
      <div className={bem('link-list')}>
        <div className={bem('link')} title={t('header.language')}>
          <Dropdown
            placement="bottom-end"
            button={<AiOutlineGlobal size="1.5rem" />}
            show={show}
            setShow={setShow}
          >
            <Segment
              items={languages.map(lng =>
                i18n.exists('locale:name', { lng, fallbackLng: [] })
                  ? `${t('locale:name', { lng })} (${lng})`
                  : lng
              )}
              index={languages.indexOf(i18n.language) ?? 0}
              onChanged={i => i18n.changeLanguage(languages[i])}
              direction="vertical"
            />
          </Dropdown>
        </div>
        <a
          className={bem('link')}
          href="https://github.com/livewing/mahjong-calc/blob/main/doc/how-to-use.md"
          target="_blank"
          rel="noopener noreferrer"
          title={t('header.how-to-use')}
        >
          <IoMdHelp size="1.5rem" />
        </a>
        <a
          className={bem('link')}
          href="https://github.com/livewing/mahjong-calc"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
        >
          <IoLogoGithub size="1.5rem" />
        </a>
      </div>
    </header>
  );
};
