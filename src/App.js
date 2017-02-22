import React, { Component } from 'react'
import { Router, Route, hashHistory } from 'react-router'
import {PageHeader, Grid, Row, Col, ListGroup, ListGroupItem} from 'react-bootstrap'
import 'whatwg-fetch'
import './App.css'

class UserList extends Component {

  render () {
    console.log(Object.values(this.props.users))
    return (
      <ListGroup className='users'>
        {Object.values(this.props.users).map(function (user) {
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

class UserRepoList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      repos: []
    }
  }

  componentDidMount () {
    let user = this.props.user
    let component = this
    if (user) {
      fetch(user.repos_url)
      .then(function (response) {
        return response.json()
      })
      .then(function (repos) {
        component.setState({
          repos: repos
        })
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    let user = nextProps.user
    let component = this
    if (user) {
      fetch(user.repos_url)
      .then(function (response) {
        return response.json()
      })
      .then(function (repos) {
        component.setState({
          repos: repos
        })
      })
    }
  }

  render () {
    return (
      <ListGroup >
        {this.state.repos.map(function (repo) {
          return (<ListGroupItem key={repo.id} href={repo.homepage || repo.html_url}>{repo.name}</ListGroupItem>)
        })}
      </ListGroup>
    )
  }
}

class User extends Component {

  render () {
    const user = this.props.users[this.props.params.id]

    if (user) {
      return (
        <section className='user-profile'>
          <h2>{user.login}</h2>
          <img alt={user.login} src={user.avatar_url} height='100' />
          <UserRepoList user={user} />
        </section>
      )
    } else {
      return (
        <p>Unfortunately there is no user information!</p>
      )
    }
  }
}

class App extends Component {

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
          users: users.reduce(function (memo, user) {
            memo[user.id] = user
            return memo
          },
          {})
        })
      })
  }

  render () {
    return (
      <div className='App'>
        <Grid>
          <PageHeader> code42 <a href='https://github.com/code42/'>is on GitHub</a></PageHeader>
          <Row className='show-grid'>
            <Col xs={3} md={3}>
              <UserList users={this.state.users} />
            </Col>
            <Col xs={9} md={9}>
              <Router history={hashHistory}>
                <Route path='/' component={About} />
                <Route path='/:id' component={(props) => (<User params={props.params} users={this.state.users} />)} />
              </Router>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default App
