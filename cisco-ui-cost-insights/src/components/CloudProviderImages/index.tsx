import React from "react";
import awsicon from "assets/images/add-account/aws-icon.svg";
import azureicon from "assets/images/add-account/azure-icon.svg";
import gcpicon from "assets/images/add-account/gcp-icon.svg";
import { Image } from "react-bootstrap";

const CloudProviderImages = (data: any) => {
  const cloudprovider = data.cloudprovider;
  let source = gcpicon;
  let imgclass = "table-cloud-logo";
  if (cloudprovider === "AWS") {
    source = awsicon;
  } else if (cloudprovider === "Azure") {
    source = azureicon;
  }
  return (
    <React.Fragment>
      <Image src={source} className={imgclass} alt={cloudprovider} />
    </React.Fragment>
  );
};

export default CloudProviderImages;
