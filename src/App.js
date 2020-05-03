import React, { Component } from 'react'
import { Pagination } from 'antd';

export default class App extends Component {
  render() {
    return (
      <div>
        <Pagination defaultCurrent={6} total={500} />
      </div>
    )
  }
}
