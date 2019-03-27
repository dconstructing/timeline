import React from 'react';
import Datetime from 'react-datetime';

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

export default TimelineEvent;