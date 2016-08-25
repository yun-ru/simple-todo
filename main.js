const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";

class Action {
    addTodo(todo) {
        return {type: ADD_TODO, todo}
    }
    removeTodo(id){
        return {type: REMOVE_TODO, id}
    }
}

class Store {
    constructor() {
        this.state = {
            title: "Simple Todo",
            todos: [
                {
                    id: Date.now(),
                    title: "Have a good time",
                    finished: false
                }
            ]
        }
    }
    dispatch(action) {
        switch(action.type){
            case ADD_TODO:
                return this.state =
                    Object.assign({},this.state,{todos:
                        this.state.todos.concat([{id: Date.now(), title: action.todo, finished: false}])
                    });
            case REMOVE_TODO:
                return this.state =
                    Object.assign({},this.state,{todos:
                        this.state.todos.map(todo=>{
                            if(todo.id === action.id){
                                todo.finished = !todo.finished;
                                return todo;
                            }else{
                                return todo;
                            }
                        })
                    });

            default:
                return this.state;
        }
    }
}


var store = new Store();
var action = new Action();

class Main {
    init() {
        this.cacheDom();
        this.eventBinding();
    }
    cacheDom() {
        this.$title = $("#title");
        this.$todoList = $("#todoList");
        this.$myInput = $("#myInput");
        this.$myBtn = $("#myBtn");
        this.template = $("#template").html();
    }
    eventBinding() {
        $(window).on("load",this.render.bind(this));
        this.$myBtn.on("click",this.handleSubmit.bind(this));
        this.$myInput.on("keyup",e=>{e.keyCode===13 && this.handleSubmit()});
        this.$todoList.on("click",".delete",e=>this.removeTodo(e))
    }
    removeTodo(e) {
        const id = $(e.target).data("id");
        store.dispatch(action.removeTodo(id));
        this.render();
    }
    handleSubmit() {
        const todo = this.$myInput.val();
        store.dispatch(action.addTodo(todo));
        this.$myInput.val("");
        this.render();
    }
    render() {
        this.$title.text(store.state.title);
        this.$todoList.html(Handlebars.compile(this.template)({todos:store.state.todos}));
        console.log(store.state.todos)
    }
}

const app = new Main();
app.init();