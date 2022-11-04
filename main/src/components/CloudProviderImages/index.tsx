import awsicon from "assets/images/add-account/aws-icon.svg";
import azureicon from "assets/images/add-account/azure-icon.svg";
import gcpicon from "assets/images/add-account/gcp-icon.svg";
import { Image } from "react-bootstrap";

const CloudProviderImages = (data: any) => {
  const cloud = data.cloudprovider;
  let source = "";
  let imgclass = "table-cloud-logo";
  if (cloud === "AWS") {
    source = awsicon;
  } else if (cloud === "Azure") {
    source = azureicon;
  } else if (cloud === "GCP") {
    source = gcpicon;
  }
  return (
    <>
      <Image src={source} className={imgclass} alt={cloud} />
    </>
  );
};

export default CloudProviderImages;
