import React, { Component } from 'react'
import PropTypes from 'prop-types';

import {
  View,
  Dimensions,
  NativeMethodsMixin,
} from 'react-native'

export default class InView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      rectTop: 0,
      rectBottom: 0
    }
  }
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    active: PropTypes.bool,
    delay: PropTypes.number,
    once: PropTypes.bool,
    offset: PropTypes.number
  }

  static defaultProps = {
    active: true,
    delay: 100,
    offset: 0,
    once: false
  }

  onLayout() {
    if (this.props.active) {
      this.startWatching()
    }
  }

  componentWillUnmount() {
    this.stopWatching()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      this.lastValue = null
      this.startWatching()
    } else {
      this.stopWatching()
    }
  }

  startWatching() {
    if (this.interval) { return }
    this.interval = setInterval(event => this.check(), this.props.delay)
  }

  stopWatching() {
    this.interval = clearInterval(this.interval)
  }
  check() {
    let win = Dimensions.get('window')
    let el = this.refs.myview
    let rect = el.measureInWindow((x, y, width, height) => {
      this.setState({
        rectTop: y,
        rectBottom: y + this.props.offset,
        rectWidth: x + width,
      })
    })
    let isVisible = (
      this.state.rectBottom != 0 && this.state.rectTop >= 0 && this.state.rectBottom <= win.height &&
      this.state.rectWidth > 0 && this.state.rectWidth <= win.width
    )

    if (isVisible && this.props.once) {
      this.stopWatching();
    }

    // notify the parent when the value changes
    if (this.lastValue !== isVisible) {
      this.lastValue = isVisible
      this.props.onChange(isVisible)
    }
  }

  render() {
    return (
      <View ref="myview" {...this.props} onLayout={event => this.onLayout(event)}>
        {this.props.children}
      </View>
    )
  }
}

