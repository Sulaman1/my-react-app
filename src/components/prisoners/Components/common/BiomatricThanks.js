import React, { Fragment } from 'react';
import { ICONS } from '../../../../services/icons';

const BiomatricThanks = ({ }) => {
	return (
		<div className='thankspage biomatric-page '>
	<div className='page-container'>
	<i className='' dangerouslySetInnerHTML={{ __html: ICONS.biomatric }}></i>
		<h3 className='heading'>bio-metric service is successfully activated</h3>
	</div>
		</div>
	);
};

export default BiomatricThanks;
