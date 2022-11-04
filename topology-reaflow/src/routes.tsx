import * as React from "react";
const Error = React.lazy(() => import("./pages/Error"));
const Accounts = React.lazy(() => import("./pages/AccountsTable"));
const VPCs = React.lazy(() => import("./pages/CloudResources/VPCs"));
const Regions = React.lazy(() => import("./pages/CloudResources/Regions"));
const Endpoints = React.lazy(() => import("./pages/CloudResources/Endpoints"));
const Networks = React.lazy(() => import("./pages/CloudResources/Networks"));
const SecurityGroups = React.lazy(
  () => import("./pages/CloudResources/SecurityGroups")
);
const InstancesVMs = React.lazy(
  () => import("./pages/CloudResources/InstancesVMs")
);
const KubernetesClusters = React.lazy(
  () => import("./pages/CloudResources/KubernetesClusters")
);
const Topology = React.lazy(() => import("./pages/Topology"));

const routes = [
  {
    path: "/",
    exact: true,
    name: "Accounts",
    component: Accounts,
  },
  {
    path: "/topology",
    exact: true,
    name: "Topology",
    component: Topology,
  },
  {
    path: "/regions",
    exact: true,
    name: "Cloud Resources | Regions",
    component: Regions,
  },
  {
    path: "/vpcs",
    exact: true,
    name: "Cloud Resources | VPCs",
    component: VPCs,
  },
  {
    path: "/add-account",
    exact: true,
    name: "Add Account",
    component: Accounts,
  },
  {
    path: "/endpoints",
    exact: true,
    name: "Cloud Resources | Endpoints",
    component: Endpoints,
  },
  {
    path: "/securitygroups",
    exact: true,
    name: "Cloud Resources | SecurityGroups",
    component: SecurityGroups,
  },
  {
    path: "/instancesvms",
    exact: true,
    name: "Cloud Resources | InstancesVMs",
    component: InstancesVMs,
  },
  {
    path: "/kubernetes-clusters",
    exact: true,
    name: "Cloud Resources | Kubernetes Clusters",
    component: KubernetesClusters,
  },
  {
    path: "/networks",
    exact: true,
    name: "Cloud Resources | Networks",
    component: Networks,
  },
  { path: "*", exact: true, name: "Error", component: Error },
];

export default routes;
