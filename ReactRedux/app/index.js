import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Routes} from  './routes';
import {Router, browserHistory} from 'react-router'
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import rootReducer from './reducers/';
import thunk from 'redux-thunk' 

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render((
    < Provider store={store}>
        <Router routes={Routes} history={browserHistory}/>
    </Provider>
), document.getElementById('root'));




// Жизненный цикл компонента

// class App extends Component {
//
//   // Метод вызовется перед установкой компонента в DOM
//   componentWillMount() {
//     console.log('I\'m going into DOM');
//   }
//
//   // Метод вызовется после установки компонента в DOM
//   componentDidMount() {
//     console.log('I\'m in DOM');
//     // setTimeout(() => this.setState({ message: 'Updated with state'}), 1000);
//   }
//
//   // Метод вызовется перед извлечения компонента из DOM
//   componentWillUnmount() {
//     console.log('I\'m going out of DOM');
//   }
//
//   // Метод вызовется при получении новых свойств
//   componentWillReceiveProps(nextProps) {
//     console.log('I\'m going to receive props', nextProps);
//   }
//
//   // Метод вызовется перед каждым обновлением компонента
//   // для того, что бы решить, должен ли компонент обновиться
//   shouldComponentUpdate(nextProps, nextState) {
//     console.log('Should I re-render?');
//     return true;
//   }
//
//   // Метод вызовется перед обновлением компонента и после SCU
//   componentWillUpdate(nextProps, nextState) {
//     console.log('I\'m going to re-render');
//   }
//
//   // Метод вызовется после обновления компонента
//   componentDidUpdate(prevProps, prevState) {
//     console.log('I\'ve just re-rendered');
//   }
//
//   render() {
//     return (
//       <div>
//         <h1>{this.props.title}</h1>
//       </div>
//     );
//   }
// };
//
// ReactDOM.render(<App title='React' />, document.querySelector('.app'));
//
// setTimeout(function() {
//   ReactDOM.render(<App title='Updated with props' />, document.querySelector('.app'));
// }, 2000);
