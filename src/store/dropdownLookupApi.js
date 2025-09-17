import { lookupName } from '../components/admin/system-settings/lookupNames';
import { getData } from '../services/request';
import { setDropdownLookups } from './dropdownLookups';

export const fetchLookupsFromAPI = async () => {
    const lookupData = {};
    try {
      const promises = Object.keys(lookupName).map(async key => {
        try {
          const response = await getData(lookupName[key], false, false, false);
          lookupData[key] = response.result.data;
        } catch (error) {
          console.error(`Error fetching lookup in redux componentName = dropdownlookupapi ${key}:`, error);
        }
      });
      await Promise.all(promises);
      return {
        type: setDropdownLookups.type,
        payload: lookupData,
      };
    } catch (error) {
      console.error('error in dropdown lookups in redux store::: ', error);
      throw error;
    }
  };
  
