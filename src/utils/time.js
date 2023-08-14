//返回当前时间
export const getTime=()=>{
    let time = new Date().getHours()
    let msg="msg"
    if(time<9) msg="早上"
    else if(time<12) msg="上午"
    else if(time<18) msg="下午"
    else msg="晚上"
    return msg
}