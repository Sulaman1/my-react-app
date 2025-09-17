import ViewAdmissions from './components/ViewAdmissions';

const OutsideAdmission = props => {
	return (
		<>
			<div className='row'>
				<div class='row flex'>
					<h4 class='third-heading  just-space'>
						<span>Outside Admission</span>
					</h4>
				</div>

				<div className='card'>
					<div className='card-body'>
						<ViewAdmissions
							getURL='SearchOutsideHospitalAdmissions'
							navItem={4}
						/>
					</div>
				</div>
			</div>
		</>
	);
};
export default OutsideAdmission;
