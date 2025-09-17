import React from 'react';

import ViewVisitor from './components/ViewVisitor';

const AddVisitors = props => {
	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space '>
						<span>Add Visitors</span>
					</h4>
				</div>
				<div className='card'>
					<div className='card-body'>
						<ViewVisitor
							type='visitor'
							getURL='SearchVisitsAvailable'
						/>
					</div>
				</div>
			</div>
		</>
	);
};
export default AddVisitors;
