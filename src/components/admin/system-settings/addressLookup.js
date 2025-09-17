import React, { useEffect, useState } from 'react';
import { transfromStringArray } from '../../../common/Helpers';
import InputWidget from '../../../droppables/InputWidget';
import { getData } from '../../../services/request';
import {
  transformData
} from '../../../common/Helpers';

/*
1. create simple html form [Done]
2. fill the dropdowns with values [Done]
3. filter dropdowns [done]
4. handle default values
5. adjust payload
6. edit handle payload
*/
const others = [{label: 'Others', value: 'Others'}];
const AddressLookup = ({payload, countryData, setPayload, showSameAddressOption = false, isVisitor = false, lookUps=[]}) => { 

  const [isAddressChanged, setIsAddressChanged] = useState(false);
  const [address, setAddress] = useState({
    province: [],
    district: [],
    city: [],
    defaultCountry: '',
    defaultProVal: '',
    defaultDistVal: '',
    defaultCityVal: ''
  });


  useEffect(() => {
    if(!lookUps?.country?.length) {
      console.log('no lookups right now')
      return false;
    }
    if(payload?.id && showSameAddressOption  && !isAddressChanged) {
      setAddress(prevState => ({
        ...prevState,
        defaultCountry: lookUps?.country?.filter(item => item.value === payload?.presentAddress?.countryId)[0],
        defaultProVal: (payload?.presentAddress?.cityId ||  payload?.presentAddress?.provinceId) ? setDefaultProvinceProps() : '',
        defaultCityVal:  payload?.presentAddress?.cityId ? lookUps?.cities?.filter(item => item.value === payload?.presentAddress?.cityId)[0] : '',
        province: lookUps.provinces || transformData(lookUps.allProvinces),
        district : transformData(lookUps?.allDistricts?.filter(item => item.provinceId === payload?.presentAddress?.provinceId)),
        defaultDistVal: payload?.presentAddress?.cityId ? transformData(lookUps?.allDistricts?.filter(item => item.id === payload?.presentAddress?.districtId)) : '',
      }));
      const formPayload = {
        ...payload,
      };

      if (payload?.presentAddress?.countryId && lookUps?.country && lookUps?.country?.length > 0) {
        formPayload['presentAddress']['isPakistan'] = lookUps?.country.filter(item => item.value === payload?.presentAddress?.countryId)[0]?.label?.toLowerCase() === 'pakistan';
      }
    }
  },[payload, lookUps])

  const setDefaultProvinceProps = () => {
    let selectedPro;
    const allprov = transformData(lookUps?.allProvinces);
    if (lookUps?.provinces) {
      selectedPro = lookUps?.provinces?.filter(item => item.value === payload?.presentAddress?.provinceId)[0] 
    } else {
      selectedPro = allprov?.filter(item => item.value === payload?.presentAddress?.provinceId)[0] 
    }
    return selectedPro;
  }

  const handleCountry = (val) => {
    if (province.length > 0) {
      // setProvince([]);
      setAddress(prevState => ({
        ...prevState,
        province: [],
      }));
    }
    if (district.length > 0) {
      // setDistrict([]);
      setAddress(prevState => ({
        ...prevState,
        district: [],
      }));
    }
    if (city.length > 0) {
      // setCity([]);
      setAddress(prevState => ({
        ...prevState,
        city: [],
      }));
    }

    getData(
      '/services/app/AddressLkpt/GetAllProvince?countryId=' + val.value,
      '',
      true
    )
    .then((result) => {
      const {data} = result.result;
      if(!data.length) { 
        setAddress(prevState => ({
          ...prevState,
          province: others,
          district: others,
          city: others
        }));
      } else {
        const proObj = result.result.data.map((e) => {
          return {
            label: e.name,
            value: e.id,
          };
        });
        setAddress(prevState => ({
          ...prevState,
          province: proObj
        }));
      }
      
    })
    .catch((err) => {
      console.log(err, 'getting error while fetching API {GetAllProvince} & fileName is {Address.js}');
    });
  };

  const handleProvince = (val, type) => {
    if (district.length > 0) {
      //setDistrict([]);
    }
    if (city.length > 0) {
      // setCity([]);
    }
    if(val.value === 'Others') {
      setAddress(prevState => ({
        ...prevState,
        district: others
      }));
      return false;
    }
    getData(
      '/services/app/AddressLkpt/GetAllDistrict?provinceId=' + val.value,
      '',
      true
    )
    .then((result) => {
      let distObj = result.result.data.map((e) => {
        return {
          label: e.name,
          value: e.id,
        };
      });
        setAddress(prevState => ({
          ...prevState,
          district: distObj,
          defaultProVal: val
        }));
    })
    .catch((err) => {
        console.log(err, 'getting error while fetching API {GetAllDistrict} & fileName is {Address.js}');
    });
  };


  const handleDistrict = (val) => {
    if (city.length > 0) {
      //setCity([]);
    }
    if(val.value === 'Others') {
      setAddress(prevState => ({
        ...prevState,
        city: others
      }));
      return false;
    }
    getData(
      '/services/app/AddressLkpt/GetAllCity?districtId=' + val.value,
      '',
      true
    )
      .then((result) => {
        let cityObj = result.result.data.map((e) => {
          return {
            label: e.name,
            value: e.id,
          };
        });
        setAddress(prevState => ({
          ...prevState,
          city: cityObj
        }));
        
      })
      .catch((err) => {
        console.log(err, 'getting error while fetching API {GetAllProvince} & fileName is {Address.js}');
      });
  };

  const resetDropDowns = (name) => {
    setIsAddressChanged(true);
    switch (name) {
      case 'country':
        setAddress(prevState => ({
          ...prevState,
          province: [],
          defaultProVal: '',
          district: [],
          defaultDistVal: '',
          city: []
        }));
        break;
      case 'province':
        setAddress(prevState => ({
          ...prevState,
          district: [],
          defaultDistVal: '',
          city: [],
          defaultCityVal: ''
        }));
        break;
      case 'district':
        setAddress(prevState => ({
          ...prevState,
          city: [],
          defaultCityVal: ''
        }));
        break;
      default:
        break;
    }
  };


  return (
    <>
    <div className="">
        <div className="">
          <div className='row '>
            <div className='col-lg-6'>
              <InputWidget
                type={'multiSelect'}
                isMulti={false}
                inputType={'select'}
                label={'Country (ملک)'}
                id={'country'}
                require={false}
                icon={'icon-web'}
                options={countryData || []}
                defaultValue={address?.defaultCountry || ""}
                setValue={(value) => {
                  resetDropDowns('country');
                  const formPayload = {
                    ...payload,
                  };
                  setAddress(prevState => ({
                    ...prevState,
                    defaultCountry: value
                  }));
                  handleCountry(value);
                  if(showSameAddressOption) {
                    formPayload['presentAddress'].countryId = value.value;
                    formPayload['presentAddress'].isPakistan = value.label.toLowerCase() === 'pakistan';
                  } else {
                    formPayload.countryId = value.value;
                    formPayload['isPakistan'] = value.label.toLowerCase() === 'pakistan';
                  }
                 
                  setPayload(formPayload);
                }}
              />
            </div>
            <div className='col-lg-6'>
              <InputWidget
                type={'multiSelect'}
                isMulti={false}
                inputType={'select'}
                isDisabled={false}
                defaultValue={address?.defaultProVal || ""}
                label={'Province (صوبہ)'}
                id={'province'}
                require={false}
                icon={'icon-building'}
                options={address?.province || []}
                setValue={(value) => { 
                  resetDropDowns('province')
                  const formPayload = {
                    ...payload,
                  };
                  handleProvince(value);
                  setAddress(prevState => ({
                    ...prevState,
                    defaultProVal: value
                  }));
                  if(showSameAddressOption) {
                    formPayload['presentAddress'].provinceId = value.value;
                  } else {
                    formPayload.provinceId = value.value;
                  }
                  setPayload(formPayload);
                }}
              />
            </div>
            <div className='col-lg-6'>
              <InputWidget
                type={'multiSelect'}
                isMulti={false}
                inputType={'select'}
                label={'District (ڈسٹرکٹ)'}
                id={'district'}
                require={false}
                icon={'icon-building'}
                isDisabled={false}
                options={address?.district || []}
                defaultValue={address?.defaultDistVal || ""}
                setValue={(value) => {
                  const formPayload = {
                    ...payload,
                  };
                  resetDropDowns('district');
                  handleDistrict(value);
                  setAddress(prevState => ({
                    ...prevState,
                    defaultDistVal: value
                  }));
                  if(showSameAddressOption) {
                    formPayload['presentAddress'].districtId = value.value;
                  } else {
                    formPayload.districtId = value.value;
                  }
                  setPayload(formPayload);
                }}
              />
            </div>
            <div className='col-lg-6'>
              <InputWidget
                type={'multiSelect'}
                isMulti={false}
                inputType={'select'}
                label={'City (شہر)'}
                id={'city'}
                require={false}
                icon={'icon-building'}
                isDisabled={false}
                options={address?.city || []}
                defaultValue={address?.defaultCityVal || ""}
                setValue={(value) => {
                  const formPayload = {
                    ...payload,
                  };
                  setAddress(prevState => ({
                    ...prevState,
                    defaultCityVal: value
                  }));
                  if (showSameAddressOption) {
                    formPayload['presentAddress'].cityId = value.value;
                  } else {
                    formPayload.cityId = value.value;
                  }
                  
                  setPayload(formPayload);
                }}
              />
            </div>
            <div className='col-lg-12'>
              <InputWidget
                type={'input'}
                inputType={'name'}
                label={'Street Address (گلی کا پتہ)'}
                id={'street-address'}
                require={false}
                icon={'icon-destination'}
                defaultValue={showSameAddressOption ? payload?.presentAddress?.streetAddress : payload?.street ? payload.street : null}
                setValue={(value) => {
                  const formPayload = {
                    ...payload,
                  };
                  if(showSameAddressOption) {
                    formPayload['presentAddress'].street = value;
                    formPayload['presentAddress'].streetAddress = value;
                  } else {
                    formPayload['street'] = value;
                  }
                  setPayload(formPayload);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default AddressLookup;