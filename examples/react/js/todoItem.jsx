/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */
var app = app || {};

(function () {
	'use strict';

	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;

	app.TodoItem = React.createClass({
		handleSubmit: function (event) {
			var val = this.state.editText.trim();
			var assignTo = this.state.assignTo;
			if (val) {
				this.props.onSave(val, assignTo);
				this.setState({
					editText: val,
					assignTo: assignTo
				});
			} else {
				this.props.onDestroy();
			}
		},

		handleEdit: function () {
			this.props.onEdit();
			this.setState({
				editText: this.props.todo.title,
				assignTo: this.props.todo.assignTo
			});
		},

		handleKeyDown: function (event) {
			if (event.which === ESCAPE_KEY) {
				this.setState({ editText: this.props.todo.title });
				this.props.onCancel(event);
			} else if (event.which === ENTER_KEY) {
				this.handleSubmit(event);
			}
		},

		handleChange: function (event) {
			if (this.props.editing) {
				this.setState({ editText: event.target.value });
			}
		},

		handleAssign: function (event) {
			if (this.props.editing) {
				this.setState({ assignTo: event.target.value });
			}
		},

		getInitialState: function () {
			return { editText: this.props.todo.title };
		},

		/**
		 * This is a completely optional performance enhancement that you can
		 * implement on any React component. If you were to delete this method
		 * the app would still work correctly (and still be very performant!), we
		 * just use it as an example of how little code it takes to get an order
		 * of magnitude performance improvement.
		 */
		shouldComponentUpdate: function (nextProps, nextState) {
			return (
				nextProps.todo !== this.props.todo ||
				nextProps.editing !== this.props.editing ||
				nextState.editText !== this.state.editText ||
				nextState.assignTo !== this.state.assignTo
			);
		},

		/**
		 * Safely manipulate the DOM after updating the state when invoking
		 * `this.props.onEdit()` in the `handleEdit` method above.
		 * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
		 * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
		 */
		componentDidUpdate: function (prevProps) {
			if (!prevProps.editing && this.props.editing) {
				var node = React.findDOMNode(this.refs.editField);
				node.focus();
				node.setSelectionRange(node.value.length, node.value.length);
			}
		},

		render: function () {
			return (
				<li className={classNames({
					completed: this.props.todo.completed,
					editing: this.props.editing
				})}>
					<div className="view">
						<input
							className="toggle"
							type="checkbox"
							checked={this.props.todo.completed}
							onChange={this.props.onToggle}
						/>
						<label onDoubleClick={this.handleEdit}>
							<span style={{ display: 'inline-block', width: '61%' }}>{this.props.todo.title}</span> {this.props.todo.assignTo}
						</label>
						<button className="destroy" onClick={this.props.onDestroy} />
					</div>
					<div className="edit">
						<input
							ref="editField"
							value={this.state.editText}
							onChange={this.handleChange}
							onKeyDown={this.handleKeyDown}
							style={{ width: '40%' }}
						/>
						<select
							style={{ width: '30%' }}
							onChange={this.handleAssign}
						>
							{this.props.assignOptions.map((name) => (
								<option value={name} selected={name == this.state.assignTo}>{name}</option>
							))
							}
						</select>
						<button style={{ width: '20%', border: '1px solid #CCC', borderRadius: '5px' }} onClick={this.handleSubmit}>Save</button>
					</div>
				</li>
			);
		}
	});
})();
