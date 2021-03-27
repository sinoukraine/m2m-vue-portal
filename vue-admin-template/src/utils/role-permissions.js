export const Permission = {}
  
export function getPermissionStatus(response, code){
    let permissionStatus = 0
    let permissionCode = -1
    if (response.length){
        permissionCode = response.findIndex(item => item.PermissionCode === code)
    }
    if (permissionCode !== -1) permissionStatus = response[permissionCode].Status.toString()
    return +permissionStatus
}