import React, { useEffect, useState } from "react";
import { getData } from "../../services/request";
import unodcLogo from "../../assets/images/footerlogo/1.png";

const AppFooter = (props) => {
  const isTrue = sessionStorage.getItem("isLoggedIn") === "true";
  const [currentVersionNumber, setCurrentVersionNumber] = useState("");
  const [currentVersionData, setCurrentVersionData] = useState("");
  const [popupShown, setPopupShown] = useState(
    localStorage.getItem("isPopUpOpen") === "true"
  );
  const inlLogoFromEnv = "Khyber Pakhtunkhwa"

  if (!isTrue) {
    window.location.href = "/";
  }

  const versionControl = sessionStorage?.getItem("user");
  const versionShow = JSON.parse(versionControl);
  const [usFlag, setUsFlag] = useState('');
  const [inlLogo, setInlLogo] = useState('');

  const Logo = () => {
    
    // import(`../${process.env.REACT_APP_US_FLAG}`).then((module) => {
    //   setUsFlag(module.default);
    // });
  
    return (
      <img src={unodcLogo}  alt="" />
    );
  };

const donorLogo = () => {

    // import(`../${process.env.REACT_APP_INL_LOGO}`).then((module) => {
		// setInlLogo(module.default);
	  // });
	
	  return (
		<img src={unodcLogo}  alt="" />
	  );
}	

  const versionControlPopUp = () => {
    const { tag, description } = versionShow?.versionControl || "";
    if (
      versionShow?.versionControl &&
      versionShow?.versionControl?.lastestRelease
    ) {
      localStorage.setItem("isPopUpOpen", true);

      swal({
        title: `PMIS Updated To Version ${tag}`,
        buttons: {
          confirm: {
            text: "Close",
            value: true,
            visible: true,
            className: "custom-swal-confirm-button",
            closeModal: true,
          },
        },
        content: {
          element: "div",
          attributes: {
            innerHTML: `
					<hr/>
					  <div style="max-height: 500px;">
						<p class="swal-bold"><b class= "custom-icons-modal me-1"></b><span style="font-weight: 600"> </span> ${description}</p>
					  </div>
					`,
          },
        },
        icon: "success",
        className: "custom-swal-two",
      });
    }
  };

  const versionControlpopupOnVersionCLick = () => {
    const { tag, description } = currentVersionData || "";
    if (currentVersionData?.tag) {
      swal({
        title: `PMIS Updated To Version ${tag}`,
        buttons: {
          confirm: {
            text: "Close",
            value: true,
            visible: true,
            className: "custom-swal-confirm-button",
            closeModal: true,
          },
        },
        content: {
          element: "div",
          attributes: {
            innerHTML: `
				<hr/>
				  <div style="max-height: 500px;">
					<p class="swal-bold"><b class= "custom-icons-modal me-1"></b><span style="font-weight: 600"> </span> ${description}</p>
				  </div>
				`,
          },
        },
        icon: "success",
        className: "custom-swal-two",
      });
    }
  };

  const fetchVersionData = async () => {
    try {
      const versionNumber = await getData(
        "/TokenAuth/GetCurrentVersionNumber",
        null,
        true,
        false
      );
      if (versionNumber && versionNumber.success) {
        setCurrentVersionNumber(versionNumber.result);
      }

      const versionDetailsPopup = await getData(
        "/TokenAuth/GetCurrentVersion",
        null,
        true,
        false
      );
      if (versionDetailsPopup && versionDetailsPopup.success) {
        setCurrentVersionData(versionDetailsPopup.result.data);
      }
    } catch (error) {
      console.error("Error fetching version data: ", error);
    }
  };

  useEffect(() => {
    fetchVersionData();
  }, []);

  useEffect(() => {
    if (
      isTrue &&
      !popupShown &&
      versionShow?.versionControl &&
      versionShow?.versionControl?.tag
    ) {
      versionControlPopUp();
    }
  }, [isTrue]);

  return (
    <>
      <div className="app-footer">

        <div className="">
          <p className="text-center mb-0">
            © {new Date().getFullYear()}. All Rights Reserved.
            <br />
            Prisons Department of Quetta
          </p>
          <p className="text-center mb-0" style={{ fontSize: "12px" }}>
		  <span
            className="cursor-pointer"
            onClick={() => {
              versionControlpopupOnVersionCLick();
            }}
          >
            {" "}
              Version {currentVersionNumber}
            </span>
          </p>
          <hr />

          <center>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td style={{ width: "40%", paddingLeft: "50px" }}>
					          {Logo()}
                  </td>
				           {inlLogoFromEnv && (
                  <td style={{ width: "23%" }}>
					          {donorLogo()}
                  </td>
				            )}
                  <td style={{ width: "18%", paddingRight: "50px" }} >
                    <img
                      src={unodcLogo}
                      align="right"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <hr />
            <p className="text-center mb-0">
				Funded by Me <br /> Implemented by: United
              Nations Office on Drugs and Crime (UNODC)
            </p>
          </center>
        </div>
      </div>
    </>
  );
};

export default AppFooter;
