import { useState, useRef, useCallback } from 'react';

import AllSearch from './AllSearch';
import PrisonerList from './PrisonerList';

const AllPrisonerSearch = ({componentType}) => {
	const [searchData, setSearchData] = useState([]);
	const [totalCount, setTotalCount] = useState(0);
	const allSearchRef = useRef();

	const addSearchDataHandler = searchData => {
		if(searchData.data) {
			setSearchData(searchData.data);
			setTotalCount(searchData.totalPrisoners)
		}else  {
			setSearchData(searchData);
		}
	};

	const handlePageLimitChange = useCallback((newPageLimit) => {
		// Trigger search with new page limit
		if (allSearchRef.current) {
			allSearchRef.current.loadData(newPageLimit);
		}
	}, []);

	return (
		<>
			<AllSearch ref={allSearchRef} onAddSearchData={addSearchDataHandler} />
			<PrisonerList 
				searchData={searchData} 
				componentType={componentType} 
				totalCount={totalCount} 
				onPageLimitChange={handlePageLimitChange}
			/>
		</>
	);
};

export default AllPrisonerSearch;
