import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'; 
import { Container } from 'semantic-ui-react'

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { AuthProvider } from './context/auth'
import AuthRoute from './util/AuthRoute'

import Nav from './components/Nav';
import Home from './routes/Home'
import Login from './routes/Login'
import Register from './routes/Register'
import SinglePost from './routes/SinglePost'

// wrap in provider, wrapped components recieve context
function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <Nav />
          <Route exact path='/' component={Home}/>
          <AuthRoute exact path='/login' component={Login}/>
          <AuthRoute exact path='/register' component={Register}/>
          <Route exact path='/posts/:postId' component={SinglePost}/>

        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
