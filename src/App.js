import React, { Component } from 'react'
import { Router, Route, hashHistory } from 'react-router'
import {PageHeader, Grid, Row, Col, ListGroup, ListGroupItem, Image, Glyphicon, Well} from 'react-bootstrap'
import 'whatwg-fetch'
import './App.css'

class UserList extends Component {

  render () {
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
      <section className='about'>
        <h2>Thank You!</h2>
        <p>Thank you for giving me this opportunity to demonstrate my skills as a front-end developer.</p>
      </section>
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
    console.log(nextProps.user)
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
      <Well >
        <h3>Public Repositories</h3>
        <ListGroup className='user-repo-list' >
          {this.state.repos.map(function (repo) {
            return (<ListGroupItem key={repo.id} href={repo.homepage || repo.html_url}>{repo.name}</ListGroupItem>)
          })}
        </ListGroup>
      </Well>
    )
  }
}

class User extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    const user = this.props.users[this.props.params.id]
    let component = this
    this.setState({
      user: user,
      userData: null
    })
    if (user) {
      fetch(user.url)
      .then(function (response) {
        return response.json()
      })
      .then(function (userData) {
        component.setState({
          userData: userData
        })
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    const user = nextProps.users[nextProps.params.id]
    let component = this
    this.setState({
      user: user,
      userData: null
    })
    if (user) {
      fetch(user.url)
      .then(function (response) {
        return response.json()
      })
      .then(function (userData) {
        component.setState({
          userData: userData
        })
      })
    }
  }

  render () {
    const user = this.state.user
    const userData = this.state.userData

    if (user && userData) {
      return (
        <section className='user-profile'>
          <a className='close' href='#/'><Glyphicon glyph='remove' /></a>
          <h2>{user.login}</h2>
          <Image alt={user.login} src={user.avatar_url} rounded height='100' />
          <p>{userData.location}</p>
          <p>{userData.email}</p>
          <p>Joined on {userData.created_at.substr(0, 10)}</p>
          <UserRepoList user={user} />
        </section>
      )
    } else {
      return (
        <p>Loading...</p>
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
