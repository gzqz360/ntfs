import {exec} from 'child_process'
import {MessageBox} from 'element-ui';
import {Message} from 'element-ui';

var sudoPwd;
if (localStorage.sudoPwd) {
    sudoPwd = localStorage.sudoPwd
} else {
    sudoPwd = ''
    localStorage.sudoPwd = ''
}

function _checkSudoPwd(pwd) {
    return new Promise((resolve, reject) => {
        let s = `echo "${pwd}" | sudo -S ls`;
        exec(s, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return;
            }
            resolve(true)
        });
    })
}

function _getSudoPwd() {
    return new Promise((resolve, reject) => {
        MessageBox.prompt(i18n.t('messages.please_input_sudo'),i18n.t('messages.tip'), {
            confirmButtonText: i18n.t('messages.ok'),
            cancelButtonText: i18n.t('messages.cancel'),
            inputType:'password'
        }).then(({value}) => {
            resolve(value);
        }).catch((e) => {
            console.log(e);
            Message({
                type: 'info',
                message: i18n.t('messages.please_input_pwd_tip')
            });
            resolve("");
        });
    })
}

function _execShell(shell) {
    return new Promise((resolve, reject) => {
        let s = `echo "${sudoPwd}" | sudo -S ${shell}`;
        exec(s, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return;
            }
            resolve(stdout)
        });
    })
}

export async function execShell(shell) {
    while (true) {
        try {
            await _checkSudoPwd(sudoPwd);
            localStorage.sudoPwd=sudoPwd;
            break
        } catch (e) {
            Message({
                type: 'error',
                message: e.message //密码错误
            });
        }
        let pwd = await _getSudoPwd();
        sudoPwd = pwd;
    }
    return _execShell(shell);
}

export async function execShellNoPwd(shell) {
    return new Promise((resolve, reject) => {
        let s = `${shell}`;
        exec(s, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return;
            }
            resolve(stdout)
        });
    })
}

export function checkNtfs() {
    return new Promise( async (resolve, reject) => {
        var ntfsStatus = 0
        var osxfuseStatus = 0
        var ntfsStatusStr = ' '
        var osxfuseStatusStr = ' '
        exec(`cat /Library/Filesystems/macfuse.fs/Contents/version.plist`,(error,stdout,stderr)=>{
            if (error) {
                osxfuseStatus = 1;
                osxfuseStatusStr = i18n.t('messages.osxfuse')
            }
            exec(`/usr/local/bin/ntfs-3g --version`,(error,stdout,stderr)=>{
                if (error) {
                    ntfsStatus = 1;
                    ntfsStatusStr = i18n.t('messages.ntfs_3g')
                }
                if(ntfsStatus == 1 || osxfuseStatus == 1){
                    var msg = i18n.t('messages.ntfs_check')+ntfsStatusStr + osxfuseStatusStr +','+i18n.t('messages.please_install')
                    MessageBox.alert(msg,i18n.t('messages.tip'), {
                        confirmButtonText: i18n.t('messages.install'),
                        showClose:false,
                        dangerouslyUseHTMLString:true,
                        beforeClose: async(action, instance, done) => {
                            if (action === 'confirm') {
                                instance.confirmButtonLoading = true;
                                instance.confirmButtonText = i18n.t('messages.installing');
                                if(osxfuseStatus == 1) {
                                    await execShell(`curl -L https://gitlab.gzqz.work/ntfs/osxfuse/raw/master/macFUSE%204.0.5.pkg -o ~/Downloads/macFUSE4.0.5.pkg`)
                                    await execShell(`sudo installer -pkg ~/Downloads/macFUSE4.0.5.pkg -target /Library/Filesystems/`)
                                }
                                if(ntfsStatus == 1) {
                                    await execShellNoPwd(`mkdir -p /usr/local/bin/`)
                                    await execShellNoPwd(`curl -L https://gitlab.gzqz.work/ntfs/ntfs-3g/raw/master/ntfs-3g -o /usr/local/bin/ntfs-3g`);
                                    await execShellNoPwd(`chmod 777 /usr/local/bin/ntfs-3g`);
                                    await execShellNoPwd(`curl -L https://gitlab.gzqz.work/ntfs/ntfsfix/raw/master/ntfsfix -o /usr/local/bin/ntfsfix`);
                                    await execShellNoPwd(`chmod 777 /usr/local/bin/ntfsfix`);
                                    await execShellNoPwd(`mkdir -p /usr/local/sbin/`)
                                    await execShellNoPwd(`curl -L https://gitlab.gzqz.work/ntfs/mkntfs/raw/master/mkntfs -o /usr/local/sbin/mkntfs`);
                                    await execShellNoPwd(`chmod 777 /usr/local/sbin/mkntfs`);
                                    await execShellNoPwd(`mkdir -p /usr/local/Cellar/`);
                                    await execShellNoPwd(`curl -L https://gitlab.gzqz.work/ntfs/ntfs-3g-2017/-/archive/master/ntfs-3g-2017-master.tar -o /usr/local/Cellar/ntfs-3g.tar`);
                                    await execShellNoPwd(`mkdir -p /usr/local/Cellar/ntfs-3g`);
                                    await execShellNoPwd(`tar -zxvf /usr/local/Cellar/ntfs-3g.tar -C /usr/local/Cellar/ntfs-3g --strip-components 1`);
                                    await execShellNoPwd(`rm -f /usr/local/Cellar/ntfs-3g.tar`);
                                    await execShellNoPwd(`if [ ! -d /usr/local/opt/gettext ]; then mkdir -p /usr/local/opt/gettext && curl -L https://gitlab.gzqz.work/ntfs/gettext/-/archive/master/gettext-master.tar -o /usr/local/opt/gettext.tar && tar -zxvf /usr/local/opt/gettext.tar -C /usr/local/opt/gettext --strip-components 1 && rm -rf /usr/local/opt/gettext.tar; fi`);
                                }
                                done();
                                instance.confirmButtonLoading = false;
                                resolve(true)
                            } else {
                                done();
                            }
                        }
                    })
                }
                resolve(true)
            })
        })



    })
}

