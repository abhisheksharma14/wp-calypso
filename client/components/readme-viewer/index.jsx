/** @format */

/**
 * External Dependencies
 */

import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import request from 'superagent';

/**
 * Internal Dependencies
 */

class ReadmeViewer extends Component {
	static propTypes = {
		readmeFilePath: PropTypes.string,
		showEditLink: PropTypes.bool,
	};

	static defaultProps = {
		showEditLink: true,
	};

	state = {
		readme: null,
	};

	componentDidMount() {
		const { readmeFilePath } = this.props;
		request
			.get( '/devdocs/service/content' )
			.query( { path: readmeFilePath } )
			.then( ( { text } ) => {
				this.setState( {
					readme: text,
				} );
			} );
	}

	render() {
		const { readmeFilePath, showEditLink } = this.props;
		const editLink = (
			<a
				className="readme-viewer__doc-edit-link devdocs__doc-edit-link"
				href={ `https://github.com/Automattic/wp-calypso/edit/master${ readmeFilePath }` }
			>
				Improve this document on GitHub
			</a>
		);

		let content;

		if ( ! this.state.readme ) {
			content = <div className="readme-viewer__not-available">No documentation available.</div>;
		} else {
			content = <ReactMarkdown source={ this.state.readme } />;
		}

		return this.props.readmeFilePath ? (
			<div className="readme-viewer__wrapper devdocs__doc-content">
				{ this.state.readme && showEditLink && editLink }
				{ content }
			</div>
		) : null;
	}
}

export default ReadmeViewer;
