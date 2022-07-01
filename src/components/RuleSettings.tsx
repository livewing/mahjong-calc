import { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCheck, MdDelete, MdMenu, MdSave } from 'react-icons/md';
import { useStore } from '../contexts/store';
import { compareRules } from '../lib/rule';
import { Dropdown } from './ui/Dropdown';
import { RuleEditor } from './ui/RuleEditor';

export const RuleSettings: FC = () => {
  const [{ currentRule, savedRules }, dispatch] = useStore();
  const [openPresetMenu, setOpenPresetMenu] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const { t } = useTranslation();

  const ruleName = Object.entries(savedRules).find(([, r]) =>
    compareRules(r, currentRule)
  )?.[0];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Dropdown
          label={
            <div className="p-1">
              <MdMenu />
            </div>
          }
          open={openPresetMenu}
          onSetOpen={setOpenPresetMenu}
        >
          <div className="flex flex-col py-1">
            {Object.keys(savedRules).length === 0 && (
              <div className="flex items-center gap-2 p-2">
                <MdCheck className="invisible" />
                <div className="select-none text-neutral-500">
                  {t('settings.empty')}
                </div>
              </div>
            )}
            {Object.entries(savedRules)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([name, rule]) => (
                <div key={name} className="flex">
                  <button
                    className="group peer flex flex-1 items-center gap-2 overflow-hidden p-2 hover:bg-blue-500 hover:text-white"
                    onClick={() => {
                      dispatch({ type: 'set-current-rule', payload: rule });
                      setOpenPresetMenu(false);
                    }}
                  >
                    <MdCheck
                      className={
                        name === ruleName
                          ? 'visible text-blue-600 group-hover:text-white dark:text-blue-400'
                          : 'invisible'
                      }
                    />
                    <div className="flex-1 truncate text-left" title={name}>
                      {name}
                    </div>
                  </button>
                  <button
                    className="flex items-center justify-center px-3 hover:bg-red-500 hover:text-white peer-hover:bg-blue-500 peer-hover:text-white"
                    onClick={() =>
                      dispatch({ type: 'delete-saved-rule', payload: name })
                    }
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            {typeof ruleName === 'undefined' && (
              <>
                <div className="my-1 border-t border-neutral-300 dark:border-neutral-700" />
                <div className="flex items-center gap-2 px-2">
                  <MdCheck className="invisible" />
                  <div className="select-none pt-1 text-sm text-neutral-500">
                    {t(
                      typeof savedRules[newRuleName] === 'undefined'
                        ? 'settings.save-as'
                        : 'settings.overwrite-save'
                    )}
                  </div>
                </div>
                <div className="group flex items-center gap-2 p-2">
                  <MdCheck className="invisible" />
                  <input
                    type="text"
                    size={1}
                    placeholder={t('settings.name')}
                    className="w-full rounded-md border border-neutral-300 bg-white p-1 transition dark:border-neutral-700 dark:bg-black"
                    onInput={e => setNewRuleName(e.currentTarget.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && newRuleName.length !== 0) {
                        dispatch({
                          type: 'save-current-rule',
                          payload: newRuleName
                        });
                        setNewRuleName('');
                        e.preventDefault();
                      }
                    }}
                  />
                  <button
                    className="flex items-center justify-center rounded-md p-2 hover:bg-blue-500 hover:text-white disabled:text-neutral-500 disabled:hover:bg-transparent disabled:hover:text-neutral-500"
                    disabled={newRuleName.length === 0}
                    onClick={() => {
                      dispatch({
                        type: 'save-current-rule',
                        payload: newRuleName
                      });
                      setNewRuleName('');
                    }}
                  >
                    <MdSave />
                  </button>
                </div>
              </>
            )}
          </div>
        </Dropdown>
        <div
          className="truncate font-bold"
          title={ruleName ?? t('settings.untitled-rule')}
        >
          {ruleName ?? t('settings.untitled-rule')}
        </div>
      </div>
      <div className="border-t border-neutral-300 dark:border-neutral-700" />
      <RuleEditor
        rule={currentRule}
        onChange={rule => dispatch({ type: 'set-current-rule', payload: rule })}
      />
    </div>
  );
};