export function getDiskList() {
    return new Promise((resolve, reject) => {
        execShell(`diskutil list physical | awk  '{print $1}'`).then(async (res) => {
            var diskList = []
            var v = res
                .split("\n")
                .filter((item) => {
                    var reg = /\/dev\/disk\d/
                    return reg.test(item)
                }).map(async (item) => {
                    var o = {
                        disk_path: item,
                        disk_info: "",
                        disk_child: []
                    };
                    var infoMap = {};
                    let execShell2 = await execShell(`diskutil info ` + item);
                    execShell2.split("\n").filter((item2) => {
                        return !/^\s*$/.test(item2)
                    }).map((item2) => {
                        return item2.split(/:\s+/)
                    }).map((item2) => {
                        var key = item2[0].replace(/\s+/ig, "_");
                        infoMap[key] = item2[1]
                    })
                    o.disk_info = infoMap

                    var childItem = [];
                    var childList = [];
                    let execShell3 = await execShell(`diskutil list `+ item+` | awk  '{print $NF}'`);
                    var childItem = execShell3
                        .split("\n")
                        .filter((item3) => {
                            var reg = /disk\ds\d/
                            return reg.test(item3)
                        }).map(async (item3,itemKey) => {
                            var child= {
                                disk_path:item3,
                                disk_info:""
                            }
                            var infoMap1 = {};
                            let execShell2 = await execShell(`diskutil info ` + item3);
                            execShell2.split("\n").filter((item4) => {
                                return !/^\s*$/.test(item4)
                            }).map((item4) => {
                                return item4.split(/:\s+/)
                            }).map((item4) => {
                                var key = item4[0].replace(/\s+/ig, "_");
                                infoMap1[key] = item4[1]
                            })

                            if(infoMap1['_Type_(Bundle)'] != undefined && infoMap1['_Type_(Bundle)'] == 'ntfs' && localStorage.selfMountValue == 1){
                                if(infoMap1['_Mounted'] == 'No'){
                                    await  mountDisk(infoMap1['_Device_Node'],infoMap1['_Volume_Name'])
                                }else{
                                    if(infoMap1['_Read-Only_Volume'] == 'Yes'){
                                        await umountDisk(infoMap1['_Device_Node'])
                                        await  mountDisk(infoMap1['_Device_Node'],infoMap1['_Volume_Name'])
                                    }
                                }
                            }
                            child.disk_info = infoMap1
                            // childItem.push(child)
                            return child
                        })
                        for (let i = 0; i < childItem.length; i++) {
                            var child = await childItem[i];
                            if(child['disk_info']['_Partition_Type'] != 'EFI'){
                                childList.push(child);
                            }
                        }
                    o.disk_child = childList
                    // console.log(o);
                    return o
                })
            for (let i = 0; i < v.length; i++) {
                var o = await v[i];
                diskList.push(o);
            }
            resolve(diskList)
        }).catch((e) => {
            // console.log(e);
            reject(e)
        })
    })
}

export function ejectDisk(path) {
    return new Promise((resolve, reject) => {
        execShell(`diskutil eject ` + path).then((res) => {
            console.log(res);
            resolve()
        }).catch((e) => {
            console.log(e);
            reject(e)
        })
    })
}
export function mountDisk(diskPath, volumeName) {
    var mountPoint = '/Volumes/Untitled';
    if(volumeName) {
        var name = volumeName.replace(' ', '_');
        mountPoint = '/Volumes/'+name;
    }else{
        volumeName = 'untitled'
    }
    return new Promise(async (resolve, reject) => {
        try {
            await execShell(`mkdir -p "${mountPoint}"`);
            await execShell(`/usr/local/bin/ntfs-3g "${diskPath}" "${mountPoint}" -olocal -oallow_other -o auto_xattr -o volname="${volumeName}"\n`);
            resolve();
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}
export function umountDisk(diskPath) {
    return new Promise(async (resolve, reject) => {
        try {
            await execShell(`umount "${diskPath}"`);
            resolve();
        } catch (e) {
            reject(e)
        }
    })
}
export function formatDisk(diskPath,mounted,formatTarget,fileName) {
    return new Promise(async (resolve, reject) => {
        try {
            if(mounted == 'Yes'){
                await execShell(`diskutil umount "${diskPath}"`);
            }
            if(formatTarget == 'NTFS'){
                var mountPoint = '/Volumes/'+fileName;
                await execShell(`/usr/local/sbin/mkntfs -f -L "${fileName}" "${diskPath}"`);
                await execShell(`/usr/local/bin/ntfs-3g "${diskPath}" "${mountPoint}" -olocal -oallow_other -o auto_xattr -o volname="${fileName}"\n`);
            }else{
                await execShell(`diskutil zeroDisk "${diskPath}"`);
                await execShell(`diskutil eraseVolume  "${formatTarget}" "${fileName}" "${diskPath}"`);
            }
            resolve();
        } catch (e) {
            reject(e)
        }
    })
}
export function repairDisk(diskPath,mounted) {
    return new Promise(async (resolve, reject) => {
        try {
            if(mounted == 'Yes'){
                await execShell(`diskutil unmount "${diskPath}"`);
            }
            let res = await execShell(`/usr/local/bin/ntfsfix "${diskPath}"`);
            resolve(res);

        } catch (e) {
            reject(e)
        }
    })
}


