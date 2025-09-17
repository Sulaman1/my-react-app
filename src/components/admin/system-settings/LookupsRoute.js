import React from 'react';
import { Route } from 'react-router';
import MetaLookups from './MetaLookups';
import { Link, useParams, useLocation } from 'react-router-dom';
import PrisonLookup from './PrisonLookup';

function LookupRoutes() {
	const { search, pathname } = useLocation();
	const tp = pathname.split('/');
	const type = tp[tp.length - 1];
	return (
		<div className='LookupRoutes'>
			<Route exact={true} path={`/admin/administration/system-settings/country`}>
				<MetaLookups />
			</Route>
			<Route exact={true} path={`/admin/administration/system-settings/province`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/district`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/city`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/departments`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/designation`}>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/employementType`}
			>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/religion`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/caste`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/sections`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/domicile`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/leaveTypes`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/acts`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/prisonType`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/prisons`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/prisoner`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/courtType`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/court`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/crimeType`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/occupation`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/disease`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/medicineType`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/prisonerType`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/prisonerSubType`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/remissionType`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/authorityTypes`}>
				<MetaLookups />
			</Route>
	
			<Route exact path={`/admin/administration/system-settings/policeStation`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/hrServiceStatus`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/hr-service-type`}>
				<MetaLookups />
			</Route>
			<Route
				exact path={`/admin/administration/system-settings/hr-termination-type`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/bannedOrganizations`}
			>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/judgeType`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/judge`}>
				<MetaLookups />
			</Route>

			<Route exact path={`/admin/administration/system-settings/arv`}>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/medicine`}>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/facilitationCenters`}
			>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/medicalTests`}>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/medicalTestsResults`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/outsideHospitals`}
			>
				<MetaLookups />
			</Route>
			<Route exact path={`/admin/administration/system-settings/outinReason`}>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/prisonerCategory`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/prison`}
			>
				<PrisonLookup />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/ageCategory`}
			>
				<MetaLookups />
			</Route>

			<Route
				exact
				path={`/admin/administration/system-settings/gender`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/MaritalStatus`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/NarcoticStatus`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/Nationality`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/Relationships`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/Language`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/EducationLKPT`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/EducationTypeLkpt`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/ReleaseType`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/Enclosure`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/PrisonBarracks`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/PrisonBarrackTypes`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/bloodGroup`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/vaccinations`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/inventory`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/inventoryType`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/sect`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/donors`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/offenceType`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/inPrisonOffences`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/relationshipTypes`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/remissionTypes`}
			>
				<MetaLookups />
			</Route>
			<Route
				exact
				path={`/admin/administration/system-settings/remission`}
			>
				<MetaLookups />
			</Route>
		</div>
	);
}

export default LookupRoutes;
