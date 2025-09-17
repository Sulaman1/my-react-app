import React, { useEffect, useState } from 'react';
import { transfromStringArray } from '../../../common/Helpers';
import InputWidget from '../../../droppables/InputWidget';
import { getData } from '../../../services/request';
import {
  transformData
} from '../../../common/Helpers';


const others = [{ label: 'Others', value: 'Others' }];

const PermanentAddress = ({ payload, countryData, setPayload, lookUps = [], clearAll = false }) => {
  const [isAddressChanged, setIsAddressChanged] = useState(false);
  const [address, setAddress] = useState({
    province: [],
    district: [],
    city: [],
    defaultCountry: '',
    defaultProVal: '',
    defaultDistVal: '',
    defaultCityVal: '',
  });

  useEffect(() => {
    if (!lookUps?.country?.length) {
      console.log('no lookups right now')
      return false;
    }
    if (payload?.id && !isAddressChanged) {
      setAddress(prevState => ({
        ...prevState,
        defaultCountry: lookUps?.country?.filter(item => item.value === payload?.permanentAddress?.countryId)[0],
        defaultProVal: (payload?.permanentAddress?.cityId || payload?.permanentAddress?.provinceId) ? setDefaultProvinceProps() : '',
        defaultCityVal:  payload?.permanentAddress?.cityId ? lookUps.cities.filter(item => item.value === payload?.permanentAddress?.cityId || item.id == payload?.permanentAddress?.cityId) : '',
        province: payload?.permanentAddress?.cityId ? lookUps.provinces : payload.id === "default" ? lookUps.provinces : '',
        district: transformData(lookUps?.allDistricts?.filter(item => item.provinceId === payload?.permanentAddress?.provinceId)),
        defaultDistVal: payload?.permanentAddress?.cityId ? transformData(lookUps?.allDistricts?.filter(item => item.id === payload?.permanentAddress?.districtId)) : '',
      }));
      const formPayload = {
        ...payload,
      };
      if (payload?.permanentAddress?.countryId && lookUps?.country?.length > 0) {
        formPayload['permanentAddress']['isPakistan'] = lookUps?.country.filter(item => item.value === payload?.permanentAddress?.countryId)[0]?.label?.toLowerCase() === 'pakistan';
      }
    }
  }, [payload])

  const setDefaultProvinceProps = () => {
    let selectedPro;
    const allprov = transformData(lookUps?.allProvinces);
    if (lookUps?.provinces) {
      selectedPro = lookUps?.provinces?.filter(item => item.value === payload?.permanentAddress?.provinceId)[0] 
    } else {
      selectedPro = allprov?.filter(item => item.value === payload?.presentAddress?.provinceId)[0]
    }
    return selectedPro;
  }

  useEffect(() => {
    if (clearAll) {
      setIsAddressChanged(true);
      setAddress(prevState => ({
        ...prevState,
        // defaultCountry: '',
        // defaultProVal: '',
        defaultDistVal: '',
        defaultCityVal: '',
      }));
    }
  }, [clearAll])


  const handleCountry = (val) => {
    getData(
      '/services/app/AddressLkpt/GetAllProvince?countryId=' + val.value,
      '',
      true
    )
      .then((result) => {
        const { data } = result.result;
        if (!data.length) {
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
        console.log(err, 'getting error while fetching API {GetAllProvince} & fileName is {PermanentAddress.js}');
      });
  };


  const handleProvince = (val) => {
    if (val.value === 'Others') {
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
    if (val.value === 'Others') {
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
      <div className='row'>
        <div className='col-lg-6'>
          <InputWidget
            type={'multiSelect'}
            isMulti={false}
            inputType={'select'}
            label={'Country (ملک)'}
            id={'country'}
            require={false}
            icon={'icon-web'}
            options={lookUps?.country || []}
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

              formPayload['permanentAddress'].countryId = value.value;
              formPayload['permanentAddress'].isPakistan = value.label.toLowerCase() === 'pakistan';

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
            id={'p-province'}
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
              formPayload['permanentAddress']['provinceId'] = value.value;
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
            id={'p-district'}
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
              formPayload['permanentAddress'].districtId = value.value;
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
            id={'p-city'}
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
              formPayload['permanentAddress'].cityId = value.value;
              setPayload(formPayload);
            }}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-lg-12'>
          <InputWidget
            type={'input'}
            inputType={'name'}
            label={'Street Address (گلی کا پتہ)'}
            id={'p-street-address'}
            require={false}
            icon={'icon-destination'}
            defaultValue={payload?.permanentAddress?.streetAddress || ""}
            setValue={(value) => {
              const formPayload = {
                ...payload,
              };
              formPayload['permanentAddress'].street = value;
              formPayload['permanentAddress'].streetAddress = value;
              setPayload(formPayload);
            }}
          />
        </div>
      </div>
    </>
  )
}



export default PermanentAddress;