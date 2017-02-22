import React, { Component } from 'react'
import { Router, Route, hashHistory } from 'react-router'
import {PageHeader, Grid, Row, Col, ListGroup, ListGroupItem} from 'react-bootstrap'
import 'whatwg-fetch'
import './App.css'

class UserList extends Component {

  constructor (props) {
    super(props)
    this.state = {users: []}
  }

  componentDidMount () {
    var component = this
    fetch('https://api.github.com/orgs/code42/public_members')
      .then(function (response) {
        return response.json()
      })
      .then(function (users) {
        component.setState({
          users: users
        })
      })
  }

  render () {
    return (
      <ListGroup className='users'>
        {this.state.users.map(function (user) {
          return <ListGroupItem key={user.id} href={'#/' + user.id} className='user'>{user.login}</ListGroupItem>
        })}
      </ListGroup>
    )
  }
}

class About extends Component {
  render () {
    return (
      <p>Hullo!</p>
    )
  }
}

class User extends Component {
  render () {
    return (
      <p>{this.props.params.id}!</p>
    )
  }
}

class App extends Component {
  render () {
    return (
      <div className='App'>
        <Grid>
          <PageHeader> code42 <a href='https://github.com/code42/'>is on GitHub</a></PageHeader>
          <Row className='show-grid'>
            <Col xs={3} md={3}>
              <UserList />
            </Col>
            <Col xs={9} md={9}>
              <Router history={hashHistory}>
                <Route path='/' component={About} />
                <Route path='/:id' component={User} />
              </Router>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default App
