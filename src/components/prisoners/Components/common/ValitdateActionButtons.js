export 	const validateGloabalActionButtons = (user, prisons, prisonerData, setActionButton) => {
    const currentLoggedInUser = {user: user, prisons: prisons};
    // if edit is on same branch and prison
    const actionButtonStates = { edit: false,view: false,add: false}
    
    const loggedInUserIsInPrison = currentLoggedInUser.prisons.find(item => item?.prisonName?.toLowerCase() === prisonerData?.prisonName?.toLowerCase());
    const prisonerCategoryIndex = currentLoggedInUser.user.roleNames.findIndex(item => item.toLowerCase().includes(prisonerData?.prisonerCategory?.toLowerCase()));
    if ( loggedInUserIsInPrison && Object.keys(loggedInUserIsInPrison).length && loggedInUserIsInPrison.prisonName && prisonerCategoryIndex > -1) {
        actionButtonStates['edit'] = true;
        actionButtonStates['view'] = true;
    }   else if (loggedInUserIsInPrison && Object.keys(loggedInUserIsInPrison).length && loggedInUserIsInPrison.prisonName) {
        actionButtonStates['edit'] = false;
        actionButtonStates['view'] = true;
    } else if (!prisonerData.prisonName) {
        actionButtonStates['edit'] = false;
        actionButtonStates['view'] = true;
        actionButtonStates['add'] = true;
    }
    setActionButton(actionButtonStates);
};