/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router*/
var app = app || {};

(function () {
	'use strict';

	app.ALL_TODOS = 'all';
	app.ACTIVE_TODOS = 'active';
	app.COMPLETED_TODOS = 'completed';
	var TodoFooter = app.TodoFooter;
	var TodoItem = app.TodoItem;
	var ASSIGN_OPTIONS = ['Tom', 'Dick', 'Harry']

	var ENTER_KEY = 13;

	var TodoApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: app.ALL_TODOS,
				editing: null,
				newTodo: '',
				assignTo: 'Tom'
			};
		},

		componentDidMount: function () {
			var setState = this.setState;
			var routes = {
				'/': setState.bind(this, { nowShowing: app.ALL_TODOS }),
				'/active': setState.bind(this, { nowShowing: app.ACTIVE_TODOS }),
				'/completed': setState.bind(this, { nowShowing: app.COMPLETED_TODOS })
			}
			var self = this
			ASSIGN_OPTIONS.forEach(function (assTo) {
				routes[`/${assTo.toLowerCase()}`] = setState.bind(self, { nowShowing: assTo.toLowerCase() })
			})
			var router = Router(routes);
			router.init('/');
		},

		handleChange: function (event) {
			this.setState({ newTodo: event.target.value });
		},

		handleAssign: function (event) {
			this.setState({ assignTo: event.target.value });
			console.log(this.state.assignTo);
		},

		handleNewTodoKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {
				return;
			}

			event.preventDefault();

			var val = this.state.newTodo.trim();
			var assignTo = this.state.assignTo;

			if (val) {
				this.props.model.addTodo(val, assignTo);
				this.setState({ newTodo: '' });
			}
		},

		handleButtonClick: function () {

			var val = this.state.newTodo.trim();
			var assignTo = this.state.assignTo;

			if (val) {
				this.props.model.addTodo(val, assignTo);
				this.setState({ newTodo: '' });
			}
		},

		toggleAll: function (event) {
			var checked = event.target.checked;
			this.props.model.toggleAll(checked);
		},

		toggle: function (todoToToggle) {
			this.props.model.toggle(todoToToggle);
		},

		destroy: function (todo) {
			this.props.model.destroy(todo);
		},

		edit: function (todo) {
			this.setState({ editing: todo.id });
		},

		save: function (todoToSave, text, assignTo) {
			this.props.model.save(todoToSave, text, assignTo);
			this.setState({ editing: null });
		},

		cancel: function () {
			this.setState({ editing: null });
		},

		clearCompleted: function () {
			this.props.model.clearCompleted();
		},

		render: function () {
			var footer;
			var main;
			var todos = this.props.model.todos;

			var shownTodos = todos.filter(function (todo) {
				var assignRoutes = ASSIGN_OPTIONS.map(function (name) {
					return name.toLowerCase();
				})
				if (this.state.nowShowing == app.ACTIVE_TODOS) {
					return !todo.completed;
				}
				if (this.state.nowShowing == app.COMPLETED_TODOS) {
					return todo.completed;
				}
				if (assignRoutes.indexOf(this.state.nowShowing) > -1) {
					return todo.assignTo && todo.assignTo.toLowerCase() === this.state.nowShowing;
				}
				return true;

			}, this);

			var todoItems = shownTodos.map(function (todo) {
				return (
					<TodoItem
						key={todo.id}
						todo={todo}
						onToggle={this.toggle.bind(this, todo)}
						onDestroy={this.destroy.bind(this, todo)}
						onEdit={this.edit.bind(this, todo)}
						editing={this.state.editing === todo.id}
						onSave={this.save.bind(this, todo)}
						onCancel={this.cancel}
						assignOptions={ASSIGN_OPTIONS}
					/>
				);
			}, this);

			var activeTodoCount = todos.reduce(function (accum, todo) {
				return todo.completed ? accum : accum + 1;
			}, 0);

			var completedCount = todos.length - activeTodoCount;

			if (activeTodoCount || completedCount) {
				footer =
					<TodoFooter
						count={activeTodoCount}
						completedCount={completedCount}
						nowShowing={this.state.nowShowing}
						onClearCompleted={this.clearCompleted}
						assignOptions={ASSIGN_OPTIONS}
					/>;
			}

			if (todos.length) {
				main = (
					<section className="main">
						<input
							className="toggle-all"
							type="checkbox"
							onChange={this.toggleAll}
							checked={activeTodoCount === 0}
						/>
						<ul className="todo-list">
							{todoItems}
						</ul>
					</section>
				);
			}

			return (
				<div>
					<header className="header">
						<h1>todos</h1>
						<input
							className="new-todo"
							placeholder="What needs to be done?"
							value={this.state.newTodo}
							onKeyDown={this.handleNewTodoKeyDown}
							onChange={this.handleChange}
							autoFocus={true}
							style={{ width: '58%' }}
						/>
						<select
							style={{ width: '25%' }}
							className="new-todo"
							onChange={this.handleAssign}
						>
							{ASSIGN_OPTIONS.map((name) => (
								<option value={name}>{name}</option>
							))
							}
						</select>
						<button
							style={{ width: '15%', fontSize: '24px', border: '1px solid #CCC', borderRadius: '5px' }}
							onClick={this.handleButtonClick}
						>Save</button>
					</header>
					{main}
					{footer}
				</div>
			);
		}
	});

	var model = new app.TodoModel('react-todos');

	function render() {
		React.render(
			<TodoApp model={model} />,
			document.getElementsByClassName('todoapp')[0]
		);
	}

	model.subscribe(render);
	render();
})();
