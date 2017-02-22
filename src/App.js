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
        <p>This was my first time using some of these technologies.</p>
        <ul>
          <li><p><strong>React</strong>: Although I've worked on a few projects with React-derived ClojureScript libraries <a href='https://github.com/reagent-project/reagent'>reagent</a> and <a href='https://github.com/Day8/re-frame/'>re-frame</a>, I'd never worked with React in JavaScript before. Not only did I use JSX for the first time (not terribly painful!), I also had to learn a different system of data flow (<code>props</code> and <code>this.setState</code> are quite unlike how things work in re-frame). In order to minimize the workflow overhead, I used Facebook's drop-dead simple <a href='https://github.com/facebookincubator/create-react-app'>create-react-app</a> template to scaffold it out and load up the dependencies. Thus, I have yet to get involved in the intricacies of Babel or webpack. I also had to learn to use react-router. I decided not to further complicate things by including redux (although I optimistically installed it as a dependency), even though I'm sure it provides a more elegant solution to the aforementioned data flow. There is so little data, however, I thought it easier to make do.</p></li>
          <li><p><strong>fetch</strong>: Although I know in my heart of hearts that keeping jQuery around just for <code>$.ajax</code> is at best lazy and at worst perverse, I'm usually in environments that have jQuery around for legacy reasons anyway, so I've never forced myself to explore JavaScript alternatives to AJAX handling (although of course in ClojureScript there's a third way altogether). Fetch was surprisingly simple, although the apparently idiomatic (as per GitHub's docs) usage of piping processed data through successive <code>then</code>s surprised me and seems unnecessary.</p></li>
        </ul>

        <h4>Post Mortem</h4>
        <p>I really enjoyed using React. I've long been a devotee of functional programming, and seek to use concepts like pure functions and immutability in everything I do. JavaScript doesn't always make it easy (although it easier than in <em>some</em> languages!), but React makes using them for UI updates, at least, feel completely natural, sane, and manageable.</p>
        <p>That said, there were some things I found less than elegant—owing, no doubt, to my own ignorance. For instance, it was necessary for me to make GitHub API calls whenever the user changed. I ended up having to do this in both the <code>componentDidMount</code> and <code>componentWillGetProps</code> methods of both the <code>User</code> and <code>UserRepoList</code> components. Even factoring these calls out into a separate function and passing them the appropriate props, there remains an unpleasant redundancy. I expect there is a more satisying solution to be found, given that it seems like a common pattern, but I could not find it myself.</p>
        <p>Additionally, I encountered a problem whereby my <code>User</code> component would sometimes (for instance, if refreshing the page while viewing a specific user) be required to render when the user in question was undefined (because the initial call to load the users hadn't completed). My first instinct, to check for an undefined user in the <code>User.render</code> method, proved rather ungainly as the app grew in complexity.</p>
        <p>Despite these small drawbacks, I am very pleased with React and proud of my little experimental application. I hope you will agree it is nicely architechted, reasonably featureful, and not terrible to look at. I reiterate my gratitude for having had this opportunity, for not only have I demonstrated to my own satisfaction the kind of coding sensibility I would bring to Code42, but I've learned a very useful skill as well. Thank you!</p>

        <p>Cheers,</p>
        <p>[C. Warren] Dale</p>

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
    const user = this.props.user
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
    const user = nextProps.user
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
          <p>{userData.name}</p>
          <p>{userData.location}</p>
          <a href={'mailto:' + userData.email}>{userData.email}</a>
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
          <PageHeader> Code42 <a href='https://github.com/code42/'>is on GitHub</a></PageHeader>
          <Row className='show-grid'>
            <Col xs={3} md={3}>
              <UserList users={this.state.users} />
            </Col>
            <Col xs={9} md={6}>
              <Router history={hashHistory}>
                <Route path='/' component={About} />
                <Route path='/:id' component={(props) => (<User params={props.params} user={this.state.users[props.params.id]} />)} />
              </Router>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default App
