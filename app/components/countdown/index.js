import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Component from '../base';
import { Button } from 'antd-mobile'
import { setTimeout } from 'timers';
import dantejs, { Timer } from 'dantejs';


export default class CountdownButton extends Component {

    constructor(props) {
        super(props);
        this.interval = null;
        this.onClick = this.onClick.bind(this);
    }

    /**
     * 组件props类型定义
     */
    static propTypes = {
        //倒计时显示的模板
        format: PropTypes.string,
        timerCls:PropTypes.string,
        total: 10,
    }

    /**
     * 组件默认props
     */
    static defaultProps = {
        format: '{0}',
        timerCls:'timing',
        total: 3,
    }

    onClick() {
        if (this.interval) {
            return;
        }
        const btnDOM = ReactDOM.findDOMNode(this.refs.button);
        const { format, total, onClick,timerCls="" } = this.props;
        const innerHTML = btnDOM.innerHTML;
        let currency = 0;
        this.interval = setInterval(() => {
            if (currency >= total) {
                btnDOM.innerHTML = innerHTML
                clearInterval(this.interval);
                btnDOM.classList.remove(timerCls);
                return this.interval = null;
            }
            currency++;
            btnDOM.classList.add(timerCls)
            btnDOM.innerHTML = dantejs.String.format(format, currency);
        }, 1000)
        if (dantejs.Type.isFunction(onClick)) {
            onClick.apply(this, arguments);
        }
    }

    render() {
        return (
            <Button ref="button" {...this.props} onClick={this.onClick} />
        )
    }
}