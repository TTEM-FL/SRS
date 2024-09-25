import React from 'react';
import PropTypes from 'prop-types';

import Tippy from '@tippyjs/react';

import css from './index.scss';

class StandardTooltip extends React.Component {
  static propTypes = {
    tooltipEl: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.oneOf([null])]),
    children: PropTypes.any,

    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tooltipProps: PropTypes.object,
  }

  static defaultProps = {
    children: null,
    tooltipProps: {},
    width: 200
  }

  render = () =>
    <Tippy
      content={<div style={{ fontSize: 12, width: this.props.width, maxWidth: '100%' }}>{this.props.tooltipEl}</div>}
      className="standard-tooltip -bright"
      {...this.props.tooltipProps}
    >
      {
        this.props.children ?
          this.props.children :
          <button type="button" className={css.standardTooltipButton}>
            <i className="material-icons">info</i>
          </button>
      }
    </Tippy>
}

export default StandardTooltip;
