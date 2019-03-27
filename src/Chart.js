import React from 'react';
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

export default Chart;