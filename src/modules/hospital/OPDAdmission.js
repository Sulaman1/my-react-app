import ViewAdmissions from './components/ViewAdmissions';

const OPDAdmission = props => {
	return (
		<>
			<div className='row'>
				<div className='row flex'>
					<h4 className='third-heading just-space'>
						<span>OPD Treatment</span>
					</h4>
				</div>
				<div className='card'>
					<div className='card-body'>
						<ViewAdmissions
							getURL='SearchOPDAdmissions'
							navItem={2}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default OPDAdmission;
