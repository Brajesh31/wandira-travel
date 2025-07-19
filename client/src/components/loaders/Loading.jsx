import React from 'react'

const Loading = () => {
    return (
        <div className="absolute top-0 left-0 w-screen h-dvh bg-ligh-50 z-[9999] ">
            <div className="absolute-center">
                <div className="three-body">
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                </div>
            </div>
        </div>
    )
}

export default Loading
