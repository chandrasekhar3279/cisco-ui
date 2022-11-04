export const getVpcNames=(vpcs: any[],vpcData: any)=>{
    if(vpcs?.length){
        let list= vpcs.map(vpc=>{
           return vpcData[vpc] || "";
        })
        return [...new Set(list.filter(l=>l))]
        
    }
    return []
}