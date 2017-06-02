import React from 'react';

const Title = ({todoCount}) => {
    return (
        <div>
            <h1>to-do ({todoCount})</h1>
        </div>
    );
};

const TodoForm = ({addTodo}) => {
    let input;

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            addTodo(input.value);
            input.value = '';
        }}>
            <input className="form-control col-md-12" ref={node => {
                input = node;
            }} />
            <br />
        </form>
    );
};

const Todo = ({todo, remove}) =>
    (<a href="#" className="list-group-item" onClick={() => {remove(todo.id)}}>{todo.value}</a>);

const List = ({todos, remove}) => {
    let allTodos = [];

    if(todos.length > 0) {
        allTodos = todos.map(todo => {
            // passing todo and remove method reference
            return (<Todo todo={todo} remove={remove} />);
            //return (<p>{todo.value}</p>);
        });
    } else {
        allTodos.push(<h3 id="acu">All caught up !</h3>);
    }

    return (
        <div id="list" className="list-group" style={{marginTop:'30px'}}>
            {allTodos}
        </div>
    );
};

export default class App extends React.Component {
    constructor(){
        super();
        const localData = localStorage.todos && JSON.parse(localStorage.todos);
        this.state = {
            data: localData
        };

        this.addTodo = this.addTodo.bind(this);
        this.removeTodo = this.removeTodo.bind(this);
    }

    updateLocalStorage() {
        if (typeof(Storage) !== "undefined")
            localStorage.todos = JSON.stringify(this.state.data);
    }

    addTodo(value) {
        let id = Number(localStorage.count);
        localStorage.count = Number(localStorage.count) + 1;

        const todo = {
             value,
             id
        };

        this.setState({
            data: this.state.data.concat([todo])},
            () => {
            // update localStorage
            this.updateLocalStorage();
        });

    }

    removeTodo(id) {
        this.setState({
            data: this.state.data.filter(todo => todo.id !== id)
        }, () => {
            // update localStorage
            this.updateLocalStorage();
        });
    }

    componentDidMount() {
        localStorage.clear();
        if (!localStorage.todos) {
            localStorage.todos = JSON.stringify(this.state.data);
        }
        if (!localStorage.count) {
            localStorage.count = 0;
        }

    }

    render() {
        return (
            <div  className="col-md-8 col-md-offset-2">
                <Title todoCount={this.state.data.length}/>
                <TodoForm addTodo={this.addTodo.bind(this)}/>
                <List todos={this.state.data} remove={this.removeTodo} />
            </div>
        );
    }

}