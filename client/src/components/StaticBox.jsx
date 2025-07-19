import React from 'react'
import { cn } from '../utils/util'

const StaticBox = ({ title, count, icon, iconStyle, lastMonth, currentMonth }) => {

    const calcPercentage = () => {
        if (lastMonth === 0) {
            return currentMonth === 0 ?
                { image: "no cjange", percent: 0 } : { image: "increment", percent: 100 }
        };

        const change = currentMonth - lastMonth;
        const percentage = Math.abs((change / lastMonth) * 100);

        if (change > 0) {
            return { image: "increment", percent: percentage }
        } else if (change < 0) {
            return { image: "decrement", percent: percentage }
        } else {
            return { image: "no cjange", percent: 0 }
        }
    }

    const trend = calcPercentage()

    return (
        <div className='p-5 px-4 lg:px-5 bg-white rounded-md shadow-100 hover:shadow-400 duration-2'>
            <div className="flex-center gap-1.5">
                <div className={cn("size-8 flex-center justify-center bg-pink-100 rounded-full aspect-square text-pink-500", iconStyle)}>
                    {icon}
                </div>
                <p className="text-gray-600 font-bold text-base font-karla capitalize">
                    {title}
                </p>
            </div>

            <div className="flex-center justify-between mt-3">
                <div className="">
                    <h4 className="text-xl lg:text-2xl font-bold mx-1">{count}</h4>
                    <div className="center flex-row gap-1.5 mt-1">
                        <div className="flex-center gap-1">
                            {trend.image === "increment" ?
                                (
                                    <img
                                        src='/assets/images/arrow-up-green.svg'
                                        alt='increment'
                                        width={15}
                                    />
                                ) : (
                                    <img
                                        src='/assets/images/arrow-down-red.svg'
                                        alt='increment'
                                        width={15}
                                    />
                                )}
                            <span className={cn("font-semibold text-sm", trend.image === "increment" ? "text-green-500 bg-green-50" : "text-red-100 bg-red-50")}>
                                {trend.percent}%
                            </span>
                        </div>
                        <p className="text-gray-600 font-medium font-karla text-base md:text-sm whitespace-nowrap">
                            vs last month
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StaticBox