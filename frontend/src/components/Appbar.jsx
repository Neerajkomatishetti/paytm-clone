
export default function Appbar() {
    const username = localStorage.getItem('username');
    return(
        <div className=" flex flex-row items-center justify-between w-[97%] h-10 border-t-2 shadow border-black bg-white mt-2">
            <h3 className="pl-2 font-medium text-sm font- ">Paytm App</h3>
            <div className="flex [&>*]:m-1 items-center">
                <h3 className="font-medium text-sm">Hello!</h3>
                <div className="rounded-full h-8 w-8 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {username[0].toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    )
}