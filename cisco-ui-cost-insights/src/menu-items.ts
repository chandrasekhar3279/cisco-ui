interface Badge {
    title: string;
    type: string;
}
export interface MenuItemType {
    id: string;
    title: string;
    type: string;
    icon?: string;
    children?: MenuItemType[];
    breadcrumbs?: boolean;
    url?: string;
    badge?: Badge;
    target?: boolean;
    classes?: string;
    external?: boolean;
    heading?: string;
    headingIcon?: any;
}
const chartData: { items: MenuItemType[] } = {
    items: [
        {
            id: 'navigation',
            title: 'Navigation',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                // {
                //     id: 'default',
                //     title: 'Dashboard',
                //     type: 'item',
                //     icon: 'fas fa-tachometer-alt',
                //     url: '/'
                // },
                {
                    id: 'topology',
                    title: 'Topology',
                    type: 'item',
                    url: '/topology',
                    breadcrumbs: true,
                    icon: 'fab fa-joget',
                },
                {
                    id: 'accounts',
                    title: 'Accounts',
                    type: 'item',
                    url: '/',
                    icon: 'fas fa-chalkboard-teacher',
                },
                {
                    id: 'cloud-resources',
                    title: 'Cloud Resources',
                    type: 'collapse',
                    icon: 'feather icon-box',
                    children: [
                        {
                            id: 'regions',
                            title: 'Regions',
                            type: 'item',
                            url: '/regions',
                            icon: 'feather icon-map-pin'
                        },
                        {
                            id: 'vpcs',
                            title: 'VPCs',
                            type: 'item',
                            url: '/vpcs',
                            heading: "VPCs in All Clouds",
                            icon: 'feather icon-server'
                        },
                        {
                            id: 'securityGroups',
                            title: 'Security Groups',
                            type: 'item',
                            url: '/securitygroups',
                            icon: 'feather icon-lock'
                        },
                        {
                            id: 'endpoints',
                            title: 'Endpoints',
                            type: 'item',
                            url: '/endpoints',
                            icon: 'feather icon-x-circle'
                        },
                        {
                            id: 'instancesvms',
                            title: 'VMs',
                            type: 'item',
                            url: '/instancesvms',
                            icon: 'feather icon-inbox'
                        },
                        
                        {
                            id: 'kubernetesClusters',
                            title: 'Kubernetes Clusters',
                            type: 'item',
                            url: '/kubernetes-clusters',
                            icon: 'feather icon-layers'
                        },{
                            id: 'networks',
                            title: 'Networks',
                            type: 'item',
                            url: '/networks',
                            icon: 'feather icon-wifi'
                        }
                    ]
                },
                {
                    id: 'cost-insights',
                    title: 'Cost Insights',
                    type: 'item',
                    url: '/cost-insights',
                    // breadcrumbs: true,
                    icon: 'fas fa-chalkboard-teacher',
                }
            ]
        }

    ]
};
export default chartData;