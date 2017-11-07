/**
 * 实现卡片切换页面的视图，用于模拟app的页面切换效果
 * 
 * 用例： 
 *      <StackAnimateView route={path} isForward={forward}>..children...</StackAnimateView>
 */
import React from 'react'
import PropTypes from 'prop-types';

export default class StackAnimateView extends React.PureComponent {

    static propTypes = {
        route: PropTypes.string,
        isForward: PropTypes.bool
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    /**
     * 当属性改变时,切换窗口样式
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.route !== this.props.route) {
            this.setState({ lastChildren: this.props.children })
        }
    }

    /**
   * 当属性改变时,切换窗口样式
   */
    componentDidUpdate(nextProps) {
        this.transitionAnimations();
    }

    /**
     * 播放动画页面进入动画
     */
    transitionAnimations() {
        if (this.state.lastChildren) {
            const { current, prev } = this.refs;
            const activeCls = this.props.isForward ? 'forward' : 'back';
            current.className = "page active " + activeCls;
            prev.className = "page inactive " + activeCls;
            this.bindAnimationEnd(prev, () => {
                this.setState({ lastChildren: undefined });
            })
        }
    }

    /**
     * 绑定元素animationend事件
     */
    bindAnimationEnd(element, callback) {
        function handler() {
            console.log('end animation');
            callback && callback();
        }
        element.addEventListener('webkitAnimationEnd', handler);
        element.addEventListener('animationEnd', handler);
    }

    /**
     * 渲染切换前的视图
     */
    renderPrev() {
        let { lastChildren } = this.state;
        if (lastChildren) {
            return (
                <div ref="prev" className="page">
                    {lastChildren}
                </div>
            )
        }
    }

    /**
     * 渲染组件
     */
    render() {
        return (
            <div className="pages">
                {this.renderPrev()}
                <div ref="current" className="page">
                    {this.props.children}
                </div>
            </div>
        );
    }
}