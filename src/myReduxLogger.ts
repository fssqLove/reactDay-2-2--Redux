
export default function logger() {    
    return (dispatch:any) => (action:any) => {
        console.log(action)
        return dispatch(action)
    }
}