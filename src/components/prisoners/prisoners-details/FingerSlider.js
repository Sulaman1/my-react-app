import Carousel from 'react-bootstrap/Carousel';
import ProfilePic from '../../../../src/assets/images/users/1.gif';
import { baseImageUrl, getData } from '../../../services/request';

const FingerSlider = ({ prisonerData }) => {

	return (
		<>

			<Carousel>
				<Carousel.Item className="slide-item">
					<div className="finger-print">

						<img
							src={
								prisonerData?.biometricInfo?.rightThumbImg
									? baseImageUrl + prisonerData?.biometricInfo?.rightThumbImg
									: ProfilePic
							}
							className='img-thumbnail rounded-circle'
							alt=''
						/>

					</div>
				</Carousel.Item>
				<Carousel.Item className="slide-item">
					<div className="finger-print">

						<img
							src={
								prisonerData?.biometricInfo?.leftThumbImg
									? baseImageUrl + prisonerData?.biometricInfo?.leftThumbImg
									: ProfilePic
							}
							className='img-thumbnail rounded-circle'
							alt=''
						/>
					</div>
				</Carousel.Item>
				<Carousel.Item className="slide-item">
					<div className="finger-print">

						<img
							src={
								prisonerData?.biometricInfo?.leftIndexImg
									? baseImageUrl + prisonerData?.biometricInfo?.leftIndexImg
									: ProfilePic
							}
							className='img-thumbnail rounded-circle'
							alt=''
						/>
					</div>
				</Carousel.Item>
				<Carousel.Item className="slide-item">
					<div className="finger-print">

						<img
							src={
								prisonerData?.biometricInfo?.rightIndexImg
									? baseImageUrl + prisonerData?.biometricInfo?.rightIndexImg
									: ProfilePic
							}
							className='img-thumbnail rounded-circle'
							alt=''
						/>
					</div>
				</Carousel.Item>
			</Carousel>
		</>
	);
}
export default FingerSlider;