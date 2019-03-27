import React from 'react';
import ReactDOM from 'react-dom';
import Datetime from 'react-datetime';
import html2canvas from 'html2canvas';
import * as timeline from 'timeline-plus';

function generateChartItems(events) {
	return events.map((event, i) => {
		return {
			start: event.datetime,
			content: event.note
		}
	});
}

class Chart extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		var container = document.getElementById('mytimeline');
		const items = generateChartItems(this.props.events);
		const options = {
			moment: function(date) {
				return timeline.moment(date).utc();
			}
		};
		this.timeline = new timeline.Timeline(container, items, options);
	}

	shouldComponentUpdate(nextProps, nextState) {
		console.log('checking update')
		const items = generateChartItems(nextProps.events);
		this.timeline.setItems(items)
		this.timeline.redraw();
		this.timeline.fit(items);
		return false;
	}

	render() {
		return <div id="mytimeline" />
	}
}

class TimelineEvent extends React.Component {
	constructor(props) {
		super(props);
		this.datetimeChanged = this.datetimeChanged.bind(this);
		this.noteChanged = this.noteChanged.bind(this); 
	}

	datetimeChanged(datetime) {
		const updatedEvent = {
			datetime: datetime,
			note: this.props.event.note
		}
		this.props.onUpdate(this.props.sort, updatedEvent)
	}

	noteChanged(event) {
		const updatedEvent = {
			datetime: this.props.event.datetime,
			note: event.target.value
		}
		this.props.onUpdate(this.props.sort, updatedEvent)
	}

	render() {
		return (
			<form>
				<div className="field is-horizontal">
					<div className="field">
						<div className="control has-icons-left">
							<Datetime utc inputProps={{ className: 'input', placeholder: 'Datetime'}} value={this.props.event.datetime} onChange={this.datetimeChanged} />
							<span className="icon is-small is-left">
								<i className="fas fa-calendar-alt"></i>
							</span>
						</div>
					</div>
					<div className="field">
						<div className="control has-icons-left">
							<input className="input" placeholder="Note" value={this.props.event.note} onChange={this.noteChanged} />
							<span className="icon is-small is-left">
								<i className="fas fa-user"></i>
							</span>
						</div>
					</div>
				</div>
			</form>
		)
	}
}

function blankTimelineEvent() {
	return {
		datetime: '',
		note: ''
	}
}

class TimelineEvents extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			events: [],
			newEvent: blankTimelineEvent()
		};

		this.datetimeChanged = this.datetimeChanged.bind(this);
		this.noteChanged = this.noteChanged.bind(this); 
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleExport = this.handleExport.bind(this);
	}

	datetimeChanged(datetime) {
		const newEvent = this.state.newEvent;
		newEvent.datetime = datetime;
		this.setState({newEvent: newEvent});
	}

	noteChanged(event) {
		const newEvent = this.state.newEvent;
		newEvent.note = event.target.value;
		this.setState({newEvent: newEvent});
	}

	handleSubmit(event) {
		console.log(this.state)
		const eventSet = this.state.events;
		eventSet.push(this.state.newEvent);
		this.setState({events: eventSet, newEvent: blankTimelineEvent()});
		event.preventDefault();
	}

	handleUpdate(sort, timelineEvent) {
		console.log(this.state);
		console.log(sort, timelineEvent);
		const eventSet = this.state.events;
		eventSet.splice(sort, 1, timelineEvent);
		console.log(eventSet);
		this.setState({events: eventSet});
	}

	handleExport(event) {
		const container = document.getElementById('mytimeline');
		html2canvas(container).then(function(canvas) {
			var link = document.createElement('a');
			link.download = 'timeline.png';
			canvas.toBlob(function(blob) {
				link.href = URL.createObjectURL(blob);
				link.click();
			},'image/png');
		});
	}

	render() {
		const events = this.state.events.map((event, i) => <TimelineEvent key={i} sort={i} event={event} onUpdate={this.handleUpdate} />)
		return (
			<div>
				<div className="section">
					<div className="container">
						<h1 className="title">Timeline Generator</h1>
						<p className="subtitle">Enter your event details to automatically build a timeline. Red line represents current time in UTC.</p>
						<Chart events={this.state.events} />
						<button className="button is-primary is-outlined" onClick={this.handleExport}>
							<span className="icon is-small">
								<i className="fas fa-file-download"></i>
							</span>
							<span>Save as PNG</span>
						</button>
					</div>
				</div>
				<div className="section">
					<div className="container">
						<h2 className="title is-2">Events</h2>
						<p className="subtitle">Expects times in UTC</p>
						{events}
						<form onSubmit={this.handleSubmit}>
							<div className="field is-horizontal">
								<div className="field">
									<div className="control has-icons-left">
										<Datetime utc inputProps={{ className: 'input', placeholder: 'Datetime'}} value={this.state.newEvent.datetime} onChange={this.datetimeChanged} />
										<span className="icon is-small is-left">
											<i className="fas fa-calendar-alt"></i>
										</span>
									</div>
								</div>
								<div className="field">
									<div className="control has-icons-left">
										<input className="input" placeholder="Note" value={this.state.newEvent.note} onChange={this.noteChanged} />
										<span className="icon is-small is-left">
											<i className="fas fa-user"></i>
										</span>
									</div>
								</div>
								<div className="field">
									<div className="control">
										<button className="button is-primary" type="submit">
											<span className="icon is-small">
												<i className="fas fa-plus-circle"></i>
											</span>
											<span>Add</span>
										</button>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

ReactDOM.render(
	<TimelineEvents />,
	document.getElementById('react')
);
