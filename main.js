const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const FINISH_TODO = "FINISH_TODO";
const FILTER_FINISH_TODO = "FILTER_FINISH_TODO";
const FILTER_UNFINISH_TODO = "FILTER_UNFINISH_TODO";

class Action {
    addTodo(todo) {
        return {type: ADD_TODO, todo}
    }
    finishTodo(id) {
        return {type: FINISH_TODO, id}
    }
    removeTodo(id) {
        return {type: REMOVE_TODO, id}
    }
    filterFinish() {
        return {type: FILTER_FINISH_TODO}
    }
    filterUnFinish() {
        return {type: FILTER_UNFINISH_TODO}
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
            ],
            filterTodos: []
        }
    }
    dispatch(action) {
        switch(action.type){
            case ADD_TODO:
                return this.state =
                    Object.assign({},this.state,{todos:
                        this.state.todos.concat([{id: Date.now(), title: action.todo, finished: false}])
                    });
            case FINISH_TODO:
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
            case REMOVE_TODO:
                return this.state =
                    Object.assign({},this.state,{todos:
                        this.state.todos.filter(todo=>todo.id!==action.id)
                    });
            case FILTER_FINISH_TODO:
                return this.state =
                    Object.assign({},this.state,{filterTodos:
                        this.state.todos.filter(todo=>!todo.finished)
                    })
            case FILTER_UNFINISH_TODO:
                return this.state =
                    Object.assign({},this.state,{filterTodos:
                        this.state.todos.filter(todo=>todo.finished)
                    })

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
        this.$filterFinish = $("#filterFinish");
        this.$filterUnFinish = $("#filterUnFinish");
        this.$showAll = $("#showAll");
    }
    eventBinding() {
        $(window).on("load",this.render.bind(this));
        this.$myBtn.on("click",this.handleSubmit.bind(this));
        this.$myInput.on("keyup",e=>{e.keyCode===13 && this.handleSubmit()});
        this.$todoList.on("click","button.finish",e=>this.finishTodo(e));
        this.$todoList.on("click","button.delete",e=>this.removeTodo(e));
        this.$filterFinish.on("click",this.filterFinish.bind(this));
        this.$filterUnFinish.on("click",this.filterUnFinish.bind(this));
        this.$showAll.on("click",this.render.bind(this))

    }
    removeTodo(e) {
        const id = $(e.target).data("id");
        store.dispatch(action.removeTodo(id));
        this.render();
    }
    finishTodo(e) {
        const id = $(e.target).data("id");
        store.dispatch(action.finishTodo(id));
        this.render();
    }
    filterFinish() {
        store.dispatch(action.filterFinish());
        this.$todoList.html(Handlebars.compile(this.template)({todos:store.state.filterTodos}));
    }
    filterUnFinish() {
        store.dispatch(action.filterUnFinish());
        this.$todoList.html(Handlebars.compile(this.template)({todos:store.state.filterTodos}));
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
    }
}

const app = new Main();
app.init();