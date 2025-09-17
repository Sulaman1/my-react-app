import { useState, useEffect } from "react";
import { transformData, getIds } from "../../../common/Helpers";
import InputWidget from "../../../droppables/InputWidget";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { IoMdArrowDroprightCircle, IoMdArrowDropdownCircle } from "react-icons/io";
import { Collapse } from "react-bootstrap";
import { booleanOptions, mapIdsToLabels } from "../../../common/ReportHelpers";
import { getData } from "../../../services/request";

const PrisonerAccodomationForm = ({ type, formPayload, setFormPayload }) => {
  const [allocationDateRange, setAllocationDateRange] = useState(() => {
    const startDate = formPayload?.prisonerAccommodation?.allocationDate?.start
      ? new Date(formPayload.prisonerAccommodation.allocationDate.start)
      : null;
    const endDate = formPayload?.prisonerAccommodation?.allocationDate?.end
      ? new Date(formPayload.prisonerAccommodation.allocationDate.end)
      : null;
    return [startDate, endDate];
  });
  
  const [startAllocationDate, endAllocationDate] = allocationDateRange;
  const [lookup, setLookup] = useState();
  const newLookups = useSelector((state) => state?.dropdownLookups);
  const [open, setOpen] = useState(true);
  const [prisons, setPrisons] = useState([]);
  const [isRoleExist, setIsRoleExist] = useState("");
  const [barracksWithDetails, setBarracksWithDetails] = useState([]);
  const [allBarracksOptions, setAllBarracksOptions] = useState([]); // Store all barracks for filtering
  const [userPrisonIds, setUserPrisonIds] = useState([]); // Store user's prison IDs

  // Create a bold text effect using Unicode bold characters
  const makeBold = (text) => {
    // Character mapping from regular to bold
    const boldMap = {
      'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜',
      'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥',
      'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
      'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶',
      'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿',
      's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
      '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵',
      ':': ':', ' ': ' ', '|': '|'
    };

    return text.split('').map(char => boldMap[char] || char).join('');
  };

  useEffect(() => {
    try {
      // Get user data from sessionStorage
      const rawData = sessionStorage.getItem("user");
      console.log("Raw user data from sessionStorage:", rawData ? "Data exists" : "No data");
      
      const userData = JSON.parse(rawData);
      console.log("User data structure:", userData ? Object.keys(userData) : "Failed to parse");
      
      const employee = userData?.employee;
      console.log("Employee data:", employee ? "Found employee data" : "No employee data");
      
      // For debugging - inspect prison data structure
      console.log("Prison data structure:", employee?.prisons);
      
      // Extract prison data
      if (employee?.prisons && Array.isArray(employee.prisons)) {
        // Create prison objects for dropdown
        const prisonObj = employee.prisons.map((prison) => {
          return { value: prison.prisonId, label: prison.prisonName };
        });
        setPrisons(prisonObj);
        
        // Extract prison IDs
        const prisonIds = employee.prisons.map(prison => prison.prisonId);
        console.log("Extracted prison IDs:", prisonIds);
        setUserPrisonIds(prisonIds);
        
        // Set prison IDs in form payload if not already set
        if (!formPayload?.prisonerBasicInfo?.prisonId && prisonIds?.length) {
          const payload = { ...formPayload };
          if (!payload.prisonerBasicInfo) payload.prisonerBasicInfo = {};
          payload.prisonerBasicInfo.prisonId = prisonIds;
          setFormPayload(payload);
        }
      } else {
        console.warn("No prison data found in user data");
      }
      
      // Set role
      setIsRoleExist(employee?.user?.roleNames[0]);
    } catch (error) {
      console.error("Error processing user data:", error);
    }
  }, []);

  useEffect(() => {
    fetchLookUps();
  }, [newLookups, userPrisonIds]); // Also refetch when userPrisonIds changes

  const fetchLookUps = async () => {
    try {
      let lookup = {};
      // Get barracks data with details
      const barracksData = newLookups?.PrisonBarracks || [];
      const circlesData = newLookups?.Enclosure || [];
      const barrackTypesData = newLookups?.PrisonBarrackTypes || [];
      
      console.log("DEBUG DATA:");
      console.log("Barracks Data:", barracksData);
      console.log("Circles Data:", circlesData);
      console.log("Barrack Types Data:", barrackTypesData);
      console.log("User Prison IDs for filtering:", userPrisonIds);
      
      // Sample logging of the first item in each array to check structure
      if (barracksData.length > 0) console.log("First Barrack Sample:", barracksData[0]);
      if (circlesData.length > 0) console.log("First Circle Sample:", circlesData[0]);
      if (barrackTypesData.length > 0) console.log("First Barrack Type Sample:", barrackTypesData[0]);
      
      // Create detailed barracks options
      const enhancedBarracksOptions = barracksData.map(barrack => {
        // The data already has circle and barrack type as string properties
        // We'll use those directly when available, or look them up by ID if needed
        
        // Get circle information
        let circleName = barrack.circle; // Direct property from barrack data
        if (!circleName && barrack.circleId) {
          // Fallback to lookup by ID if needed
          const circle = circlesData.find(c => c.id === barrack.circleId);
          circleName = circle?.name || 'N/A';
        }
        
        // Get barrack type information
        let barrackTypeName = barrack.prisonBarrackTypes; // Direct property from barrack data
        if (!barrackTypeName) {
          // Try to look up by ID if we had one
          const typeId = barrack.prisonBarrackTypeId || 1; // Default to 1 (Barrack) if not specified
          const barrackType = barrackTypesData.find(bt => bt.id === typeId);
          barrackTypeName = barrackType?.name || 'N/A';
        }
        
        // Get prison information for the barrack
        const prisonName = barrack.prison || 'N/A';
        
        // Format label with descriptive headings
        const barrackName = barrack.name || barrack.barrackName || '';
        
        // Make headers bold using Unicode bold characters
        const barrackHeader = makeBold("BARRACK:");
        const typeHeader = makeBold("TYPE:");
        const enclosureHeader = makeBold("ENCLOSURE:");
        const prisonHeader = makeBold("PRISON:");
        
        // Include prison name in the label for all roles to make debugging easier
        const label = `${barrackHeader} ${barrackName} | ${typeHeader} ${barrackTypeName} | ${enclosureHeader} ${circleName}${isRoleExist === "Inspector General Prisons" || isRoleExist === "DIG Prisons" ? ` | ${prisonHeader} ${prisonName}` : ''}`;
        
        return {
          value: barrack.id,
          label: label,
          barrackId: barrack.id,
          barrackName: barrackName,
          circleId: barrack.circleId,
          circleName: circleName,
          barrackTypeId: barrack.prisonBarrackTypeId,
          barrackTypeName: barrackTypeName, 
          prisonId: barrack.prisonId,
          prisonName: prisonName
        };
      });
      
      console.log("Final Enhanced Barracks Options:", enhancedBarracksOptions);
      
      // Store all barracks for later filtering
      setAllBarracksOptions(enhancedBarracksOptions);
      
      lookup["prisonBarracks"] = transformData(newLookups?.PrisonBarracks);
      setLookup(lookup);
      
      // Apply initial filtering based on prison IDs
      const selectedPrisonIds = formPayload?.prisonerBasicInfo?.prisonId || userPrisonIds;
      
      console.log("Selected prison IDs for filtering:", selectedPrisonIds);
      
      // For IG/DIG roles, use selected prisons; for others, use user's assigned prisons
      if (isRoleExist === "Inspector General Prisons" || isRoleExist === "DIG Prisons") {
        if (selectedPrisonIds?.length > 0) {
          filterBarracksByPrison(selectedPrisonIds, enhancedBarracksOptions);
        } else {
          setBarracksWithDetails(enhancedBarracksOptions);
        }
      } else {
        // For other roles, always filter by user's prison IDs
        console.log("Non-IG/DIG role, filtering by user prison IDs:", userPrisonIds);
        
        if (userPrisonIds && userPrisonIds.length > 0) {
          filterBarracksByPrison(userPrisonIds, enhancedBarracksOptions);
        } else {
          console.warn("No user prison IDs available for filtering, showing all barracks");
          setBarracksWithDetails(enhancedBarracksOptions);
        }
      }
    } catch (error) {
      console.error("Error in fetchLookUps:", error);
      alert("Something went wrong in lookups api");
    }
  };

  useEffect(() => {
    // Watch for changes in prisonId
    const selectedPrisonIds = formPayload?.prisonerBasicInfo?.prisonId;
    if (isRoleExist === "Inspector General Prisons" || isRoleExist === "DIG Prisons") {
      filterBarracksByPrison(selectedPrisonIds);
    }
  }, [formPayload?.prisonerBasicInfo?.prisonId]);

  const filterBarracksByPrison = async (prisonIds, barrackOptions = null) => {
    try {
      const barracksToFilter = barrackOptions || allBarracksOptions;
      
      // Reset to all barracks if no prison is selected or all are selected
      if (!prisonIds || !prisonIds.length) {
        console.log("No prison selected, resetting to all barracks");
        setBarracksWithDetails(allBarracksOptions);
        return;
      }
      
      console.log("Filtering barracks for prison IDs:", prisonIds);
      
      // Filter barracks based on selected prison IDs
      const filteredBarracks = barracksToFilter.filter(
        barrack => prisonIds.includes(barrack.prisonId)
      );
      
      console.log("Filtered barracks count:", filteredBarracks.length);
      console.log("First few filtered barracks:", filteredBarracks.slice(0, 3));
      
      // Only update if we have a different result
      if (JSON.stringify(filteredBarracks) !== JSON.stringify(barracksWithDetails)) {
        setBarracksWithDetails(filteredBarracks);
      }
      
      // Clear selected barracks that don't belong to the selected prisons
      if (formPayload?.prisonerAccommodation?.barrackId?.length) {
        const validBarrackIds = filteredBarracks.map(b => b.value);
        const currentBarrackIds = formPayload.prisonerAccommodation.barrackId;
        const validSelectedIds = currentBarrackIds.filter(id => validBarrackIds.includes(id));
        
        // Update formPayload if any barracks were filtered out
        if (validSelectedIds.length !== currentBarrackIds.length) {
          const payload = { ...formPayload };
          payload.prisonerAccommodation.barrackId = validSelectedIds;
          setFormPayload(payload);
        }
      }
    } catch (error) {
      console.error("Error filtering barracks:", error);
    }
  };

  // Function to find the selected barrack in the enhanced options
  const findSelectedBarrack = (barrackId) => {
    if (!barrackId) return null;
    return barracksWithDetails.find(barrack => barrack.value === barrackId) || null;
  };

  return (
    <div className="row">
      <h3
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        className="master-report-headings"
      >
        <span className="d-flex justify-content-between w-100">
          Prisoner Accomodation {" "}
          {open ? <IoMdArrowDropdownCircle size={27} /> : <IoMdArrowDroprightCircle size={27} />}
        </span>
      </h3>
      
      <Collapse in={open}>
        <div id="example-collapse-text" className="row">
          <div className="col-lg-3">
            <InputWidget
              type="input"
              onlyNumbers
              inputType="number"
              label={"No of allocations"}
              require={false}
              icon={"icon-operator"}
              id={"no-of-allocation"}
              defaultValue={formPayload?.prisonerAccommodation?.noOfAllocations}
              setValue={(value) => {
                const payload = { ...formPayload };
                payload["prisonerAccommodation"]["noOfAllocations"] = value || 0;
                setFormPayload(payload);
              }}
            />
          </div>

          {(isRoleExist === "Inspector General Prisons" ||
            isRoleExist === "DIG Prisons") && (
            <div className="col-lg-3">
              <InputWidget
                type={"multiSelect"}
                label={"Prison"}
                isMulti={true}
                id={"prison"}
                icon={"icon-office"}
                options={prisons || []}
                defaultValue={
                  formPayload?.prisonerBasicInfo?.prisonId
                    ? prisons.filter(prison => 
                      formPayload.prisonerBasicInfo.prisonId.includes(prison.value)
                    )
                    : []
                }
                setValue={(value) => {
                  const payload = {
                    ...formPayload,
                  };
                  payload["prisonerBasicInfo"]["prisonId"] = getIds(value);
                  setFormPayload(payload);
                }}
              />
            </div>
          )}

          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Barrack"}
              require={false}
              isMulti={true}
              icon={"icon-operator"}
              id={"Barrack"}
              options={barracksWithDetails || []}
              defaultValue={
                formPayload?.prisonerAccommodation?.barrackId?.map(id => 
                  findSelectedBarrack(id)
                ).filter(item => item !== null) || []
              }
              setValue={(value) => {
                const payload = { ...formPayload };
                payload["prisonerAccommodation"]["barrackId"] = getIds(value);
                setFormPayload(payload);
              }}
            />
          </div>

          <div className="col-lg-3">
            <div className='inputs force-active'>
              <label>Barrack Allocation Start-End Date</label>
              <DatePicker
                icon={"icon-calendar"}
                dateFormat="dd/MM/yyyy"
                selectsRange={true}
                startDate={startAllocationDate}
                endDate={endAllocationDate}
                onChange={(date) => {
                  setAllocationDateRange(date);
                  const payload = { ...formPayload };
                  payload["prisonerAccommodation"]["allocationDate"]["start"] =
                    date && date[0] != null
                      ? `${date[0].getFullYear()}-${date[0].getMonth() + 1}-${date[0].getDate()}`
                      : "";
                  payload["prisonerAccommodation"]["allocationDate"]["end"] =
                    date && date[1] != null
                      ? `${date[1].getFullYear()}-${date[1].getMonth() + 1}-${date[1].getDate()}`
                      : "";
                  setFormPayload(payload);
                }}
                isClearable={true}
                id={"release-start-end-date"}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={120}
                showMonthDropdown
              />
            </div>
          </div>

          <div className="col-lg-3">
            <InputWidget
              type={"multiSelect"}
              label={"Current Population"}
              isMulti={false}
              id={"current-population"}
              icon={"icon-prisoner"}
              isClearable={true}
              options={booleanOptions}
              defaultValue={
                formPayload?.prisonerAccommodation?.addedInPrison !== undefined
                  ? booleanOptions.find(
                      option => option.value === formPayload.prisonerAccommodation.addedInPrison
                    )
                  : null
              }
              setValue={(value) => {
                const payload = { ...formPayload };
                payload["prisonerAccommodation"]["addedInPrison"] = value?.value;
                setFormPayload(payload);
              }}
            />
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default PrisonerAccodomationForm;






