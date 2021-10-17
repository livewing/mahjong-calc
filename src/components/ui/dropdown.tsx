import React, { useState } from 'react';
import { usePopper } from 'react-popper';
import { BEM } from '../../lib/bem';
import type { VFC } from 'react';
import type { Placement } from '@popperjs/core';

const bem = BEM('dropdown');

interface DropdownProps {
  children?: React.ReactNode;
  button?: React.ReactNode;
  show?: boolean;
  setShow?: (show: boolean) => void;
  placement: Placement;
}

export const Dropdown: VFC<DropdownProps> = ({
  children,
  button,
  show,
  setShow,
  placement
}) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [popper, setPopper] = useState<HTMLDivElement | null>(null);
  const [arrow, setArrow] = useState<HTMLDivElement | null>(null);
  const { attributes, styles } = usePopper(container, popper, {
    modifiers: [{ name: 'arrow', options: { element: arrow } }],
    placement
  });

  return (
    <div className={bem()}>
      <div
        ref={setContainer}
        className={bem('button')}
        onClick={() => setShow && setShow(true)}
      >
        {button}
      </div>
      {show && (
        <div className={bem('bg')} onClick={() => setShow && setShow(false)}>
          <div
            ref={setPopper}
            className={bem('body')}
            style={styles.popper}
            {...attributes.popper}
            onClick={e => e.stopPropagation()}
          >
            {children}
            <div ref={setArrow} className={bem('arrow')} />
          </div>
        </div>
      )}
    </div>
  );
};
