import Carousel from 'react-bootstrap/Carousel';
import ProfilePic from '../../../../src/assets/images/users/1.jpg';
import { baseImageUrl, getData } from '../../../services/request';
const ProfileSlider = ({ prisonerData }) => {
	return (
		<>
			<Carousel>
				<Carousel.Item className="slide-item">
					<div className="profile">

						<img
							src={
								prisonerData?.frontPic
									? baseImageUrl + prisonerData?.frontPic
									: ProfilePic
							}
							className='img-thumbnail rounded-circle'
							alt=''
							onError={(e) => {
								e.target.src = ProfilePic;
							}}
						/>
					</div>
				</Carousel.Item>
				<Carousel.Item className="slide-item">
					<div className="profile">

						<img
							src={
								prisonerData?.biometricInfo?.leftPic
									? baseImageUrl + prisonerData?.biometricInfo?.leftPic
									: ProfilePic
							}
							className='img-thumbnail rounded-circle'
							alt=''
							onError={(e) => {
								e.target.src = ProfilePic;
							}}
							/>
					</div>
				</Carousel.Item>
				<Carousel.Item className="slide-item">
					<div className="profile">

						<img
							src={
								prisonerData?.biometricInfo?.rightPic
									? baseImageUrl + prisonerData?.biometricInfo?.rightPic
									: ProfilePic
							}
							className='img-thumbnail rounded-circle'
							alt=''
							onError={(e) => {
								e.target.src = ProfilePic;
							}}
							/>
					</div>
				</Carousel.Item>
			</Carousel>
		</>
	);
}
export default ProfileSlider;